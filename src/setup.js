// Enhanced CLI UI for MERN Setup
// const inquirer = require('inquirer').default || require('inquirer');
// const chalk = require('chalk');
// const ora = require('ora');
// const path = require('path');
// const fs = require('fs/promises');
// const figlet = require('figlet');
// const gradient = require('gradient-string');
// // const boxen = require('boxen');
// const _boxen = require('boxen');
// const boxen = _boxen.default || _boxen;
// const logSymbols = require('log-symbols');
// const Table = require('cli-table3');
// const showBanner = require('../utils/banner');

// const { createProjectStructure } = require('./project-structure');
// const { installDependencies } = require('./dependencies');
// const { generateTemplates } = require('./templates');

// async function setupMernProject() {
//   showBanner();

//   const config = await getProjectConfig();
//   const spinner = ora('Creating project directory...').start();

//   try {
//     await fs.mkdir(config.projectPath, { recursive: true });
//     process.chdir(config.projectPath);
//     spinner.succeed(`${logSymbols.success} ${chalk.green('Project directory created')}`);

//     spinner.start('Creating project structure...');
//     await createProjectStructure(config);
//     spinner.succeed(`${logSymbols.success} ${chalk.green('Project structure created')}`);

//     spinner.start('Generating boilerplate code...');
//     await generateTemplates(config);
//     spinner.succeed(`${logSymbols.success} ${chalk.green('Boilerplate code generated')}`);

//     spinner.start('Installing dependencies...');
//     await installDependencies(config);
//     spinner.succeed(`${logSymbols.success} ${chalk.green('Dependencies installed')}`);

//     showCompletionMessage(config);
//   } catch (err) {
//     spinner.fail(`${logSymbols.error} ${chalk.red('Setup failed:')} ${err.message}`);
//     console.error(chalk.red('❌ Error details:'), err);
//   }
// }

// async function getProjectConfig() {
//   const answers = await inquirer.prompt([
//     {
//       type: 'input',
//       name: 'projectName',
//       message: 'What is your project name?',
//       default: 'my-mern-app',
//       validate: (input) => input.trim().length > 0 || 'Project name is required'
//     },
//     {
//       type: 'checkbox',
//       name: 'features',
//       message: 'Select features:',
//       choices: [
//         { name: '⚛️  Frontend (React)', value: 'react', checked: true },
//         { name: '🚀 Backend (Express + Node.js)', value: 'express', checked: true },
//         { name: '🍃 Database (MongoDB)', value: 'mongodb', checked: true },
//         { name: '📘 TypeScript Support', value: 'typescript' },
//         { name: '🔐 Authentication (JWT)', value: 'auth' },
//         { name: '📁 File Upload Support', value: 'upload' },
//         { name: '📧 Email Service', value: 'email' },
//         { name: '🧪 Testing Setup (Jest/Vitest)', value: 'testing' },
//         { name: '🐳 Docker Configuration', value: 'docker' }
//       ]
//     },
//     {
//       type: 'list',
//       name: 'cssFramework',
//       message: 'Choose a CSS framework:',
//       choices: [
//         { name: '🎨 Tailwind CSS', value: 'tailwind' },
//         { name: '🅱️  Bootstrap', value: 'bootstrap' },
//         { name: '🎭 Material-UI (MUI)', value: 'mui' },
//         { name: '💅 Styled Components', value: 'styled' },
//         { name: '📄 Plain CSS', value: 'plain' }
//       ],
//       when: (answers) => answers.features.includes('react')
//     },
//     {
//       type: 'list',
//       name: 'packageManager',
//       message: 'Choose a package manager:',
//       choices: [
//         { name: '📦 npm', value: 'npm' },
//         { name: '🧶 yarn', value: 'yarn' },
//         { name: '⚡ pnpm', value: 'pnpm' }
//       ],
//       default: 'npm'
//     },
//     {
//       type: 'checkbox',
//       name: 'additionalOptions',
//       message: 'Select additional setup options:',
//       choices: [
//         { name: '🔧 Initialize Git repository', value: 'initGit', checked: true },
//         { name: '⚙️  Create environment configuration files', value: 'createEnvFiles', checked: true },
//         { name: '📚 Generate comprehensive README', value: 'generateReadme', checked: true },
//         { name: '🔍 Add ESLint configuration', value: 'eslint' },
//         { name: '💄 Add Prettier configuration', value: 'prettier' }
//       ]
//     }
//   ]);

