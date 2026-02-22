# Deployment Guide

## Build Artifact

Production output is generated at:

```text
dist/enterprise-workspace/browser
```

## Docker + Nginx

Build and run:

```bash
docker build -t enterprise-workspace:latest .
docker run -d -p 8080:80 --name enterprise-workspace enterprise-workspace:latest
```

Open `http://localhost:8080`.

The Nginx config includes:

- SPA route fallback (`try_files ... /index.html`)
- Long-lived caching for static assets
- No-cache for `index.html`

## Vercel

- Build command: `npm run build:prod`
- Output directory: `dist/enterprise-workspace/browser`
- Keep `vercel.json` in repo root for SPA rewrites and cache headers.

## Netlify

- Build command: `npm run build:prod`
- Publish directory: `dist/enterprise-workspace/browser`
- Keep both `netlify.toml` and `public/_redirects`.

## Production Checklist

- Verify `npm run build:prod` passes.
- Confirm canonical URL and SEO tags in deployed environment.
- Validate route refresh behavior for deep links.
- Validate i18n asset loading (`/assets/i18n/*.json`).
- Confirm caching headers for static chunks.
