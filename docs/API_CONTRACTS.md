# API Contracts and Fallback Behavior

This frontend targets these API paths:

## Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`

Implementation: `src/app/core/services/auth-api.service.ts`

Behavior:

- Attempts real API call first.
- Falls back to deterministic mock responses on request failure.
- Persists mock JWT-style tokens through `JwtService`.

## Projects

- `GET /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects`
- `PATCH /api/projects/:projectId`

Implementation: `src/app/features/projects/services/projects-api.service.ts`

Behavior:

- Attempts real API call first.
- Falls back to in-memory project dataset on failure.
- Simulates latency for realistic loading and UX behavior.

## Interceptor Pipeline

Configured in `src/app/app.config.ts`:

1. `loadingInterceptor`
2. `authInterceptor`
3. `errorInterceptor`

These provide global loading state, auth token handling, refresh retry logic,
and centralized user-facing error messaging.
