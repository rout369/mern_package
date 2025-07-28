// const execa = require('execa');
// const path = require('path');

// async function installDependencies(config) {
//   const { projectPath, features, packageManager, cssFramework } = config;

//   // Install root dependencies (if using monorepo structure)
//   const rootDeps = ['concurrently'];
//   if (rootDeps.length > 0) {
//     await runInstall(projectPath, rootDeps, packageManager, true);
//   }

//   // Install React dependencies
//   if (features.includes('react')) {
//     const clientPath = path.join(projectPath, 'client');
//     const reactDeps = [
//       'react@latest',
//       'react-dom@latest',
//       'react-router-dom@latest',
//       'axios@latest'
//     ];

//     const reactDevDeps = [
//       '@vitejs/plugin-react@latest',
//       'vite@latest'
//     ];

//     // Add TypeScript dependencies for React
//     if (features.includes('typescript')) {
//       reactDevDeps.push('@types/react@latest', '@types/react-dom@latest', 'typescript@latest');
//     }

//     // Add CSS framework dependencies
//     if (cssFramework === 'tailwind') {
//       reactDevDeps.push('tailwindcss@latest', 'postcss@latest', 'autoprefixer@latest');
//     } else if (cssFramework === 'bootstrap') {
//       reactDeps.push('bootstrap@latest');
//     } else if (cssFramework === 'mui') {
//       reactDeps.push('@mui/material@latest', '@emotion/react@latest', '@emotion/styled@latest');
//     } else if (cssFramework === 'styled') {
//       reactDeps.push('styled-components@latest');
//       if (features.includes('typescript')) {
//         reactDevDeps.push('@types/styled-components@latest');
//       }
//     }

//     // Add testing dependencies
//     if (features.includes('testing')) {
//       reactDevDeps.push('vitest@latest', '@testing-library/react@latest', '@testing-library/jest-dom@latest');
//     }

//     await runInstall(clientPath, reactDeps, packageManager);
//     await runInstall(clientPath, reactDevDeps, packageManager, true);
//   }

//   // Install Express dependencies
//   if (features.includes('express')) {
//     const serverPath = path.join(projectPath, 'server');
//     const expressDeps = [
//       'express@latest',
//       'cors@latest',
//       'dotenv@latest'
//     ];

//     const expressDevDeps = [
//       'nodemon@latest'
//     ];

//     // Add MongoDB dependencies
//     if (features.includes('mongodb')) {
//       expressDeps.push('mongoose@latest');
//     }

//     // Add authentication dependencies
//     if (features.includes('auth')) {
//       expressDeps.push('jsonwebtoken@latest', 'bcryptjs@latest');
//     }

//     // Add file upload dependencies
//     if (features.includes('upload')) {
//       expressDeps.push('multer@latest');
//     }

//     // Add email dependencies
//     if (features.includes('email')) {
//       expressDeps.push('nodemailer@latest');
//     }

//     // Add TypeScript dependencies for Express
//     if (features.includes('typescript')) {
//       expressDeps.push('typescript@latest');
//       expressDevDeps.push('@types/express@latest', '@types/cors@latest', '@types/node@latest');
      
//       if (features.includes('auth')) {
//         expressDevDeps.push('@types/jsonwebtoken@latest', '@types/bcryptjs@latest');
//       }
//       if (features.includes('upload')) {
//         expressDevDeps.push('@types/multer@latest');
//       }
//     }

//     // Add testing dependencies
//     if (features.includes('testing')) {
//       expressDevDeps.push('jest@latest', 'supertest@latest');
//       if (features.includes('typescript')) {
//         expressDevDeps.push('@types/jest@latest', '@types/supertest@latest');
//       }
//     }

//     await runInstall(serverPath, expressDeps, packageManager);
//     await runInstall(serverPath, expressDevDeps, packageManager, true);
//   }
// }

// async function runInstall(cwd, packages, packageManager, dev = false) {
//   if (packages.length === 0) return;

//   const commands = {
//     npm: dev ? ['install', '--save-dev'] : ['install'],
//     yarn: dev ? ['add', '--dev'] : ['add'],
//     pnpm: dev ? ['add', '--save-dev'] : ['add']
//   };

//   try {
//     await execa(packageManager, [...commands[packageManager], ...packages], {
//       cwd,
//       stdio: 'pipe'
//     });
//   } catch (error) {
//     console.error(`Failed to install packages in ${cwd}:`, error.message);
//     throw error;
//   }
// }

// module.exports = { installDependencies };


