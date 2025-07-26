// const inquirer = require('inquirer').default || require('inquirer');
// const chalk = require('chalk');
// const ora = require('ora');
// const path = require('path');
// const fs = require('fs/promises');
// const { createProjectStructure } = require('./project-structure');
// const { installDependencies } = require('./dependencies');
// const { generateTemplates } = require('./templates');

// async function setupMernProject() {
//   console.log(chalk.cyan.bold('\n🚀 Welcome to MERN Setup CLI\n'));
//   console.log(chalk.gray('Set up your entire MERN stack with just one command!\n'));

//   // Get project configuration
//   const config = await getProjectConfig();

//   const spinner = ora('Creating project directory...').start();

//   try {
//     // Create the root folder
//     await fs.mkdir(config.projectPath, { recursive: true });

//     // Move into that folder
//     process.chdir(config.projectPath);
//     spinner.succeed('Project directory created');

//     // Create project structure (e.g., client/, server/)
//     spinner.start('Creating project structure...');
//     await createProjectStructure(config);  // <<== CALL IT HERE
//     spinner.succeed('Project structure created');

//     // Generate boilerplate files
//     spinner.start('Generating boilerplate code...');
//     await generateTemplates(config);
//     spinner.succeed('Boilerplate code generated');

//     // Install dependencies
//     spinner.start('Installing dependencies...');
//     await installDependencies(config);
//     spinner.succeed('Dependencies installed');

//     // Final message
//     showCompletionMessage(config);

//   } catch (err) {
//     spinner.fail('Setup failed: ' + err.message);
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
//       validate: (input) => {
//         if (input.trim().length === 0) {
//           return 'Project name is required';
//         }
//         return true;
//       }
//     },
//     {
//       type: 'checkbox',
//       name: 'features',
//       message: 'Select the features you want to include (use ↑↓ to navigate, space to select, enter to confirm):',
//       choices: [
//         { name: '⚛️  Frontend (React)', value: 'react', checked: true },
//         { name: '🚀 Backend (Express + Node.js)', value: 'express', checked: true },
//         { name: '🍃 Database (MongoDB)', value: 'mongodb', checked: true },
//         { name: '📘 TypeScript Support', value: 'typescript', checked: false },
//         { name: '🔐 Authentication (JWT)', value: 'auth', checked: false },
//         { name: '📁 File Upload Support', value: 'upload', checked: false },
//         { name: '📧 Email Service', value: 'email', checked: false },
//         { name: '🧪 Testing Setup (Jest/Vitest)', value: 'testing', checked: false },
//         { name: '🐳 Docker Configuration', value: 'docker', checked: false }
//       ]
//     },
//     {
//       type: 'list',
//       name: 'cssFramework',
//       message: 'Choose a CSS framework (use ↑↓ to navigate, enter to select):',
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
//       message: 'Choose a package manager (use ↑↓ to navigate, enter to select):',
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
//       message: 'Select additional setup options (use ↑↓ to navigate, space to select, enter to confirm):',
//       choices: [
//         { name: '🔧 Initialize Git repository', value: 'initGit', checked: true },
//         { name: '⚙️  Create environment configuration files', value: 'createEnvFiles', checked: true },
//         { name: '📚 Generate comprehensive README', value: 'generateReadme', checked: true },
//         { name: '🔍 Add ESLint configuration', value: 'eslint', checked: false },
//         { name: '💄 Add Prettier configuration', value: 'prettier', checked: false }
//       ]
//     },
//   ]);

//   // Convert additionalOptions array to individual boolean properties
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
//   console.log(chalk.green.bold('\n✅ MERN project setup completed successfully!\n'));

//   console.log(chalk.cyan('📁 Project structure:'));
//   console.log(`   ${config.projectName}/`);
//   if (config.features.includes('react')) {
//     console.log('   ├── client/          (React frontend)');
//   }
//   if (config.features.includes('express')) {
//     console.log('   ├── server/          (Express backend)');
//   }
//   console.log('   ├── package.json');
//   console.log('   └── README.md\n');

//   console.log(chalk.cyan('🚀 Next steps:'));
//   console.log(`   cd ${config.projectName}`);

//   if (config.features.includes('react') && config.features.includes('express')) {
//     console.log(`   ${config.packageManager} run dev          # Start both frontend and backend`);
//   } else if (config.features.includes('react')) {
//     console.log(`   ${config.packageManager} run dev          # Start frontend`);
//   } else if (config.features.includes('express')) {
//     console.log(`   ${config.packageManager} run dev          # Start backend`);
//   }

