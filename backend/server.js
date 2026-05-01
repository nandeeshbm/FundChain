const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.get('/', (req, res) => res.send('API Running'));

// Transaction Routes
app.use('/api/transactions', require('./routes/transactions'));
// Project Routes
app.use('/api/projects', require('./routes/projects'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
