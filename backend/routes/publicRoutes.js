const express = require('express');
const router = express.Router();
const { 
  getPublicProjects, 
  getPublicProjectDetail, 
  getPublicTransactions,
  getPublicMilestoneProof 
} = require('../controllers/publicController');
const { validate, createIssueReportSchema } = require('../middleware/validateRequest');
const { createIssueReport } = require('../controllers/reportController');

// No auth required — public transparency APIs
router.get('/projects', getPublicProjects);
router.get('/projects/:projectId', getPublicProjectDetail);
router.get('/transactions', getPublicTransactions);
router.get('/milestones/:milestoneId/proof', getPublicMilestoneProof);
router.post('/report-issues', validate(createIssueReportSchema), createIssueReport);

module.exports = router;
