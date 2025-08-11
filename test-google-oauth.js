const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Google OAuth Configuration');
console.log('=====================================');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('💡 Run: node setup-google-oauth.js');
  process.exit(1);
}

// Read environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

const config = {};
envLines.forEach(line => {
  if (line.includes('=') && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    config[key] = value.replace(/"/g, '');
  }
});

console.log('📋 Environment Variables Check:');
console.log('');

// Check NextAuth configuration
if (config.NEXTAUTH_URL) {
  console.log('✅ NEXTAUTH_URL:', config.NEXTAUTH_URL);
} else {
  console.log('❌ NEXTAUTH_URL not set');
}

if (config.NEXTAUTH_SECRET && config.NEXTAUTH_SECRET.length >= 32) {
  console.log('✅ NEXTAUTH_SECRET: Set (length:', config.NEXTAUTH_SECRET.length, 'chars)');
} else {
  console.log('❌ NEXTAUTH_SECRET not set or too short (minimum 32 characters)');
}

// Check Google OAuth configuration
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
  console.log('✅ GOOGLE_CLIENT_ID:', config.GOOGLE_CLIENT_ID);
} else {
  console.log('❌ GOOGLE_CLIENT_ID not set or invalid format');
}

if (config.GOOGLE_CLIENT_SECRET && config.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
  console.log('✅ GOOGLE_CLIENT_SECRET: Set (starts with GOCSPX-)');
} else {
  console.log('❌ GOOGLE_CLIENT_SECRET not set or invalid format');
}

// Check database configuration
if (config.DATABASE_URL && config.DATABASE_URL.includes('postgresql://')) {
  console.log('✅ DATABASE_URL: Set (PostgreSQL)');
} else {
  console.log('❌ DATABASE_URL not set or invalid');
}

// Check API configuration
if (config.NEXT_PUBLIC_API_URL) {
  console.log('✅ NEXT_PUBLIC_API_URL:', config.NEXT_PUBLIC_API_URL);
} else {
  console.log('❌ NEXT_PUBLIC_API_URL not set');
}

console.log('');
console.log('🔗 Google OAuth URLs:');
console.log('');
console.log('Authorized JavaScript origins:');
console.log('  http://localhost:3001');
console.log('');
console.log('Authorized redirect URIs:');
console.log('  http://localhost:3001/api/auth/callback/google');
console.log('');

// Check if all required variables are set
const requiredVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
const missingVars = requiredVars.filter(varName => !config[varName]);

if (missingVars.length === 0) {
  console.log('🎉 All required environment variables are set!');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Make sure your website is running: npm run dev');
  console.log('2. Test Google login at: http://localhost:3001/test-auth');
  console.log('3. Click "Continue with Google" button');
  console.log('4. Grant permissions and verify login works');
  console.log('');
  console.log('🔧 If Google login fails, check:');
  console.log('- Google Cloud Console OAuth configuration');
  console.log('- Authorized origins and redirect URIs');
  console.log('- OAuth consent screen setup');
  console.log('- Browser console for error messages');
} else {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('');
  console.log('💡 Update your .env.local file with the missing variables');
}

console.log('');
console.log('📚 For detailed setup instructions, see: GOOGLE_OAUTH_SETUP_GUIDE.md');
