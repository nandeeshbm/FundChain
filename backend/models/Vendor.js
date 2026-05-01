const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  walletAddress: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  isWhitelisted: { type: Boolean, default: true },
  departmentTags: [{ type: String, trim: true }],
  taxId: { type: String, trim: true },
  registryId: { type: String, unique: true },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Blocked'],
    default: 'Active',
  },
  anomalyScore: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String, default: '' },
}, { timestamps: true });

VendorSchema.index({ registryId: 1 });
VendorSchema.index({ walletAddress: 1 });
VendorSchema.index({ isWhitelisted: 1 });

// Auto-generate registryId before save
VendorSchema.pre('save', async function (next) {
  if (this.isNew && !this.registryId) {
    const count = await mongoose.model('Vendor').countDocuments();
    this.registryId = `VND${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Vendor', VendorSchema);
