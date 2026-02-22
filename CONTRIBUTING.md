# Contributing Guide

Thanks for contributing to Enterprise Workspace.

## Development Setup

1. Install Node.js `>= 20.11.1` and npm `>= 10`.
2. Install dependencies:

```bash
npm ci
```

3. Start development server:

```bash
npm start
```

## Branching

- Use short, purpose-driven branch names.
- Recommended pattern: `type/scope-short-description`.
- Examples:
  - `feat/projects-sort-improvements`
  - `fix/auth-refresh-loop`
  - `docs/readme-cleanup`

## Commit Messages

Use clear, imperative messages.

- Good: `feat: add project settings autosave indicator`
- Good: `fix: prevent duplicate refresh retries in auth interceptor`
- Good: `docs: expand deployment playbook`

## Pull Request Expectations

Before opening a PR:

1. Run `npm run build:prod`.
2. Run relevant local tests (`npm run test:ci`) if your environment supports headless browser execution.
3. Ensure docs are updated for behavioral/config/API changes.
4. Keep PRs focused and reviewable.

## Definition of Done

- Feature or fix is functionally complete.
- No new warnings/errors in build output.
- Documentation is updated.
- PR includes concise testing notes.
