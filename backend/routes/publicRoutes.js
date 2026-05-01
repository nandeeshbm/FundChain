const express = require('express');
const router = express.Router();
const { getPublicProjects, getPublicProjectDetail, getPublicTransactions } = require('../controllers/publicController');

// No auth required — public transparency APIs
router.get('/projects', getPublicProjects);
router.get('/projects/:projectId', getPublicProjectDetail);
router.get('/transactions', getPublicTransactions);

module.exports = router;