//   if (config.features.includes('mongodb')) {
//     console.log('\n' + chalk.yellow('📄 Don\'t forget to:'));
//     console.log('   • Set up your MongoDB connection string in .env');
//     console.log('   • Install MongoDB locally or use MongoDB Atlas');
//   }

//   console.log(chalk.gray('\nHappy coding! 🎉\n'));
// }

// module.exports = { setupMernProject };



// // Enhanced CLI UI for MERN Setup
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
const runSetup = require('../utils/banner');

const symbols = {
  branch: chalk.gray('├──'),
  last: chalk.gray('└──'),
  pipe: chalk.gray('│'),
  pointer: chalk.green('➤'),
};

async function setupMernProject() {
  showBanner();

  const spin = ora({
    text: chalk.cyan('🔧 Setting up the wizard, please wait...'),
    spinner: 'arc',
    color: 'cyan'
  }).start();

  await new Promise(resolve => setTimeout(resolve, 6000));

  spin.succeed(chalk.green('✅ Wizard ready!\n'));
  const config = await getProjectConfig();
  const spinner = ora('Creating project directory...').start();

  try {
    await fs.mkdir(config.projectPath, { recursive: true });
    process.chdir(config.projectPath);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Project directory created')}`);

    spinner.start('Creating project structure...');
    await createProjectStructure(config);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Project structure created')}`);

    spinner.start('Generating boilerplate code...');
    await generateTemplates(config);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Boilerplate code generated')}`);

    spinner.start('Installing dependencies...');
    await installDependencies(config);
    spinner.succeed(`${logSymbols.success} ${chalk.green('Dependencies installed')}`);

    showCompletionMessage(config);
  } catch (err) {
    spinner.fail(`${logSymbols.error} ${chalk.red('Setup failed:')} ${err.message}`);
    console.error(chalk.red('❌ Error details:'), err);
  }
}

async function getProjectConfig() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: chalk.green(`? What is your project name? ${symbols.pointer}`),
      default: 'my-mern-app',
      validate: (input) => input.trim().length > 0 || 'Project name is required'
    },
    {
      type: 'checkbox',
      name: 'features',
      message: chalk.green(`\n${symbols.branch}> Select features:`),
      choices: [
        { name: `${symbols.pipe}   ╭─⚛️  Frontend (React)`, value: 'react', checked: true },
        { name: `${symbols.pipe}   ├─🚀 Backend (Express)`, value: 'express', checked: true },
        { name: `${symbols.pipe}   ├─🍃 Database (MongoDB)`, value: 'mongodb', checked: true },
        { name: `${symbols.pipe}   ├─🔐 Authentication (JWT)`, value: 'auth' },
        { name: `${symbols.pipe}   ├─📁 File Upload Support`, value: 'upload' },
        { name: `${symbols.pipe}   ├─📧 Email Service`, value: 'email' },
        { name: `${symbols.pipe}   ├─🧪 Testing Setup (Jest/Vitest)`, value: 'testing' },
        { name: `${symbols.pipe}   ├─🐳 Docker Configuration`, value: 'docker' },
        { name: `${symbols.pipe}   └─📘 TypeScript Support`, value: 'typescript' },
      ]
    },
    {
      type: 'list',
      name: 'cssFramework',
      message: chalk.green(`\n${symbols.branch}> Choose a CSS framework:`),
      choices: [
        { name: `${symbols.pipe}   ├─🎨 Tailwind CSS`, value: 'tailwind' },
        { name: `${symbols.pipe}   ├─🅱️  Bootstrap`, value: 'bootstrap' },
        { name: `${symbols.pipe}   ├─🎭 Material-UI (MUI)`, value: 'mui' },
        { name: `${symbols.pipe}   ├─💅 Styled Components`, value: 'styled' },
        { name: `${symbols.pipe}   └─📄 Plain CSS`, value: 'plain' }
      ],
      when: (answers) => answers.features.includes('react')
    },
    {
      type: 'list',
      name: 'packageManager',
      message: chalk.green(`\n${symbols.branch}> Choose a package manager:`),
      choices: [
        { name: `${symbols.pipe}   ├─📦 npm`, value: 'npm' },
        { name: `${symbols.pipe}   ├─🧶 yarn`, value: 'yarn' },
        { name: `${symbols.pipe}   └─⚡ pnpm`, value: 'pnpm' }
      ],
      default: 'npm'
    },
    {
      type: 'checkbox',
      name: 'additionalOptions',
      message: chalk.green(`\n${symbols.branch}> Additional setup options:`),
      choices: [
        { name: `${symbols.pipe}   ├─🔧 Initialize Git`, value: 'initGit', checked: true },
        { name: `${symbols.pipe}   ├─⚙️  .env config`, value: 'createEnvFiles', checked: true },
        { name: `${symbols.pipe}   ├─📚 Generate README`, value: 'generateReadme', checked: true },
        { name: `${symbols.pipe}   ├─🔍 Add ESLint config`, value: 'eslint' },
        { name: `${symbols.pipe}   └─💄 Add Prettier config`, value: 'prettier' },
      ]
    }
  ]);

  const config = {
    ...answers,
    initGit: answers.additionalOptions.includes('initGit'),
    createEnvFiles: answers.additionalOptions.includes('createEnvFiles'),
    generateReadme: answers.additionalOptions.includes('generateReadme'),
    eslint: answers.additionalOptions.includes('eslint'),
    prettier: answers.additionalOptions.includes('prettier'),
    projectPath: path.resolve(process.cwd(), answers.projectName)
  };

  delete config.additionalOptions;
  return config;
}

