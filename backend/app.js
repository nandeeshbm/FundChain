const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security & logging middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

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

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
