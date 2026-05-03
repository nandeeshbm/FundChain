const mongoose = require('mongoose');

const ReportIssueSchema = new mongoose.Schema({
  projectRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  projectId: { type: String, required: true, trim: true },
  projectName: { type: String, required: true, trim: true },
  observation: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  anonymous: { type: Boolean, default: true },
  reporterName: { type: String, trim: true, default: null },
  reporterEmail: { type: String, trim: true, default: null },
  reporterPhone: { type: String, trim: true, default: null },
  status: { type: String, enum: ['new', 'reviewed', 'closed'], default: 'new' },
  userAgent: { type: String, default: null },
  reporterIp: { type: String, default: null },
}, {
  timestamps: true,
});

ReportIssueSchema.index({ projectId: 1 });
ReportIssueSchema.index({ status: 1 });

module.exports = mongoose.model('ReportIssue', ReportIssueSchema);
