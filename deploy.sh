#!/bin/bash

# 🚀 Mispri Bakery Website Deployment Script
# This script prepares and deploys your website to production

echo "🎉 MISPRI BAKERY WEBSITE DEPLOYMENT"
echo "=================================="
echo ""

# Check if we're in the website directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the website directory"
    exit 1
fi

echo "✅ Step 1: Installing dependencies..."
npm install

echo ""
echo "✅ Step 2: Running build test..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "✅ Step 3: Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Creating template..."
    cat > .env << EOL
# Production Environment Variables
NEXT_PUBLIC_API_URL=https://mispri24.vercel.app/api
NEXT_PUBLIC_APP_URL=https://your-website-domain.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://mispri24.vercel.app
NEXT_PUBLIC_SITE_NAME=Mispri Bakery
NEXT_PUBLIC_CONTACT_EMAIL=contact@mispribakery.com
NEXT_PUBLIC_CONTACT_PHONE=+91-XXXXXXXXXX
EOL
    echo "📝 Please update .env file with your actual values"
fi

echo ""
echo "✅ Step 4: Deployment options:"
echo ""
echo "🌐 OPTION 1: VERCEL (Recommended)"
echo "   1. Push code to GitHub"
echo "   2. Connect repository to Vercel"
echo "   3. Deploy automatically"
echo ""
echo "🌐 OPTION 2: NETLIFY"
echo "   1. Push code to GitHub"
echo "   2. Connect repository to Netlify"
echo "   3. Configure build settings"
echo ""
echo "🌐 OPTION 3: MANUAL DEPLOYMENT"
echo "   1. Upload build files to your server"
echo "   2. Configure web server"
echo "   3. Set up SSL certificate"
echo ""

echo "🎯 NEXT STEPS:"
echo "1. Choose your deployment platform"
echo "2. Update environment variables"
echo "3. Configure custom domain"
echo "4. Test live website"
echo ""

echo "🎊 Your website is ready for deployment!"
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Git repository not initialized. Run these commands:"
    echo ""
    echo "git init"
    echo "git add ."
    echo "git commit -m 'Initial website deployment'"
    echo "git branch -M main"
    echo "git remote add origin https://github.com/yourusername/mispri-website.git"
    echo "git push -u origin main"
    echo ""
fi

echo "✅ Deployment preparation complete!"
