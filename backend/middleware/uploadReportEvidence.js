const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadRoot = path.join(__dirname, '..', 'uploads', 'report-issues');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    cb(null, `${unique}_${safeName}`);
  },
});

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const fileFilter = (_req, file, cb) => {
  if (allowedTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Unsupported file type. Only images and PDF/DOC/DOCX are allowed.'));
};

const uploadReportEvidence = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

module.exports = uploadReportEvidence;
