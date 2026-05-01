const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true, unique: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['Fund Release', 'Utilization'], 
    required: true 
  },
  by: { type: String, required: true }, // e.g., 'Admin', 'Contractor'
  status: { 
    type: String, 
    enum: ['Success', 'Pending', 'Flagged'], 
    default: 'Pending' 
  },
  blockchainTxHash: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
