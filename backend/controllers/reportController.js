const Project = require('../models/Project');
const ReportIssue = require('../models/ReportIssue');
const auditService = require('../services/auditService');
const apiResponse = require('../utils/apiResponse');

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

const createIssueReport = async (req, res, next) => {
  try {
    const { projectId, observation, description, anonymous, name, email, phone } = req.body;
    const project = await Project.findOne({ projectId }).select('projectId projectName').lean();
    if (!project) {
      return apiResponse.error(res, 'Project not found for this report', [], 404);
    }

    const isAnonymous = parseBoolean(anonymous);
    const evidenceFiles = (req.files || []).map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      storagePath: file.path.replace(/\\/g, '/'),
      fileUrl: `/uploads/report-issues/${file.filename}`,
    }));

    const report = await ReportIssue.create({
      source: 'public_witness',
      projectRef: project._id,
      projectId,
      projectName: project.projectName,
      observation,
      description,
      anonymous: isAnonymous,
      reporterName: isAnonymous ? null : name || null,
      reporterEmail: isAnonymous ? null : email || null,
      reporterPhone: isAnonymous ? null : phone || null,
      evidenceFiles,
      userAgent: req.headers['user-agent'] || null,
      reporterIp: req.ip || null,
    });

    return apiResponse.success(res, 'Issue report submitted successfully', {
      reportId: report._id,
      projectId: report.projectId,
      projectName: report.projectName,
      createdAt: report.createdAt,
      evidenceFiles: report.evidenceFiles,
    }, 201);
  } catch (err) {
    next(err);
  }
};

const getIssueReportsForAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, projectId, status } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (status && status !== 'all') query.status = status;
    if (!status) query.status = 'validated';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reports, total] = await Promise.all([
      ReportIssue.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ReportIssue.countDocuments(query),
    ]);

    return apiResponse.paginated(res, 'Issue reports retrieved', reports, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

const getIssueReportsForAuditor = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, projectId, status = 'new' } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (status && status !== 'all') query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reports, total] = await Promise.all([
      ReportIssue.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ReportIssue.countDocuments(query),
    ]);

    return apiResponse.paginated(res, 'Issue reports retrieved', reports, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

const resolveIssueReport = async (req, res, next) => {
  try {
    const { resolutionStatus, resolutionNote } = req.body;
    const report = await ReportIssue.findById(req.params.reportId);
    if (!report) return apiResponse.error(res, 'Report not found', [], 404);

    if (resolutionStatus === 'frozen') {
      report.status = 'validated';
    } else {
      report.status = resolutionStatus;
    }
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();
    report.resolutionNote = resolutionNote;
    await report.save();

    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'PUBLIC_REPORT_REVIEWED',
      entityType: 'report_issue',
      entityId: report._id.toString(),
      projectId: report.projectRef,
      newValues: { status: resolutionStatus },
      reason: resolutionNote,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Issue report updated', {
      reportId: report._id,
      status: report.status,
      reviewedAt: report.reviewedAt,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createIssueReport,
  getIssueReportsForAdmin,
  getIssueReportsForAuditor,
  resolveIssueReport,
};
