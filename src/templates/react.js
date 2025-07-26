const fs = require('fs-extra');
const path = require('path');

async function generateReactTemplates(config) {
  const { projectPath, features, cssFramework } = config;
  const clientPath = path.join(projectPath, 'client');
  const isTypeScript = features.includes('typescript');
  const fileExt = isTypeScript ? 'tsx' : 'jsx';

  // Generate package.json for client
  const clientPackageJson = {
    name: `${config.projectName}-client`,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    }
  };

  if (features.includes('testing')) {
    clientPackageJson.scripts.test = "vitest";
  }

  await fs.writeFile(
    path.join(clientPath, 'package.json'),
    JSON.stringify(clientPackageJson, null, 2)
  );

  // Generate Vite config
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
`;

  await fs.writeFile(path.join(clientPath, 'vite.config.js'), viteConfig);

  // Generate index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${fileExt}"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(clientPath, 'index.html'), indexHtml);

  // Generate main entry file
  const mainFile = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
${cssFramework === 'tailwind' ? "import './index.css'" : ''}
${cssFramework === 'bootstrap' ? "import 'bootstrap/dist/css/bootstrap.min.css'" : ''}

ReactDOM.createRoot(document.getElementById('root')${isTypeScript ? ' as HTMLElement' : ''}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

  await fs.writeFile(path.join(clientPath, `src/main.${fileExt}`), mainFile);

  // Generate App component
  const appComponent = generateAppComponent(config);
  await fs.writeFile(path.join(clientPath, `src/App.${fileExt}`), appComponent);

  // Generate CSS files based on framework choice
  if (cssFramework === 'tailwind') {
    await generateTailwindConfig(config);
  } else if (cssFramework === 'plain') {
    await generatePlainCSS(config);
  }

  // Generate utility files
  await generateUtilityFiles(config);

  // Generate sample components
  await generateSampleComponents(config);

  // Generate TypeScript config if needed
  if (isTypeScript) {
    await generateTypeScriptConfig(config);
  }
}

function generateAppComponent(config) {
  const { features, cssFramework } = config;
  const isTypeScript = features.includes('typescript');
  const fileExt = isTypeScript ? 'tsx' : 'jsx';

  let imports = `import React from 'react'`;
  
  if (features.includes('express')) {
    imports += `\nimport { useEffect, useState } from 'react'`;
  }

  let component = `${imports}

function App() {`;

  if (features.includes('express')) {
    component += `
  const [message, setMessage] = useState${isTypeScript ? '<string>' : ''}('Loading...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Failed to connect to server'))
  }, [])
`;
  }

  const tailwindClasses = cssFramework === 'tailwind' 
    ? 'className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"'
    : 'className="app"';

  const cardClasses = cssFramework === 'tailwind'
    ? 'className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4"'
    : 'className="card"';

  const titleClasses = cssFramework === 'tailwind'
    ? 'className="text-3xl font-bold text-gray-800 mb-4 text-center"'
    : 'className="title"';

  const textClasses = cssFramework === 'tailwind'
    ? 'className="text-gray-600 text-center"'
    : 'className="text"';

  component += `
  return (
    <div ${tailwindClasses}>
      <div ${cardClasses}>
        <h1 ${titleClasses}>
          Welcome to ${config.projectName}
        </h1>
        <p ${textClasses}>
          ${features.includes('express') ? '{message}' : 'Your MERN stack application is ready!'}
        </p>
        ${features.includes('auth') ? `
        <div className="${cssFramework === 'tailwind' ? 'mt-6 space-y-4' : 'auth-section'}">
          <button className="${cssFramework === 'tailwind' ? 'w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors' : 'btn-primary'}">
            Login
          </button>
          <button className="${cssFramework === 'tailwind' ? 'w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors' : 'btn-secondary'}">
            Sign Up
          </button>
        </div>
        ` : ''}
      </div>
    </div>
  )
}

export default App
`;

  return component;
}

async function generateTailwindConfig(config) {
  const clientPath = path.join(config.projectPath, 'client');

  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  const indexCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  await fs.writeFile(path.join(clientPath, 'tailwind.config.js'), tailwindConfig);
  await fs.writeFile(path.join(clientPath, 'postcss.config.js'), postcssConfig);
  await fs.writeFile(path.join(clientPath, 'src/index.css'), indexCSS);
}

async function generatePlainCSS(config) {
  const clientPath = path.join(config.projectPath, 'client');

  const indexCSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.text {
  color: #666;
  line-height: 1.6;
}

.auth-section {
  margin-top: 1.5rem;
}

.btn-primary, .btn-secondary {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
`;

  await fs.writeFile(path.join(clientPath, 'src/index.css'), indexCSS);
}

async function generateUtilityFiles(config) {
  const clientPath = path.join(config.projectPath, 'client');
  const isTypeScript = config.features.includes('typescript');
  const fileExt = isTypeScript ? 'ts' : 'js';

  // API utility
  const apiUtil = `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  get: async (endpoint${isTypeScript ? ': string' : ''}) => {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
  
  post: async (endpoint${isTypeScript ? ': string' : ''}, data${isTypeScript ? ': any' : ''}) => {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
  
  put: async (endpoint${isTypeScript ? ': string' : ''}, data${isTypeScript ? ': any' : ''}) => {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
  
  delete: async (endpoint${isTypeScript ? ': string' : ''}) => {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
}
`;

  await fs.writeFile(path.join(clientPath, `src/utils/api.${fileExt}`), apiUtil);
}

async function generateSampleComponents(config) {
  const clientPath = path.join(config.projectPath, 'client');
  const isTypeScript = config.features.includes('typescript');
  const fileExt = isTypeScript ? 'tsx' : 'jsx';

  // Sample component
  const sampleComponent = `import React from 'react'

${isTypeScript ? `interface Props {
  title: string
  children: React.ReactNode
}

const Card: React.FC<Props> = ({ title, children }) => {` : `const Card = ({ title, children }) => {`}
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

export default Card
`;

  await fs.writeFile(path.join(clientPath, `src/components/Card.${fileExt}`), sampleComponent);
}

async function generateTypeScriptConfig(config) {
  const clientPath = path.join(config.projectPath, 'client');

  const tsConfig = {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ["src"],
    references: [{ path: "./tsconfig.node.json" }]
  };

  const tsConfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: "ESNext",
      moduleResolution: "bundler",
      allowSyntheticDefaultImports: true
    },
    include: ["vite.config.ts"]
  };

  await fs.writeFile(
    path.join(clientPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  await fs.writeFile(
    path.join(clientPath, 'tsconfig.node.json'),
    JSON.stringify(tsConfigNode, null, 2)
  );
}

module.exports = { generateReactTemplates };