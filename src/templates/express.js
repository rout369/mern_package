// const fs = require('fs-extra');
// const path = require('path');

// async function generateExpressTemplates(config) {
//   const { projectPath, features } = config;
//   const serverPath = path.join(projectPath, 'server');
//   const isTypeScript = features.includes('typescript');
//   const fileExt = isTypeScript ? 'ts' : 'js';

//   // Generate package.json for server
//   const serverPackageJson = {
//     name: `${config.projectName}-server`,
//     version: "1.0.0",
//     main: `src/index.${fileExt}`,
//     scripts: {
//       start: `node src/index.${fileExt}`,
//       dev: `nodemon src/index.${fileExt}`
//     }
//   };

//   if (features.includes('testing')) {
//     serverPackageJson.scripts.test = "jest";
//   }

//   if (isTypeScript) {
//     serverPackageJson.scripts.build = "tsc";
//     serverPackageJson.scripts.start = "node dist/index.js";
//     serverPackageJson.scripts.dev = "nodemon --exec ts-node src/index.ts";
//   }

//   await fs.writeFile(
//     path.join(serverPath, 'package.json'),
//     JSON.stringify(serverPackageJson, null, 2)
//   );

//   // Generate main server file
//   const serverIndex = generateServerIndex(config);
//   await fs.writeFile(path.join(serverPath, `src/index.${fileExt}`), serverIndex);

//   // Generate routes
//   await generateRoutes(config);

//   // Generate controllers
//   await generateControllers(config);

//   // Generate models if MongoDB is included
//   if (features.includes('mongodb')) {
//     await generateModels(config);
//   }

//   // Generate middleware
//   await generateMiddleware(config);

//   // Generate TypeScript config if needed
//   if (isTypeScript) {
//     await generateServerTypeScriptConfig(config);
//   }

//   // Generate nodemon config
//   await generateNodemonConfig(config);
// }

// function generateServerIndex(config) {
//   const { features } = config;
//   const isTypeScript = features.includes('typescript');
//   const fileExt = isTypeScript ? 'ts' : 'js';

//   let imports = `const express = require('express')
// const cors = require('cors')
// require('dotenv').config()`;

//   if (isTypeScript) {
//     imports = `import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'

// dotenv.config()`;
//   }

//   if (features.includes('mongodb')) {
//     imports += isTypeScript 
//       ? `\nimport mongoose from 'mongoose'`
//       : `\nconst mongoose = require('mongoose')`;
//   }

//   let serverCode = `${imports}

// const app = express()
// const PORT = process.env.PORT || 5000

// // Middleware
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// `;

//   if (features.includes('mongodb')) {
//     serverCode += `// Database connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${config.projectName}')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err))

// `;
//   }

//   serverCode += `// Routes
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     message: 'Server is running!', 
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   })
// })

// `;

//   if (features.includes('auth')) {
//     serverCode += `// Auth routes
// app.use('/api/auth', require('./routes/auth${isTypeScript ? '.ts' : '.js'}'))

// `;
//   }

//   serverCode += `// API routes
// app.use('/api', require('./routes/index${isTypeScript ? '.ts' : '.js'}'))

// // Error handling middleware
// app.use((err${isTypeScript ? ': any' : ''}, req${isTypeScript ? ': express.Request' : ''}, res${isTypeScript ? ': express.Response' : ''}, next${isTypeScript ? ': express.NextFunction' : ''}) => {
//   console.error(err.stack)
//   res.status(500).json({ 
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   })
// })

// // 404 handler
// app.use('*', (req${isTypeScript ? ': express.Request' : ''}, res${isTypeScript ? ': express.Response' : ''}) => {
//   res.status(404).json({ message: 'Route not found' })
// })

// app.listen(PORT, () => {
//   console.log(\`Server running on port \${PORT}\`)
//   console.log(\`Health check: http://localhost:\${PORT}/api/health\`)
// })

// ${isTypeScript ? 'export default app' : 'module.exports = app'}
// `;

//   return serverCode;
// }

