/**
 * Test script for Government IRN API Integration
 */
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const { verifyGovernmentIRN } = require('./services/irnVerificationService');

async function testIRN() {
  console.log('--- Testing IRN Verification Integration ---');
  
  // 1. Test Valid IRN (64 chars, not ending in 00)
  const validIRN = 'A'.repeat(64);
  console.log(`\nTesting Valid IRN: ${validIRN}`);
  const result1 = await verifyGovernmentIRN(validIRN);
  console.log('Result:', JSON.stringify(result1, null, 2));

  // 2. Test Invalid IRN (64 chars, ending in 00)
  const invalidIRN = 'B'.repeat(62) + '00';
  console.log(`\nTesting Invalid IRN: ${invalidIRN}`);
  const result2 = await verifyGovernmentIRN(invalidIRN);
  console.log('Result:', JSON.stringify(result2, null, 2));

  // 3. Test Error IRN (Starts with ERR)
  const errorIRN = 'ERR' + 'C'.repeat(61);
  console.log(`\nTesting Error IRN: ${errorIRN}`);
  const result3 = await verifyGovernmentIRN(errorIRN);
  console.log('Result:', JSON.stringify(result3, null, 2));

  console.log('\n--- Test Complete ---');
}

// We don't even need DB for this as it's testing the service -> mock govt api
// But the server needs to be running for the mock api to respond
testIRN();
