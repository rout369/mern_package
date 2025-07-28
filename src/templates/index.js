// const fs = require('fs-extra');
// const path = require('path');
// const { generateReactTemplates } = require('./react');
// const { generateExpressTemplates } = require('./express');
// const { generateSharedTemplates } = require('./shared');

// async function generateTemplates(config) {
//   const { projectPath, features } = config;

//   // Generate shared templates (package.json, README, etc.)
//   await generateSharedTemplates(config);

//   // Generate React templates
//   if (features.includes('react')) {
//     await generateReactTemplates(config);
//   }

//   // Generate Express templates
//   if (features.includes('express')) {
//     await generateExpressTemplates(config);
//   }

//   // Generate environment files
//   if (config.createEnvFiles) {
//     await generateEnvFiles(config);
//   }

//   // Initialize git repository
//   if (config.initGit) {
//     await generateGitFiles(config);
//   }
// }

// async function generateEnvFiles(config) {
//   const { projectPath, features } = config;

//   if (features.includes('express')) {
//     const serverEnv = `# Server Configuration
// PORT=5000
// NODE_ENV=development

// # Database Configuration
// ${features.includes('mongodb') ? 'MONGODB_URI=mongodb://localhost:27017/your-app-name' : ''}

// # Authentication Configuration
// ${features.includes('auth') ? 'JWT_SECRET=your-super-secret-jwt-key-change-this-in-production' : ''}

// # Email Configuration
// ${features.includes('email') ? `EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-app-password` : ''}
// `;

//     await fs.writeFile(path.join(projectPath, 'server', '.env'), serverEnv.trim());
//     await fs.writeFile(path.join(projectPath, 'server', '.env.example'), serverEnv.trim());
//   }

//   if (features.includes('react')) {
//     const clientEnv = `# Client Configuration
// VITE_API_URL=http://localhost:5000/api
// `;

//     await fs.writeFile(path.join(projectPath, 'client', '.env'), clientEnv.trim());
//     await fs.writeFile(path.join(projectPath, 'client', '.env.example'), clientEnv.trim());
//   }
// }

// async function generateGitFiles(config) {
//   const { projectPath } = config;

//   const gitignore = `# Dependencies
// node_modules/
// npm-debug.log*
// yarn-debug.log*
// yarn-error.log*

// # Environment variables
// .env
// .env.local
// .env.development.local
// .env.test.local
// .env.production.local

// # Build outputs
// dist/
// build/

// # IDE
// .vscode/
// .idea/
// *.swp
// *.swo

// # OS
// .DS_Store
// Thumbs.db

// # Logs
// logs
// *.log

// # Runtime data
// pids
// *.pid
// *.seed
// *.pid.lock

// # Coverage directory used by tools like istanbul
// coverage/

// # Dependency directories
// jspm_packages/

// # Optional npm cache directory
// .npm

// # Optional eslint cache
// .eslintcache
// `;

//   await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
// }

// module.exports = { generateTemplates };



const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

let generateReactTemplates, generateExpressTemplates, generateVueTemplates, generateAngularTemplates, generateNestjsTemplates, generateSharedTemplates;

try {
  ({ generateReactTemplates } = require('./react'));
  ({ generateExpressTemplates } = require('./express'));
  ({ generateVueTemplates } = require('./vue'));
  ({ generateAngularTemplates } = require('./angular'));
  ({ generateNestjsTemplates } = require('./nest'));
  ({ generateSharedTemplates } = require('./shared'));
} catch (error) {
  console.error(chalk.red(`Failed to load template modules: ${error.message}`));
  throw new Error(`Template module loading failed. Ensure react.js, express.js, vue.js, angular.js, nest.js, and shared.js exist in src/templates/.`);
}

async function generateTemplates(config) {
  const { projectPath, frontend, backend, frontendDir, backendDir, features, createEnvFiles, initGit } = config;

  console.log(chalk.gray(`🔍 Generating templates for frontend: ${frontend || 'none'}, backend: ${backend || 'none'}`));

  try {
    // Generate shared templates (package.json, README, etc.)
    await generateSharedTemplates(config);

    // Generate frontend templates
    if (frontend) {
      const clientPath = path.join(projectPath, frontendDir);
      await fs.ensureDir(clientPath);
      switch (frontend.toLowerCase()) {
        case 'react':
          await generateReactTemplates(config);
          break;
        case 'vue':
          await generateVueTemplates(config);
          break;
        case 'angular':
          await generateAngularTemplates(config);
          break;
        default:
          console.warn(chalk.yellow(`⚠️ Frontend framework '${frontend}' not supported. Skipping frontend template generation.`));
      }
    }

    // Generate backend templates
    if (backend) {
      const serverPath = path.join(projectPath, backendDir);
      await fs.ensureDir(serverPath);
      switch (backend.toLowerCase()) {
        case 'express':
          await generateExpressTemplates(config);
          break;
        case 'nestjs':
          await generateNestjsTemplates(config);
          break;
        default:
          console.warn(chalk.yellow(`⚠️ Backend framework '${backend}' not supported. Skipping backend template generation.`));
      }
    }

    // Generate environment files
    if (createEnvFiles) {
      await generateEnvFiles(config);
    }

    // Initialize git repository
    if (initGit) {
      await generateGitFiles(config);
    }

    console.log(chalk.green(`✓ Templates generated successfully in ${projectPath}`));
  } catch (error) {
    console.error(chalk.red(`Failed to generate templates: ${error.message}`));
    throw error;
  }
}

async function generateEnvFiles(config) {
  const { projectPath, frontend, backend, frontendDir, backendDir, features, database } = config;

  // Frontend .env
  if (frontend) {
    const clientPath = path.join(projectPath, frontendDir);
    const clientEnv = `# Client Configuration
API_URL=http://localhost:3000/api
${database === 'postgresql' ? 'DB_URL=postgresql://user:password@localhost:5432/dbname' : ''}
${database === 'mongodb' ? 'DB_URL=mongodb://localhost:27017/your-app-name' : ''}
${database === 'mysql' ? 'DB_URL=mysql://user:password@localhost:3306/dbname' : ''}`;

    await fs.writeFile(path.join(clientPath, '.env'), clientEnv.trim());
    await fs.writeFile(path.join(clientPath, '.env.example'), clientEnv.trim());
  }

  // Backend .env
  if (backend) {
    const serverPath = path.join(projectPath, backendDir);
    const serverEnv = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
${database === 'postgresql' ? `DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=dbname` : ''}
${database === 'mongodb' ? 'MONGODB_URI=mongodb://localhost:27017/your-app-name' : ''}
${database === 'mysql' ? `DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=dbname` : ''}

# Authentication Configuration
${features.includes('auth') ? 'JWT_SECRET=your-super-secret-jwt-key-change-this-in-production' : ''}

# Email Configuration
${features.includes('email') ? `EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password` : ''}`;

    await fs.writeFile(path.join(serverPath, '.env'), serverEnv.trim());
    await fs.writeFile(path.join(serverPath, '.env.example'), serverEnv.trim());
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
