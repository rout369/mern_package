// const fs = require('fs-extra');
// const path = require('path');

// async function createProjectStructure(config) {
//   const { projectPath, features } = config;

//   // Create main project directory
//   await fs.ensureDir(projectPath);

//   // Create subdirectories based on selected features
//   if (features.includes('react')) {
//     await fs.ensureDir(path.join(projectPath, 'client', 'src', 'components'));
//     await fs.ensureDir(path.join(projectPath, 'client', 'src', 'pages'));
//     await fs.ensureDir(path.join(projectPath, 'client', 'src', 'utils'));
//     await fs.ensureDir(path.join(projectPath, 'client', 'public'));
//   }

//   if (features.includes('express')) {
//     await fs.ensureDir(path.join(projectPath, 'server', 'src', 'controllers'));
//     await fs.ensureDir(path.join(projectPath, 'server', 'src', 'models'));
//     await fs.ensureDir(path.join(projectPath, 'server', 'src', 'routes'));
//     await fs.ensureDir(path.join(projectPath, 'server', 'src', 'middleware'));
//     await fs.ensureDir(path.join(projectPath, 'server', 'src', 'utils'));
//   }

//   if (features.includes('testing')) {
//     if (features.includes('react')) {
//       await fs.ensureDir(path.join(projectPath, 'client', 'src', '__tests__'));
//     }
//     if (features.includes('express')) {
//       await fs.ensureDir(path.join(projectPath, 'server', 'src', '__tests__'));
//     }
//   }

//   // Create shared directories
//   await fs.ensureDir(path.join(projectPath, 'docs'));
// }

// module.exports = { createProjectStructure };


const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function createProjectStructure(config) {
  const {
    projectPath,
    frontend,
    backend,
    features,
    frontendDir,
    backendDir
  } = config;

  console.log(chalk.gray(`🔍 Creating structure in ${projectPath} with frontendDir: ${frontendDir}, backendDir: ${backendDir}`)); // Debug log

  try {
    // Root directories
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, 'docs'));

    // Frontend directories
    if (frontend) {
      const clientPath = path.join(projectPath, frontendDir);
      if (frontend === 'react') {
        await fs.ensureDir(path.join(clientPath, 'public'));
        await fs.ensureDir(path.join(clientPath, 'src', 'components'));
        await fs.ensureDir(path.join(clientPath, 'src', 'pages'));
        await fs.ensureDir(path.join(clientPath, 'src', 'utils'));
      } else if (frontend === 'vue') {
        await fs.ensureDir(path.join(clientPath, 'public'));
        await fs.ensureDir(path.join(clientPath, 'src', 'components'));
        await fs.ensureDir(path.join(clientPath, 'src', 'views'));
        await fs.ensureDir(path.join(clientPath, 'src', 'assets'));
      } else if (frontend === 'angular') {
        await fs.ensureDir(path.join(clientPath, 'src', 'app', 'components'));
        await fs.ensureDir(path.join(clientPath, 'src', 'app', 'services'));
        await fs.ensureDir(path.join(clientPath, 'src', 'assets'));
        await fs.ensureDir(path.join(clientPath, 'src', 'environments'));
      }
      if (features.includes('testing')) {
        await fs.ensureDir(path.join(clientPath, 'tests'));
      }
    }

    // Backend directories
    if (backend) {
      const serverPath = path.join(projectPath, backendDir);
      if (backend === 'express') {
        await fs.ensureDir(path.join(serverPath, 'routes'));
        await fs.ensureDir(path.join(serverPath, 'controllers'));
        await fs.ensureDir(path.join(serverPath, 'models'));
        await fs.ensureDir(path.join(serverPath, 'middleware'));
      } else if (backend === 'nestjs') {
        await fs.ensureDir(path.join(serverPath, 'src', 'controllers'));
        await fs.ensureDir(path.join(serverPath, 'src', 'services'));
        await fs.ensureDir(path.join(serverPath, 'src', 'modules'));
        await fs.ensureDir(path.join(serverPath, 'src', 'entities'));
      }
      if (features.includes('testing')) {
        await fs.ensureDir(path.join(serverPath, 'tests'));
      }
    }

    // Additional directories based on features
    if (features.includes('docker')) {
      await fs.ensureDir(path.join(projectPath, 'docker'));
    }
    if (config.cicd) {
      await fs.ensureDir(path.join(projectPath, '.github', 'workflows'));
    }

    console.log(chalk.green(`✓ Project structure created successfully`));
  } catch (error) {
    console.error(chalk.red(`Failed to create project structure: ${error.message}`));
    throw error;
  }
}

module.exports = { createProjectStructure };
