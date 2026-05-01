const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  department: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  releasedAmount: { type: Number, default: 0 },
  utilisedAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'], 
    default: 'Planning' 
  },
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
