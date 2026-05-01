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

// Admin-write routes require admin role
router.use(['/dashboard-stats', '/projects', '/vendors', '/milestones'], authenticateUser);

// Dashboard (admin only)
router.get('/dashboard-stats', authorizeRoles('admin'), getDashboardStats);

// Projects — admin writes, all authenticated roles can read
router.post('/projects', authorizeRoles('admin'), validate(createProjectSchema), createProject);
router.get('/projects', authorizeRoles('admin', 'auditor', 'contractor'), getAllProjects);
router.get('/projects/:projectId', authorizeRoles('admin', 'auditor', 'contractor'), getProjectById);

// Fund Release (admin + auditor can view, only admin can release)
router.get('/projects/:projectId/fund-summary', authenticateUser, authorizeRoles('admin', 'auditor'), getFundSummary);
router.get('/projects/:projectId/milestones', authenticateUser, authorizeRoles('admin', 'auditor', 'contractor'), getProjectMilestones);
router.get('/milestones/:milestoneId/proof', authenticateUser, authorizeRoles('admin', 'auditor'), getMilestoneProof);
router.post('/milestones/:milestoneId/release', authenticateUser, authorizeRoles('admin'), releaseFunds);

// Vendor routes (admin only write, auditor can read)
const {
  createVendor,
  getAllVendors,
  updateVendor,
} = require('../controllers/vendorController');
router.post('/vendors', authenticateUser, authorizeRoles('admin'), validate(require('../middleware/validateRequest').createVendorSchema), createVendor);
router.get('/vendors', authenticateUser, authorizeRoles('admin', 'auditor', 'contractor'), getAllVendors);
router.patch('/vendors/:registryId', authenticateUser, authorizeRoles('admin'), validate(require('../middleware/validateRequest').updateVendorSchema), updateVendor);

module.exports = router;
