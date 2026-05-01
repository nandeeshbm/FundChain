const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const apiResponse = require('../utils/apiResponse');
const auditService = require('../services/auditService');

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

module.exports = { register, login, getProfile };
