# Enterprise Workspace

<p align="center">
  <img src="[public/graphics/workspace-hero-mockup.svg](https://res.cloudinary.com/dhqavjbx6/image/upload/v1771695669/ChatGPT_Image_Feb_21_2026_05_40_39_PM_vbdoec.png)" alt="Enterprise Workspace logo" width="220" />
</p>

Enterprise Workspace is a production-ready Angular application that combines authentication, analytics, project portfolio views, and Kanban task execution in one enterprise UI.

## Why This Project

Teams often split dashboards, delivery tracking, and operational task flow across multiple tools. This project demonstrates how to unify those workflows into a single frontend platform with modern UX, accessibility, and deployment readiness.

## Core Capabilities

- Standalone Angular architecture with feature-based routing.
- Auth flow with guards, interceptors, JWT session handling, and graceful mock fallback.
- Dashboard experience with KPI cards, Chart.js visualizations, and motion-driven feedback.
- Projects workspace with list filtering, details view, modal form creation, and settings updates.
- Tasks Kanban board with drag-and-drop and contextual side drawer details.
- Global systems for loading state, toast notifications, SEO metadata, theming, and localization.
- Multi-language support (`en`, `fr`, `es`, `de`, `ar`, `it`) with RTL handling.

## Tech Stack

- Angular 18 (standalone APIs)
- TypeScript (strict mode)
- Angular Material + CDK DragDrop
- Chart.js
- GSAP
- ngx-translate
- SCSS design tokens and module-level styling

## Quick Start

### Prerequisites

- Node.js `>= 20.11.1`
- npm `>= 10`

### Install and Run

```bash
npm ci
npm start
```

Open `http://localhost:4200`.

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start local dev server |
| `npm run start:host` | Start dev server on `0.0.0.0:4200` |
| `npm run build` | Create a default build |
| `npm run build:prod` | Create an optimized production build |
| `npm run build:stats` | Production build with stats output |
| `npm run serve:dist` | Serve built artifacts locally |
| `npm run test` | Run unit tests in watch mode |
| `npm run test:ci` | Run unit tests once (headless) |
| `npm run verify` | Run production build verification |

## Architecture Snapshot

```text
src/app/
|-- core/          # app-wide services, guards, interceptors, config, models
|-- features/      # domain modules: auth, dashboard, projects, tasks, analytics, public, system
|-- layout/        # shell, sidebar, navbar
|-- shared/        # reusable UI components and animations
|-- app.config.ts  # providers, router, interceptors, app initializers
`-- app.routes.ts  # route composition and lazy feature boundaries
```

Detailed docs:

- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `docs/DEPLOYMENT.md`
- `docs/API_CONTRACTS.md`
- `docs/LINKEDIN_KIT.md`

## API Behavior

The UI targets REST endpoints under `/api/*`. If endpoints are unavailable, the app transparently falls back to local mocked responses in service layers so the full product flow remains demoable.

## Deployment

This repository includes deployment-ready configuration for:

- Docker + Nginx (`Dockerfile`, `nginx.conf`)
- Vercel (`vercel.json`)
- Netlify (`netlify.toml`, `public/_redirects`)

See `docs/DEPLOYMENT.md` for full instructions.

## Repository Standards

This repo includes baseline professional project files:

- `LICENSE`
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `.github/workflows/ci.yml`
- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`

## Screenshots

Add product screenshots to `docs/screenshots/` and update references in `docs/SCREENSHOTS.md`.

## License

Released under the MIT License. See `LICENSE`.
