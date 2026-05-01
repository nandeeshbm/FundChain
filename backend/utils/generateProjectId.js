const Project = require('../models/Project');

const generateProjectId = async () => {
  const last = await Project.findOne().sort({ createdAt: -1 }).select('projectId');
  if (!last || !last.projectId) return 'PJT001';

  const num = parseInt(last.projectId.replace('PJT', ''), 10);
  return `PJT${String(num + 1).padStart(3, '0')}`;
};

module.exports = generateProjectId;
