require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/public-fund-tracker',
  JWT_SECRET: process.env.JWT_SECRET || 'pfts_jwt_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Blockchain
  SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
  DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY || '',
  CHAIN_ID: parseInt(process.env.CHAIN_ID || '11155111', 10),
  EXPLORER_BASE_URL: process.env.EXPLORER_BASE_URL || 'https://sepolia.etherscan.io',
  VENDOR_REGISTRY_ADDRESS: process.env.VENDOR_REGISTRY_ADDRESS,
  ESCROW_VAULT_MASTER_ADDRESS: process.env.ESCROW_VAULT_MASTER_ADDRESS,

  // IRN verification API (Govt/Provider integration)
  IRN_API_ENABLED: String(process.env.IRN_API_ENABLED || 'false').toLowerCase() === 'true',
  IRN_API_BASE_URL: process.env.IRN_API_BASE_URL || '',
  IRN_VERIFY_PATH: process.env.IRN_VERIFY_PATH || '/verify-irn',
  IRN_API_KEY: process.env.IRN_API_KEY || '',
  IRN_API_AUTH_HEADER: process.env.IRN_API_AUTH_HEADER || 'x-api-key',

  // IPFS upload (Pinata JWT)
  PINATA_JWT: process.env.PINATA_JWT || '',

  // Event listener
  LAST_PROCESSED_BLOCK_KEY: 'lastProcessedBlock',
};
