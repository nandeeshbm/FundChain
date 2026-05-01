const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  phaseNumber: { type: Number, required: true, enum: [1, 2, 3] },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  amount: { type: Number, required: true, min: 0 },
  estimatedDeadline: { type: Date, required: true },
  actualSubmissionDate: { type: Date, default: null },
  actualVerificationDate: { type: Date, default: null },
  actualReleaseDate: { type: Date, default: null },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'submitted', 'verified', 'released', 'flagged', 'rejected'],
    default: 'pending',
  },
  proofSubmissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProofSubmission', default: null },
  sentinelStatus: {
    type: String,
    enum: ['not_started', 'checking', 'success', 'flagged', 'pending'],
    default: 'not_started',
  },
  blockchainReleaseTxHash: { type: String, default: null },
  blockchainReleaseBlockNumber: { type: Number, default: null },
  releaseTriggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  remarks: { type: String, default: '' },
}, { timestamps: true });

MilestoneSchema.index({ projectId: 1 });
MilestoneSchema.index({ phaseNumber: 1 });
MilestoneSchema.index({ status: 1 });
MilestoneSchema.index({ projectId: 1, phaseNumber: 1 }, { unique: true });

module.exports = mongoose.model('Milestone', MilestoneSchema);