function showCompletionMessage(config) {
  const featuresTable = new Table({
    head: ['Feature', 'Included'],
    colWidths: [30, 15]
  });

  const featureMap = [
    ['Frontend (React)', 'react'],
    ['Backend (Express)', 'express'],
    ['Database (MongoDB)', 'mongodb'],
    ['Authentication', 'auth'],
    ['File Upload', 'upload'],
    ['Email Service', 'email'],
    ['Docker', 'docker'],
    ['TypeScript', 'typescript'],
    ['Testing', 'testing']
  ];

  featureMap.forEach(([label, key]) => {
    featuresTable.push([label, config.features.includes(key) ? '✅' : '❌']);
  });

  // const message = [
  //   chalk.green.bold('✅ MERN project setup completed successfully!'),
  //   chalk.cyan('📁 Project structure:'),
  //   `   ${chalk.gray(config.projectName + '/')}`,
  //   config.features.includes('react') ? '   ├── client/          (React frontend)' : '',
  //   config.features.includes('express') ? '   ├── server/          (Express backend)' : '',
  //   '   ├── package.json',
  //   '   └── README.md',
  //   '',
  //   chalk.magenta('🧩 Features selected:'),
  //   featuresTable.toString(),
  //   '',
  //   chalk.cyan('🚀 Next steps:'),
  //   `   cd ${chalk.yellow(config.projectName)}`,
  //   config.features.includes('react') && config.features.includes('express')
  //     ? `   ${chalk.yellow(config.packageManager)} run dev          # Start both frontend and backend`
  //     : config.features.includes('react')
  //     ? `   ${chalk.yellow(config.packageManager)} run dev          # Start frontend`
  //     : `   ${chalk.yellow(config.packageManager)} run dev          # Start backend`,
  //   config.features.includes('mongodb')
  //     ? chalk.yellow('\n📄 Don\'t forget to:\n   • Set up your MongoDB connection string in .env\n   • Install MongoDB locally or use MongoDB Atlas')
  //     : '',
  //   chalk.gray('\nHappy coding! 🎉')
  // ].join('\n');

  // console.log(boxen(message, {
  //   padding: 1,
  //   borderStyle: 'round',
  //   borderColor: 'green',
  //   margin: 1
  // }));

  const message = [
  chalk.green.bold('✅ All done! Your MERNex stack is ready to roll 🚀'),
  chalk.cyan('📁 Project structure:'),
  chalk.gray(`${config.projectName}/`),
  config.features.includes('react') ? chalk.gray(`├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx`) : '',
  config.features.includes('express') ? chalk.gray(`├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── index.js`) : '',
  chalk.gray('├── package.json'),
  chalk.gray('└── README.md'),
  '',
  chalk.magenta('🧩 Features selected:'),
  featuresTable.toString(),
  '',
  chalk.cyan('🚀 Next steps:'),
  `   cd ${chalk.yellow(config.projectName)}`,
  config.features.includes('react') && config.features.includes('express')
    ? `   ${chalk.yellow(config.packageManager)} run dev          # Start both frontend and backend`
    : config.features.includes('react')
    ? `   ${chalk.yellow(config.packageManager)} run dev          # Start frontend`
    : `   ${chalk.yellow(config.packageManager)} run dev          # Start backend`,
  config.features.includes('mongodb')
    ? chalk.yellow('\n📄 Don\'t forget to:\n   • Set up your MongoDB connection string in .env\n   • Install MongoDB locally or use MongoDB Atlas')
    : '',
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
