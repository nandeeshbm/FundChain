const { IRN_API_ENABLED, IRN_API_BASE_URL, IRN_VERIFY_PATH, IRN_API_KEY, IRN_API_AUTH_HEADER } = require('../config/env');

const parseIrnApiResponse = (json) => {
  // Supports common patterns from verification APIs
  const directValid = json?.isValid ?? json?.valid ?? json?.data?.isValid ?? json?.data?.valid;
  const status = json?.status || json?.data?.status;
  const message = json?.message || json?.error || json?.data?.message;

  if (typeof directValid === 'boolean') {
    return { isValid: directValid, reason: message || null, raw: json };
  }

  // Fallback: consider status semantics
  if (typeof status === 'string') {
    const s = status.toLowerCase();
    if (['verified', 'valid', 'success'].includes(s)) return { isValid: true, reason: message || null, raw: json };
    if (['invalid', 'failed', 'not_found', 'rejected'].includes(s)) return { isValid: false, reason: message || 'IRN invalid', raw: json };
  }

  return { isValid: false, reason: 'Unknown response from IRN API', raw: json };
};

const verifyGovernmentIRN = async (irn) => {
  if (!IRN_API_ENABLED) {
    return { isValid: false, reason: 'IRN API integration disabled', raw: null };
  }

  if (!IRN_API_BASE_URL || !IRN_API_KEY) {
    return { isValid: false, reason: 'IRN API config missing', raw: null };
  }

  try {
    const url = `${IRN_API_BASE_URL.replace(/\/$/, '')}${IRN_VERIFY_PATH}`;
    const headers = {
      'Content-Type': 'application/json',
      [IRN_API_AUTH_HEADER]: IRN_API_KEY,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ irn }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        isValid: false,
        reason: data?.message || `IRN API HTTP ${response.status}`,
        raw: data,
      };
    }

    return parseIrnApiResponse(data);
  } catch (err) {
    return { isValid: false, reason: `IRN API request failed: ${err.message}`, raw: null };
  }
};

module.exports = { verifyGovernmentIRN };
