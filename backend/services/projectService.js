const mongoose = require('mongoose');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Vendor = require('../models/Vendor');
const generateProjectId = require('../utils/generateProjectId');
const blockchainService = require('./blockchainService');
const transactionService = require('./transactionService');
const auditService = require('./auditService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create a new project with milestones, blockchain deployment, and full audit trail.
 * Uses a MongoDB session for atomicity.
 */
const createProject = async (payload, adminUser, reqMeta = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate contractor is whitelisted
    const vendor = await Vendor.findById(payload.contractorId).session(session);
    if (!vendor) throw new AppError('Contractor not found', 404);
    if (!vendor.isWhitelisted || vendor.status !== 'Active') {
      throw new AppError('Contractor is not whitelisted or not active', 400);
    }

    // 2. Validate milestone amounts sum to totalBudget
    const milestoneSum = payload.milestoneBreakdown.reduce((sum, m) => sum + m.amount, 0);
    if (milestoneSum !== payload.totalBudget) {
      throw new AppError(
        `Milestone amounts sum (${milestoneSum}) does not equal totalBudget (${payload.totalBudget})`,
        400
      );
    }

    // 3. Generate project ID
    const projectId = await generateProjectId();

    // 4. Deploy EscrowVault contract on Sepolia
    const milestoneAmounts = payload.milestoneBreakdown.map((m) => m.amount);
    const deployResult = await blockchainService.deployEscrowVault(
      projectId,
      vendor.walletAddress,
      payload.totalBudget,
      milestoneAmounts
    );

    // 5. Create Project document
    const [project] = await Project.create(
      [{
        projectName: payload.projectName,
        department: payload.department,
        otherDepartmentName: payload.department === 'Others' ? payload.otherDepartmentName : null,
        projectId,
        contractorId: vendor._id,
        contractorWalletAddress: vendor.walletAddress,
        projectCreationDateTime: new Date(),
        totalBudget: payload.totalBudget,
        remainingAmount: payload.totalBudget,
        contractAddress: deployResult.contractAddress,
        contractDeploymentTxHash: deployResult.deploymentTxHash,
        contractDeploymentBlockNumber: deployResult.blockNumber,
        status: 'active',
        officialLocation: payload.officialLocation,
        allowedRadiusMeters: payload.allowedRadiusMeters,
        expectedSupplierIRNMin: payload.expectedSupplierIRNMin || null,
        expectedSupplierIRNMax: payload.expectedSupplierIRNMax || null,
        requiredProofs: payload.requiredProofs,
        createdBy: adminUser._id,
        lastUpdatedBy: adminUser._id,
      }],
      { session }
    );

    // 6. Create 3 Milestone documents
    const milestones = await Milestone.create(
      payload.milestoneBreakdown.map((m, index) => ({
        projectId: project._id,
        phaseNumber: index + 1,
        title: m.title,
        description: m.description || '',
        amount: m.amount,
        estimatedDeadline: m.estimatedDeadline,
        status: 'pending',
        sentinelStatus: 'not_started',
      })),
      { session }
    );

    // 7. Create fund_lock transaction entry
    const fundLockTxn = await transactionService.createTransaction(
      {
        projectId: project._id,
        projectNameSnapshot: project.projectName,
        type: 'fund_lock',
        amount: payload.totalBudget,
        contractAddress: deployResult.contractAddress,
        onChainTxnHash: deployResult.deploymentTxHash,
        blockNumber: deployResult.blockNumber,
        initiatedBy: adminUser._id,
        recipientWalletAddress: vendor.walletAddress,
        status: 'success',
        notes: `Initial fund lock for project ${projectId}`,
        chainTimestamp: new Date(),
      },
      session
    );

    // 8. Create audit log
    await auditService.logAction({
      userId: adminUser._id,
      userRole: adminUser.role,
      action: 'PROJECT_CREATED',
      entityType: 'project',
      entityId: project.projectId,
      projectId: project._id,
      transactionId: fundLockTxn._id,
      newValues: {
        projectName: project.projectName,
        totalBudget: project.totalBudget,
        contractAddress: deployResult.contractAddress,
        contractor: vendor.companyName,
      },
      reason: 'New project created with EscrowVault deployment',
      ipAddress: reqMeta.ipAddress,
      userAgent: reqMeta.userAgent,
    });

    await session.commitTransaction();

    // Return populated data
    const populatedProject = await Project.findById(project._id)
      .populate('contractorId', 'vendorName companyName walletAddress registryId')
      .lean();

    return {
      project: populatedProject,
      milestones,
      transaction: fundLockTxn,
      contractDeployment: deployResult,
    };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = { createProject };
