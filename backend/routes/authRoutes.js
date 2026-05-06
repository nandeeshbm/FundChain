const express = require('express');
const router = express.Router();
const { register, login, getProfile, requestPasswordOtp, resetPasswordWithOtp } = require('../controllers/authController');
const authenticateUser = require('../middleware/authenticateUser');
const { validate, registerSchema, loginSchema, requestOtpSchema, resetPasswordSchema } = require('../middleware/validateRequest');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/request-otp', validate(requestOtpSchema), requestPasswordOtp);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordWithOtp);
router.get('/profile', authenticateUser, getProfile);

module.exports = router;
