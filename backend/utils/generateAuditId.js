const AuditLog = require('../models/AuditLog');

const generateAuditId = async () => {
  const last = await AuditLog.findOne().sort({ createdAt: -1 }).select('auditId');
  if (!last || !last.auditId) return 'AUD0001';

  const num = parseInt(last.auditId.replace('AUD', ''), 10);
  return `AUD${String(num + 1).padStart(4, '0')}`;
};

module.exports = generateAuditId;
