# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current State

A static Astro site with all content in the repo. No backend, database, or external data service. Phase 1: a small, manually curated set of programs.

- `npm run dev` (port 4321), `npm run build` (into `dist/`), `npm run check` (typecheck incl. `.astro`), `npm run lint`, `npx prettier --check .`. CI runs all of these.
- Programs: `content/programs/<id>.yaml`. Writeups: `content/writeups/*.md`. The schema is `src/content.config.ts`; the build fails on invalid content or a writeup pointing at a missing program.
- Only `src/lib/content.ts` queries collections. `src/lib/programs.ts` must stay free of `astro:content` because the React filter island imports it.
- Never set `lastVerified` on a listing unless someone actually checked it against the program's page. Never invent writeups or sample reviews.
- `scripts/check-stale.mjs` + `.github/workflows/stale-check.yml` flag listings to re-verify.
- Architecture: `docs/architecture.md`. Writing style for any prose (docs, site copy): `docs/features.md`.

The product brief was removed from the working tree; read it with `git show c380582:nextinml-brief.md` before product or design work. It is the source of truth for what NextInML is and, just as importantly, what it deliberately is not.

## What NextInML Is

A **discovery and access platform** for early-stage ML students (primary focus: MENA and Africa, global in scope) who have finished foundational coursework and don't know what concrete next step to take. It sits between "I finished my first ML course" and "I know what I'm doing with my career."

It aggregates and contextualizes three opportunity types:

- **ML summer/winter schools** — the practical learning tracks inside programs (M2L, MENA.ML, Data Science Africa, AMMI), _not_ the conference schedules around them.
- **Research fellowships & mentorship programs** (MATS, SPAR, Pivotal, MARS, CBAI).
- **Undergraduate-accessible internships** at research institutes and labs (e.g. MPIA).

It is **not** a course platform, not a job board, and not a paper aggregator.

## Design Constraints That Shape the Code

These come from the brief and should drive technical decisions — treat them as requirements, not nice-to-haves:

1. **The human/editorial layer is the core differentiator.** Every listing carries honest, first-person attendee writeups, not organizer marketing copy. Any data model must treat reviews/experience writeups as first-class entities tied to listings — not an afterthought bolted onto a directory.

2. **Stale data is the primary failure mode.** Opportunity aggregators die when deadlines pass and pages go unmaintained. Every listing surfaces its "last verified" date, and the maintenance workflow (editorial curation, the weekly stale check, later community submissions) is a day-one design concern, not a later feature.

3. **Scope discipline.** Out of scope for now: general ML conferences, paid courses/MOOCs, senior job listings, academic paper aggregation. Resist feature creep toward these.

## Roadmap (from the brief)

- **Phase 1 — Foundation:** curated, manually maintained directory of 30–50 high-quality programs + a handful of honest writeups. Get data hygiene right first.
- **Phase 2 — Community:** open submissions; alumni-authored experiences.
- **Phase 3 — Expansion:** broader taxonomy; filtering by region/format/deadline/field; possible mentorship matching.
- **Phase 4 — Identity:** become the canonical answer to "what's next after my first ML course" for Global South students.

Default to Phase 1 assumptions (manual curation, small dataset) unless told otherwise.