const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function installDependencies(config) {
  const {
    projectPath,
    frontend,
    backend,
    frontendDir,
    backendDir,
    packageManager,
    features,
    database,
    cssFramework
  } = config;

  console.log(chalk.gray(`🔍 Installing dependencies with packageManager: ${packageManager}, frontendDir: ${frontendDir}, backendDir: ${backendDir}`));

  try {
    const npmCommand = packageManager === 'npm' ? 'npm' : packageManager === 'yarn' ? 'yarn' : 'pnpm';

    // Verify and install package manager if needed
    try {
      execSync(`${npmCommand} --version`, { stdio: 'ignore' });
      console.log(chalk.green(`✓ ${npmCommand} is available`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️ ${npmCommand} not found. Installing ${npmCommand} globally...`));
      try {
        execSync(`npm install -g ${npmCommand}`, { stdio: 'inherit' });
        console.log(chalk.green(`✓ ${npmCommand} installed successfully`));
      } catch (installError) {
        throw new Error(`Failed to install ${npmCommand}: ${installError.message}`);
      }
      // Verify again after installation
      try {
        execSync(`${npmCommand} --version`, { stdio: 'ignore' });
        console.log(chalk.green(`✓ ${npmCommand} is now available`));
      } catch (verifyError) {
        throw new Error(`Failed to verify ${npmCommand} after installation: ${verifyError.message}`);
      }
    }

    // Adjust install command based on package manager
    const installCmd = packageManager === 'yarn' ? 'add' : packageManager === 'pnpm' ? 'add' : 'install';
    const devFlag = packageManager === 'yarn' || packageManager === 'pnpm' ? '--dev' : '--save-dev';
    const saveFlag = packageManager === 'yarn' || packageManager === 'pnpm' ? '' : '--save';
    const exactFlag = packageManager === 'yarn' || packageManager === 'pnpm' ? '--exact' : '--save-exact';

    // Root dependencies
    const rootDependencies = ['concurrently@latest'];
    if (rootDependencies.length > 0) {
      console.log(chalk.gray(`📦 Installing root dependencies in ${projectPath}`));
      execSync(`${npmCommand} ${installCmd} ${devFlag} ${exactFlag} ${rootDependencies.join(' ')}`, {
        cwd: projectPath,
        stdio: 'inherit'
      });
      console.log(chalk.green(`✓ Root dependencies installed`));
    }

    // === Frontend Setup ===
    if (frontend) {
      const clientPath = path.join(projectPath, frontendDir);
      await fs.ensureDir(clientPath);

      let frontendDeps = [];
      let frontendDevDeps = [];

      if (frontend.toLowerCase() === 'react') {
        frontendDeps = ['react@latest', 'react-dom@latest', 'axios@latest', 'react-router-dom@latest'];
        frontendDevDeps = ['vite@latest', '@vitejs/plugin-react@latest'];

        if (features.includes('typescript')) {
          frontendDevDeps.push('typescript@latest', '@types/react@latest', '@types/react-dom@latest');
        }

        if (features.includes('testing')) {
          frontendDevDeps.push('vitest@latest', '@testing-library/react@latest', '@testing-library/jest-dom@latest');
        }

        // CSS Frameworks
        if (cssFramework === 'tailwind') {
          frontendDevDeps.push('tailwindcss@latest', 'postcss@latest', 'autoprefixer@latest');
        } else if (cssFramework === 'mui') {
          frontendDeps.push('@mui/material@latest', '@emotion/react@latest', '@emotion/styled@latest');
        } else if (cssFramework === 'bootstrap') {
          frontendDeps.push('bootstrap@latest');
        } else if (cssFramework === 'styled') {
          frontendDeps.push('styled-components@latest');
          if (features.includes('typescript')) {
            frontendDevDeps.push('@types/styled-components@latest');
          }
        }
      } else if (frontend.toLowerCase() === 'vue') {
        frontendDeps = ['vue@latest', 'axios@latest'];
        frontendDevDeps = ['vite@latest', '@vitejs/plugin-vue@latest'];
        if (features.includes('typescript')) {
          frontendDevDeps.push('typescript@latest', 'vue-tsc@latest');
        }
        if (features.includes('testing')) {
          frontendDevDeps.push('vitest@latest', '@vue/test-utils@latest');
        }
        if (cssFramework === 'tailwind') {
          frontendDevDeps.push('tailwindcss@latest', 'postcss@latest', 'autoprefixer@latest');
        }
      } else if (frontend.toLowerCase() === 'angular') {
        frontendDeps = ['@angular/core@latest', '@angular/common@latest', '@angular/platform-browser@latest'];
        frontendDevDeps = ['@angular/cli@latest'];
        if (features.includes('typescript')) {
          frontendDevDeps.push('typescript@latest');
        }
      }

      // Install frontend deps
      if (frontendDeps.length > 0) {
        console.log(chalk.gray(`📦 Installing frontend dependencies in ${clientPath}`));
        execSync(`${npmCommand} ${installCmd} ${saveFlag} ${exactFlag} ${frontendDeps.join(' ')}`, {
          cwd: clientPath,
          stdio: 'inherit'
        });
        console.log(chalk.green(`✓ Frontend dependencies installed in ${frontendDir}`));
      }

      if (frontendDevDeps.length > 0) {
        console.log(chalk.gray(`📦 Installing frontend dev dependencies in ${clientPath}`));
        execSync(`${npmCommand} ${installCmd} ${devFlag} ${exactFlag} ${frontendDevDeps.join(' ')}`, {
          cwd: clientPath,
          stdio: 'inherit'
        });
        console.log(chalk.green(`✓ Frontend dev dependencies installed in ${frontendDir}`));
      }
    }

    // === Backend Setup ===
    if (backend) {
      const serverPath = path.join(projectPath, backendDir);
      await fs.ensureDir(serverPath);

      let backendDeps = [];
      let backendDevDeps = ['nodemon@latest'];

      if (backend.toLowerCase() === 'nestjs') {
        backendDeps = ['@nestjs/core@latest', '@nestjs/common@latest', '@nestjs/platform-express@latest', 'reflect-metadata@latest', 'rxjs@latest'];
        backendDevDeps.push('@nestjs/cli@latest', '@nestjs/schematics@latest');
        if (features.includes('typescript')) {
          backendDevDeps.push('typescript@latest', 'ts-node@latest', '@types/node@latest', '@types/express@latest');
        }
      } else {
        backendDeps = ['express@latest', 'cors@latest', 'dotenv@latest'];
        if (features.includes('typescript')) {
          backendDevDeps.push('typescript@latest', 'ts-node@latest', '@types/node@latest', '@types/express@latest', '@types/cors@latest');
        }
      }

      // Auth
      if (features.includes('auth')) {
        backendDeps.push('jsonwebtoken@latest', 'bcryptjs@latest');
        if (features.includes('typescript')) {
          backendDevDeps.push('@types/jsonwebtoken@latest', '@types/bcryptjs@latest');
        }
      }

      // File Upload
      if (features.includes('upload')) {
        backendDeps.push('multer@latest');
        if (features.includes('typescript')) {
          backendDevDeps.push('@types/multer@latest');
        }
      }

      // Email
      if (features.includes('email')) {
        backendDeps.push('nodemailer@latest');
        if (features.includes('typescript')) {
          backendDevDeps.push('@types/nodemailer@latest');
        }
      }

      // DB
      if (database === 'mongodb') {
        backendDeps.push('mongoose@latest');
      } else if (database === 'postgresql') {
        backendDeps.push('typeorm@latest', 'pg@latest');
      } else if (database === 'mysql') {
        backendDeps.push('typeorm@latest', 'mysql2@latest');
      }

      // Testing
      if (features.includes('testing')) {
        backendDevDeps.push('jest@latest', 'supertest@latest');
        if (features.includes('typescript')) {
          backendDevDeps.push('@types/jest@latest', '@types/supertest@latest');
        }
      }

      // Install backend deps
      if (backendDeps.length > 0) {
        console.log(chalk.gray(`📦 Installing backend dependencies in ${serverPath}`));
        execSync(`${npmCommand} ${installCmd} ${saveFlag} ${exactFlag} ${backendDeps.join(' ')}`, {
          cwd: serverPath,
          stdio: 'inherit'
        });
        console.log(chalk.green(`✓ Backend dependencies installed in ${backendDir}`));
      }

      if (backendDevDeps.length > 0) {
        console.log(chalk.gray(`📦 Installing backend dev dependencies in ${serverPath}`));
        execSync(`${npmCommand} ${installCmd} ${devFlag} ${exactFlag} ${backendDevDeps.join(' ')}`, {
          cwd: serverPath,
          stdio: 'inherit'
        });
        console.log(chalk.green(`✓ Backend dev dependencies installed in ${backendDir}`));
      }
    }

  } catch (error) {
    console.error(chalk.red(`❌ Failed to install dependencies: ${error.message}`));
    throw error;
  }
}

module.exports = { installDependencies };

