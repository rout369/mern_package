const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function generateNestjsTemplates(config) {
  const { projectPath, backendDir, features, database, createEnvFiles } = config;
  const serverPath = path.join(projectPath, backendDir);
  const isTypeScript = features.includes('typescript');
  const ext = isTypeScript ? 'ts' : 'js';

  console.log(chalk.gray(`🔍 Generating NestJS-compatible boilerplate in ${serverPath}`));

  try {
    // src/index.[js|ts]
    const indexContent = isTypeScript
      ? `import express from 'express';
import cors from 'cors';
${features.includes('auth') ? `import jwt from 'jsonwebtoken';` : ''}
${features.includes('upload') ? `import multer from 'multer';` : ''}
${database === 'postgresql' ? `import { createConnection } from 'typeorm';` : ''}

const app = express();
app.use(cors());
app.use(express.json());
${features.includes('upload') ? `const upload = multer({ dest: 'uploads/' });` : ''}

${database === 'postgresql' ? `async function connectDb() {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'dbname',
      synchronize: true
    });
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
connectDb();` : ''}

${features.includes('auth') ? `app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Mock user validation
  if (email === 'test@example.com' && password === 'password') {
    const token = jwt.sign({ email, id: 1 }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, 'secretKey');
    res.json({ id: payload.id, email: payload.email, name: 'Test User' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});` : ''}

${features.includes('upload') ? `app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});` : ''}

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});`
      : `const express = require('express');
const cors = require('cors');
${features.includes('auth') ? `const jwt = require('jsonwebtoken');` : ''}
${features.includes('upload') ? `const multer = require('multer');` : ''}
${database === 'postgresql' ? `const { createConnection } = require('typeorm');` : ''}

const app = express();
app.use(cors());
app.use(express.json());
${features.includes('upload') ? `const upload = multer({ dest: 'uploads/' });` : ''}

${database === 'postgresql' ? `async function connectDb() {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'dbname',
      synchronize: true
    });
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
connectDb();` : ''}

${features.includes('auth') ? `app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Mock user validation
  if (email === 'test@example.com' && password === 'password') {
    const token = jwt.sign({ email, id: 1 }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, 'secretKey');
    res.json({ id: payload.id, email: payload.email, name: 'Test User' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});` : ''}

${features.includes('upload') ? `app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});` : ''}

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});`;
    await fs.writeFile(path.join(serverPath, `src/index.${ext}`), indexContent);

    // .env
    if (createEnvFiles) {
      const envContent = `PORT=3000
${database === 'postgresql' ? `DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=dbname` : ''}`;
      await fs.writeFile(path.join(serverPath, '.env'), envContent);
    }

    console.log(chalk.green(`✓ NestJS-compatible boilerplate generated in ${serverPath}`));
  } catch (error) {
    console.error(chalk.red(`Failed to generate NestJS boilerplate: ${error.message}`));
    throw error;
  }
}

module.exports = { generateNestjsTemplates };