const ProofSubmission = require('../models/ProofSubmission');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const Vendor = require('../models/Vendor');
const { analyzeSubmission } = require('../services/anomalyDetector');
const { calculateDistanceMeters } = require('../services/geoService');
const auditService = require('../services/auditService');
const apiResponse = require('../utils/apiResponse');

// POST /api/contractor/milestones/:milestoneId/submit-proof
const submitProof = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId);
    if (!milestone) return apiResponse.error(res, 'Milestone not found', [], 404);

    const project = await Project.findById(milestone.projectId);
    if (!project) return apiResponse.error(res, 'Project not found', [], 404);

    // Validate contractor owns this project
    const vendor = await Vendor.findById(project.contractorId);
    if (!vendor) return apiResponse.error(res, 'Contractor not found', [], 404);

    // Build proof submission
    const distance = calculateDistanceMeters(
      project.officialLocation.latitude,
      project.officialLocation.longitude,
      req.body.gpsLatitude,
      req.body.gpsLongitude
    );

    const proof = new ProofSubmission({
      projectId: project._id,
      milestoneId: milestone._id,
      contractorId: vendor._id,
      ipfsPhotoUrl: req.body.ipfsPhotoUrl || null,
      ipfsPhotoCid: req.body.ipfsPhotoCid || null,
      gpsLatitude: req.body.gpsLatitude,
      gpsLongitude: req.body.gpsLongitude,
      distanceFromOfficialPinMeters: Math.round(distance),
      uploadedProofs: req.body.uploadedProofs,
      receiptDocumentUrl: req.body.receiptDocumentUrl || null,
      completionCertificateUrl: req.body.completionCertificateUrl || null,
      forensicMeta: req.body.forensicMeta || {},
      submittedAt: new Date(),
    });

    // Run sentinel analysis
    const existingSubs = await ProofSubmission.find({ projectId: project._id }).lean();
    const sentinel = await analyzeSubmission({
      proofSubmission: proof,
      project,
      milestone,
      existingSubmissions: existingSubs,
    });

    proof.sentinelResult = sentinel.sentinelResult;
    proof.sentinelReasons = sentinel.sentinelReasons;
    proof.distanceFromOfficialPinMeters = sentinel.distanceFromOfficialPinMeters;
    await proof.save();

    // Update milestone
    milestone.proofSubmissionId = proof._id;
    milestone.actualSubmissionDate = new Date();

    if (sentinel.sentinelResult === 'flagged') {
      milestone.status = 'flagged';
      milestone.sentinelStatus = 'flagged';
    } else {
      milestone.status = 'submitted';
      milestone.sentinelStatus = 'success';
    }
    await milestone.save();

    await auditService.logAction({
      userId: req.user?._id,
      userRole: req.user?.role,
      action: 'PROOF_SUBMITTED',
      entityType: 'proof_submission',
      entityId: proof._id.toString(),
      projectId: project._id,
      newValues: {
        sentinelResult: sentinel.sentinelResult,
        distance: sentinel.distanceFromOfficialPinMeters,
        reasons: sentinel.sentinelReasons,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Proof submitted successfully', {
      proof,
      sentinelResult: sentinel.sentinelResult,
      sentinelReasons: sentinel.sentinelReasons,
      distanceFromPin: sentinel.distanceFromOfficialPinMeters,
    }, 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitProof };
