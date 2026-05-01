/**
 * MetaMask / Ethereum wallet integration service
 * Works without ethers.js — uses raw window.ethereum provider
 */

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

// Check if MetaMask is available
export const isMetaMaskAvailable = () =>
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;

// Request account connection
export const connectWallet = async () => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not installed. Please install it from metamask.io');
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) throw new Error('No accounts found');
  return accounts[0].toLowerCase();
};

// Get currently connected account (without prompting)
export const getConnectedAccount = async () => {
  if (!isMetaMaskAvailable()) return null;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts?.[0]?.toLowerCase() || null;
  } catch { return null; }
};

// Ensure we are on Sepolia
export const ensureSepolia = async () => {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== SEPOLIA_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        // Chain not added — add Sepolia
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: SEPOLIA_CHAIN_ID,
            chainName: 'Ethereum Sepolia Testnet',
            nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      } else { throw switchError; }
    }
  }
};

// Sign a message (proof of identity) — returns signature string
export const signMessage = async (message) => {
  const account = await getConnectedAccount();
  if (!account) throw new Error('No wallet connected');
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, account],
  });
  return signature;
};

// Sign the proof submission data — creates a tamper-proof hash
export const signProofSubmission = async ({ milestoneId, projectId, gpsLatitude, gpsLongitude }) => {
  const account = await getConnectedAccount();
  if (!account) throw new Error('No wallet connected — connect MetaMask first');

  const payload = JSON.stringify({
    milestoneId,
    projectId,
    gpsLatitude,
    gpsLongitude,
    submittedAt: new Date().toISOString(),
    submitter: account,
  });

  const signature = await signMessage(payload);
  return { signature, walletAddress: account, payload };
};

// Listen for account/chain changes
export const onAccountChange = (callback) => {
  if (!isMetaMaskAvailable()) return () => {};
  window.ethereum.on('accountsChanged', (accounts) => callback(accounts[0]?.toLowerCase() || null));
  return () => window.ethereum.removeListener('accountsChanged', callback);
};

export const onChainChange = (callback) => {
  if (!isMetaMaskAvailable()) return () => {};
  window.ethereum.on('chainChanged', callback);
  return () => window.ethereum.removeListener('chainChanged', callback);
};

// Format address for display
export const shortAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

export default {
  isMetaMaskAvailable,
  connectWallet,
  getConnectedAccount,
  ensureSepolia,
  signMessage,
  signProofSubmission,
  onAccountChange,
  onChainChange,
  shortAddress,
};
