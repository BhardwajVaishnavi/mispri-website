const crypto = require('crypto');

// Generate a secure random secret for NextAuth
const secret = crypto.randomBytes(32).toString('hex');

console.log('🔑 Generated NextAuth Secret:');
console.log('');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('');
console.log('📋 Add this to your .env.local file');
console.log('⚠️  Keep this secret secure and never commit it to version control');
console.log('');
console.log('🔧 For production, use a different secret in Vercel environment variables');
