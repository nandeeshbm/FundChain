const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security & logging middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => res.json({ success: true, message: 'Public Fund Tracker API Running' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/vendors', require('./routes/vendorRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/auditor', require('./routes/auditorRoutes'));
app.use('/api/contractor', require('./routes/contractorRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/govt', require('./routes/govtRoutes'));

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
