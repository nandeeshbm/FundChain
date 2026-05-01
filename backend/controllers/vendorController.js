const Vendor = require('../models/Vendor');
const apiResponse = require('../utils/apiResponse');
const auditService = require('../services/auditService');

// POST /api/admin/vendors — Create new vendor
const createVendor = async (req, res, next) => {
  try {
    const { vendorName, companyName, walletAddress, email, phone, departmentTags, taxId, notes } = req.body;

    // Check duplicate email (walletAddress optional)
    const orConditions = [{ email }];
    if (walletAddress) orConditions.push({ walletAddress });
    const existing = await Vendor.findOne({ $or: orConditions });
    if (existing) {
      return apiResponse.error(res, 'Vendor with this email or wallet address already exists', [], 409);
    }

    const vendor = new Vendor({
      vendorName,
      companyName,
      walletAddress,
      email,
      phone,
      departmentTags: departmentTags || [],
      taxId: taxId || '',
      notes: notes || '',
      createdBy: req.user._id,
      isWhitelisted: true,
      status: 'Active',
    });
    await vendor.save();

    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'VENDOR_CREATED',
      entityType: 'vendor',
      entityId: vendor.registryId,
      newValues: { vendorName, companyName, walletAddress, email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Vendor onboarded successfully', { vendor }, 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/vendors — List all vendors
const getAllVendors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { vendorName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { registryId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Vendor.countDocuments(query),
    ]);

    return apiResponse.paginated(res, 'Vendors retrieved', vendors, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/vendors/:id — Get vendor details
const getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!vendor) {
      return apiResponse.error(res, 'Vendor not found', [], 404);
    }

    return apiResponse.success(res, 'Vendor retrieved', { vendor });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/vendors/:id — Update vendor
const updateVendor = async (req, res, next) => {
  try {
    const isObjectId = require('mongoose').Types.ObjectId.isValid(req.params.registryId);
    const vendor = isObjectId
      ? await Vendor.findById(req.params.registryId)
      : await Vendor.findOne({ registryId: req.params.registryId });

    if (!vendor) {
      return apiResponse.error(res, 'Vendor not found', [], 404);
    }

    const oldValues = vendor.toObject();

    const allowedFields = [
      'vendorName', 'companyName', 'email', 'phone',
      'departmentTags', 'taxId', 'notes', 'status', 'isWhitelisted',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        vendor[field] = req.body[field];
      }
    });

    await vendor.save();

    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'VENDOR_UPDATED',
      entityType: 'vendor',
      entityId: vendor.registryId,
      oldValues: { status: oldValues.status, isWhitelisted: oldValues.isWhitelisted },
      newValues: { status: vendor.status, isWhitelisted: vendor.isWhitelisted },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Vendor updated successfully', { vendor });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/vendors/:id/suspend — Suspend vendor
const suspendVendor = async (req, res, next) => {
  try {
    const isObjectId = require('mongoose').Types.ObjectId.isValid(req.params.id);
    const vendor = isObjectId
      ? await Vendor.findById(req.params.id)
      : await Vendor.findOne({ registryId: req.params.id });
    if (!vendor) return apiResponse.error(res, 'Vendor not found', [], 404);

    const oldStatus = vendor.status;
    vendor.status = 'Suspended';
    vendor.isWhitelisted = false;
    await vendor.save();

    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'VENDOR_SUSPENDED',
      entityType: 'vendor',
      entityId: vendor.registryId,
      oldValues: { status: oldStatus },
      newValues: { status: 'Suspended' },
      reason: req.body.reason || 'Admin action',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Vendor suspended', { vendor });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/vendors/:id/block — Block vendor
const blockVendor = async (req, res, next) => {
  try {
    const isObjectId = require('mongoose').Types.ObjectId.isValid(req.params.id);
    const vendor = isObjectId
      ? await Vendor.findById(req.params.id)
      : await Vendor.findOne({ registryId: req.params.id });
    if (!vendor) return apiResponse.error(res, 'Vendor not found', [], 404);

    const oldStatus = vendor.status;
    vendor.status = 'Blocked';
    vendor.isWhitelisted = false;
    await vendor.save();

    await auditService.logAction({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'VENDOR_BLOCKED',
      entityType: 'vendor',
      entityId: vendor.registryId,
      oldValues: { status: oldStatus },
      newValues: { status: 'Blocked' },
      reason: req.body.reason || 'Admin action',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Vendor blocked', { vendor });
  } catch (err) {
    next(err);
  }
};

module.exports = { createVendor, getAllVendors, getVendorById, updateVendor, suspendVendor, blockVendor };
