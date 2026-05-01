const Joi = require('joi');

// Middleware factory that validates req.body against a Joi schema
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    next();
  };
};

// ── Schemas ──

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('admin', 'auditor', 'contractor').required(),
  walletAddress: Joi.string().allow(null, '').optional(),
  contractorRegistryId: Joi.string().allow(null, '').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const milestoneItemSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().allow('').optional(),
  amount: Joi.number().positive().required(),
  estimatedDeadline: Joi.alternatives().try(Joi.date(), Joi.string()).allow(null, '').optional(),
});

const createProjectSchema = Joi.object({
  projectName: Joi.string().trim().min(2).max(200).required(),
  department: Joi.string().min(1).max(100).required(),
  otherDepartmentName: Joi.string().allow(null, '').optional(),
  contractorId: Joi.string().allow(null, '').optional(),
  totalBudget: Joi.number().positive().required(),
  milestoneBreakdown: Joi.array().items(milestoneItemSchema).min(1).required(),
  officialLocation: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }).required(),
  allowedRadiusMeters: Joi.number().positive().allow(null).optional(),
  expectedSupplierIRNMin: Joi.number().allow(null).optional(),
  expectedSupplierIRNMax: Joi.number().allow(null).optional(),
  requiredProofs: Joi.object({
    sitePhoto: Joi.boolean(),
    materialReceipt: Joi.boolean(),
    completionCertificate: Joi.boolean(),
  }).optional(),
});

const submitProofSchema = Joi.object({
  ipfsPhotoUrl: Joi.string().allow(null, '').optional(),
  ipfsPhotoCid: Joi.string().allow(null, '').optional(),
  gpsLatitude: Joi.number().min(-90).max(90).required(),
  gpsLongitude: Joi.number().min(-180).max(180).required(),
  taxIRN: Joi.string().length(64).allow(null, '').optional(),
  uploadedProofs: Joi.object({
    sitePhoto: Joi.boolean().optional(),
    materialReceipt: Joi.boolean().optional(),
    completionCertificate: Joi.boolean().optional(),
  }).optional(),
  receiptDocumentUrl: Joi.string().allow(null, '').optional(),
  completionCertificateUrl: Joi.string().allow(null, '').optional(),
  walletAddress: Joi.string().allow(null, '').optional(),
  metaMaskSignature: Joi.string().allow(null, '').optional(),
  forensicMeta: Joi.object({
    imageHash: Joi.string().allow(null, '').optional(),
    exifCapturedAt: Joi.alternatives().try(Joi.date().iso(), Joi.string()).allow(null, '').optional(),
    deviceInfo: Joi.string().allow(null, '').optional(),
    geoMatchResult: Joi.string().allow(null, '').optional(),
  }).optional(),
});

const releaseFundsSchema = Joi.object({
  remarks: Joi.string().allow('').optional(),
});

const resolveTransactionSchema = Joi.object({
  resolutionStatus: Joi.string().valid('resolved', 'escalated', 'dismissed', 'frozen').required(),
  resolutionNote: Joi.string().trim().min(2).required(),
});

const createVendorSchema = Joi.object({
  vendorName: Joi.string().trim().min(2).max(100).required(),
  companyName: Joi.string().trim().min(2).max(200).required(),
  walletAddress: Joi.string().trim().allow(null, '').optional(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().min(7).max(20).required(),
  departmentTags: Joi.array().items(Joi.string().trim()).optional(),
  taxId: Joi.string().trim().allow('').optional(),
  notes: Joi.string().allow('').optional(),
});

const updateVendorSchema = Joi.object({
  vendorName: Joi.string().trim().min(2).max(100).optional(),
  companyName: Joi.string().trim().min(2).max(200).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().trim().min(10).max(15).optional(),
  departmentTags: Joi.array().items(Joi.string().trim()).optional(),
  taxId: Joi.string().trim().allow('').optional(),
  notes: Joi.string().allow('').optional(),
  status: Joi.string().valid('Active', 'Suspended', 'Blocked').optional(),
  isWhitelisted: Joi.boolean().optional(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createProjectSchema,
  submitProofSchema,
  releaseFundsSchema,
  resolveTransactionSchema,
  createVendorSchema,
  updateVendorSchema,
};
