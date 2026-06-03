# Forum Demo — Rebuilt-From-Scratch Prototype

## What This Is

A high-fidelity, frontend-only prototype (this app — the `Demo/` project root for planning) that shows how the current Zoho-embedded system would look and feel if rebuilt from scratch as a standalone product. It renders every feature — the existing ones (inbox, daily summary, ידע-פון inquiries, search, tests) plus new ones (customer management, donation management via Nedarim Plus, receipts) — as rich, fully-designed screens driven entirely by static demo data. The goal is a 2026-grade visual language and UX that defines the target design and architecture for a future real build off Zoho.

## Core Value

The visual language and "2026 feel" — every screen must look modern, polished, and best-in-class. The UI itself is the star; if the design isn't top-tier, the prototype hasn't succeeded.

## Requirements

### Validated

<!-- Inferred from the existing codebase — already built and working. -->

- ✓ React + TypeScript + Vite scaffold — existing
- ✓ RTL / Hebrew layout throughout — existing
- ✓ App shell: TopBar + Sidebar + workspace routing across modules — existing
- ✓ Decorative Login screen — existing
- ✓ Dashboard module — existing
- ✓ Inbox module — existing
- ✓ DesignSystem module (the shared visual base) — existing
- ✓ Static sample-data layer (`data/sampleData.ts`) with avatar gradients, badges, email shapes — existing

### Active

<!-- Current scope. Building toward these. Hypotheses until shipped. -->

- [ ] Lock a 2026-grade visual language across the whole app (extend the DesignSystem module into the source of truth)
- [ ] Daily Summary (סיכום יומי) — full rich screen
- [ ] Inquiries / ידע-פון (פניות) — full rich screen
- [ ] Customer management (ניהול לקוחות) — NEW, full rich screens (lists + customer cards)
- [ ] Donation management via Nedarim Plus (נדרים פלוס) — NEW, full rich mockup screens (donation forms, Nedarim Plus dashboard)
- [ ] Receipts (קבלות) — NEW, full rich screen
- [ ] Tests (בדיקות) — full screen
- [ ] Demo data extended to cover all new modules so every screen feels alive
- [ ] Show how customers ↔ donations ↔ receipts connect into one coherent workflow

### Out of Scope

<!-- Explicit boundaries with reasoning. -->

- Real backend / API / database — purely static demo data; this is a visual prototype, not a working product
- Real authentication / login — the Login screen is decorative only, no real users or credentials
- Real Nedarim Plus integration — the Nedarim Plus screens are visual mockups, not wired to their actual API
- Mobile responsiveness — desktop-first for v1; full mobile comes later
- Zoho coupling — the whole point is to show the system *outside* Zoho

## Context

- This is a **brownfield** effort: this app already exists with a partial build (App shell, Login, Dashboard, Inbox, DesignSystem) and placeholder `ComingSoon` screens for every remaining module.
- The real production system lives in the parent repo (one level up): Apps Script (`../apps_script_unified/`, `../Code.gs`), a vanilla-JS client (`../app/js/*`), and Deluge functions. Those define the *behavior* being reimagined — the prototype mirrors their features without their implementation.
- Known module keys already wired in the shell: `design`, `dashboard`, `inbox`, `daily`, `inquiries`, `customers`, `receipts`, `nedarim`, `tests`.
- The sample-data layer (`src/data/sampleData.ts`) is the established pattern for feeding screens — new modules should extend it.

## Constraints

- **Tech stack**: Stay on React + TypeScript + Vite — continue the existing stack, no technology swap.
- **Language / direction**: Full RTL + Hebrew across every screen.
- **Design bar**: 2026-grade, highest-tier UX/UI. A heavy component library isn't required, but Tailwind/shadcn or similar is allowed if it raises the visual quality.
- **Data**: Static demo data only — no live calls.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Frontend-only prototype, static demo data | Goal is to define target UX/architecture before a real build, not to ship a working product | — Pending |
| Treat the demo as a prototype toward a real off-Zoho build (not just a pitch mockup) | It will inform the real architecture, so design/component decisions carry weight | — Pending |
| Visual language / "2026 feel" is the single core priority | If the design isn't best-in-class the prototype fails its purpose | — Pending |
| New features (customers, Nedarim Plus, receipts) get full rich screens | They must be evaluated at production fidelity, not as stubs | — Pending |
| Continue on existing React + TS + Vite stack | Avoid rework; the scaffold and DesignSystem base already exist | — Pending |

---
*Last updated: 2026-06-03 after initialization*
