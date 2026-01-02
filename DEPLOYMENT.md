# Deployment Guide

## Build Output

The application has been successfully built and is ready for deployment. Build artifacts are located in the `dist/` folder.

## Build Stats

- **Bundle Size**: 201.40 kB (63.17 kB gzipped)
- **CSS Size**: 5.33 kB (1.50 kB gzipped)
- **No Build Errors**: ✅

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to deploy

### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Point to the `dist` folder when prompted

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/workflow-builder"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: Static Hosting

Simply upload the contents of the `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- Azure Static Web Apps
- Google Cloud Storage
- Any static hosting provider

## Local Preview

To preview the production build locally:

```bash
npm run preview
```

This will start a local server serving the built files from the `dist/` directory.

## Environment Configuration

The application runs entirely in the browser and requires no backend or environment variables.

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Post-Deployment

After deploying, update the README.md with:
1. Your live demo URL
2. Your repository URL
