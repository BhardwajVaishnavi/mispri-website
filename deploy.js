/**
 * Deployment script for the Bakery Shop E-commerce Website
 * 
 * This script prepares the website for deployment by:
 * 1. Building the Next.js application
 * 2. Generating the Prisma client
 * 3. Creating a deployment package
 * 
 * Usage: node deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const deploymentDir = path.join(__dirname, 'deployment');
const packageName = 'bakery-shop-website.zip';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

/**
 * Execute a command and log the output
 * @param {string} command - Command to execute
 * @param {string} message - Message to display
 */
function executeCommand(command, message) {
  console.log(`${colors.blue}${message}...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Done${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ Failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Main deployment function
 */
async function deploy() {
  console.log(`${colors.yellow}=== Bakery Shop E-commerce Website Deployment ===${colors.reset}`);
  
  // Step 1: Install dependencies
  executeCommand('npm install', 'Installing dependencies');
  
  // Step 2: Generate Prisma client
  executeCommand('npx prisma generate', 'Generating Prisma client');
  
  // Step 3: Build the Next.js application
  executeCommand('npm run build', 'Building Next.js application');
  
  // Step 4: Create deployment directory if it doesn't exist
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  // Step 5: Create deployment package
  console.log(`${colors.blue}Creating deployment package...${colors.reset}`);
  
  // Create a list of files and directories to include in the package
  const filesToInclude = [
    '.next',
    'public',
    'prisma',
    'package.json',
    'next.config.js',
    '.env',
  ];
  
  // Create the zip command
  const zipCommand = `zip -r "${path.join(deploymentDir, packageName)}" ${filesToInclude.join(' ')}`;
  
  try {
    execSync(zipCommand, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Deployment package created: ${path.join(deploymentDir, packageName)}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ Failed to create deployment package: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Note: You may need to install the 'zip' command on your system.${colors.reset}`);
    console.log(`${colors.yellow}Alternatively, you can manually zip the required files.${colors.reset}`);
  }
  
  console.log(`${colors.yellow}=== Deployment Preparation Complete ===${colors.reset}`);
  console.log(`${colors.green}The website is ready for deployment.${colors.reset}`);
  console.log(`${colors.blue}You can deploy the website using one of the following methods:${colors.reset}`);
  console.log(`${colors.blue}1. Deploy to Vercel: https://vercel.com/import/git${colors.reset}`);
  console.log(`${colors.blue}2. Deploy to Netlify: https://app.netlify.com/start${colors.reset}`);
  console.log(`${colors.blue}3. Deploy manually using the deployment package: ${path.join(deploymentDir, packageName)}${colors.reset}`);
}

// Run the deployment function
deploy().catch(error => {
  console.error(`${colors.red}Deployment failed: ${error.message}${colors.reset}`);
  process.exit(1);
});
