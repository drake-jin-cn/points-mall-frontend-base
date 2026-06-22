# points-mall-frontend-base

> Shared NPM component library — the frontend infrastructure layer. Published to NPM and consumed by `points-mall-frontend`. Mirrors real enterprise practices where a platform team maintains base components used across product teams.

[![npm version](https://img.shields.io/npm/v/@your-scope/points-mall-base.svg)](https://www.npmjs.com/package/@your-scope/points-mall-base)

## What This Package Provides

### Layout Components
- `AppShell` — root layout with sidebar + topbar + content area
- `Sidebar` — permission-driven navigation menu (driven by API response)
- `Topbar` — user avatar, notification bell, global search, theme toggle
- `PageContainer` — consistent page padding, breadcrumb, page title slot
- `EmptyState`, `SkeletonLoader`, `ErrorFallback` — universal UI states

### Auth & Permission Hooks
- `useAuth()` — current user, logout, session status
- `usePermission(permissionKey)` — returns `{ visible, disabled }` for button-level control
- `useRouteGuard()` — client-side route protection helper

### HTTP Infrastructure
- Pre-configured `axios` instance with:
  - Request interceptor: inject JWT, base URL prefix, timestamp header
  - Response interceptor: unwrap response envelope, unified error toast
  - 401 handler: silent refresh token flow
  - API fallback: return static placeholder data on network failure

### Global State Stores (Zustand)
- `useAuthStore` — user info, token, login/logout actions
- `useThemeStore` — dark/light mode, persisted to localStorage
- `useConfigStore` — global feature flags, menu config, announcement data

### UI Utilities
- Global dark/light theme variables (CSS custom properties)
- `formatCurrency(amount, locale)`, `formatDate(date, timezone)`, `maskSensitive(str)` helpers
- `useTableConfig()` — persisted column visibility + width preferences per table key
- `usePageState()` — preserve filter/pagination state when navigating away and back

## Installation

```bash
# Install from NPM
npm install @your-scope/points-mall-base
# or
pnpm add @your-scope/points-mall-base
```

## Usage

```tsx
import { AppShell, useAuth, usePermission } from '@your-scope/points-mall-base'

export default function DashboardLayout({ children }) {
  return <AppShell>{children}</AppShell>
}
```

## Local Development (pnpm link)

```bash
# In this package:
pnpm install
pnpm run build  # or pnpm run dev for watch mode
pnpm link --global

# In points-mall-frontend:
pnpm link --global @your-scope/points-mall-base
```

## Build & Publish

```bash
pnpm run build      # Rollup: ESM + CJS dual output + .d.ts declarations
pnpm run storybook  # Launch Storybook component docs at http://localhost:6006
pnpm run publish:npm  # Semantic version bump + npm publish
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18, TypeScript |
| Styling | TailwindCSS (peer dependency) |
| Bundler | Rollup — ESM + CommonJS dual output |
| Type Declarations | TypeScript compiler (`tsc --emitDeclarationOnly`) |
| Component Docs | Storybook 8 |
| Testing | Vitest + @testing-library/react |
| Linting | ESLint + Prettier |

## Package Outputs

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## Storybook

All exported components are documented in Storybook with:
- Interactive prop controls
- Usage code examples
- Accessibility notes
- Dark/light theme preview
