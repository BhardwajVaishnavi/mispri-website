#!/usr/bin/env node

/**
 * Website Deployment Script for Vercel
 * This script helps deploy the website with proper environment variables
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Website Deployment to Vercel...');
console.log('===========================================');

// Check if we're in the website directory
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Make sure you\'re in the website directory.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
if (packageJson.name !== 'bakery-ecommerce') {
  console.error('❌ Error: This doesn\'t appear to be the website directory.');
  console.error('   Please run this script from the website folder.');
  process.exit(1);
}

console.log('✅ Verified: Running from website directory');

// Check for required files
const requiredFiles = [
  'prisma/schema.prisma',
  'src/app/api/contact/route.ts',
  'vercel.json',
  '.env.example'
];

console.log('\n🔍 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ Missing: ${file}`);
    process.exit(1);
  }
}

// Environment variables that need to be set on Vercel
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM_NAME',
  'NEXT_PUBLIC_API_URL'
];

console.log('\n📋 Required Environment Variables for Vercel:');
console.log('============================================');
requiredEnvVars.forEach(envVar => {
  console.log(`   ${envVar}`);
});

console.log('\n⚠️  IMPORTANT: Make sure these environment variables are set in your Vercel dashboard:');
console.log('   1. Go to https://vercel.com/dashboard');
console.log('   2. Select your website project');
console.log('   3. Go to Settings > Environment Variables');
console.log('   4. Add all the variables listed above');

console.log('\n🔧 Recommended Environment Variable Values:');
console.log('==========================================');
console.log('DATABASE_URL: (Same as your admin panel)');
console.log('NEXTAUTH_SECRET: (Generate a random secret)');
console.log('NEXTAUTH_URL: https://mispri-website.vercel.app');
console.log('SMTP_HOST: smtp.gmail.com');
console.log('SMTP_PORT: 587');
console.log('SMTP_USER: mispriaks@gmail.com');
console.log('SMTP_PASS: kgbw bcef kbhr mlwf');
console.log('EMAIL_FROM_NAME: Mispri');
console.log('NEXT_PUBLIC_API_URL: https://mispri24.vercel.app/api');

// Ask user if they want to proceed
console.log('\n❓ Have you set all the environment variables in Vercel? (y/n)');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    const answer = chunk.trim().toLowerCase();
    if (answer === 'y' || answer === 'yes') {
      deployToVercel();
    } else {
      console.log('\n⏸️  Deployment cancelled. Please set the environment variables first.');
      console.log('   Then run this script again.');
      process.exit(0);
    }
  }
});

function deployToVercel() {
  console.log('\n🚀 Deploying to Vercel...');
  console.log('========================');

  try {
    // Check if Vercel CLI is installed
    console.log('🔍 Checking Vercel CLI...');
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');

    // Deploy to Vercel
    console.log('\n📤 Starting deployment...');
    execSync('vercel --prod', { stdio: 'inherit' });

    console.log('\n🎉 Deployment completed successfully!');
    console.log('===================================');
    console.log('✅ Website should be available at: https://mispri-website.vercel.app');
    console.log('✅ Contact form should now work properly');
    console.log('✅ Emails will be sent to: mispriaks@gmail.com');

    console.log('\n🧪 Next Steps:');
    console.log('=============');
    console.log('1. Test the contact form at: https://mispri-website.vercel.app/contact');
    console.log('2. Check browser console for any errors');
    console.log('3. Verify emails are received at mispriaks@gmail.com');

  } catch (error) {
    console.error('\n❌ Deployment failed!');
    console.error('====================');
    console.error('Error:', error.message);

    console.log('\n🔧 Troubleshooting:');
    console.log('==================');
    console.log('1. Make sure Vercel CLI is installed: npm i -g vercel');
    console.log('2. Make sure you\'re logged in: vercel login');
    console.log('3. Check environment variables in Vercel dashboard');
    console.log('4. Try manual deployment: vercel --prod');
  }
}

console.log('\n💡 Tip: You can also deploy manually by running: vercel --prod');
