#!/usr/bin/env node

const { setupMernProject } = require('../src/setup');

// Run the setup
setupMernProject().catch((error) => {
  console.error('Setup failed:', error.message);
  process.exit(1);
});