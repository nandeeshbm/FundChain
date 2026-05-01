const Transaction = require('../models/Transaction');
const Project = require('../models/Project');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('project', 'name');
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private/Admin
const createTransaction = async (req, res) => {
  const { txnId, projectId, amount, type, by, status, blockchainTxHash } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const newTransaction = new Transaction({
      txnId,
      project: projectId,
      amount,
      type,
      by,
      status,
      blockchainTxHash,
    });

    const transaction = await newTransaction.save();

    // Update project amounts
    if (type === 'Fund Release') {
      project.releasedAmount += amount;
    } else if (type === 'Utilization') {
      project.utilisedAmount += amount;
    }
    await project.save();

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
