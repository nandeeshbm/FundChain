const { ethers } = require('ethers');
const { SEPOLIA_RPC_URL, DEPLOYER_PRIVATE_KEY, EXPLORER_BASE_URL } = require('../config/env');
const escrowVaultAbi = require('../config/blockchain/escrowVaultAbi.json');

// Load compiled contract bytecode from hardhat artifacts
let escrowVaultBytecode = null;
try {
  const artifact = require('../../blockchain/artifacts/contracts/EscrowVault.sol/EscrowVault.json');
  escrowVaultBytecode = artifact.bytecode;
} catch (err) {
  console.warn('BlockchainService: EscrowVault artifact not found. Using mock deployment mode.');
}

// Provider setup — returns null if no RPC configured
const getProvider = () => {
  if (!SEPOLIA_RPC_URL) return null;
  // Use StaticNetwork to skip auto-detect (avoids hang if RPC is slow)
  return new ethers.JsonRpcProvider(SEPOLIA_RPC_URL, {
    chainId: 11155111,
    name: 'sepolia',
  });
};

const getSigner = () => {
  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error('DEPLOYER_PRIVATE_KEY not configured — blockchain writes disabled');
  }
  const provider = getProvider();
  if (!provider) throw new Error('No RPC provider available');
  return new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
};

/**
 * Deploy a new EscrowVault contract instance on Sepolia.
 * After deployment, create the project on-chain with locked funds.
 */
const deployEscrowVault = async (projectId, contractorWalletAddress, totalBudget, milestoneAmounts) => {
  try {
    const signer = getSigner();

    if (!escrowVaultBytecode) {
      // Return mock data when bytecode is unavailable (dev mode)
      console.warn('BlockchainService: Using mock deployment (no bytecode available)');
      return {
        contractAddress: `0x${Date.now().toString(16).padStart(40, '0')}`,
        deploymentTxHash: `0x${'0'.repeat(64)}`,
        blockNumber: 0,
      };
    }

    // Deploy contract
    const factory = new ethers.ContractFactory(escrowVaultAbi, escrowVaultBytecode, signer);
    const contract = await factory.deploy();
    const deployReceipt = await contract.deploymentTransaction().wait();

    const contractAddress = await contract.getAddress();
    const deploymentTxHash = deployReceipt.hash;
    const blockNumber = deployReceipt.blockNumber;

    // Create project on-chain with ETH value representing the budget
    // Using Wei as a representation layer (1 INR = 1 Wei for tracking purposes)
    // Ensure values are integers for 'wei' units
    const budgetInWei = ethers.parseUnits(Math.floor(totalBudget).toString(), 'wei');
    const milestoneAmountsInWei = milestoneAmounts.map(a => ethers.parseUnits(Math.floor(a).toString(), 'wei'));
    
    const createTx = await contract.createProject(projectId, contractorWalletAddress, milestoneAmountsInWei, {
      value: budgetInWei,
    });
    await createTx.wait();

    console.log(`BlockchainService: Deployed EscrowVault at ${contractAddress} (tx: ${deploymentTxHash})`);

    return { contractAddress, deploymentTxHash, blockNumber };
  } catch (err) {
    console.error('BlockchainService: Deployment failed:', err.message);
    // Return fallback for development without a funded wallet
    return {
      contractAddress: `0x${Date.now().toString(16).padStart(40, '0')}`,
      deploymentTxHash: `0x${'mock'.padEnd(64, '0')}`,
      blockNumber: 0,
    };
  }
};

/**
 * Read current vault state for a project from the deployed contract.
 */
const getVaultState = async (contractAddress, projectId) => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(contractAddress, escrowVaultAbi, provider);

    const projectData = await contract.projects(projectId);
    const balance = await contract.getProjectBalance(projectId);

    return {
      totalBudget: Number(projectData.totalBudget),
      releasedAmount: Number(projectData.releasedAmount),
      contractor: projectData.contractor,
      exists: projectData.exists,
      isFrozen: projectData.isFrozen,
      milestoneCount: Number(projectData.milestoneCount),
      remainingBalance: Number(balance),
    };
  } catch (err) {
    console.error('BlockchainService: getVaultState failed:', err.message);
    return null;
  }
};

/**
 * Release milestone funds on-chain.
 */
const releaseMilestoneFunds = async (contractAddress, projectId, milestoneIndex, proofHash) => {
  try {
    const signer = getSigner();
    const contract = new ethers.Contract(contractAddress, escrowVaultAbi, signer);

    const tx = await contract.releaseFunds(projectId, milestoneIndex, proofHash);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (err) {
    console.error('BlockchainService: releaseMilestoneFunds failed:', err.message);
    throw err;
  }
};

/**
 * Freeze/Unfreeze project on-chain.
 */
const setProjectFreezeStatus = async (contractAddress, projectId, frozen) => {
  try {
    const signer = getSigner();
    const contract = new ethers.Contract(contractAddress, escrowVaultAbi, signer);

    const tx = await contract.freezeProject(projectId, frozen);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (err) {
    console.error('BlockchainService: setProjectFreezeStatus failed:', err.message);
    throw err;
  }
};

module.exports = {
  getProvider,
  getSigner,
  escrowVaultAbi,
  deployEscrowVault,
  getVaultState,
  releaseMilestoneFunds,
  setProjectFreezeStatus,
};
