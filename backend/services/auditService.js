const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry for any sensitive action.
 */
const logAction = async ({
  userId = null,
  userRole = null,
  action,
  entityType,
  entityId = null,
  projectId = null,
  transactionId = null,
  oldValues = null,
  newValues = null,
  reason = '',
  ipAddress = null,
  userAgent = null,
  status = 'success',
}) => {
  try {
    const log = new AuditLog({
      userId,
      userRole,
      action,
      entityType,
      entityId,
      projectId,
      transactionId,
      oldValues,
      newValues,
      reason,
      ipAddress,
      userAgent,
      status,
    });
    await log.save();
    return log;
  } catch (err) {
    console.error('AuditService: Failed to create audit log:', err.message);
    // Audit logging failures should not break the main flow
    return null;
  }
};

/**
 * Query audit logs with filters.
 */
const getAuditLogs = async (filters = {}, page = 1, limit = 20) => {
  const query = {};
  if (filters.entityType) query.entityType = filters.entityType;
  if (filters.projectId) query.projectId = filters.projectId;
  if (filters.userId) query.userId = filters.userId;
  if (filters.action) query.action = { $regex: filters.action, $options: 'i' };

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(query),
  ]);

  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
};

module.exports = { logAction, getAuditLogs };
