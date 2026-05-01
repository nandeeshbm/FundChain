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
      taxIRN: req.body.taxIRN || null,
      distanceFromOfficialPinMeters: Math.round(distance),
      uploadedProofs: {
        sitePhoto:             !!(req.body.uploadedProofs?.sitePhoto),
        materialReceipt:       !!(req.body.uploadedProofs?.materialReceipt),
        completionCertificate: !!(req.body.uploadedProofs?.completionCertificate),
      },
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

    // Create "utilization" transaction record
    const transactionService = require('../services/transactionService');
    await transactionService.createTransaction({
      projectId: project._id,
      milestoneId: milestone._id,
      projectNameSnapshot: project.projectName,
      type: 'utilization',
      amount: milestone.amount,
      initiatedBy: req.user?._id,
      status: sentinel.sentinelResult === 'flagged' ? 'flagged' : 'pending',
      proofSubmissionId: proof._id,
      notes: `Proof submitted for Phase ${milestone.phaseNumber}. Sentinel result: ${sentinel.sentinelResult}`,
    });

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

// GET /api/contractor/submissions
const getMySubmissions = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user?._id).select('contractorRegistryId walletAddress').lean();

    let vendor = null;
    if (user?.contractorRegistryId) {
      vendor = await Vendor.findOne({ registryId: user.contractorRegistryId }).lean();
    }
    if (!vendor && user?.walletAddress) {
      vendor = await Vendor.findOne({ walletAddress: user.walletAddress }).lean();
    }
    if (!vendor) {
      vendor = await Vendor.findOne({ createdBy: req.user?._id }).lean();
    }
    if (!vendor) {
      return apiResponse.success(res, 'Submissions retrieved', []);
    }

    const submissions = await ProofSubmission.find({ contractorId: vendor._id })
      .sort({ submittedAt: -1 })
      .populate({ path: 'projectId', select: 'projectName projectId' })
      .populate({ path: 'milestoneId', select: 'title phaseNumber amount status sentinelStatus' })
      .lean();

    const normalized = submissions.map((s) => ({
      _id: s._id,
      proofId: `PRF-${String(s._id).slice(-6).toUpperCase()}`,
      projectName: s.projectId?.projectName || '—',
      projectCode: s.projectId?.projectId || '—',
      milestoneTitle: s.milestoneId?.title || `Phase ${s.milestoneId?.phaseNumber || ''}`.trim(),
      amount: s.milestoneId?.amount || 0,
      sentinelStatus: s.sentinelResult || 'pending',
      status: s.milestoneId?.status || 'submitted',
      submittedAt: s.submittedAt || s.createdAt,
      gpsLatitude: s.gpsLatitude,
      gpsLongitude: s.gpsLongitude,
      taxIRN: s.taxIRN,
    }));

    return apiResponse.success(res, 'Submissions retrieved', normalized);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitProof, getMySubmissions };
