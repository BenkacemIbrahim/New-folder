# Development Guide

## Prerequisites

- Node.js `>= 20.11.1`
- npm `>= 10`

## Install

```bash
npm ci
```

## Run Locally

```bash
npm start
```

The app runs at `http://localhost:4200`.

## Build Commands

```bash
npm run build
npm run build:prod
npm run build:stats
npm run serve:dist
```

## Validation Commands

```bash
npm run verify
npm run test:ci
```

## Development Conventions

- Keep features isolated in `src/app/features/<feature-name>`.
- Place cross-cutting services and models in `src/app/core`.
- Add reusable primitives in `src/app/shared`.
- Keep route-level metadata updated for SEO (`data.seo`).
- Prefer strict typing over implicit any.
- Update i18n keys under `public/assets/i18n/*.json` when UI copy changes.

## Common Troubleshooting

### Build warnings for component style budgets

Component style budgets are configured in `angular.json`. If a component style
sheet grows, either refactor styles or consciously adjust thresholds.

### API endpoints unavailable locally

This app has service-level mock fallbacks for auth and project flows, so the UI
remains functional without a live backend.

### Headless tests fail in local environment

Karma requires a Chrome/Chromium runtime. Install Chrome and rerun
`npm run test:ci`.
