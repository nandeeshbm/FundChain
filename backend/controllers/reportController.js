const Project = require('../models/Project');
const ReportIssue = require('../models/ReportIssue');
const apiResponse = require('../utils/apiResponse');

const createIssueReport = async (req, res, next) => {
  try {
    const { projectId, observation, description, anonymous, name, email, phone } = req.body;
    const project = await Project.findOne({ projectId }).select('projectId projectName').lean();

    const report = await ReportIssue.create({
      projectRef: project?._id || null,
      projectId,
      projectName: project?.projectName || 'Unknown Project',
      observation,
      description,
      anonymous: Boolean(anonymous),
      reporterName: anonymous ? null : name || null,
      reporterEmail: anonymous ? null : email || null,
      reporterPhone: anonymous ? null : phone || null,
      userAgent: req.headers['user-agent'] || null,
      reporterIp: req.ip || null,
    });

    return apiResponse.success(res, 'Issue report submitted successfully', {
      reportId: report._id,
      projectId: report.projectId,
      projectName: report.projectName,
      createdAt: report.createdAt,
    }, 201);
  } catch (err) {
    next(err);
  }
};

const getIssueReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, projectId, status } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (status) query.status = status;

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

module.exports = {
  createIssueReport,
  getIssueReports,
};
