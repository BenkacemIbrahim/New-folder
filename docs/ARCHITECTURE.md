# Architecture

## System Goals

Enterprise Workspace is designed as a modular frontend platform for enterprise
operations. It prioritizes:

- Feature isolation through lazy route boundaries
- Shared platform services in a centralized `core` layer
- UI consistency through reusable shared components and design tokens
- Performance-conscious rendering and motion

## High-Level Module Layout

```text
src/app/
|-- core/
|   |-- config/        # app constants, nav config, i18n setup, theme config
|   |-- guards/        # auth and guest route guards
|   |-- interceptors/  # loading, auth, error HTTP lifecycle control
|   |-- models/        # shared domain models
|   `-- services/      # cross-cutting platform services
|-- features/
|   |-- public/        # landing/marketing experience
|   |-- auth/          # login/register flows
|   |-- dashboard/     # KPI + chart surface
|   |-- projects/      # portfolio list/detail/settings workflows
|   |-- tasks/         # Kanban board and task detail drawer
|   |-- analytics/     # analytics module route/pages
|   `-- system/        # error and not-found routes
|-- layout/            # authenticated shell, navbar, sidebar
`-- shared/            # reusable components, ui primitives, animations
```

## Routing Strategy

- Root public routes load marketing pages.
- `/auth/*` routes are protected by `guestGuard`.
- Authenticated shell routes are protected by `authGuard` and lazy-loaded by feature.
- Error and not-found pages are explicit route-level experiences.

Primary route composition lives in `src/app/app.routes.ts`.

## Cross-Cutting Platform Services

- `AuthService`: session lifecycle, login/register/logout orchestration.
- `JwtService`: token persistence and expiry handling.
- `TranslationService`: language/locale/direction with document-level RTL updates.
- `ThemeService`: theme persistence and runtime token application.
- `SeoService`: route-aware title/meta/robots/canonical management.
- `LoadingService`: global request activity state.
- `ToastService`: global user feedback pipeline.

## HTTP Interceptors

- `loadingInterceptor`: request lifecycle loading state.
- `authInterceptor`: bearer token injection + refresh retry behavior.
- `errorInterceptor`: user-facing handling for network/permission/not-found/server errors.

## UI Composition Principles

- Standalone components with feature-local styles.
- Shared primitives for consistency (`metric-card`, `page-header`, global loader, toast outlet).
- SCSS tokens and mixins to keep visual rules centralized.
- Motion tuned for feedback and reduced-motion accessibility.

## Data and API Pattern

The app calls `/api/*` endpoints first. When no backend is connected, services
fallback to local mock data and simulated latency, allowing complete product
demos without server dependencies.
