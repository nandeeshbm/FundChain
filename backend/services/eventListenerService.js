const { ethers } = require('ethers');
const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');
const { getProvider, escrowVaultAbi } = require('./blockchainService');
const blockchainService = require('./blockchainService');
const generateTxnId = require('../utils/generateTxnId');

// Simple in-memory store for last processed block (production: use Redis or DB)
let lastProcessedBlock = 0;

/**
 * Initialize event listeners for all known EscrowVault contracts.
 * Called once on server startup.
 */
const startEventListeners = async () => {
  try {
    const provider = blockchainService.getProvider();
    if (!provider) {
      console.log('EventListener: No RPC provider configured — blockchain event listening disabled');
      return;
    }
    const currentBlock = await provider.getBlockNumber();

    const Project = require('../models/Project');
    const projects = await Project.find({
      contractAddress: { $ne: null },
      status: { $in: ['active', 'in_progress'] },
    }).select('contractAddress projectId projectName');

    console.log(`EventListener: Watching ${projects.length} active contract(s) from block ${currentBlock}`);

    for (const project of projects) {
      attachListenerToContract(provider, project);
    }

    lastProcessedBlock = currentBlock;
  } catch (err) {
    console.error('EventListener: Failed to start:', err.message);
  }
};

/**
 * Attach FundsReleased event listener to a specific contract.
 */
const attachListenerToContract = (provider, project) => {
  try {
    const contract = new ethers.Contract(project.contractAddress, blockchainService.escrowVaultAbi, provider);

    contract.on('FundsReleased', async (projectId, amount, contractor, event) => {
      console.log(`EventListener: FundsReleased event for ${projectId}`);

      try {
        // Check for duplicate indexing
        const existingTxn = await Transaction.findOne({
          onChainTxnHash: event.log.transactionHash,
        });

        if (existingTxn) {
          // Update confirmations only
          const receipt = await event.log.getTransactionReceipt();
          existingTxn.confirmations = receipt.confirmations || 0;
          await existingTxn.save();
          return;
        }

        // Create new transaction record from on-chain event
        const txnId = await generateTxnId();
        await Transaction.create({
          txnId,
          projectId: project._id || null,
          projectNameSnapshot: project.projectName || projectId,
          type: 'fund_release',
          amount: Number(amount),
          contractAddress: project.contractAddress,
          onChainTxnHash: event.log.transactionHash,
          blockNumber: event.log.blockNumber,
          recipientWalletAddress: contractor,
          status: 'success',
          notes: 'Indexed from on-chain FundsReleased event',
          chainTimestamp: new Date(),
        });

        // Write audit log
        await AuditLog.create({
          action: 'ON_CHAIN_FUND_RELEASE_INDEXED',
          entityType: 'transaction',
          entityId: txnId,
          newValues: { projectId, amount: Number(amount), contractor },
          reason: 'Blockchain event auto-indexed',
          status: 'success',
        });

        lastProcessedBlock = event.log.blockNumber;
      } catch (indexErr) {
        console.error('EventListener: Failed to index event:', indexErr.message);
      }
    });
  } catch (err) {
    console.error(`EventListener: Failed to attach to ${project.contractAddress}:`, err.message);
  }
};

/**
 * Attach listener for a newly deployed contract.
 */
const addContractListener = (project) => {
  try {
    const provider = getProvider();
    attachListenerToContract(provider, project);
  } catch (err) {
    console.error('EventListener: Failed to add new listener:', err.message);
  }
};

const getLastProcessedBlock = () => lastProcessedBlock;

module.exports = { startEventListeners, addContractListener, getLastProcessedBlock };