// async function generateRoutes(config) {
//   const serverPath = path.join(config.projectPath, 'server');
//   const isTypeScript = config.features.includes('typescript');
//   const fileExt = isTypeScript ? 'ts' : 'js';

//   // Main routes index
//   const routesIndex = isTypeScript 
//     ? `import express from 'express'
// const router = express.Router()

// // API routes will be added here
// router.get('/', (req, res) => {
//   res.json({ message: 'API is working!' })
// })

// export default router`
//     : `const express = require('express')
// const router = express.Router()

// // API routes will be added here
// router.get('/', (req, res) => {
//   res.json({ message: 'API is working!' })
// })

// module.exports = router`;

//   await fs.writeFile(path.join(serverPath, `src/routes/index.${fileExt}`), routesIndex);

//   // Auth routes if authentication is enabled
//   if (config.features.includes('auth')) {
//     const authRoutes = generateAuthRoutes(config);
//     await fs.writeFile(path.join(serverPath, `src/routes/auth.${fileExt}`), authRoutes);
//   }
// }

// function generateAuthRoutes(config) {
//   const isTypeScript = config.features.includes('typescript');

//   return isTypeScript 
//     ? `import express from 'express'
// import { register, login, getProfile } from '../controllers/auth'
// import { authenticate } from '../middleware/auth'

// const router = express.Router()

// router.post('/register', register)
// router.post('/login', login)
// router.get('/profile', authenticate, getProfile)

// export default router`
//     : `const express = require('express')
// const { register, login, getProfile } = require('../controllers/auth')
// const { authenticate } = require('../middleware/auth')

// const router = express.Router()

// router.post('/register', register)
// router.post('/login', login)
// router.get('/profile', authenticate, getProfile)

// module.exports = router`;
// }

// async function generateControllers(config) {
//   const serverPath = path.join(config.projectPath, 'server');
//   const isTypeScript = config.features.includes('typescript');
//   const fileExt = isTypeScript ? 'ts' : 'js';

//   if (config.features.includes('auth')) {
//     const authController = generateAuthController(config);
//     await fs.writeFile(path.join(serverPath, `src/controllers/auth.${fileExt}`), authController);
//   }
// }

// function generateAuthController(config) {
//   const isTypeScript = config.features.includes('typescript');
//   const hasDB = config.features.includes('mongodb');

//   let imports = isTypeScript 
//     ? `import { Request, Response } from 'express'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'`
//     : `const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')`;

//   if (hasDB) {
//     imports += isTypeScript 
//       ? `\nimport User from '../models/User'`
//       : `\nconst User = require('../models/User')`;
//   }

//   const typeAnnotations = isTypeScript ? ': Request, res: Response' : ', res';

//   return `${imports}

// ${isTypeScript ? 'export ' : ''}const register = async (req${typeAnnotations}) => {
//   try {
//     const { email, password, name } = req.body

//     ${hasDB ? `
//     // Check if user already exists
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' })
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword
//     })

//     await user.save()

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET || 'fallback-secret',
//       { expiresIn: '7d' }
//     )

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     })` : `
//     // Mock registration (replace with actual database logic)
//     const hashedPassword = await bcrypt.hash(password, 10)
    
//     const token = jwt.sign(
//       { email, name },
//       process.env.JWT_SECRET || 'fallback-secret',
//       { expiresIn: '7d' }
//     )

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: { email, name }
//     })`}
//   } catch (error) {
//     console.error('Registration error:', error)
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// ${isTypeScript ? 'export ' : ''}const login = async (req${typeAnnotations}) => {
//   try {
//     const { email, password } = req.body

//     ${hasDB ? `
//     // Find user
//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' })
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' })
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET || 'fallback-secret',
//       { expiresIn: '7d' }
//     )

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     })` : `
//     // Mock login (replace with actual database logic)
//     if (email === 'demo@example.com' && password === 'password') {
//       const token = jwt.sign(
//         { email },
//         process.env.JWT_SECRET || 'fallback-secret',
//         { expiresIn: '7d' }
//       )

