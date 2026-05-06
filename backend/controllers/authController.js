const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const apiResponse = require('../utils/apiResponse');
const auditService = require('../services/auditService');

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, walletAddress, contractorRegistryId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return apiResponse.error(res, 'Email already registered', [], 409);
    }

    const user = new User({
      name,
      email,
      passwordHash: password, // pre-save hook will hash it
      role,
      walletAddress: walletAddress || null,
      contractorRegistryId: contractorRegistryId || null,
      isActive: true,
    });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await auditService.logAction({
      userId: user._id,
      userRole: user.role,
      action: 'USER_REGISTERED',
      entityType: 'auth',
      entityId: user._id.toString(),
      newValues: { name, email, role },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Registration successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    }, 201);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return apiResponse.error(res, 'Invalid credentials', [], 401);
    }

    if (!user.isActive) {
      return apiResponse.error(res, 'Account deactivated', [], 403);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return apiResponse.error(res, 'Invalid credentials', [], 401);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await auditService.logAction({
      userId: user._id,
      userRole: user.role,
      action: 'USER_LOGIN',
      entityType: 'auth',
      entityId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    return apiResponse.success(res, 'Profile retrieved', { user: req.user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/request-otp
const requestPasswordOtp = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      return apiResponse.error(res, 'User not found for OTP reset', [], 404);
    }
    if (!user.isActive) {
      return apiResponse.error(res, 'Account deactivated', [], 403);
    }

    const otp = generateOtp();
    user.resetOtpHash = hashOtp(otp);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`[OTP] ${email} (${role}) => ${otp}`);

    await auditService.logAction({
      userId: user._id,
      userRole: user.role,
      action: 'PASSWORD_RESET_OTP_REQUESTED',
      entityType: 'auth',
      entityId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'OTP generated. Check server console for the code.', {
      expiresInMinutes: 10,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, role, otp, newPassword } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      return apiResponse.error(res, 'User not found for password reset', [], 404);
    }
    if (!user.isActive) {
      return apiResponse.error(res, 'Account deactivated', [], 403);
    }

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
      return apiResponse.error(res, 'OTP not requested or expired', [], 400);
    }
    if (new Date(user.resetOtpExpiresAt).getTime() < Date.now()) {
      return apiResponse.error(res, 'OTP expired. Request a new one.', [], 400);
    }
    if (hashOtp(otp) !== user.resetOtpHash) {
      return apiResponse.error(res, 'Invalid OTP', [], 400);
    }

    user.passwordHash = newPassword;
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    await user.save();

    await auditService.logAction({
      userId: user._id,
      userRole: user.role,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'auth',
      entityId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Password reset successfully', { email: user.email });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, requestPasswordOtp, resetPasswordWithOtp };
