const apiResponse = require('../utils/apiResponse');

/**
 * Mock Government API Controller
 * Simulates external government services like IRN verification.
 */

// POST /api/govt/verify-irn
const verifyIRN = async (req, res, next) => {
  try {
    const { irn } = req.body;

    if (!irn) {
      return res.status(400).json({
        success: false,
        message: 'IRN is required',
      });
    }

    // Simulate 64-char IRN validation
    if (irn.length !== 64) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IRN format. Must be 64 characters.',
      });
    }

    // Mock logic: 
    // - IRNs ending in '00' are considered INVALID
    // - IRNs starting with 'ERR' are considered ERROR
    // - All others are VALID
    
    if (irn.endsWith('00')) {
      return res.status(200).json({
        success: true,
        isValid: false,
        status: 'invalid',
        message: 'IRN has been canceled or is invalid in government records',
      });
    }

    if (irn.startsWith('ERR')) {
      return res.status(500).json({
        success: false,
        message: 'Internal Government Database Error',
      });
    }

    return res.status(200).json({
      success: true,
      isValid: true,
      status: 'verified',
      data: {
        irn,
        generatedAt: new Date().toISOString(),
        issuer: 'GSTN-MOCK-GOVT',
        amount: 50000, // Mock amount from invoice
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyIRN,
};
