# Enterprise Workspace

Production-ready Angular workspace for enterprise operations: premium auth, analytics dashboard, Kanban tasks, and project management with smooth motion design.

## Features

- Standalone Angular architecture (Angular 18 compatible with 17+ patterns).
- Strict TypeScript and feature-based routing.
- Enterprise shell with collapsible sidebar and responsive navbar.
- Premium authentication UX (login/register, JWT flow, guards, interceptor).
- High-end dashboard with Chart.js + GSAP + reveal interactions.
- Projects feature with list/details/modal/forms patterns.
- Tasks Kanban board with polished drag/drop and side drawer details.
- Global loading overlay with fade animation.
- Global toast notification outlet with slide animation.
- Dedicated 404 and error pages with modern UI.
- Route-level SEO metadata and canonical URL updates.
- Accessibility baseline (skip link, focus-visible styles, reduced motion support).
- Docker-ready production container with SPA-friendly nginx config.

## Architecture

```text
enterprise-workspace/
|-- src/
|   |-- app/
|   |   |-- core/
|   |   |   |-- config/
|   |   |   |-- guards/
|   |   |   |-- interceptors/
|   |   |   |-- models/
|   |   |   `-- services/
|   |   |-- features/
|   |   |   |-- analytics/
|   |   |   |-- auth/
|   |   |   |-- dashboard/
|   |   |   |-- projects/
|   |   |   |-- system/
|   |   |   `-- tasks/
|   |   |-- layout/
|   |   |   |-- navbar/
|   |   |   |-- shell/
|   |   |   `-- sidebar/
|   |   |-- shared/
|   |   |   |-- animations/
|   |   |   |-- components/
|   |   |   `-- ui/
|   |   |-- app.config.ts
|   |   `-- app.routes.ts
|   |-- styles/
|   |   |-- _material-theme.scss
|   |   |-- _mixins.scss
|   |   |-- _spacing.scss
|   |   |-- _typography.scss
|   |   `-- _variables.scss
|   `-- styles.scss
|-- Dockerfile
|-- nginx.conf
|-- netlify.toml
`-- vercel.json
```

## UI/UX Philosophy

- Jira/Coursera-inspired enterprise clarity: strong hierarchy, clean spacing, reliable interaction affordances.
- Motion as feedback, not decoration: consistent durations for route/page/state transitions.
- Premium visual language: soft glass surfaces, restrained gradients, and professional color contrast.
- Performance-first rendering with `OnPush`, signals, trackBy, and lazy route chunks.

## Key Technical Decisions

- Feature-level lazy loading via route files (`loadChildren`) for improved initial bundle size.
- Global platform systems in `core`:
  - `LoadingService` + `loadingInterceptor`
  - `ToastService` + toast outlet
  - `SeoService` (title/meta/robots/canonical)
  - `authInterceptor` + `errorInterceptor`
- Router enhancements:
  - `withViewTransitions()`
  - `withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })`

## Local Development

```bash
npm install
npm start
```

## Production Build Commands

```bash
# Standard build
npm run build

# Production build (optimized)
npm run build:prod

# Production build + stats json
npm run build:stats

# Serve built artifacts locally
npm run serve:dist
```

Build output directory:

```text
dist/enterprise-workspace/browser
```

## Docker Deployment

Build and run:

```bash
docker build -t enterprise-workspace:latest .
docker run -d -p 8080:80 --name enterprise-workspace enterprise-workspace:latest
```

Open: `http://localhost:8080`

## Deployment Guide

### Vercel

1. Import repository in Vercel.
2. Configure build:
   - Build command: `npm run build:prod`
   - Output directory: `dist/enterprise-workspace/browser`
3. Keep `vercel.json` in repo root (SPA rewrite included).
4. Deploy.

### Netlify

1. Import repository in Netlify.
2. Build settings:
   - Build command: `npm run build:prod`
   - Publish directory: `dist/enterprise-workspace/browser`
3. Keep `public/_redirects` (SPA fallback) and `netlify.toml` in repo root.
4. Deploy.

### VPS (Ubuntu + Docker)

1. Install Docker and Docker Compose.
2. Clone repository and run:
   - `docker build -t enterprise-workspace:latest .`
   - `docker run -d -p 80:80 --restart unless-stopped enterprise-workspace:latest`
3. Optional TLS: place behind reverse proxy (nginx/Caddy/Traefik) with HTTPS certs.

## Screenshot Sections

Place screenshots under `docs/screenshots/` and reference them below.

### 1. Authentication (Split Layout)

![Authentication](docs/screenshots/auth-login.png)

### 2. Dashboard (KPI + Charts + Timeline)

![Dashboard](docs/screenshots/dashboard.png)

### 3. Projects (List + Details + Modal)

![Projects](docs/screenshots/projects.png)

### 4. Kanban Board (Drag & Drop + Drawer)

![Kanban](docs/screenshots/kanban.png)

### 5. Error and 404 Experience

![System Pages](docs/screenshots/system-pages.png)
