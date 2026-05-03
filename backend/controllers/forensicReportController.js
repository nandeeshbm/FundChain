const PDFDocument = require('pdfkit');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');
const ReportArchive = require('../models/ReportArchive');
const apiResponse = require('../utils/apiResponse');

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const isFlaggedTxn = (txn) => txn.status === 'flagged' || txn.sentinelStatus === 'flagged';

const applyStatusFilter = (filters, reportStatus) => {
  if (!reportStatus || reportStatus === 'all') return;

  if (reportStatus === 'flagged') {
    filters.$or = [{ status: 'flagged' }, { sentinelStatus: 'flagged' }];
    return;
  }
  if (reportStatus === 'success') {
    filters.status = 'success';
    return;
  }
  if (reportStatus === 'failed') {
    filters.status = 'failed';
    return;
  }
  if (reportStatus === 'pending') {
    filters.status = 'pending';
  }
};

const buildTableRows = ({ transactions, auditLogMap }) => {
  return transactions.map((txn) => {
    const proof = txn.proofSubmissionId;
    const sentinelReason = proof?.sentinelReasons?.length
      ? proof.sentinelReasons.join('; ')
      : (auditLogMap.get(txn._id.toString()) || '');

    const status = isFlaggedTxn(txn) ? 'Flagged' : 'Approved';

    return {
      txnId: txn.txnId,
      projectId: txn.projectId?.projectId || '—',
      projectName: txn.projectNameSnapshot || txn.projectId?.projectName || '—',
      amount: txn.amount || 0,
      type: txn.type || '—',
      status,
      rawStatus: txn.status || null,
      rawSentinelStatus: txn.sentinelStatus || null,
      reason: sentinelReason || '—',
      ipfsCid: proof?.ipfsPhotoCid || '—',
      txHash: txn.onChainTxnHash || '—',
      createdAt: txn.createdAt || null,
    };
  });
};

const drawTable = (doc, rows, startY) => {
  const left = 35;
  const columnWidths = [60, 58, 84, 48, 58, 52, 122, 74];
  const headers = ['Txn ID', 'Project ID', 'Project', 'Type', 'Amount', 'Status', 'Reason', 'Date'];

  let y = startY;
  const drawHeader = () => {
    doc.font('Helvetica-Bold').fontSize(8);
    headers.forEach((h, i) => {
      doc.text(h, left + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
        width: columnWidths[i],
        ellipsis: true,
      });
    });
    y += 14;
    doc.font('Helvetica').fontSize(7);
  };

  drawHeader();

  rows.forEach((row) => {
    if (y > doc.page.height - 60) {
      doc.addPage();
      y = 35;
      drawHeader();
    }
    const values = [
      row.txnId,
      row.projectId,
      row.projectName,
      row.type,
      `INR ${Number(row.amount || 0).toLocaleString('en-IN')}`,
      row.status,
      row.reason,
      row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN') : '—',
    ];
    values.forEach((val, i) => {
      doc.text(String(val), left + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
        width: columnWidths[i],
        ellipsis: true,
      });
    });
    y += 13;
  });

  return y;
};

// GET /api/reports/forensic
const generateForensicReport = async (req, res, next) => {
  try {
    const { projectId, startDate, endDate, reportStatus = 'all' } = req.query;
    const filters = {};

    if (projectId) {
      const project = await Project.findOne({ projectId }).select('_id projectId').lean();
      if (!project) {
        return apiResponse.error(res, 'Project not found', [], 404);
      }
      filters.projectId = project._id;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }
    applyStatusFilter(filters, reportStatus);

    const transactions = await Transaction.find(filters)
      .sort({ createdAt: -1 })
      .populate('projectId', 'projectName projectId')
      .populate('proofSubmissionId', 'ipfsPhotoCid sentinelReasons')
      .lean();

    const auditLogs = await AuditLog.find({
      transactionId: { $in: transactions.map((t) => t._id) },
      action: { $regex: 'SENTINEL|TRANSACTION', $options: 'i' },
    }).sort({ createdAt: -1 }).lean();

    const auditLogMap = new Map();
    auditLogs.forEach((log) => {
      if (log.transactionId) {
        auditLogMap.set(log.transactionId.toString(), log.reason || '');
      }
    });

    const rows = buildTableRows({ transactions, auditLogMap });
    const flaggedRows = rows.filter((row) => row.status === 'Flagged');
    const summary = {
      totalTransactions: rows.length,
      flaggedTransactions: flaggedRows.length,
      totalAmount: rows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
      projectsCovered: new Set(rows.map((row) => row.projectId).filter(Boolean)).size,
    };

    await ReportArchive.create({
      generatedBy: req.user._id,
      reportType: 'forensic',
      reportName: 'Forensic Audit Report',
      filterParameters: {
        projectId: projectId || null,
        reportStatus: reportStatus || 'all',
        startDate: startDate || null,
        endDate: endDate || null,
      },
      summary,
      transactionSnapshots: rows.map((row) => ({
        txnId: row.txnId,
        projectId: row.projectId,
        projectName: row.projectName,
        amount: row.amount,
        type: row.type,
        status: row.rawStatus,
        sentinelStatus: row.rawSentinelStatus,
        reason: row.reason,
        ipfsCid: row.ipfsCid,
        txHash: row.txHash,
        createdAt: row.createdAt,
      })),
    });

    const nowStamp = formatDate(new Date()) || 'Report';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Forensic_Audit_Report_${nowStamp}.pdf"`);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    doc.fontSize(18).text('Forensic Audit Report', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Generated By: ${req.user?.name || 'Auditor'}`);
    doc.text(`Generated At: ${new Date().toLocaleString('en-IN')}`);
    doc.text(`Project Filter: ${projectId || 'All'}`);
    doc.text(`Status Filter: ${reportStatus || 'all'}`);
    doc.text(`Date Range: ${formatDate(startDate) || 'Any'} to ${formatDate(endDate) || 'Any'}`);
    doc.text(`Total Transactions: ${summary.totalTransactions}`);
    doc.text(`Flagged Transactions: ${summary.flaggedTransactions}`);
    doc.text(`Total Value: INR ${Number(summary.totalAmount).toLocaleString('en-IN')}`);

    doc.moveDown(1);
    doc.fontSize(12).text('Transaction Evidence Table (Real Data)');
    doc.moveDown(0.4);

    drawTable(doc, rows, doc.y);

    doc.end();
  } catch (err) {
    next(err);
  }
};

module.exports = { generateForensicReport };
