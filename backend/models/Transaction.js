const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', default: null },
  projectNameSnapshot: { type: String, required: true },
  type: {
    type: String,
    enum: ['fund_lock', 'fund_release', 'utilization'],
    required: true,
  },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  contractAddress: { type: String, default: null },
  onChainTxnHash: { type: String, default: null },
  blockNumber: { type: Number, default: null },
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientWalletAddress: { type: String, default: null },
  status: {
    type: String,
    enum: ['pending', 'success', 'flagged', 'failed'],
    default: 'pending',
  },
  sentinelStatus: {
    type: String,
    enum: ['pending', 'success', 'flagged', 'not_applicable'],
    default: 'not_applicable',
  },
  proofSubmissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProofSubmission', default: null },
  notes: { type: String, default: '' },
  chainTimestamp: { type: Date, default: null },
  confirmations: { type: Number, default: 0 },
}, { timestamps: true });

// txnId index auto-created by unique: true
TransactionSchema.index({ projectId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ onChainTxnHash: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
