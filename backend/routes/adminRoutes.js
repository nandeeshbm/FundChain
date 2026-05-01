const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const { validate, createProjectSchema } = require('../middleware/validateRequest');
const {
  createProject,
  getAllProjects,
  getProjectById,
  getDashboardStats,
} = require('../controllers/adminProjectController');
const {
  getFundSummary,
  getProjectMilestones,
  getMilestoneProof,
  releaseFunds,
} = require('../controllers/fundReleaseController');

// All admin routes require auth + admin role
router.use(authenticateUser, authorizeRoles('admin'));

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Projects
router.post('/projects', validate(createProjectSchema), createProject);
router.get('/projects', getAllProjects);
router.get('/projects/:projectId', getProjectById);

// Fund Release
router.get('/projects/:projectId/fund-summary', getFundSummary);
router.get('/projects/:projectId/milestones', getProjectMilestones);
router.get('/milestones/:milestoneId/proof', getMilestoneProof);
router.post('/milestones/:milestoneId/release', releaseFunds);

module.exports = router;
