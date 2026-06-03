# Roadmap: Forum Demo — Rebuilt-From-Scratch Prototype

## Overview

A high-fidelity, frontend-only prototype that reimagines the current Zoho-embedded
system as a standalone 2026-grade product. The journey: first lock a best-in-class
visual language and a coherent static data model, then build out every module as a
fully-designed rich screen — daily summary, inquiries, customers, donations (Nedarim
Plus), receipts, and tests — then wire the new entities into one connected workflow,
and finish with an end-to-end polish pass. Every screen is driven by static demo data;
the UI itself is the deliverable.

## Domain Expertise

None (no expertise skills installed locally; `~/.claude/skills/expertise/` is empty).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Visual Foundation** - Promote DesignSystem into the canonical source of truth + shared component library
- [ ] **Phase 2: Demo Data Model** - Extend sampleData.ts into a coherent cross-module entity model
- [ ] **Phase 3: Daily Summary** - Full rich סיכום יומי screen
- [ ] **Phase 4: Inquiries** - Full rich ידע-פון / פניות screen
- [ ] **Phase 5: Customer Management** - NEW: customer list + customer-card screens
- [ ] **Phase 6: Donations / Nedarim Plus** - NEW: donation forms + Nedarim Plus dashboard mockup
- [ ] **Phase 7: Receipts** - NEW: receipt list + receipt-document design
- [ ] **Phase 8: Tests** - Full בדיקות screen
- [ ] **Phase 9: Cross-Module Workflow** - Wire customers → donations → receipts into one navigable flow
- [ ] **Phase 10: Polish & Cohesion Pass** - End-to-end visual QA across all screens

## Phase Details

### Phase 1: Visual Foundation
**Goal**: Promote the existing DesignSystem module into the canonical source of truth and build a shared component library (buttons, cards, tables, badges, modals, form controls, layout primitives) that every later screen consumes. Lock the 2026-grade visual language — tokens, spacing, typography, color, motion.
**Depends on**: Nothing (first phase)
**Research**: Likely (tooling/architecture decision)
**Research topics**: Stay on the current CSS-variables approach vs. adopt Tailwind/shadcn (or similar) to raise visual quality; component-library structure for an RTL React app; 2026 design-language references
**Plans**: TBD

Plans:
- [ ] 01-01: TBD during planning

### Phase 2: Demo Data Model
**Goal**: Extend `src/data/sampleData.ts` into a coherent entity model spanning all modules (customers, donations, receipts, inquiries, daily-summary, tests) with relationships so customers ↔ donations ↔ receipts link, making every screen feel alive.
**Depends on**: Phase 1 (consumes shared types/visual primitives where relevant)
**Research**: Unlikely (extends an established internal pattern)
**Plans**: TBD

Plans:
- [ ] 02-01: TBD during planning

### Phase 3: Daily Summary
**Goal**: Full rich סיכום יומי screen replacing the ComingSoon placeholder, driven by demo data.
**Depends on**: Phase 1, Phase 2
**Research**: Unlikely (internal UI using established patterns)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD during planning

### Phase 4: Inquiries
**Goal**: Full rich ידע-פון / פניות screen, driven by demo data.
**Depends on**: Phase 1, Phase 2
**Research**: Unlikely (internal UI using established patterns)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD during planning

### Phase 5: Customer Management
**Goal**: NEW module — customer list view plus a rich customer-card / detail screen at production fidelity.
**Depends on**: Phase 1, Phase 2
**Research**: Unlikely (internal UI using established patterns)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD during planning

### Phase 6: Donations / Nedarim Plus
**Goal**: NEW module — donation forms and a Nedarim Plus dashboard mockup. Visual mockup only, not wired to the real Nedarim Plus API.
**Depends on**: Phase 1, Phase 2
**Research**: Likely (mockup fidelity)
**Research topics**: Real Nedarim Plus donation flow and dashboard layout conventions, so the mockup looks convincing
**Plans**: TBD

Plans:
- [ ] 06-01: TBD during planning

### Phase 7: Receipts
**Goal**: NEW module — receipt list plus a rich receipt-document design, driven by demo data.
**Depends on**: Phase 1, Phase 2
**Research**: Unlikely (internal UI using established patterns)
**Plans**: TBD

Plans:
- [ ] 07-01: TBD during planning

### Phase 8: Tests
**Goal**: Full בדיקות screen replacing the ComingSoon placeholder.
**Depends on**: Phase 1, Phase 2
**Research**: Likely (feature clarification)
**Research topics**: What the בדיקות feature actually does in the production system (`../app/js/*`, `../apps_script_unified/`) so the screen mirrors real behavior
**Plans**: TBD

Plans:
- [ ] 08-01: TBD during planning

### Phase 9: Cross-Module Workflow
**Goal**: Wire customers → donations → receipts into one coherent, navigable flow (e.g., open a customer → see their donations → generate a receipt), so the prototype feels like a connected product rather than isolated screens.
**Depends on**: Phase 5, Phase 6, Phase 7
**Research**: Unlikely (internal integration of already-built screens)
**Plans**: TBD

Plans:
- [ ] 09-01: TBD during planning

### Phase 10: Polish & Cohesion Pass
**Goal**: End-to-end visual QA across every screen — consistency, empty/loading states, micro-interactions, RTL edge cases — ensuring the "2026 feel" holds throughout.
**Depends on**: All prior phases
**Research**: Unlikely (internal refinement)
**Plans**: TBD

Plans:
- [ ] 10-01: TBD during planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Visual Foundation | 0/TBD | Not started | - |
| 2. Demo Data Model | 0/TBD | Not started | - |
| 3. Daily Summary | 0/TBD | Not started | - |
| 4. Inquiries | 0/TBD | Not started | - |
| 5. Customer Management | 0/TBD | Not started | - |
| 6. Donations / Nedarim Plus | 0/TBD | Not started | - |
| 7. Receipts | 0/TBD | Not started | - |
| 8. Tests | 0/TBD | Not started | - |
| 9. Cross-Module Workflow | 0/TBD | Not started | - |
| 10. Polish & Cohesion Pass | 0/TBD | Not started | - |
