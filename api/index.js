/**
 * Vercel Serverless Function Entry Point
 * This allows Vercel to properly handle the Express app as a serverless function
 */

require('dotenv').config();

const app = require('../server/app');

// Export the app for Vercel
module.exports = app;
