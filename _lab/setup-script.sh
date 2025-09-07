#!/bin/bash

# Setup script for migrating Jekyll to Astro
# Run this from your project root

echo "🚀 Setting up Astro project structure..."

# Create directory structure
echo "📁 Creating directories..."
mkdir -p src/components
mkdir -p src/layouts
mkdir -p src/pages
mkdir -p src/assets/{images,svgs,p,pdf}
mkdir -p src/styles/layers
mkdir -p src/content/{about,content,design,offer,product,services,works}
mkdir -p public/assets/favicons

# Move CSS files to proper location
echo "🎨 Moving CSS files..."
if [ -f "global.css" ]; then
  mv global.css src/styles/
fi

for file in components.css layout.css print.css reset.css tokens.css utilities.css; do
  if [ -f "$file" ]; then
    mv "$file" src/styles/layers/
  fi
done

# Create a site config file
echo "⚙️ Creating site config..."
cat > src/config.ts << 'EOF'
// Site configuration
export const SITE = {
  name: 'Junglestar',
  url: 'https://junglestar.org',
  email: 'info@junglestar.org',
  description: 'Sustainable Web Design to help fight Climate Change',
  author: {
    name: 'Junglestar',
    twitter: '@rokmatwit'
  },
  defaultLanguage: 'english',
  googleVerify: '', // Add your Google verification code
  version: '0.0.1'
};
EOF

# Create a basic 404 page
echo "📄 Creating 404 page..."
cat > src/pages/404.astro << 'EOF'
---
import Layout from '@layouts/Layout.astro';
---

<Layout title="404 - Page Not Found">
  <div class="wrapper center">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>Sorry, the page you're looking for doesn't exist.</p>
    <a href="/" class="button">Go Home</a>
  </div>
</Layout>
EOF

# Create sample content for collections
echo "📝 Creating sample content..."
cat > src/content/services/web-design.md << 'EOF'
---
title: "Web Design"
description: "Professional web design services"
language: "english"
footer_listed: true
---

# Web Design Services

We create beautiful, functional websites.
EOF

cat > src/content/offer/starter-package.md << 'EOF'
---
title: "Starter Package"
description: "Perfect for small businesses"
language: "english"
footer_listed: true
---

# Starter Package

Get started with a professional web presence.
EOF

# Update astro.config.mjs with site URL
echo "🔧 Updating Astro config..."
cat > astro.config.mjs << 'EOF'
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://junglestar.org',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssMinify: true
    }
  }
});
EOF

# Create a helper script for common tasks
echo "🛠️ Creating helper scripts..."
cat > migrate-jekyll-file.js << 'EOF'
#!/usr/bin/env node

// Helper script to convert Jekyll liquid templates to Astro
// Usage: node migrate-jekyll-file.js input.html output.astro

const fs = require('fs');

function convertJekyllToAstro(content) {
  let converted = content;

  // Convert Jekyll variables to Astro
  converted = converted.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
    return `{${p1.trim()}}`;
  });

  // Convert Jekyll includes
  converted = converted.replace(/\{%\s*include\s+([^%]+)\s*%\}/g, (match, p1) => {
    const parts = p1.trim().split(/\s+/);
    const file = parts[0].replace('.html', '');
    const props = parts.slice(1).join(' ');
    return `<${file} ${props} />`;
  });

  // Convert Jekyll for loops
  converted = converted.replace(/\{%\s*for\s+(\w+)\s+in\s+([^%]+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g,
    (match, item, collection, body) => {
      return `{${collection.trim()}.map(${item} => (\n${body}\n))}`;
    });

  // Convert Jekyll if statements
  converted = converted.replace(/\{%\s*if\s+([^%]+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g,
    (match, condition, body) => {
      return `{${condition.trim()} && (\n${body}\n)}`;
    });

  return converted;
}

// Read file from command line args
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node migrate-jekyll-file.js input.html output.astro');
  process.exit(1);
}

const input = fs.readFileSync(args[0], 'utf8');
const output = convertJekyllToAstro(input);
fs.writeFileSync(args[1], output);
console.log(`✅ Converted ${args[0]} to ${args[1]}`);
EOF

chmod +x migrate-jekyll-file.js

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Move your Jekyll HTML files to src/components/ or src/pages/"
echo "2. Move your images to src/assets/images/"
echo "3. Move your SVGs to src/assets/svgs/"
echo "4. Only put favicon.ico in public/ root"
echo "5. Run 'pnpm dev' to start the development server"
echo ""
echo "💡 Tips:"
echo "- Use './migrate-jekyll-file.js' to help convert Jekyll files"
echo "- Components from artifacts should be saved in their respective folders"
echo "- Your CSS is already properly organized and will work as-is!"
