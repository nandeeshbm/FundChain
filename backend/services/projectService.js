const mongoose = require('mongoose');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Vendor = require('../models/Vendor');
const blockchainService = require('./blockchainService');
const generateProjectId = require('../utils/generateProjectId');
const transactionService = require('./transactionService');
const auditService = require('./auditService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create a new project with milestones, optional blockchain deployment, and audit trail.
 */
const createProject = async (payload, adminUser, reqMeta = {}) => {
  try {
    // 1. Validate contractor (optional — allow null contractor for now)
    let vendor = null;
    if (payload.contractorId) {
      // Try lookup by ObjectId, fallback to registryId
      const isObjectId = mongoose.Types.ObjectId.isValid(payload.contractorId);
      if (isObjectId) {
        vendor = await Vendor.findById(payload.contractorId);
      }
      if (!vendor) {
        vendor = await Vendor.findOne({ registryId: payload.contractorId });
      }
      if (!vendor) {
        throw new AppError('Contractor not found. Please select a valid contractor.', 404);
      }
    }

    // 2. Validate milestone amounts — warn but don't fail (admin can adjust later)
    const milestonesList = payload.milestoneBreakdown || [];
    const milestoneSum = milestonesList.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
    const budgetDiff = Math.abs(milestoneSum - payload.totalBudget);
    if (budgetDiff > 1 && milestonesList.length > 0) {
      // Allow up to ₹1 rounding diff; only fail if milestones sum is wildly off
      if (budgetDiff / payload.totalBudget > 0.01) {
        throw new AppError(
          `Milestone amounts sum (₹${milestoneSum.toLocaleString()}) must equal Total Budget (₹${payload.totalBudget.toLocaleString()})`,
          400
        );
      }
    }

    // 3. Generate project ID
    const projectId = await generateProjectId().catch(e => {
      console.error('generateProjectId failed:', e.message);
      return `PJT${Date.now()}`; 
    });

    // 4. Try blockchain deployment — skip gracefully if no private key
    let deployResult = {
      contractAddress: null,
      deploymentTxHash: null,
      blockNumber: null,
    };
    if (vendor?.walletAddress) {
      try {
        const milestoneAmounts = milestonesList.map((m) => Number(m.amount));
        deployResult = await blockchainService.deployEscrowVault(
          projectId,
          vendor.walletAddress,
          payload.totalBudget,
          milestoneAmounts
        );
      } catch (bcErr) {
        console.warn(`BlockchainService: Skipping deployment — ${bcErr.message}`);
      }
    }
    // 5. Create Project document
    const [project] = await Project.create(
      [{
        projectName: payload.projectName,
        department: payload.department,
        otherDepartmentName: payload.department === 'Others' ? payload.otherDepartmentName : null,
        projectId,
        contractorId: vendor?._id || null,
        contractorWalletAddress: vendor?.walletAddress || null,
        projectCreationDateTime: new Date(),
        totalBudget: payload.totalBudget,
        remainingAmount: payload.totalBudget,
        releasedAmount: 0,
        contractAddress: deployResult.contractAddress,
        contractDeploymentTxHash: deployResult.deploymentTxHash,
        contractDeploymentBlockNumber: deployResult.blockNumber,
        contractNetwork: deployResult.contractAddress ? 'sepolia' : null,
        status: 'active',
        publicVisibility: true,
        officialLocation: {
          latitude: Number(payload.officialLocation?.latitude) || 0,
          longitude: Number(payload.officialLocation?.longitude) || 0,
        },
        allowedRadiusMeters: Number(payload.allowedRadiusMeters) || 500,
        expectedSupplierIRNMin: payload.expectedSupplierIRNMin || null,
        expectedSupplierIRNMax: payload.expectedSupplierIRNMax || null,
        requiredProofs: payload.requiredProofs || { sitePhoto: true, materialReceipt: true, completionCertificate: true },
        createdBy: adminUser?._id,
        lastUpdatedBy: adminUser?._id,
      }],
    );

    // 6. Create Milestones
    const milestones = await Milestone.create(
      milestonesList.map((m, idx) => ({
        projectId: project._id,
        phaseNumber: idx + 1,
        title: m.title || `Phase ${idx + 1}`,
        description: m.description || '',
        amount: Number(m.amount),
        status: 'pending',
      })),
    );

    // 7. Create initial "fund_lock" transaction
    await transactionService.createTransaction({
      projectId: project._id,
      projectNameSnapshot: project.projectName,
      type: 'fund_lock',
      amount: project.totalBudget,
      contractAddress: project.contractAddress,
      onChainTxnHash: project.contractDeploymentTxHash,
      initiatedBy: adminUser?._id,
      status: 'success',
      notes: 'Initial budget locked in vault',
    });

    // 8. Audit log
    await auditService.logAction({
      userId: adminUser?._id,
      userRole: adminUser?.role,
      action: 'PROJECT_CREATED',
      entityType: 'project',
      entityId: project.projectId,
      projectId: project._id,
      newValues: { budget: project.totalBudget, milestones: milestones.length },
      ipAddress: reqMeta.ipAddress,
      userAgent: reqMeta.userAgent,
    });

    return { project, milestones };
  } catch (err) {
    console.error('projectService: FAILED:', err.message);
    throw err;
  }
};

module.exports = { createProject };
