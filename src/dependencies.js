const execa = require('execa');
const path = require('path');

async function installDependencies(config) {
  const { projectPath, features, packageManager, cssFramework } = config;

  // Install root dependencies (if using monorepo structure)
  const rootDeps = ['concurrently'];
  if (rootDeps.length > 0) {
    await runInstall(projectPath, rootDeps, packageManager, true);
  }

  // Install React dependencies
  if (features.includes('react')) {
    const clientPath = path.join(projectPath, 'client');
    const reactDeps = [
      'react@latest',
      'react-dom@latest',
      'react-router-dom@latest',
      'axios@latest'
    ];

    const reactDevDeps = [
      '@vitejs/plugin-react@latest',
      'vite@latest'
    ];

    // Add TypeScript dependencies for React
    if (features.includes('typescript')) {
      reactDevDeps.push('@types/react@latest', '@types/react-dom@latest', 'typescript@latest');
    }

    // Add CSS framework dependencies
    if (cssFramework === 'tailwind') {
      reactDevDeps.push('tailwindcss@latest', 'postcss@latest', 'autoprefixer@latest');
    } else if (cssFramework === 'bootstrap') {
      reactDeps.push('bootstrap@latest');
    } else if (cssFramework === 'mui') {
      reactDeps.push('@mui/material@latest', '@emotion/react@latest', '@emotion/styled@latest');
    } else if (cssFramework === 'styled') {
      reactDeps.push('styled-components@latest');
      if (features.includes('typescript')) {
        reactDevDeps.push('@types/styled-components@latest');
      }
    }

    // Add testing dependencies
    if (features.includes('testing')) {
      reactDevDeps.push('vitest@latest', '@testing-library/react@latest', '@testing-library/jest-dom@latest');
    }

    await runInstall(clientPath, reactDeps, packageManager);
    await runInstall(clientPath, reactDevDeps, packageManager, true);
  }

  // Install Express dependencies
  if (features.includes('express')) {
    const serverPath = path.join(projectPath, 'server');
    const expressDeps = [
      'express@latest',
      'cors@latest',
      'dotenv@latest'
    ];

    const expressDevDeps = [
      'nodemon@latest'
    ];

    // Add MongoDB dependencies
    if (features.includes('mongodb')) {
      expressDeps.push('mongoose@latest');
    }

    // Add authentication dependencies
    if (features.includes('auth')) {
      expressDeps.push('jsonwebtoken@latest', 'bcryptjs@latest');
    }

    // Add file upload dependencies
    if (features.includes('upload')) {
      expressDeps.push('multer@latest');
    }

    // Add email dependencies
    if (features.includes('email')) {
      expressDeps.push('nodemailer@latest');
    }

    // Add TypeScript dependencies for Express
    if (features.includes('typescript')) {
      expressDeps.push('typescript@latest');
      expressDevDeps.push('@types/express@latest', '@types/cors@latest', '@types/node@latest');
      
      if (features.includes('auth')) {
        expressDevDeps.push('@types/jsonwebtoken@latest', '@types/bcryptjs@latest');
      }
      if (features.includes('upload')) {
        expressDevDeps.push('@types/multer@latest');
      }
    }

    // Add testing dependencies
    if (features.includes('testing')) {
      expressDevDeps.push('jest@latest', 'supertest@latest');
      if (features.includes('typescript')) {
        expressDevDeps.push('@types/jest@latest', '@types/supertest@latest');
      }
    }

    await runInstall(serverPath, expressDeps, packageManager);
    await runInstall(serverPath, expressDevDeps, packageManager, true);
  }
}

async function runInstall(cwd, packages, packageManager, dev = false) {
  if (packages.length === 0) return;

  const commands = {
    npm: dev ? ['install', '--save-dev'] : ['install'],
    yarn: dev ? ['add', '--dev'] : ['add'],
    pnpm: dev ? ['add', '--save-dev'] : ['add']
  };

  try {
    await execa(packageManager, [...commands[packageManager], ...packages], {
      cwd,
      stdio: 'pipe'
    });
  } catch (error) {
    console.error(`Failed to install packages in ${cwd}:`, error.message);
    throw error;
  }
}

module.exports = { installDependencies };