//       res.json({
//         message: 'Login successful',
//         token,
//         user: { email }
//       })
//     } else {
//       res.status(400).json({ message: 'Invalid credentials' })
//     }`}
//   } catch (error) {
//     console.error('Login error:', error)
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// ${isTypeScript ? 'export ' : ''}const getProfile = async (req${typeAnnotations}) => {
//   try {
//     ${hasDB ? `
//     const user = await User.findById(req.user.userId).select('-password')
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     res.json({ user })` : `
//     // Mock profile (replace with actual database logic)
//     res.json({
//       user: {
//         email: req.user.email,
//         name: 'Demo User'
//       }
//     })`}
//   } catch (error) {
//     console.error('Profile error:', error)
//     res.status(500).json({ message: 'Server error' })
//   }
// }

// ${!isTypeScript ? `module.exports = {
//   register,
//   login,
//   getProfile
// }` : ''}
// `;
// }

// async function generateModels(config) {
//   const serverPath = path.join(config.projectPath, 'server');
//   const isTypeScript = config.features.includes('typescript');
//   const fileExt = isTypeScript ? 'ts' : 'js';

//   if (config.features.includes('auth')) {
//     const userModel = generateUserModel(config);
//     await fs.writeFile(path.join(serverPath, `src/models/User.${fileExt}`), userModel);
//   }
// }

// function generateUserModel(config) {
//   const isTypeScript = config.features.includes('typescript');

//   let model = isTypeScript 
//     ? `import mongoose, { Document, Schema } from 'mongoose'

// interface IUser extends Document {
//   name: string
//   email: string
//   password: string
//   createdAt: Date
//   updatedAt: Date
// }

// const UserSchema: Schema = new Schema({`
//     : `const mongoose = require('mongoose')

// const UserSchema = new mongoose.Schema({`;

//   model += `
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//     trim: true,
//     maxlength: [50, 'Name cannot be more than 50 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     match: [
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//       'Please provide a valid email'
//     ]
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters']
//   }
// }, {
//   timestamps: true
// })

// `;

//   model += isTypeScript 
//     ? `const User = mongoose.model<IUser>('User', UserSchema)
// export default User`
//     : `module.exports = mongoose.model('User', UserSchema)`;

//   return model;
// }

// async function generateMiddleware(config) {
//   const serverPath = path.join(config.projectPath, 'server');
//   const isTypeScript = config.features.includes('typescript');
//   const fileExt = isTypeScript ? 'ts' : 'js';

//   if (config.features.includes('auth')) {
//     const authMiddleware = generateAuthMiddleware(config);
//     await fs.writeFile(path.join(serverPath, `src/middleware/auth.${fileExt}`), authMiddleware);
//   }
// }

// function generateAuthMiddleware(config) {
//   const isTypeScript = config.features.includes('typescript');

//   return isTypeScript 
//     ? `import { Request, Response, NextFunction } from 'express'
// import jwt from 'jsonwebtoken'

// interface AuthRequest extends Request {
//   user?: any
// }

// export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '')

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
//     req.user = decoded
//     next()
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' })
//   }
// }`
//     : `const jwt = require('jsonwebtoken')

// const authenticate = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '')

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
//     req.user = decoded
//     next()
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' })
//   }
// }

// module.exports = { authenticate }`;
// }

// async function generateServerTypeScriptConfig(config) {
//   const serverPath = path.join(config.projectPath, 'server');

//   const tsConfig = {
//     compilerOptions: {
//       target: "ES2020",
//       module: "commonjs",
//       lib: ["ES2020"],
//       outDir: "./dist",
//       rootDir: "./src",
//       strict: true,
//       esModuleInterop: true,
//       skipLibCheck: true,
//       forceConsistentCasingInFileNames: true,
//       resolveJsonModule: true,
//       declaration: true,
//       declarationMap: true,
//       sourceMap: true
//     },
//     include: ["src/**/*"],
//     exclude: ["node_modules", "dist"]
//   };

//   await fs.writeFile(
//     path.join(serverPath, 'tsconfig.json'),
//     JSON.stringify(tsConfig, null, 2)
//   );
// }

// async function generateNodemonConfig(config) {
//   const serverPath = path.join(config.projectPath, 'server');
//   const isTypeScript = config.features.includes('typescript');

