@echo off
echo Installing Vercel CLI...
npm install -g vercel

echo Logging in to Vercel...
vercel login

echo Deploying to Vercel...
vercel --prod

echo Deployment complete!
pause