//   const config = {
//     ...answers,
//     initGit: answers.additionalOptions.includes('initGit'),
//     createEnvFiles: answers.additionalOptions.includes('createEnvFiles'),
//     generateReadme: answers.additionalOptions.includes('generateReadme'),
//     eslint: answers.additionalOptions.includes('eslint'),
//     prettier: answers.additionalOptions.includes('prettier'),
//     projectPath: path.resolve(process.cwd(), answers.projectName)
//   };

//   delete config.additionalOptions;
//   return config;
// }


// function showCompletionMessage(config) {
//   const featuresTable = new Table({
//     head: ['Feature', 'Included'],
//     colWidths: [30, 15]
//   });

//   const featureMap = [
//     ['Frontend (React)', 'react'],
//     ['Backend (Express)', 'express'],
//     ['Database (MongoDB)', 'mongodb'],
//     ['Authentication', 'auth'],
//     ['File Upload', 'upload'],
//     ['Email Service', 'email'],
//     ['Docker', 'docker'],
//     ['TypeScript', 'typescript'],
//     ['Testing', 'testing']
//   ];

//   featureMap.forEach(([label, key]) => {
//     featuresTable.push([label, config.features.includes(key) ? '✅' : '❌']);
//   });

//   const message = [
//     chalk.green.bold('✅ MERN project setup completed successfully!'),
//     chalk.cyan('📁 Project structure:'),
//     `   ${chalk.gray(config.projectName + '/')}`,
//     config.features.includes('react') ? '   ├── client/          (React frontend)' : '',
//     config.features.includes('express') ? '   ├── server/          (Express backend)' : '',
//     '   ├── package.json',
//     '   └── README.md',
//     '',
//     chalk.magenta('🧩 Features selected:'),
//     featuresTable.toString(),
//     '',
//     chalk.cyan('🚀 Next steps:'),
//     `   cd ${chalk.yellow(config.projectName)}`,
//     config.features.includes('react') && config.features.includes('express')
//       ? `   ${chalk.yellow(config.packageManager)} run dev          # Start both frontend and backend`
//       : config.features.includes('react')
//       ? `   ${chalk.yellow(config.packageManager)} run dev          # Start frontend`
//       : `   ${chalk.yellow(config.packageManager)} run dev          # Start backend`,
//     config.features.includes('mongodb')
//       ? chalk.yellow('\n📄 Don\'t forget to:\n   • Set up your MongoDB connection string in .env\n   • Install MongoDB locally or use MongoDB Atlas')
//       : '',
//     chalk.gray('\nHappy coding! 🎉')
//   ].join('\n');

//   console.log(boxen(message, {
//     padding: 1,
//     borderStyle: 'round',
//     borderColor: 'green',
//     margin: 1
//   }));
// }

// module.exports = { setupMernProject };


const inquirer = require('inquirer').default || require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs/promises');
const figlet = require('figlet');
const gradient = require('gradient-string');
const _boxen = require('boxen');
const boxen = _boxen.default || _boxen;
const logSymbols = require('log-symbols');
const Table = require('cli-table3');
const showBanner = require('../utils/banner');
const { createProjectStructure } = require('./project-structure');
const { installDependencies } = require('./dependencies');
const { generateTemplates } = require('./templates');

const symbols = {
  branch: chalk.gray('├──'),
  last: chalk.gray('└──'),
  pipe: chalk.gray('│'),
  pointer: chalk.green('➤'),
};

