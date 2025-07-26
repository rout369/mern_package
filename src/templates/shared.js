const fs = require('fs-extra');
const path = require('path');

async function generateSharedTemplates(config) {
  const { projectPath, projectName, features, packageManager } = config;

  // Generate root package.json
  const rootPackageJson = {
    name: projectName,
    version: "1.0.0",
    description: "A MERN stack application",
    scripts: {},
    keywords: ["mern", "mongodb", "express", "react", "nodejs"],
    author: "",
    license: "MIT"
  };

  // Add scripts based on features
  if (features.includes('react') && features.includes('express')) {
    rootPackageJson.scripts = {
      "dev": "concurrently \"npm run server\" \"npm run client\"",
      "server": "cd server && npm run dev",
      "client": "cd client && npm run dev",
      "build": "cd client && npm run build",
      "start": "cd server && npm start"
    };
  } else if (features.includes('react')) {
    rootPackageJson.scripts = {
      "dev": "cd client && npm run dev",
      "build": "cd client && npm run build"
    };
  } else if (features.includes('express')) {
    rootPackageJson.scripts = {
      "dev": "cd server && npm run dev",
      "start": "cd server && npm start"
    };
  }

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2)
  );

  // Generate README.md
  const readme = generateReadme(config);
  await fs.writeFile(path.join(projectPath, 'README.md'), readme);

  // Generate Docker files if requested
  if (features.includes('docker')) {
    await generateDockerFiles(config);
  }
}

function generateReadme(config) {
  const { projectName, features, packageManager } = config;

  let readme = `# ${projectName}

A MERN stack application generated with mern-setup-cli.

## Features

`;

  if (features.includes('react')) {
    readme += '- ⚛️ React frontend with modern hooks\n';
  }
  if (features.includes('express')) {
    readme += '- 🚀 Express.js backend API\n';
  }
  if (features.includes('mongodb')) {
    readme += '- 🍃 MongoDB database integration\n';
  }
  if (features.includes('typescript')) {
    readme += '- 📘 TypeScript support\n';
  }
  if (features.includes('auth')) {
    readme += '- 🔐 JWT authentication\n';
  }
  if (features.includes('testing')) {
    readme += '- 🧪 Testing setup included\n';
  }

  readme += `
## Getting Started

### Prerequisites

- Node.js (v14 or higher)
${features.includes('mongodb') ? '- MongoDB (local installation or MongoDB Atlas)' : ''}

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd ${projectName}
\`\`\`

2. Install dependencies:
\`\`\`bash
${packageManager} install
\`\`\`

### Development

`;

  if (features.includes('react') && features.includes('express')) {
    readme += `Start both frontend and backend:
\`\`\`bash
${packageManager} run dev
\`\`\`

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:5000
`;
  } else if (features.includes('react')) {
    readme += `Start the frontend:
\`\`\`bash
${packageManager} run dev
\`\`\`

The app will be available at http://localhost:5173
`;
  } else if (features.includes('express')) {
    readme += `Start the backend:
\`\`\`bash
${packageManager} run dev
\`\`\`

The API will be available at http://localhost:5000
`;
  }

  if (features.includes('mongodb')) {
    readme += `
### Database Setup

1. Make sure MongoDB is running locally or set up MongoDB Atlas
2. Update the \`MONGODB_URI\` in your \`.env\` file:
   - Local: \`mongodb://localhost:27017/${projectName}\`
   - Atlas: \`mongodb+srv://username:password@cluster.mongodb.net/${projectName}\`
`;
  }

  readme += `
## Project Structure

\`\`\`
${projectName}/
`;

  if (features.includes('react')) {
    readme += `├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
`;
  }

  if (features.includes('express')) {
    readme += `├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
`;
  }

  readme += `├── package.json
└── README.md
\`\`\`

## Available Scripts

`;

  Object.entries(config.features.includes('react') && config.features.includes('express') ? {
    "dev": "Start both frontend and backend in development mode",
    "server": "Start only the backend server",
    "client": "Start only the frontend client",
    "build": "Build the frontend for production",
    "start": "Start the production server"
  } : config.features.includes('react') ? {
    "dev": "Start the frontend in development mode",
    "build": "Build the frontend for production"
  } : {
    "dev": "Start the backend in development mode",
    "start": "Start the production server"
  }).forEach(([script, description]) => {
    readme += `- \`${packageManager} run ${script}\`: ${description}\n`;
  });

  readme += `
## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
`;

  return readme;
}

async function generateDockerFiles(config) {
  const { projectPath, features } = config;

  // Dockerfile for the entire application
  let dockerfile = `# Multi-stage build for MERN app
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./
`;

  if (features.includes('express')) {
    dockerfile += `
# Build server
FROM base AS server-build
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

COPY server/ ./server/
WORKDIR /app/server
`;
  }

  if (features.includes('react')) {
    dockerfile += `
# Build client
FROM base AS client-build
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/
WORKDIR /app/client
RUN npm run build
`;
  }

  dockerfile += `
# Production stage
FROM node:18-alpine AS production

WORKDIR /app

${features.includes('express') ? `
# Copy server files
COPY --from=server-build /app/server ./server
` : ''}

${features.includes('react') ? `
# Copy built client files
COPY --from=client-build /app/client/dist ./client/dist
` : ''}

EXPOSE ${features.includes('express') ? '5000' : '3000'}

${features.includes('express') ? `
CMD ["node", "server/src/index.js"]
` : `
CMD ["npm", "start"]
`}
`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);

  // Docker Compose file
  const dockerCompose = `version: '3.8'

services:
${features.includes('mongodb') ? `  mongodb:
    image: mongo:latest
    container_name: ${config.projectName}-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: ${config.projectName}
    volumes:
      - mongo_data:/data/db
    networks:
      - mern-network

` : ''}  app:
    build: .
    container_name: ${config.projectName}-app
    ports:
      - "${features.includes('express') ? '5000:5000' : '3000:3000'}"
    environment:
      - NODE_ENV=production
${features.includes('mongodb') ? `      - MONGODB_URI=mongodb://mongodb:27017/${config.projectName}` : ''}
    depends_on:
${features.includes('mongodb') ? `      - mongodb` : ''}
    networks:
      - mern-network

networks:
  mern-network:
    driver: bridge

${features.includes('mongodb') ? `volumes:
  mongo_data:` : ''}
`;

  await fs.writeFile(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
}

module.exports = { generateSharedTemplates };