//   const nodemonConfig = {
//     watch: ["src"],
//     ext: isTypeScript ? "ts" : "js",
//     ignore: ["src/**/*.test.*"],
//     exec: isTypeScript ? "ts-node src/index.ts" : "node src/index.js",
//     env: {
//       NODE_ENV: "development"
//     }
//   };

//   await fs.writeFile(
//     path.join(serverPath, 'nodemon.json'),
//     JSON.stringify(nodemonConfig, null, 2)
//   );
// }

// module.exports = { generateExpressTemplates };


const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function generateExpressTemplates(config) {
  const { projectPath, backendDir, features, database, projectName, createEnvFiles } = config;
  const serverPath = path.join(projectPath, backendDir);
  const isTypeScript = features.includes('typescript');
  const fileExt = isTypeScript ? 'ts' : 'js';

  console.log(chalk.gray(`🔍 Generating Express-compatible boilerplate in ${serverPath}`));

  try {
    // Ensure directories exist
    await fs.ensureDir(path.join(serverPath, 'src', 'routes'));
    await fs.ensureDir(path.join(serverPath, 'src', 'controllers'));
    await fs.ensureDir(path.join(serverPath, 'src', 'middleware'));
    if (database) await fs.ensureDir(path.join(serverPath, 'src', 'models'));

    // Generate package.json for server
    const serverPackageJson = {
      name: `${projectName}-server`,
      version: "1.0.0",
      main: `src/index.${fileExt}`,
      scripts: {
        start: `node src/index.${fileExt}`,
        dev: `nodemon src/index.${fileExt}`
      }
    };

    if (features.includes('testing')) {
      serverPackageJson.scripts.test = "jest";
    }

    if (isTypeScript) {
      serverPackageJson.scripts.build = "tsc";
      serverPackageJson.scripts.start = "node dist/index.js";
      serverPackageJson.scripts.dev = "nodemon --exec ts-node src/index.ts";
    }

    await fs.writeFile(
      path.join(serverPath, 'package.json'),
      JSON.stringify(serverPackageJson, null, 2)
    );

    // Generate main server file
    const serverIndex = isTypeScript
      ? `import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
${database ? `import { createConnection } from 'typeorm';` : ''}
${features.includes('auth') ? `import jwt from 'jsonwebtoken';` : ''}
${features.includes('upload') ? `import multer from 'multer';` : ''}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
${features.includes('upload') ? `const upload = multer({ dest: 'uploads/' });` : ''}

${database === 'postgresql' || database === 'mysql' ? `async function connectDb() {
  try {
    await createConnection({
      type: '${database}',
      host: process.env.DB_HOST || 'localhost',
      port: ${database === 'postgresql' ? '5432' : '3306'},
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || '${projectName}',
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development'
    });
    console.log('Connected to ${database === 'postgresql' ? 'PostgreSQL' : 'MySQL'}');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
connectDb();` : database === 'mongodb' ? `import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${projectName}')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));` : ''}

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

${features.includes('auth') ? `import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);` : ''}

${features.includes('upload') ? `app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});` : ''}

import apiRoutes from './routes/index';
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
  console.log(\`Health check: http://localhost:\${PORT}/api/health\`);
});

export default app;`
      : `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
${database ? `const { createConnection } = require('typeorm');` : ''}
${features.includes('auth') ? `const jwt = require('jsonwebtoken');` : ''}
${features.includes('upload') ? `const multer = require('multer');` : ''}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
${features.includes('upload') ? `const upload = multer({ dest: 'uploads/' });` : ''}

${database === 'postgresql' || database === 'mysql' ? `async function connectDb() {
  try {
    await createConnection({
      type: '${database}',
      host: process.env.DB_HOST || 'localhost',
      port: ${database === 'postgresql' ? '5432' : '3306'},
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || '${projectName}',
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development'
    });
    console.log('Connected to ${database === 'postgresql' ? 'PostgreSQL' : 'MySQL'}');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
connectDb();` : database === 'mongodb' ? `const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/${projectName}')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));` : ''}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

${features.includes('auth') ? `const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);` : ''}

${features.includes('upload') ? `app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});` : ''}

const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
  console.log(\`Health check: http://localhost:\${PORT}/api/health\`);
});

module.exports = app;`;

    await fs.writeFile(path.join(serverPath, `src/index.${fileExt}`), serverIndex);

    // Generate routes
    const routesIndex = isTypeScript
      ? `import express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'API is working!' });
});

export default router;`
      : `const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

module.exports = router;`;

    await fs.writeFile(path.join(serverPath, `src/routes/index.${fileExt}`), routesIndex);

    if (features.includes('auth')) {
      const authRoutes = isTypeScript
        ? `import express from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;`
        : `const express = require('express');
const { register, login, getProfile } = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

module.exports = router;`;

      await fs.writeFile(path.join(serverPath, `src/routes/auth.${fileExt}`), authRoutes);
    }

    // Generate controllers
    if (features.includes('auth')) {
      const authController = isTypeScript
        ? `import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
${database ? `import User from '../models/User';` : ''}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    ${database ? `const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });` : `const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign(
      { email, name },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { email, name }
    });`}
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    ${database ? `const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });` : `if (email === 'test@example.com' && password === 'password') {
      const token = jwt.sign(
        { email, id: 1 },
        process.env.JWT_SECRET || 'secretKey',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: 1, email, name: 'Test User' }
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }`}
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    ${database ? `const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email } });` : `res.json({
      user: { id: req.user.id, email: req.user.email, name: 'Test User' }
    });`}
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};`
        : `const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
${database ? `const User = require('../models/User');` : ''}

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    ${database ? `const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });` : `const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign(
      { email, name },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { email, name }
    });`}
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    ${database ? `const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });` : `if (email === 'test@example.com' && password === 'password') {
      const token = jwt.sign(
        { email, id: 1 },
        process.env.JWT_SECRET || 'secretKey',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: 1, email, name: 'Test User' }
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }`}
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    ${database ? `const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email } });` : `res.json({
      user: { id: req.user.id, email: req.user.email, name: 'Test User' }
    });`}
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getProfile };`;

      await fs.writeFile(path.join(serverPath, `src/controllers/auth.${fileExt}`), authController);
    }

    // Generate models
    if (database) {
      const userModel = isTypeScript
        ? database === 'mongodb'
          ? `import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;`
          : `import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}`
        : database === 'mongodb'
        ? `const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);`
        : `const { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } = require('typeorm');

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ length: 50 })
  name;

  @Column({ unique: true })
  email;

  @Column()
  password;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}

module.exports = User;`;

      await fs.writeFile(path.join(serverPath, `src/models/User.${fileExt}`), userModel);
    }

    // Generate middleware
    if (features.includes('auth')) {
      const authMiddleware = isTypeScript
        ? `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};`
        : `const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authenticate };`;

      await fs.writeFile(path.join(serverPath, `src/middleware/auth.${fileExt}`), authMiddleware);
    }

    // Generate TypeScript config if needed
    if (isTypeScript) {
      const tsConfig = {
        compilerOptions: {
          target: "ES2020",
          module: "commonjs",
          lib: ["ES2020"],
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          declaration: true,
          declarationMap: true,
          sourceMap: true
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist"]
      };

      await fs.writeFile(
        path.join(serverPath, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, 2)
      );
    }

    // Generate nodemon config
    const nodemonConfig = {
      watch: ["src"],
      ext: isTypeScript ? "ts" : "js",
      ignore: ["src/**/*.test.*"],
      exec: isTypeScript ? "ts-node src/index.ts" : "node src/index.js",
      env: {
        NODE_ENV: "development"
      }
    };

    await fs.writeFile(
      path.join(serverPath, 'nodemon.json'),
      JSON.stringify(nodemonConfig, null, 2)
    );

    console.log(chalk.green(`✓ Express-compatible boilerplate generated in ${serverPath}`));
  } catch (error) {
    console.error(chalk.red(`Failed to generate Express boilerplate: ${error.message}`));
    throw error;
  }
}

module.exports = { generateExpressTemplates };
