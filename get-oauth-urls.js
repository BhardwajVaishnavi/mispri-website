// Script to get the exact OAuth URLs for Google Cloud Console configuration

console.log('🔧 GOOGLE OAUTH CONFIGURATION URLS');
console.log('=====================================');
console.log('');

// Your current deployment URL
const deploymentUrl = 'https://mispri-website-7peckb6bm-bhardwajvaishnavis-projects.vercel.app';

console.log('📋 COPY THESE EXACT URLs TO GOOGLE CLOUD CONSOLE:');
console.log('');

console.log('🌐 Authorized JavaScript Origins:');
console.log('   ' + deploymentUrl);
console.log('');

console.log('🔄 Authorized Redirect URIs:');
console.log('   ' + deploymentUrl + '/api/auth/callback/google');
console.log('');

console.log('⚙️  VERCEL ENVIRONMENT VARIABLES:');
console.log('');
console.log('NEXTAUTH_URL=' + deploymentUrl);
console.log('NEXTAUTH_SECRET=your-nextauth-secret-key-here');
console.log('GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com');
console.log('GOOGLE_CLIENT_SECRET=your-google-client-secret');
console.log('');

console.log('📝 STEP-BY-STEP INSTRUCTIONS:');
console.log('');
console.log('1. Go to: https://console.cloud.google.com/');
console.log('2. Navigate to: APIs & Services → Credentials');
console.log('3. Click on your OAuth 2.0 Client ID');
console.log('4. Add the JavaScript Origin URL above');
console.log('5. Add the Redirect URI URL above');
console.log('6. Click Save');
console.log('7. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
console.log('8. Add/Update the environment variables above');
console.log('9. Redeploy your website');
console.log('10. Test Google login');
console.log('');

console.log('🎯 ALTERNATIVE: SET UP CUSTOM DOMAIN');
console.log('');
console.log('For a cleaner URL, set up a custom domain in Vercel:');
console.log('1. Vercel Dashboard → Settings → Domains');
console.log('2. Add: mispri-website.vercel.app');
console.log('3. Update Google Cloud Console with:');
console.log('   https://mispri-website.vercel.app');
console.log('   https://mispri-website.vercel.app/api/auth/callback/google');
console.log('4. Update NEXTAUTH_URL to: https://mispri-website.vercel.app');
console.log('');

console.log('✅ After completing these steps, Google OAuth should work!');
console.log('');

// Generate a NextAuth secret if needed
const crypto = require('crypto');
const nextAuthSecret = crypto.randomBytes(32).toString('hex');
console.log('🔑 NEW NEXTAUTH_SECRET (if needed):');
console.log('   ' + nextAuthSecret);
console.log('');

console.log('🧪 TEST YOUR CONFIGURATION:');
console.log('1. Visit: ' + deploymentUrl);
console.log('2. Click "Sign In"');
console.log('3. Click "Continue with Google"');
console.log('4. Should redirect to Google login without errors');
console.log('');

console.log('🆘 TROUBLESHOOTING:');
console.log('- Wait 5-10 minutes after Google Cloud Console changes');
console.log('- Try incognito/private browsing');
console.log('- Check browser console for errors');
console.log('- Verify environment variables in Vercel');
console.log('- Ensure URLs match exactly (no trailing slashes)');
console.log('');

console.log('🎉 GOOGLE OAUTH SETUP COMPLETE!');
