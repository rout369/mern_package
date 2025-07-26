const fs = require('fs-extra');
const path = require('path');
const { generateReactTemplates } = require('./react');
const { generateExpressTemplates } = require('./express');
const { generateSharedTemplates } = require('./shared');

async function generateTemplates(config) {
  const { projectPath, features } = config;

  // Generate shared templates (package.json, README, etc.)
  await generateSharedTemplates(config);

  // Generate React templates
  if (features.includes('react')) {
    await generateReactTemplates(config);
  }

  // Generate Express templates
  if (features.includes('express')) {
    await generateExpressTemplates(config);
  }

  // Generate environment files
  if (config.createEnvFiles) {
    await generateEnvFiles(config);
  }

  // Initialize git repository
  if (config.initGit) {
    await generateGitFiles(config);
  }
}

async function generateEnvFiles(config) {
  const { projectPath, features } = config;

  if (features.includes('express')) {
    const serverEnv = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
${features.includes('mongodb') ? 'MONGODB_URI=mongodb://localhost:27017/your-app-name' : ''}

# Authentication Configuration
${features.includes('auth') ? 'JWT_SECRET=your-super-secret-jwt-key-change-this-in-production' : ''}

# Email Configuration
${features.includes('email') ? `EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password` : ''}
`;

    await fs.writeFile(path.join(projectPath, 'server', '.env'), serverEnv.trim());
    await fs.writeFile(path.join(projectPath, 'server', '.env.example'), serverEnv.trim());
  }

  if (features.includes('react')) {
    const clientEnv = `# Client Configuration
VITE_API_URL=http://localhost:5000/api
`;

    await fs.writeFile(path.join(projectPath, 'client', '.env'), clientEnv.trim());
    await fs.writeFile(path.join(projectPath, 'client', '.env.example'), clientEnv.trim());
  }
}

async function generateGitFiles(config) {
  const { projectPath } = config;

  const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
}

module.exports = { generateTemplates };