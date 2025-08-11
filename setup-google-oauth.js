const fs = require('fs');
const crypto = require('crypto');

console.log('🚀 Setting up Google OAuth for MISPRI Website');
console.log('================================================');

// Generate NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('hex');

// Create .env.local template
const envTemplate = `# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="${nextAuthSecret}"

# Google OAuth Configuration (Replace with your credentials)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_Z8QVOmJnrVJP@ep-steep-butterfly-a5q4s2ql.us-east-2.aws.neon.tech/neondb?sslmode=require"

# API Configuration
NEXT_PUBLIC_API_URL="https://mispri24.vercel.app/api"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="mispriaks@gmail.com"
SMTP_PASS="kgbw bcef kbhr mlwf"

# NextJS Configuration
NEXT_TELEMETRY_DISABLED="1"
NEXT_DISABLE_ESLINT="1"
`;

// Write .env.local file
fs.writeFileSync('.env.local', envTemplate);

console.log('✅ Created .env.local file with NextAuth secret');
console.log('');
console.log('📋 Next Steps:');
console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
console.log('2. Create a new project or select existing project');
console.log('3. Enable Google+ API or People API');
console.log('4. Configure OAuth consent screen');
console.log('5. Create OAuth 2.0 credentials');
console.log('6. Add authorized origins: http://localhost:3001');
console.log('7. Add redirect URI: http://localhost:3001/api/auth/callback/google');
console.log('8. Copy Client ID and Client Secret to .env.local');
console.log('9. Test Google login at: http://localhost:3001/test-auth');
console.log('');
console.log('🔗 Detailed setup guide: GOOGLE_OAUTH_SETUP_GUIDE.md');
console.log('');
console.log('⚠️  Remember to:');
console.log('   - Keep your Google credentials secure');
console.log('   - Add production URLs for deployment');
console.log('   - Set environment variables in Vercel');
console.log('');
console.log('🎉 Google OAuth setup template ready!');
