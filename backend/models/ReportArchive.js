const mongoose = require('mongoose');

const ReportArchiveSchema = new mongoose.Schema({
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  generatedAt: { type: Date, default: Date.now },
  reportType: { type: String, enum: ['forensic'], default: 'forensic' },
  reportName: { type: String, default: 'Forensic Audit Report' },
  filterParameters: {
    projectId: { type: String, default: null },
    reportStatus: { type: String, default: null },
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
  },
  summary: {
    totalTransactions: { type: Number, default: 0 },
    flaggedTransactions: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    projectsCovered: { type: Number, default: 0 },
  },
  transactionSnapshots: [{
    txnId: { type: String, default: null },
    projectId: { type: String, default: null },
    projectName: { type: String, default: null },
    amount: { type: Number, default: 0 },
    type: { type: String, default: null },
    status: { type: String, default: null },
    sentinelStatus: { type: String, default: null },
    reason: { type: String, default: null },
    ipfsCid: { type: String, default: null },
    txHash: { type: String, default: null },
    createdAt: { type: Date, default: null },
  }],
}, { timestamps: true });

ReportArchiveSchema.index({ generatedBy: 1 });
ReportArchiveSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('ReportArchive', ReportArchiveSchema);
