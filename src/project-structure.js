const fs = require('fs-extra');
const path = require('path');

async function createProjectStructure(config) {
  const { projectPath, features } = config;

  // Create main project directory
  await fs.ensureDir(projectPath);

  // Create subdirectories based on selected features
  if (features.includes('react')) {
    await fs.ensureDir(path.join(projectPath, 'client', 'src', 'components'));
    await fs.ensureDir(path.join(projectPath, 'client', 'src', 'pages'));
    await fs.ensureDir(path.join(projectPath, 'client', 'src', 'utils'));
    await fs.ensureDir(path.join(projectPath, 'client', 'public'));
  }

  if (features.includes('express')) {
    await fs.ensureDir(path.join(projectPath, 'server', 'src', 'controllers'));
    await fs.ensureDir(path.join(projectPath, 'server', 'src', 'models'));
    await fs.ensureDir(path.join(projectPath, 'server', 'src', 'routes'));
    await fs.ensureDir(path.join(projectPath, 'server', 'src', 'middleware'));
    await fs.ensureDir(path.join(projectPath, 'server', 'src', 'utils'));
  }

  if (features.includes('testing')) {
    if (features.includes('react')) {
      await fs.ensureDir(path.join(projectPath, 'client', 'src', '__tests__'));
    }
    if (features.includes('express')) {
      await fs.ensureDir(path.join(projectPath, 'server', 'src', '__tests__'));
    }
  }

  // Create shared directories
  await fs.ensureDir(path.join(projectPath, 'docs'));
}

module.exports = { createProjectStructure };