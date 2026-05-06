<p align="center">
  <img src="docs/images/banner.png" alt="Public Fund Tracker Banner" width="100%" />
</p>

<p align="center">
  <strong>🔗 Blockchain-Powered Public Fund Transparency Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Solidity-0.8-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ethereum" />
  <img src="https://img.shields.io/badge/MetaMask-Integrated-E2761B?style=for-the-badge&logo=metamask&logoColor=white" alt="MetaMask" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-fund-flow">Fund Flow</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-smart-contracts">Smart Contracts</a> •
  <a href="#-role-based-access">Roles</a>
</p>

Public Fund Tracker is a full-stack system for managing government project funds with blockchain escrow, AI-assisted anomaly checks, and role-based workflows for admins, auditors, and contractors.

## Features
- On-chain escrow vault for budget locking and milestone releases (Hardhat + Solidity).
- Role-based workflows for admins, auditors, contractors, and public viewers.
- Sentinel checks for GPS geofence, IRN verification, missing proofs, duplicate submissions, and velocity checks.
- Audit logs for every critical action (who, what, when, IP address).
- Public transparency endpoints for projects and transactions.

## Architecture
- backend/ (Node.js, Express, MongoDB)
  - REST API, JWT auth, role-based access, anomaly detection, audit logs
- blockchain/ (Hardhat + Solidity)
  - EscrowVault and VendorRegistry contracts, deploy and test scripts
- frontend/ (React)
  - Contractor proof submission, admin/auditor dashboards, public views

## Prerequisites
- Node.js 18+ (recommended)
- MongoDB (local or Atlas)
- npm
- MetaMask (for blockchain signing in the UI)

## Quick Start

### 1) Backend
```
cd backend
npm install
copy .env.example .env
# edit .env with your values
npm run dev
```

Optional seed users:
```
node seed.js
```

### 2) Frontend
```
cd frontend
npm install
npm start
```

### 3) Blockchain
```
cd blockchain
npm install
npm run compile
npm run test
npm run deploy
```

Note: Hardhat loads environment variables from backend/.env (see blockchain/hardhat.config.js).

## Configuration (backend/.env)
The backend uses environment variables defined in backend/config/env.js. Start from backend/.env.example, then add the following as needed:

Core:
- PORT
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN

Blockchain:
- SEPOLIA_RPC_URL
- DEPLOYER_PRIVATE_KEY
- CHAIN_ID
- EXPLORER_BASE_URL
- VENDOR_REGISTRY_ADDRESS
- ESCROW_VAULT_MASTER_ADDRESS

IRN Verification:
- IRN_API_ENABLED (true|false)
- IRN_API_BASE_URL
- IRN_VERIFY_PATH
- IRN_API_KEY
- IRN_API_AUTH_HEADER

IPFS (optional):
- PINATA_JWT

## API Endpoints (Backend)
Base URL: http://localhost:5000
- GET /                Health check
- /api/auth            Auth routes
- /api/admin           Admin routes
- /api/admin/vendors   Vendor management
- /api/auditor          Auditor routes
- /api/contractor       Contractor routes
- /api/transactions     Transactions
- /api/public           Public, no-auth endpoints

## Sentinel (Anomaly Detection)
The backend runs automated checks when a contractor submits proof. This includes:
- GPS geofence validation
- IRN verification via the configured Govt/provider API
- Missing proof checks
- Duplicate submission checks
- Velocity checks

See backend/services/anomalyDetector.js and backend/services/irnVerificationService.js for details.

## Smart Contracts
- EscrowVault.sol: locks project budgets and releases milestone funds on approval
- VendorRegistry.sol: maintains vendor verification

Deploy from blockchain/scripts/deploy.js.

## Testing
- Smart contracts: npm run test (in blockchain/)
- Backend: use Postman or curl against the REST API
- Frontend: npm test (in frontend/)

## Project Structure
```
public-fund-tracker/
  backend/
  blockchain/
  frontend/
```

## Notes
- IRN validation is mandatory for fund release. If the IRN API is disabled or fails, submissions are flagged by the Sentinel.
- Event listeners are started on backend boot; failures are logged but do not stop the API.
