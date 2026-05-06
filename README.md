# 🔗 Public Fund Tracker

> **Blockchain-Powered Public Fund Transparency Platform**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://solidity.readthedocs.io/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://sepolia.etherscan.io/)
[![MetaMask](https://img.shields.io/badge/MetaMask-Integrated-E2761B?style=for-the-badge&logo=metamask&logoColor=white)](https://metamask.io/)

---

## 📖 Quick Navigation

- [✨ Features](#-features)
- [🏗️ Architecture](#-architecture)
- [💰 Fund Flow](#-fund-flow)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📝 Smart Contracts](#-smart-contracts)
- [👥 Role-Based Access](#-role-based-access)

---

**Public Fund Tracker** is a full-stack system for managing government project funds with blockchain escrow, AI-assisted anomaly checks, and role-based workflows for admins, auditors, and contractors.

---

## ✨ Features

- **🔐 On-Chain Escrow Vault**
  - Budget locking and milestone-based fund releases
  - Automated smart contract execution
  - Immutable transaction records

- **🛡️ Sentinel Anomaly Detection**
  - GPS geofence validation for proof locations
  - IRN (Unique Identification) verification
  - Duplicate submission detection
  - Missing proof identification
  - Velocity checks for suspicious patterns

- **👥 Multi-Role Workflows**
  - **Admin**: Project creation, fund allocation, vendor management
  - **Auditor**: Forensic reviews, claim auditing, freeze/resolution capabilities
  - **Contractor**: Proof submission, milestone tracking, vendor registry
  - **Public**: Transparent project and transaction visibility

- **📋 Comprehensive Audit Logging**
  - Track every critical action (who, what, when)
  - IP address tracking for security
  - Forensic report generation (PDF)
  - Report archival system

- **🌐 Public Transparency APIs**
  - Project discovery endpoints
  - Transaction history visibility
  - No authentication required for public data

- **🔑 Secure Authentication**
  - JWT-based session management
  - OTP-based password reset
  - Role-based access control
  - MetaMask wallet integration

---

## 🏗️ Architecture

### Project Structure
```
public-fund-tracker/
├── backend/
│   ├── controllers/      # Business logic handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/        # Auth, validation, error handling
│   ├── services/         # Core services (blockchain, audit, anomaly detection)
│   ├── utils/            # Helper functions and ID generation
│   ├── config/           # Database and environment config
│   └── app.js            # Express app setup
│
├── blockchain/
│   ├── contracts/        # Solidity smart contracts
│   ├── scripts/          # Deployment and seed scripts
│   ├── test/             # Contract tests
│   ├── artifacts/        # Compiled ABI and bytecode
│   └── hardhat.config.js # Hardhat configuration
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable React components
    │   ├── pages/        # Role-based page layouts
    │   ├── services/     # API client services
    │   ├── context/      # Web3 and app state
    │   ├── hooks/        # Custom React hooks
    │   └── App.js        # Main app component
    └── public/           # Static assets
```

### Technology Stack by Layer

**Backend (Node.js/Express)**
- REST API with role-based route protection
- MongoDB/Mongoose for data persistence
- JWT authentication
- Multer for file uploads
- PDFKit for forensic report generation

**Blockchain (Solidity/Hardhat)**
- EscrowVault contract for fund management
- VendorRegistry contract for verification
- Sepolia testnet deployment
- Automated testing suite

**Frontend (React)**
- Role-specific dashboards (Admin, Auditor, Contractor, Public)
- MetaMask wallet integration
- Real-time API data fetching
- Responsive UI components

---

## 💰 Fund Flow

### Typical Workflow

1. **Project Creation** (Admin)
   - Admin creates project with budget allocation
   - Funds locked in escrow smart contract

2. **Vendor Registration** (Contractor/Admin)
   - Contractors register as vendors
   - IRN verification initiated
   - GPS geofence boundaries set

3. **Proof Submission** (Contractor)
   - Contractor uploads proof for milestone
   - Sentinel runs anomaly checks:
     - GPS validation
     - IRN verification
     - Duplicate detection
     - Proof completeness check

4. **Auditor Review** (Auditor)
   - Auditor reviews proof and sentinel flags
   - Can freeze transaction for investigation
   - Generates forensic report if needed
   - Approves or rejects claim

5. **Fund Release** (Admin/Smart Contract)
   - Approved claim triggers escrow release
   - Funds transferred to contractor
   - Transaction recorded on blockchain
   - Audit log entry created

6. **Public Visibility**
   - Public users can view approved transactions
   - Project status and fund allocation visible
   - Transparent audit trail available

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **Axios** - HTTP client
- **Web3.js** - Blockchain interaction
- **MetaMask** - Wallet integration
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **MongoDB 7.0** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **PDFKit** - Report generation
- **Nodemon** - Development server

### Blockchain
- **Solidity 0.8** - Smart contract language
- **Hardhat** - Development environment
- **Ethereum Sepolia** - Test network
- **OpenZeppelin** - Contract standards
- **Ethers.js** - Web3 library

### APIs & Services
- **IRN Verification** - Government ID verification
- **IPFS/Pinata** - Decentralized storage (optional)
- **Geolocation** - GPS-based validation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (recommended)
- **MongoDB 7.0+** (local or Atlas cloud)
- **npm** or yarn
- **MetaMask** browser extension
- **Git**

### Installation & Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Ashlesh25-art/FundChain.git
cd public-fund-tracker
```

#### 2️⃣ Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - PORT (default: 5000)
# - MONGO_URI (MongoDB connection string)
# - JWT_SECRET (any random string)
# - SEPOLIA_RPC_URL (Alchemy or Infura RPC)
# - DEPLOYER_PRIVATE_KEY (test account private key)

# Run migrations/seeding (optional)
node seed.js

# Start development server
npm run dev
```

#### 3️⃣ Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server (typically port 3000)
npm start

# Build for production
npm run build
```

#### 4️⃣ Blockchain Setup
```bash
cd blockchain

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to Sepolia
npm run deploy
```

### Environment Variables (.env)

**Core Configuration**
```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/fundtracker
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Blockchain Configuration**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere
CHAIN_ID=11155111
EXPLORER_BASE_URL=https://sepolia.etherscan.io
VENDOR_REGISTRY_ADDRESS=0x...
ESCROW_VAULT_MASTER_ADDRESS=0x...
```

**IRN Verification API**
```
IRN_API_ENABLED=true
IRN_API_BASE_URL=https://api.example.com
IRN_VERIFY_PATH=/verify
IRN_API_KEY=your_api_key
IRN_API_AUTH_HEADER=Authorization
```

**IPFS (Optional)**
```
PINATA_JWT=your_pinata_jwt_token
```

---

## 📝 Smart Contracts

### EscrowVault.sol
Manages project budget locking and milestone-based fund releases.

**Key Functions:**
- `lockFunds()` - Lock project budget
- `releaseFunds()` - Release approved milestone funds
- `freezeTransaction()` - Audit freeze for investigation
- `resolveFreeze()` - Resolve frozen transaction
- `viewBalance()` - Check escrow balance

**Events:**
- `FundsLocked` - Budget locked
- `FundsReleased` - Milestone funds released
- `TransactionFrozen` - Auditor froze transaction
- `FreezeResolved` - Frozen transaction resolved

### VendorRegistry.sol
Maintains vendor verification and registration state.

**Key Functions:**
- `registerVendor()` - Register new vendor
- `verifyVendor()` - Mark vendor as verified
- `revokeVendor()` - Remove vendor access
- `isVendorActive()` - Check vendor status

**Events:**
- `VendorRegistered` - New vendor added
- `VendorVerified` - Vendor verified
- `VendorRevoked` - Vendor access removed

### Deployment
Contracts are automatically deployed to Sepolia testnet during setup:

```bash
cd blockchain
npm run deploy
# ABI exported to backend/config/blockchain/
```

### Testing
```bash
npm run test
# Runs Hardhat test suite
```

---

## 👥 Role-Based Access

### 🧑‍💼 **Admin**
**Permissions:**
- Create and manage projects
- Allocate project budgets
- Register vendors
- View all transactions and audit logs
- Approve fund releases
- Generate forensic reports

**Routes:** `/api/admin`

**Key Actions:**
- Project CRUD operations
- Vendor management
- Fund allocation
- Access all audit data
- Approve/reject claims

---

### 🔍 **Auditor**
**Permissions:**
- Review contractor claims
- Analyze sentinel anomaly detection flags
- Freeze transactions for investigation
- Generate forensic reports
- Create audit notes
- View detailed transaction history

**Routes:** `/api/auditor`

**Key Actions:**
- Claim review and approval/rejection
- Transaction freeze/resolution
- Forensic report generation
- Report archival
- Audit log review

---

### 👷 **Contractor**
**Permissions:**
- Submit proofs for milestones
- Register as vendor
- View personal submissions
- Track payment status
- Upload supporting documents

**Routes:** `/api/contractor`

**Key Actions:**
- Proof submission
- Vendor registration
- IRN verification
- Document upload
- Submission tracking

---

### 👥 **Public (No Authentication)**
**Permissions:**
- View approved projects
- See transaction history
- Access fund allocation data
- View public fund reports
- Search projects by status/location

**Routes:** `/api/public`

**Key Actions:**
- Project search and filtering
- Transaction visibility
- Fund flow tracking
- Location-based queries
- Report access

---

## 📊 API Endpoints Overview

### Health Check
- `GET /` - Server status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/request-otp` - OTP password reset request
- `POST /api/auth/reset-password` - Reset password with OTP

### Admin
- `GET/POST /api/admin/projects` - Manage projects
- `GET/POST /api/admin/vendors` - Vendor management
- `GET /api/admin/transactions` - View all transactions
- `GET /api/admin/audit-logs` - Access audit logs

### Auditor
- `GET /api/auditor/claims` - View pending claims
- `POST /api/auditor/review-claim` - Submit claim review
- `POST /api/auditor/freeze-transaction` - Freeze for investigation
- `POST /api/auditor/resolve-freeze` - Resolve frozen transaction
- `GET /api/auditor/reports` - View forensic reports

### Contractor
- `POST /api/contractor/submit-proof` - Upload milestone proof
- `GET /api/contractor/submissions` - View personal submissions
- `POST /api/contractor/register-vendor` - Register as vendor

### Transactions
- `GET /api/transactions` - Transaction history

### Public (No Auth)
- `GET /api/public/projects` - Discover projects
- `GET /api/public/transactions` - View approved transactions
- `GET /api/public/search` - Search functionality

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based Access Control** - Fine-grained permissions
✅ **Audit Logging** - Track all critical actions
✅ **IP Tracking** - Monitor access patterns
✅ **Geofence Validation** - Location-based proof verification
✅ **IRN Verification** - Government ID verification
✅ **Duplicate Detection** - Prevent fraudulent submissions
✅ **Smart Contract Audits** - On-chain fund management
✅ **OTP Reset Flow** - Secure password recovery
✅ **MetaMask Integration** - Wallet-based signing

---

## 📈 Sentinel Anomaly Detection

The **Sentinel Service** automatically analyzes proof submissions for:

1. **GPS Geofence Validation**
   - Verifies proof location matches project geofence
   - Flags out-of-area submissions

2. **IRN Verification**
   - Cross-references submitted IRN with government database
   - Validates vendor identity

3. **Duplicate Detection**
   - Identifies duplicate submissions from same vendor
   - Prevents payment redundancy

4. **Missing Proof Checks**
   - Ensures all required documents are included
   - Flags incomplete submissions

5. **Velocity Checks**
   - Detects unusual submission patterns
   - Identifies suspicious claim frequencies

---

## 🧪 Testing

### Backend API Testing
```bash
# Using Postman or cURL
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}'
```

### Smart Contract Testing
```bash
cd blockchain
npm run test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 📚 Project Documentation

Key files to review:

- **Backend Config**: `backend/config/env.js` - Environment setup
- **Anomaly Detection**: `backend/services/anomalyDetector.js` - Sentinel logic
- **Smart Contracts**: `blockchain/contracts/` - EscrowVault & VendorRegistry
- **Frontend Pages**: `frontend/src/pages/` - Role-based dashboards
- **Audit Service**: `backend/services/auditService.js` - Logging system

---

## 🐛 Troubleshooting

**MongoDB Connection Issues**
- Verify MONGO_URI in .env
- Check MongoDB service is running
- Ensure network access is allowed

**MetaMask Connection Failed**
- Refresh page and reconnect wallet
- Verify Sepolia network is selected
- Check browser console for errors

**Smart Contract Deployment Failed**
- Verify DEPLOYER_PRIVATE_KEY has testnet ETH
- Check SEPOLIA_RPC_URL is valid
- Review hardhat.config.js network settings

**OTP Not Received**
- Verify email service is configured
- Check spam folder
- Verify user email is correct

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📧 Support & Contact

For issues, questions, or contributions:
- Open an issue on GitHub
- Review documentation in docs/
- Check existing discussions

---

**Built with ❤️ for transparent public fund management**
