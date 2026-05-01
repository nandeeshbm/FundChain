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
    if (!milestone) return apiResponse.error(res, 'Milestone not found', [], 404);

    const project = await Project.findById(milestone.projectId).session(session);
    if (!project) return apiResponse.error(res, 'Project not found', [], 404);

    if (milestone.status === 'released') {
      return apiResponse.error(res, 'Funds already released for this milestone', [], 400);
    }

    // 1. Trigger blockchain release if contract address exists
    let onChainTxHash = null;
    if (project.contractAddress) {
      const proof = await ProofSubmission.findById(milestone.proofSubmissionId).session(session);
      const proofHash = proof ? (proof.ipfsPhotoCid || 'NoProof') : 'NoProof';

      const bcResult = await blockchainService.releaseMilestoneFunds(
        project.contractAddress,
        project.projectId,
        milestone.phaseNumber - 1, // 0-indexed on-chain
        proofHash
      );
      onChainTxHash = bcResult.txHash;
    }

    // 2. Update Milestone status
    milestone.status = 'released';
    milestone.actualReleaseDate = new Date();
    milestone.blockchainReleaseTxHash = onChainTxHash;
    milestone.releaseTriggeredBy = req.user._id;
    await milestone.save({ session });

    // 3. Update Project amounts
    project.releasedAmount += milestone.amount;
    project.remainingAmount -= milestone.amount;
    if (project.remainingAmount === 0) project.status = 'completed';
    await project.save({ session });

    // 4. Create Transaction record
    await transactionService.createTransaction({
      projectId: project._id,
      milestoneId: milestone._id,
      projectNameSnapshot: project.projectName,
      type: 'fund_release',
      amount: milestone.amount,
      onChainTxnHash: onChainTxHash,
      initiatedBy: req.user._id,
      recipientWalletAddress: project.contractorWalletAddress,
      status: 'success',
      proofSubmissionId: milestone.proofSubmissionId,
    }, session);

    // 5. Audit Log
    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'FUND_RELEASED',
      entityType: 'milestone',
      entityId: milestone._id.toString(),
      projectId: project._id,
      newValues: { amount: milestone.amount, txHash: onChainTxHash },
      ipAddress: req.ip,
    }, session);

    await session.commitTransaction();
    return apiResponse.success(res, 'Funds released successfully', {
      milestoneStatus: milestone.status,
      txHash: onChainTxHash,
    });
  } catch (err) {
    if (session.inAtomicitySession()) {
      await session.abortTransaction();
    }
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = { getFundSummary, getProjectMilestones, getMilestoneProof, releaseFunds };
