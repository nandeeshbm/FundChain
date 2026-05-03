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
const { getIssueReports } = require('../controllers/reportController');

// Admin-write routes require admin role
router.use(['/dashboard-stats', '/projects', '/vendors', '/milestones', '/report-issues'], authenticateUser);

// Dashboard (admin only)
router.get('/dashboard-stats', authorizeRoles('admin'), getDashboardStats);

// Projects — admin writes, all authenticated roles can read
router.post('/projects', authorizeRoles('admin'), validate(createProjectSchema), createProject);
router.get('/projects', authorizeRoles('admin', 'auditor', 'contractor'), getAllProjects);
router.get('/projects/:projectId', authorizeRoles('admin', 'auditor', 'contractor'), getProjectById);

// Fund Release (admin + auditor can view, only admin can release)
router.get('/projects/:projectId/fund-summary', authorizeRoles('admin', 'auditor'), getFundSummary);
router.get('/projects/:projectId/milestones', authorizeRoles('admin', 'auditor', 'contractor'), getProjectMilestones);
router.get('/milestones/:milestoneId/proof', authorizeRoles('admin', 'auditor'), getMilestoneProof);
router.post('/milestones/:milestoneId/release', authorizeRoles('admin'), releaseFunds);

// Vendor routes (admin only write, auditor can read)
const {
  createVendor,
  getAllVendors,
  updateVendor,
} = require('../controllers/vendorController');
router.post('/vendors', authorizeRoles('admin'), validate(require('../middleware/validateRequest').createVendorSchema), createVendor);
router.get('/vendors', authorizeRoles('admin', 'auditor', 'contractor'), getAllVendors);
router.patch('/vendors/:registryId', authorizeRoles('admin'), validate(require('../middleware/validateRequest').updateVendorSchema), updateVendor);

// Issue report review for authorized staff
router.get('/report-issues', authorizeRoles('admin', 'auditor'), getIssueReports);

module.exports = router;
