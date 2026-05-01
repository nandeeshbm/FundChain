const mongoose = require('mongoose');
const dns = require('dns');
const { MONGO_URI } = require('./env');

// ─────────────────────────────────────────────────────────────────────────────
// DNS FIX: ISP DNS blocks MongoDB Atlas SRV lookups.
// dns.setServers forces ALL dns lookups in this Node process to use Google DNS,
// including the internal SRV resolution done by the mongodb driver.
// ─────────────────────────────────────────────────────────────────────────────
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
