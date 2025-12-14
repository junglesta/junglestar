#!/bin/bash
# One-command Netlify deployment for junglestar.org
# Just run: ./quick-netlify-deploy.sh

set -e  # Exit on error

echo "🚀 Junglestar.org - Quick Netlify Deploy"
echo "========================================="
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
pnpm add @astrojs/netlify
pnpm add -D netlify-cli

# Step 2: Build
echo ""
echo "🔨 Building site..."
pnpm build

# Step 3: Check if Netlify is configured
if [ ! -f ".netlify/state.json" ]; then
    echo ""
    echo "🔗 First time deployment - setting up Netlify..."
    echo "This will open your browser to connect to Netlify."
    echo ""
    npx netlify init
fi

# Step 4: Deploy
echo ""
echo "🚀 Deploying to Netlify..."
npx netlify deploy --prod --dir=dist

# Step 5: Success message
echo ""
echo "✅ ============================================"
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "✅ ============================================"
echo ""
echo "🌐 Your site is live at:"
echo "   https://junglestar.netlify.app"
echo ""
echo "📝 To add your custom domain:"
echo "   1. Go to https://app.netlify.com"
echo "   2. Click on your site"
echo "   3. Go to 'Domain settings'"
echo "   4. Add 'junglestar.org'"
echo ""
echo "🎯 Next deploys are even easier:"
echo "   Just run: pnpm run deploy"
echo ""