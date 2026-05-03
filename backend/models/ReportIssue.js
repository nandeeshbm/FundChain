const mongoose = require('mongoose');

const ReportIssueSchema = new mongoose.Schema({
  source: { type: String, enum: ['public_witness'], default: 'public_witness' },
  projectRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  projectId: { type: String, required: true, trim: true },
  projectName: { type: String, required: true, trim: true },
  observation: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  anonymous: { type: Boolean, default: true },
  reporterName: { type: String, trim: true, default: null },
  reporterEmail: { type: String, trim: true, default: null },
  reporterPhone: { type: String, trim: true, default: null },
  evidenceFiles: {
    type: [
      {
        originalName: { type: String, default: null },
        fileName: { type: String, default: null },
        mimeType: { type: String, default: null },
        size: { type: Number, default: 0 },
        storagePath: { type: String, default: null },
        fileUrl: { type: String, default: null },
      },
    ],
    default: [],
  },
  status: { type: String, enum: ['new', 'validated', 'dismissed'], default: 'new' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  resolutionNote: { type: String, default: '' },
  userAgent: { type: String, default: null },
  reporterIp: { type: String, default: null },
}, {
  timestamps: true,
});

ReportIssueSchema.index({ projectId: 1 });
ReportIssueSchema.index({ status: 1 });

module.exports = mongoose.model('ReportIssue', ReportIssueSchema);
