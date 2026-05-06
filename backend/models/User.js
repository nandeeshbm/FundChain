const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'auditor', 'contractor'],
    required: true,
  },
  contractorRegistryId: { type: String, default: null },
  walletAddress: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  resetOtpHash: { type: String, default: null },
  resetOtpExpiresAt: { type: Date, default: null },
}, { timestamps: true });

// email index is auto-created by unique: true
UserSchema.index({ role: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.resetOtpHash;
  delete obj.resetOtpExpiresAt;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
