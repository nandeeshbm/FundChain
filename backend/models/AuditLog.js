const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  auditId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userRole: { type: String, default: null },
  action: { type: String, required: true },
  entityType: {
    type: String,
    enum: ['project', 'milestone', 'transaction', 'proof_submission', 'vendor', 'auth'],
    required: true,
  },
  entityId: { type: String, default: null },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null },
  oldValues: { type: mongoose.Schema.Types.Mixed, default: null },
  newValues: { type: mongoose.Schema.Types.Mixed, default: null },
  reason: { type: String, default: '' },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success',
  },
  createdAt: { type: Date, default: Date.now },
});

// auditId index auto-created by unique: true
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ entityType: 1 });
AuditLogSchema.index({ projectId: 1 });
AuditLogSchema.index({ createdAt: -1 });

// Auto-generate auditId
AuditLogSchema.pre('save', async function (next) {
  if (this.isNew && !this.auditId) {
    const count = await mongoose.model('AuditLog').countDocuments();
    this.auditId = `AUD${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
