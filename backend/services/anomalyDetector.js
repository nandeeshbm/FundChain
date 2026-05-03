const { calculateDistanceMeters } = require('./geoService');
const { verifyGovernmentIRN } = require('./irnVerificationService');

/**
 * Sentinel / Anomaly Detector Service.
 * Analyzes a proof submission against project constraints and returns a verdict.
 */
const analyzeSubmission = async ({
  proofSubmission,
  project,
  milestone,
  existingSubmissions = [],
}) => {
  const reasons = [];

  // 1. Geofence check
  const distance = calculateDistanceMeters(
    project.officialLocation.latitude,
    project.officialLocation.longitude,
    proofSubmission.gpsLatitude,
    proofSubmission.gpsLongitude
  );
  proofSubmission.distanceFromOfficialPinMeters = Math.round(distance);

  if (distance > project.allowedRadiusMeters) {
    reasons.push(
      `❌ FLAGGED: GPS location is ${Math.round(distance)}m from official pin, exceeds allowed radius of ${project.allowedRadiusMeters}m`
    );
  }

  // 2. Tax API Handshake (IRN Validation)
  // Rule: Checks the submitted 64-character IRN against Govt/provider API
  const irn = proofSubmission.taxIRN;
  if (!irn) {
    reasons.push('❌ FLAGGED: Missing Tax IRN Receipt');
  } else if (irn.length !== 64) {
    reasons.push('❌ FLAGGED: Invalid IRN format — must be 64 characters');
  } else {
    const irnResult = await verifyGovernmentIRN(irn);
    if (!irnResult.isValid) {
      reasons.push(`❌ FLAGGED: IRN validation failed - ${irnResult.reason || 'Invalid IRN'}`);
    }
  }

  // 3. Missing Proofs
  const required = project.requiredProofs || {};
  const uploaded = proofSubmission.uploadedProofs || {};
  if (required.sitePhoto && (!uploaded.sitePhoto || !proofSubmission.ipfsPhotoCid)) {
    reasons.push('❌ FLAGGED: Missing required proof: site photo (IPFS)');
  }
  if (required.materialReceipt && !uploaded.materialReceipt) {
    reasons.push('❌ FLAGGED: Missing required proof: material receipt');
  }

  // 4. Duplicate Submission
  if (proofSubmission.forensicMeta?.imageHash) {
    const duplicateFound = existingSubmissions.some(
      (s) =>
        s.forensicMeta?.imageHash === proofSubmission.forensicMeta.imageHash &&
        s._id?.toString() !== proofSubmission._id?.toString()
    );
    if (duplicateFound) {
      reasons.push('❌ FLAGGED: Duplicate image hash detected — possible double spending/re-use');
    }
  }

  // 5. Velocity Check (Rapid movement to unverified wallets)
  // If the project has too many releases in a short time to unverified vendors
  const recentReleases = existingSubmissions.filter(s => 
    s.submittedAt > new Date(Date.now() - 24 * 60 * 60 * 1000) && 
    s.sentinelResult === 'success'
  );
  if (recentReleases.length > 3) {
    reasons.push('❌ FLAGGED: Velocity check failed — too many submissions in 24h');
  }

  // 5. Deadline check
  if (milestone.estimatedDeadline && new Date() > new Date(milestone.estimatedDeadline)) {
    reasons.push('Submission received after milestone estimated deadline');
  }

  // 6. Metadata integrity — check EXIF timestamp plausibility
  if (proofSubmission.forensicMeta?.exifCapturedAt) {
    const capturedAt = new Date(proofSubmission.forensicMeta.exifCapturedAt);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (capturedAt > now || capturedAt < thirtyDaysAgo) {
      reasons.push('Suspicious EXIF timestamp — image date is outside plausible range');
    }
  }

  // Determine final result
  const sentinelResult = reasons.length > 0 ? 'flagged' : 'success';

  return {
    sentinelResult,
    sentinelReasons: reasons,
    distanceFromOfficialPinMeters: proofSubmission.distanceFromOfficialPinMeters,
  };
};

module.exports = { analyzeSubmission };
