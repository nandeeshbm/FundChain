const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const authorizeRoles = require('../middleware/authorizeRoles');
const { validate, createVendorSchema, updateVendorSchema } = require('../middleware/validateRequest');
const {
  createVendor, getAllVendors, getVendorById,
  updateVendor, suspendVendor, blockVendor,
} = require('../controllers/vendorController');

router.use(authenticateUser, authorizeRoles('admin'));

router.post('/', validate(createVendorSchema), createVendor);
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
// PATCH for partial update (status/whitelist toggle)
router.patch('/:registryId', validate(updateVendorSchema), updateVendor);
// PUT for full update (legacy support)
router.put('/:id', validate(updateVendorSchema), updateVendor);
// Suspend / Block actions
router.put('/:id/suspend', suspendVendor);
router.put('/:id/block', blockVendor);

module.exports = router;
