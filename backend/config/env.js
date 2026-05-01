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

  // Event listener
  LAST_PROCESSED_BLOCK_KEY: 'lastProcessedBlock',
};
