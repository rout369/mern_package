const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function generateAngularTemplates(config) {
  const { projectPath, frontendDir, features, cssFramework, database, createEnvFiles } = config;
  const clientPath = path.join(projectPath, frontendDir);
  const isTypeScript = true; // Angular uses TypeScript by default
  const ext = 'ts';

  console.log(chalk.gray(`🔍 Generating Angular-compatible boilerplate in ${clientPath}`));

  try {
    // index.html
    const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.projectName}</title>
  <link rel="stylesheet" href="/src/style.css">
</head>
<body>
  <div id="app">
    <h1>Welcome to ${config.projectName}</h1>
    <div id="content"></div>
  </div>
  <script type="module" src="/src/main.${ext}"></script>
</body>
</html>`;
    await fs.writeFile(path.join(clientPath, 'index.html'), indexHtmlContent);

    // src/main.ts
    const mainContent = `import './style.css';
${features.includes('auth') || features.includes('upload') ? `import axios from 'axios';` : ''}

interface User {
  name: string;
  email: string;
}

${features.includes('auth') ? `async function checkAuth() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      const user: User = response.data;
      document.getElementById('content')!.innerHTML = \`<p>Welcome, \${user.name}!</p><button onclick="logout()">Logout</button>\`;
    } else {
      document.getElementById('content')!.innerHTML = '<p>Please log in.</p><button onclick="showLogin()">Login</button>';
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    document.getElementById('content')!.innerHTML = '<p>Please log in.</p><button onclick="showLogin()">Login</button>';
  }
}

function showLogin() {
  document.getElementById('content')!.innerHTML = \`
    <form id="loginForm">
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  \`;
  document.getElementById('loginForm')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      checkAuth();
    } catch (error) {
      console.error('Login failed:', error);
    }
  });
}

function logout() {
  localStorage.removeItem('token');
  checkAuth();
}` : ''}

${features.includes('upload') ? `async function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('/api/upload', formData);
      document.getElementById('content')!.innerHTML += '<p>File uploaded successfully!</p>';
    } catch (error) {
      console.error('File upload failed:', error);
    }
  }
}` : ''}

document.addEventListener('DOMContentLoaded', () => {
  ${features.includes('auth') ? 'checkAuth();' : `document.getElementById('content')!.innerHTML = '<p>Welcome to the Home Page!</p>';`}
  ${features.includes('upload') ? `document.getElementById('content')!.innerHTML += '<input type="file" id="fileInput" />';
  document.getElementById('fileInput')!.addEventListener('change', handleFileUpload);` : ''}
});`;
    await fs.writeFile(path.join(clientPath, `src/main.${ext}`), mainContent);

    // src/style.css
    const styleContent = `h1 {
  color: #3f51b5;
  text-align: center;
  margin-top: 20px;
}
#content {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input, button {
  padding: 8px;
  font-size: 16px;
}`;
    await fs.writeFile(path.join(clientPath, 'src/style.css'), styleContent);

    // .env
    if (createEnvFiles) {
      const envContent = `NG_APP_API_URL=http://localhost:3000/api
${database === 'postgresql' ? 'NG_APP_DB_URL=postgresql://user:password@localhost:5432/dbname' : ''}`;
      await fs.writeFile(path.join(clientPath, '.env'), envContent);
    }

    console.log(chalk.green(`✓ Angular-compatible boilerplate generated in ${clientPath}`));
  } catch (error) {
    console.error(chalk.red(`Failed to generate Angular boilerplate: ${error.message}`));
    throw error;
  }
}

module.exports = { generateAngularTemplates };
