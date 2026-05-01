const { calculateDistanceMeters } = require('./geoService');

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
      `GPS location is ${Math.round(distance)}m from official pin, exceeds allowed radius of ${project.allowedRadiusMeters}m`
    );
  }

  // 2. Required proof completeness check
  const required = project.requiredProofs || {};
  const uploaded = proofSubmission.uploadedProofs || {};
  if (required.sitePhoto && !uploaded.sitePhoto) {
    reasons.push('Missing required proof: site photo');
  }
  if (required.materialReceipt && !uploaded.materialReceipt) {
    reasons.push('Missing required proof: material receipt');
  }
  if (required.completionCertificate && !uploaded.completionCertificate) {
    reasons.push('Missing required proof: completion certificate');
  }

  // 3. IRN range validation (if configured)
  if (project.expectedSupplierIRNMin != null && project.expectedSupplierIRNMax != null) {
    const forensic = proofSubmission.forensicMeta || {};
    if (forensic.imageHash) {
      const hashNum = parseInt(forensic.imageHash.substring(0, 8), 16);
      const normalizedIRN = hashNum % 1000;
      if (normalizedIRN < project.expectedSupplierIRNMin || normalizedIRN > project.expectedSupplierIRNMax) {
        reasons.push(`IRN value ${normalizedIRN} is outside expected range [${project.expectedSupplierIRNMin}, ${project.expectedSupplierIRNMax}]`);
      }
    }
  }

  // 4. Duplicate submission hash check
  if (proofSubmission.forensicMeta?.imageHash) {
    const duplicateFound = existingSubmissions.some(
      (s) =>
        s.forensicMeta?.imageHash === proofSubmission.forensicMeta.imageHash &&
        s._id?.toString() !== proofSubmission._id?.toString()
    );
    if (duplicateFound) {
      reasons.push('Duplicate image hash detected — possible proof re-use');
    }
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