// Configuration for available stack options
const stackOptions = {
  frontend: [
    { name: `${symbols.pipe}   ╭─⚛️  React`, value: 'react', checked: true },
    { name: `${symbols.pipe}   ├─🔲 Vue.js`, value: 'vue' },
    { name: `${symbols.pipe}   └─🅰️  Angular`, value: 'angular' }
  ],
  backend: [
    { name: `${symbols.pipe}   ╭─🚀 Express`, value: 'express', checked: true },
    { name: `${symbols.pipe}   └─🛠️  NestJS`, value: 'nestjs' }
  ],
  database: [
    { name: `${symbols.pipe}   ╭─🍃 MongoDB`, value: 'mongodb', checked: true },
    { name: `${symbols.pipe}   ├─🐘 PostgreSQL`, value: 'postgresql' },
    { name: `${symbols.pipe}   └─🗄️  MySQL`, value: 'mysql' }
  ],
  features: [
    { name: `${symbols.pipe}   ╭─🔐 Authentication (JWT)`, value: 'auth' },
    { name: `${symbols.pipe}   ├─📁 File Upload Support`, value: 'upload' },
    { name: `${symbols.pipe}   ├─📧 Email Service`, value: 'email' },
    { name: `${symbols.pipe}   ├─🧪 Testing Setup (Jest/Vitest)`, value: 'testing' },
    { name: `${symbols.pipe}   ├─🐳 Docker Configuration`, value: 'docker' },
    { name: `${symbols.pipe}   └─📘 TypeScript Support`, value: 'typescript' }
  ],
  cssFramework: [
    { name: `${symbols.pipe}   ╭─🎨 Tailwind CSS`, value: 'tailwind' },
    { name: `${symbols.pipe}   ├─🅱️  Bootstrap`, value: 'bootstrap' },
    { name: `${symbols.pipe}   ├─🎭 Material-UI (MUI)`, value: 'mui' },
    { name: `${symbols.pipe}   ├─💅 Styled Components`, value: 'styled' },
    { name: `${symbols.pipe}   └─📄 Plain CSS`, value: 'plain' }
  ],
  packageManager: [
    { name: `${symbols.pipe}   ╭─📦 npm`, value: 'npm', checked: true },
    { name: `${symbols.pipe}   ├─🧶 yarn`, value: 'yarn' },
    { name: `${symbols.pipe}   └─⚡ pnpm`, value: 'pnpm' }
  ],
  additionalOptions: [
    { name: `${symbols.pipe}   ╭─🔧 Initialize Git`, value: 'initGit', checked: true },
    { name: `${symbols.pipe}   ├─⚙️  .env config`, value: 'createEnvFiles', checked: true },
    { name: `${symbols.pipe}   ├─📚 Generate README`, value: 'generateReadme', checked: true },
    { name: `${symbols.pipe}   ├─🔍 Add ESLint config`, value: 'eslint' },
    { name: `${symbols.pipe}   ├─💄 Add Prettier config`, value: 'prettier' },
    { name: `${symbols.pipe}   └─📦 Add CI/CD Config (GitHub Actions)`, value: 'cicd' }
  ]
};

async function setupMernProject() {
  showBanner();

  const spin = ora({
    text: chalk.cyan('🔧 Initializing the setup wizard...'),
    spinner: 'arc',
    color: 'cyan'
  }).start();

  await new Promise(resolve => setTimeout(resolve, 2000));
  spin.succeed(chalk.green('✅ Wizard initialized!\n'));

  const config = await getProjectConfig();
  console.log(chalk.gray('🔍 Config:', JSON.stringify(config, null, 2))); // Debug log

  const spinner = ora('Creating project directory...').start();

  try {
    // Check if directory already exists
    if (await fs.access(config.projectPath).then(() => true).catch(() => false)) {
      spinner.fail(chalk.red(`Directory ${config.projectName} already exists!`));
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow('Do you want to overwrite the existing directory?'),
          default: false
        }
      ]);
      if (!overwrite) {
        spinner.fail(chalk.red('Setup aborted.'));
        process.exit(1);
      }
      await fs.rm(config.projectPath, { recursive: true, force: true });
    }

    await fs.mkdir(config.projectPath, { recursive: true });
    process.chdir(config.projectPath);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Project directory created')}`);

    spinner.start('Creating project structure...');
    await createProjectStructure(config);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Project structure created')}`);

    spinner.start('Generating boilerplate code...');
    // Warn if unsupported frontend is selected
    if (config.frontend && !['react'].includes(config.frontend)) {
      console.warn(chalk.yellow(`⚠️ Warning: ${config.frontend} template generation is not yet supported. Skipping frontend files.`));
      config.features = config.features.filter(f => f !== config.frontend); // Remove unsupported frontend from features
    }
    await generateTemplates(config);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Boilerplate code generated')}`);

    spinner.start('Installing dependencies...');
    await installDependencies(config);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Dependencies installed')}`);

    if (config.cicd) {
      spinner.start('Generating CI/CD configuration...');
      await generateCICDConfig(config);
      spinner.succeed(`${logSymbols.success} ${chalk.green('CI/CD configuration generated')}`);
    }

    if (config.eslint || config.prettier) {
      spinner.start('Generating linting and formatting configs...');
      await generateLintingConfigs(config);
      spinner.succeed(`${logSymbols.success} ${chalk.green('Linting and formatting configs generated')}`);
    }

    showCompletionMessage(config);
  } catch (err) {
    spinner.fail(`${logSymbols.error} ${chalk.red('Setup failed:')} ${err.message}`);
    console.error(chalk.red('❌ Error details:'), err);
    process.exit(1);
  }
}

