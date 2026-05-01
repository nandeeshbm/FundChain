const mongoose = require('mongoose');

const ProofSubmissionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  milestoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', required: true },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  ipfsPhotoUrl: { type: String, default: null },
  ipfsPhotoCid: { type: String, default: null },
  gpsLatitude: { type: Number, required: true, min: -90, max: 90 },
  gpsLongitude: { type: Number, required: true, min: -180, max: 180 },
  distanceFromOfficialPinMeters: { type: Number, default: null },
  uploadedProofs: {
    sitePhoto: { type: Boolean, default: false },
    materialReceipt: { type: Boolean, default: false },
    completionCertificate: { type: Boolean, default: false },
  },
  receiptDocumentUrl: { type: String, default: null },
  completionCertificateUrl: { type: String, default: null },
  forensicMeta: {
    imageHash: { type: String, default: null },
    exifCapturedAt: { type: Date, default: null },
    deviceInfo: { type: String, default: null },
    geoMatchResult: { type: String, default: null },
  },
  sentinelResult: {
    type: String,
    enum: ['pending', 'success', 'flagged'],
    default: 'pending',
  },
  sentinelReasons: [{ type: String }],
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

ProofSubmissionSchema.index({ projectId: 1 });
ProofSubmissionSchema.index({ milestoneId: 1 });
ProofSubmissionSchema.index({ contractorId: 1 });

module.exports = mongoose.model('ProofSubmission', ProofSubmissionSchema);
