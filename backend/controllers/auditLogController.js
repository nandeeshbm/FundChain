const auditService = require('../services/auditService');
const apiResponse = require('../utils/apiResponse');

// GET /api/admin/audit-logs
const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, entityType, projectId, action } = req.query;
    const filters = {};
    if (entityType) filters.entityType = entityType;
    if (projectId) filters.projectId = projectId;
    if (action) filters.action = action;

    const result = await auditService.getAuditLogs(filters, parseInt(page), parseInt(limit));
    return apiResponse.paginated(res, 'Audit logs retrieved', result.logs, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAuditLogs };
