const Transaction = require('../models/Transaction');
const generateTxnId = require('../utils/generateTxnId');

/**
 * Create a new transaction ledger entry.
 */
const createTransaction = async ({
  projectId,
  milestoneId = null,
  projectNameSnapshot,
  type,
  amount,
  currency = 'INR',
  contractAddress = null,
  onChainTxnHash = null,
  blockNumber = null,
  initiatedBy = null,
  recipientWalletAddress = null,
  status = 'pending',
  sentinelStatus = 'not_applicable',
  proofSubmissionId = null,
  notes = '',
  chainTimestamp = null,
  confirmations = 0,
}, session = null) => {
  const txnId = await generateTxnId();

  const txnData = {
    txnId,
    projectId,
    milestoneId,
    projectNameSnapshot,
    type,
    amount,
    currency,
    contractAddress,
    onChainTxnHash,
    blockNumber,
    initiatedBy,
    recipientWalletAddress,
    status,
    sentinelStatus,
    proofSubmissionId,
    notes,
    chainTimestamp,
    confirmations,
  };

  const [txn] = await Transaction.create([txnData], { session });
  return txn;
};

/**
 * Filtered + paginated transaction query with role-based access.
 */
const getFilteredTransactions = async ({
  filters = {},
  page = 1,
  limit = 20,
  userRole = 'admin',
  userId = null,
}) => {
  const query = {};

  if (filters.projectId) query.projectId = filters.projectId;
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  // Role-based filtering
  if (userRole === 'contractor') {
    // Contractors can only view transactions for their assigned projects
    const Project = require('../models/Project');
    const Vendor = require('../models/Vendor');
    const User = require('../models/User');
    const user = await User.findById(userId).select('contractorRegistryId walletAddress');
    let vendor = null;

    if (user?.contractorRegistryId) {
      vendor = await Vendor.findOne({ registryId: user.contractorRegistryId });
    }
    if (!vendor && user?.walletAddress) {
      vendor = await Vendor.findOne({ walletAddress: user.walletAddress });
    }
    if (!vendor) {
      vendor = await Vendor.findOne({ createdBy: userId });
    }

    if (vendor) {
      const projects = await Project.find({ contractorId: vendor._id }).select('_id');
      query.projectId = { $in: projects.map((p) => p._id) };
    } else {
      query.projectId = null; // No projects assigned
    }
  }

  if (userRole === 'public') {
    query.status = 'success';
    query.type = { $in: ['fund_lock', 'fund_release'] };
  }

  const skip = (page - 1) * limit;

  // Select fields based on role
  let selectFields = '';
  if (userRole === 'public') {
    selectFields = 'txnId projectNameSnapshot type amount status onChainTxnHash createdAt';
  }

  const queryBuilder = Transaction.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('projectId', 'projectName projectId department')
    .populate('milestoneId', 'phaseNumber title status')
    .populate('initiatedBy', 'name role');

  if (selectFields) queryBuilder.select(selectFields);

  const [transactions, total] = await Promise.all([
    queryBuilder.lean(),
    Transaction.countDocuments(query),
  ]);

  return {
    transactions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = { createTransaction, getFilteredTransactions };