async function getProjectConfig() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: chalk.green(`? Project name ${symbols.pointer}`),
      default: 'my-mern-app',
      validate: (input) => {
        const trimmed = input.trim();
        if (trimmed.length === 0) return 'Project name is required';
        if (!/^[a-zA-Z0-9-_]+$/.test(trimmed)) return 'Project name can only contain letters, numbers, hyphens, and underscores';
        return true;
      }
    },
    {
      type: 'checkbox',
      name: 'frontend',
      message: chalk.green(`\n${symbols.branch}> Select frontend framework:`),
      choices: stackOptions.frontend,
      validate: (input) => input.length <= 1 || 'Select only one frontend framework'
    },
    {
      type: 'checkbox',
      name: 'backend',
      message: chalk.green(`\n${symbols.branch}> Select backend framework:`),
      choices: stackOptions.backend,
      validate: (input) => input.length <= 1 || 'Select only one backend framework'
    },
    {
      type: 'checkbox',
      name: 'database',
      message: chalk.green(`\n${symbols.branch}> Select database:`),
      choices: stackOptions.database,
      validate: (input) => input.length <= 1 || 'Select only one database'
    },
    {
      type: 'checkbox',
      name: 'features',
      message: chalk.green(`\n${symbols.branch}> Select additional features:`),
      choices: stackOptions.features
    },
    {
      type: 'list',
      name: 'cssFramework',
      message: chalk.green(`\n${symbols.branch}> Choose a CSS framework:`),
      choices: stackOptions.cssFramework,
      when: (answers) => answers.frontend.length > 0
    },
    {
      type: 'list',
      name: 'packageManager',
      message: chalk.green(`\n${symbols.branch}> Choose a package manager:`),
      choices: stackOptions.packageManager
    },
    {
      type: 'checkbox',
      name: 'additionalOptions',
      message: chalk.green(`\n${symbols.branch}> Additional setup options:`),
      choices: stackOptions.additionalOptions
    },
    {
      type: 'input',
      name: 'frontendDir',
      message: chalk.green(`\n${symbols.branch}> Frontend directory name:`),
      default: 'client',
      when: (answers) => answers.frontend.length > 0
    },
    {
      type: 'input',
      name: 'backendDir',
      message: chalk.green(`\n${symbols.branch}> Backend directory name:`),
      default: 'server',
      when: (answers) => answers.backend.length > 0
    }
  ]);

  const config = {
    ...answers,
    initGit: answers.additionalOptions.includes('initGit'),
    createEnvFiles: answers.additionalOptions.includes('createEnvFiles'),
    generateReadme: answers.additionalOptions.includes('generateReadme'),
    eslint: answers.additionalOptions.includes('eslint'),
    prettier: answers.additionalOptions.includes('prettier'),
    cicd: answers.additionalOptions.includes('cicd'),
    projectPath: path.resolve(process.cwd(), answers.projectName),
    frontend: answers.frontend[0] || '',
    backend: answers.backend[0] || '',
    database: answers.database[0] || '',
    // Add features array for backward compatibility with existing templates
    features: [
      ...answers.features,
      ...(answers.frontend[0] ? [answers.frontend[0]] : []),
      ...(answers.backend[0] ? [answers.backend[0]] : []),
      ...(answers.database[0] ? [answers.database[0]] : [])
    ]
  };

  delete config.additionalOptions;
  return config;
}

async function generateCICDConfig(config) {
  const githubWorkflowDir = path.join(config.projectPath, '.github', 'workflows');
  await fs.mkdir(githubWorkflowDir, { recursive: true });

  const workflow = `
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Dependencies
      run: ${config.packageManager} install

    ${config.features.includes('testing') ? `
    - name: Run Tests
      run: ${config.packageManager} run test
    ` : ''}

    - name: Build
      run: ${config.packageManager} run build
  `;

  await fs.writeFile(path.join(githubWorkflowDir, 'ci.yml'), workflow.trim());
}

async function generateLintingConfigs(config) {
  const eslintConfig = {
    env: {
      browser: config.frontend.length > 0,
      node: config.backend.length > 0,
      es2021: true
    },
    extends: [
      'eslint:recommended',
      config.frontend === 'react' ? 'plugin:react/recommended' : '',
      config.features.includes('typescript') ? 'plugin:@typescript-eslint/recommended' : ''
    ].filter(Boolean),
    parser: config.features.includes('typescript') ? '@typescript-eslint/parser' : undefined,
    plugins: [
      config.frontend === 'react' ? 'react' : '',
      config.features.includes('typescript') ? '@typescript-eslint' : ''
    ].filter(Boolean),
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  };

  const prettierConfig = {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    bracketSpacing: true
  };

  if (config.eslint) {
    await fs.writeFile(
      path.join(config.projectPath, '.eslintrc.json'),
      JSON.stringify(eslintConfig, null, 2)
    );
    await fs.writeFile(
      path.join(config.projectPath, '.eslintignore'),
      'node_modules/\ndist/\nbuild/\n.env\n'
    );
  }

  if (config.prettier) {
    await fs.writeFile(
      path.join(config.projectPath, '.prettierrc'),
      JSON.stringify(prettierConfig, null, 2)
    );
    await fs.writeFile(
      path.join(config.projectPath, '.prettierignore'),
      'node_modules/\ndist/\nbuild/\n.env\n'
    );
  }
}

