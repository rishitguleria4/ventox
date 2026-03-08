# Codex Session Changes

This file includes only the changes made by Codex in this session.

## 1. Shared Design System

### Updated
- `packages/ui/src/styles/globals.css`

### What changed
- Replaced base theme tokens (light/dark).
- Added premium surface utilities (`glass-panel`, `dashboard-page`, `dashboard-inner`, etc.).
- Added ambient background/motion helpers.

---

## 2. App Typography & Global Shell

### Updated
- `apps/web/app/layout.tsx`
- `apps/widget/app/layout.tsx`

### What changed
- Switched to `Manrope` + `IBM Plex Mono` fonts.
- Kept shared global CSS import and clean body class setup.

---

## 3. Dashboard Layout + Sidebar

### Updated
- `apps/web/modules/dashboard/ui/layouts/dashboard-layout.tsx`
- `apps/web/modules/dashboard/ui/components/dashboard-sidebar.tsx`

### What changed
- Added ambient visual layers in dashboard shell.
- Reworked sidebar styling and active navigation states.
- Improved Clerk switcher/user button appearance integration.

---

## 4. Auth Experience Styling

### Updated
- `apps/web/modules/auth/ui/layouts/auth-layout.tsx`
- `apps/web/modules/auth/ui/views/sign-in-view.tsx`
- `apps/web/modules/auth/ui/views/sign-up-view.tsx`
- `apps/web/modules/auth/ui/views/org-select-view.tsx`

### What changed
- Moved auth pages from basic centered layout to branded glass/split presentation.

---

## 5. Dashboard Route Pages

### Updated
- `apps/web/app/(dashboard)/page.tsx`
- `apps/web/app/(dashboard)/conversations/page.tsx`
- `apps/web/app/(dashboard)/files/page.tsx`
- `apps/web/app/(dashboard)/customizations/page.tsx`
- `apps/web/app/(dashboard)/integrations/page.tsx`
- `apps/web/app/(dashboard)/plugins/vapi/page.tsx`
- `apps/web/app/(dashboard)/billing/page.tsx`

### What changed
- Replaced placeholder UI with structured sections/cards and consistent styling.
- Preserved existing Convex data interaction on dashboard home.

---

## 6. Widget UI Refresh

### Updated
- `apps/widget/modules/widget/ui/components/widget-header.tsx`
- `apps/widget/modules/widget/ui/components/widget-footer.tsx`
- `apps/widget/modules/widget/ui/views/widget-view.tsx`

### What changed
- Redesigned widget to a polished chat-shell style layout.

---

## 7. Dev Runtime Fixes (Turbo/Next)

### Updated
- `apps/web/next.config.mjs`
- `apps/widget/next.config.mjs`
- `packages/ui/src/components/toggle-group.tsx`

### Renamed
- `apps/web/middleware.ts` -> `apps/web/proxy.ts`

### What changed
- Set explicit `turbopack.root` in both apps.
- Fixed invalid utility class in toggle group (`gap-[var(--gap)]` + px-based variable value).
- Migrated middleware convention to Next 16 `proxy.ts`.

---

## 8. Documentation Added By Codex

### Added
- `README.md` was replaced with project-specific implementation documentation.
- `CODEX_CHANGES.md` (this file) added as a strict Codex-only change log.

