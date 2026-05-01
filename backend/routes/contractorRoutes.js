const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const { validate, submitProofSchema } = require('../middleware/validateRequest');
const { submitProof } = require('../controllers/contractorController');

router.use(authenticateUser, authorizeRoles('contractor'));

router.post('/milestones/:milestoneId/submit-proof', validate(submitProofSchema), submitProof);

module.exports = router;