function showCompletionMessage(config) {
  const featuresTable = new Table({
    head: [chalk.cyan('Feature'), chalk.cyan('Included')],
    colWidths: [30, 15]
  });

  const featureMap = [
    ['Frontend', config.frontend || 'None'],
    ['Backend', config.backend || 'None'],
    ['Database', config.database || 'None'],
    ['Authentication', config.features.includes('auth') ? '✅' : '❌'],
    ['File Upload', config.features.includes('upload') ? '✅' : '❌'],
    ['Email Service', config.features.includes('email') ? '✅' : '❌'],
    ['Docker', config.features.includes('docker') ? '✅' : '❌'],
    ['TypeScript', config.features.includes('typescript') ? '✅' : '❌'],
    ['Testing', config.features.includes('testing') ? '✅' : '❌'],
    ['ESLint', config.eslint ? '✅' : '❌'],
    ['Prettier', config.prettier ? '✅' : '❌'],
    ['CI/CD', config.cicd ? '✅' : '❌']
  ];

  featureMap.forEach(([label, value]) => {
    featuresTable.push([label, value]);
  });

  const projectStructure = [
    chalk.gray(`${config.projectName}/`),
    config.frontend === 'react' ? chalk.gray(`├── ${config.frontendDir}/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx`) : '',
    config.frontend === 'vue' ? chalk.gray(`├── ${config.frontendDir}/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── views/
│       └── App.vue`) : '',
    config.frontend === 'angular' ? chalk.gray(`├── ${config.frontendDir}/
│   ├── src/
│   │   ├── app/
│   │   └── main.ts`) : '',
    config.backend === 'express' ? chalk.gray(`├── ${config.backendDir}/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── index.js`) : '',
    config.backend === 'nestjs' ? chalk.gray(`├── ${config.backendDir}/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── main.ts`) : '',
    chalk.gray('├── package.json'),
    chalk.gray('└── README.md'),
    config.cicd ? chalk.gray('├── .github/workflows/ci.yml') : '',
    config.eslint ? chalk.gray('├── .eslintrc.json') : '',
    config.prettier ? chalk.gray('├── .prettierrc') : ''
  ].filter(Boolean).join('\n');

  const nextSteps = [
    `   cd ${chalk.yellow(config.projectName)}`,
    config.frontend && config.backend
      ? `   ${chalk.yellow(config.packageManager)} run dev          # Start both frontend and backend`
      : config.frontend
      ? `   ${chalk.yellow(config.packageManager)} run dev          # Start frontend`
      : `   ${chalk.yellow(config.packageManager)} run dev          # Start backend`
  ];

  if (config.database) {
    nextSteps.push(chalk.yellow('\n📄 Don\'t forget to:'));
    if (config.database === 'mongodb') {
      nextSteps.push('   • Set up your MongoDB connection string in .env');
      nextSteps.push('   • Install MongoDB locally or use MongoDB Atlas');
    }
    if (config.database === 'postgresql') {
      nextSteps.push('   • Set up your PostgreSQL connection string in .env');
      nextSteps.push('   • Install PostgreSQL locally or use a cloud provider');
    }
    if (config.database === 'mysql') {
      nextSteps.push('   • Set up your MySQL connection string in .env');
      nextSteps.push('   • Install MySQL locally or use a cloud provider');
    }
  }

  const message = [
    chalk.green.bold('✅ All done! Your project stack is ready to roll 🚀'),
    chalk.cyan('📁 Project structure:'),
    projectStructure,
    '',
    chalk.magenta('🧩 Features selected:'),
    featuresTable.toString(),
    '',
    chalk.cyan('🚀 Next steps:'),
    ...nextSteps,
    chalk.gray('\nHappy coding! 🎉')
  ].join('\n');

  console.log(boxen(message, {
    padding: 1,
    borderStyle: 'round',
    borderColor: 'green',
    margin: 1
  }));
}

module.exports = { setupMernProject };
