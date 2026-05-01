const mongoose = require('mongoose');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const ProofSubmission = require('../models/ProofSubmission');
const blockchainService = require('../services/blockchainService');
const transactionService = require('../services/transactionService');
const auditService = require('../services/auditService');
const apiResponse = require('../utils/apiResponse');

// GET /api/admin/projects/:projectId/fund-summary
const getFundSummary = async (req, res, next) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId })
      .populate('contractorId', 'vendorName companyName walletAddress')
      .lean();

    if (!project) return apiResponse.error(res, 'Project not found', [], 404);

    // Try to get on-chain vault state
    let vaultState = null;
    if (project.contractAddress) {
      vaultState = await blockchainService.getVaultState(project.contractAddress, project.projectId);
    }

    const milestones = await Milestone.find({ projectId: project._id })
      .sort({ phaseNumber: 1 })
      .lean();

    return apiResponse.success(res, 'Fund summary retrieved', {
      totalBudget: project.totalBudget,
      totalReleased: project.releasedAmount,
      remainingInVault: project.remainingAmount,
      contractAddress: project.contractAddress,
      contractNetwork: project.contractNetwork,
      vaultState,
      milestones,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/projects/:projectId/milestones
const getProjectMilestones = async (req, res, next) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId }).lean();
    if (!project) return apiResponse.error(res, 'Project not found', [], 404);

    const milestones = await Milestone.find({ projectId: project._id })
      .sort({ phaseNumber: 1 })
      .populate('proofSubmissionId')
      .populate('releaseTriggeredBy', 'name email')
      .lean();

    return apiResponse.success(res, 'Milestones retrieved', { milestones });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/milestones/:milestoneId/proof
const getMilestoneProof = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId).lean();
    if (!milestone) return apiResponse.error(res, 'Milestone not found', [], 404);

    if (!milestone.proofSubmissionId) {
      return apiResponse.success(res, 'No proof submitted yet', { proof: null });
    }

    const proof = await ProofSubmission.findById(milestone.proofSubmissionId)
      .populate('contractorId', 'vendorName companyName')
      .lean();

    const project = await Project.findById(milestone.projectId).lean();

    // Check if within geofence
    const withinGeofence = proof
      ? proof.distanceFromOfficialPinMeters <= project.allowedRadiusMeters
      : false;

    return apiResponse.success(res, 'Proof details retrieved', {
      proof,
      withinGeofence,
      allowedRadiusMeters: project.allowedRadiusMeters,
      requiredProofs: project.requiredProofs,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/milestones/:milestoneId/release — Trigger fund release
const releaseFunds = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const milestone = await Milestone.findById(req.params.milestoneId).session(session);
    if (!milestone) {
      await session.abortTransaction();
      return apiResponse.error(res, 'Milestone not found', [], 404);
    }

    // Idempotency: prevent double release
    if (milestone.status === 'released') {
      await session.abortTransaction();
      return apiResponse.error(res, 'Milestone already released', [], 409);
    }

    // Must be verified
    if (milestone.status !== 'verified') {
      await session.abortTransaction();
      return apiResponse.error(res, 'Milestone must be verified before release', [], 400);
    }

    // Check sentinel
    if (milestone.sentinelStatus === 'flagged') {
      await session.abortTransaction();
      return apiResponse.error(res, 'Cannot release flagged milestone', [], 400);
    }

    // Check proof exists
    if (!milestone.proofSubmissionId) {
      await session.abortTransaction();
      return apiResponse.error(res, 'Proof submission required before release', [], 400);
    }

    const proof = await ProofSubmission.findById(milestone.proofSubmissionId).session(session);
    if (proof && proof.sentinelResult === 'flagged') {
      await session.abortTransaction();
      return apiResponse.error(res, 'Cannot release — proof is flagged by sentinel', [], 400);
    }

    const project = await Project.findById(milestone.projectId).session(session);
    if (!project) {
      await session.abortTransaction();
      return apiResponse.error(res, 'Project not found', [], 404);
    }

    // Budget safety check
    if (project.releasedAmount + milestone.amount > project.totalBudget) {
      await session.abortTransaction();
      return apiResponse.error(res, 'Release would exceed total budget', [], 400);
    }

    // Blockchain release
    const releaseResult = await blockchainService.releaseMilestoneFunds(
      project.contractAddress,
      project.projectId,
      milestone.amount,
      project.contractorWalletAddress
    );

    // Update milestone
    milestone.status = 'released';
    milestone.actualReleaseDate = new Date();
    milestone.blockchainReleaseTxHash = releaseResult.txHash;
    milestone.blockchainReleaseBlockNumber = releaseResult.blockNumber;
    milestone.releaseTriggeredBy = req.user._id;
    milestone.remarks = req.body.remarks || '';
    await milestone.save({ session });

    // Update project amounts
    project.releasedAmount += milestone.amount;
    project.remainingAmount -= milestone.amount;
    project.lastUpdatedBy = req.user._id;

    // Check if all milestones released
    const allMilestones = await Milestone.find({ projectId: project._id }).session(session);
    const allReleased = allMilestones.every((m) => m.status === 'released');
    if (allReleased) project.status = 'completed';
    else project.status = 'in_progress';

    await project.save({ session });

    // Create transaction entry
    const txn = await transactionService.createTransaction(
      {
        projectId: project._id,
        milestoneId: milestone._id,
        projectNameSnapshot: project.projectName,
        type: 'fund_release',
        amount: milestone.amount,
        contractAddress: project.contractAddress,
        onChainTxnHash: releaseResult.txHash,
        blockNumber: releaseResult.blockNumber,
        initiatedBy: req.user._id,
        recipientWalletAddress: project.contractorWalletAddress,
        status: 'success',
        proofSubmissionId: milestone.proofSubmissionId,
        notes: `Phase ${milestone.phaseNumber} fund release`,
        chainTimestamp: new Date(),
      },
      session
    );

    // Audit log
    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'FUND_RELEASED',
      entityType: 'milestone',
      entityId: milestone._id.toString(),
      projectId: project._id,
      transactionId: txn._id,
      oldValues: { status: 'verified', releasedAmount: project.releasedAmount - milestone.amount },
      newValues: { status: 'released', releasedAmount: project.releasedAmount },
      reason: req.body.remarks || 'Admin authorized fund release',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    await session.commitTransaction();

    return apiResponse.success(res, 'Funds released successfully', {
      txHash: releaseResult.txHash,
      blockNumber: releaseResult.blockNumber,
      releasedAmount: project.releasedAmount,
      remainingAmount: project.remainingAmount,
      milestoneStatus: milestone.status,
      transactionId: txn.txnId,
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = { getFundSummary, getProjectMilestones, getMilestoneProof, releaseFunds };
