const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, trim: true },
  department: {
    type: String,
    required: true,
    enum: ['PWD', 'Water Dept', 'Education', 'Others'],
  },
  otherDepartmentName: { type: String, trim: true, default: null },
  projectId: { type: String, required: true, unique: true },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  contractorWalletAddress: { type: String, required: true },
  projectCreationDateTime: { type: Date, default: Date.now },
  totalBudget: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  budgetReleaseMode: { type: String, default: '3_PHASE' },
  phaseCount: { type: Number, default: 3 },
  releasedAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  contractAddress: { type: String, default: null },
  contractNetwork: { type: String, default: 'sepolia' },
  contractDeploymentTxHash: { type: String, default: null },
  contractDeploymentBlockNumber: { type: Number, default: null },
  status: {
    type: String,
    enum: ['draft', 'active', 'in_progress', 'completed', 'flagged', 'cancelled'],
    default: 'active',
  },
  officialLocation: {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
  },
  allowedRadiusMeters: { type: Number, required: true, min: 1 },
  expectedSupplierIRNMin: { type: Number, default: null },
  expectedSupplierIRNMax: { type: Number, default: null },
  requiredProofs: {
    sitePhoto: { type: Boolean, default: true },
    materialReceipt: { type: Boolean, default: true },
    completionCertificate: { type: Boolean, default: true },
  },
  publicVisibility: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

ProjectSchema.index({ projectId: 1 });
ProjectSchema.index({ contractorId: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ contractAddress: 1 });
ProjectSchema.index({ department: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
