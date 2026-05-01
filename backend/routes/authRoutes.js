const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const authenticateUser = require('../middleware/authenticateUser');
const { validate, registerSchema, loginSchema } = require('../middleware/validateRequest');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', authenticateUser, getProfile);

module.exports = router;
