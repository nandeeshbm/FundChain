/**
 * Seed Script — creates a default admin, auditor, and contractor user.
 * Run: node seed.js
 */
require('dotenv').config();

// Fix: Force Google DNS so ISP DNS block doesn't prevent Atlas connection
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const User = require('./models/User');
const { MONGO_URI } = require('./config/env');

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const users = [
    { name: 'System Admin', email: 'admin@gov.in', passwordHash: 'password123', role: 'admin', isActive: true },
    { name: 'Auditor 01', email: 'auditor@gov.in', passwordHash: 'password123', role: 'auditor', isActive: true },
    { name: 'Contractor A', email: 'contractor@gov.in', passwordHash: 'password123', role: 'contractor', isActive: true },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`  SKIP: ${u.email} already exists`);
    } else {
      await User.create(u);
      console.log(`  CREATED: ${u.email} (${u.role})`);
    }
  }

  console.log('\nSeed complete!');
  console.log('Login credentials:');
  console.log('  Admin    → admin@gov.in    / password123');
  console.log('  Auditor  → auditor@gov.in  / password123');
  console.log('  Contractor → contractor@gov.in / password123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
