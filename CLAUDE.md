# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current State

This repository is **pre-code**. The only artifact is `nextinml-brief.md`, a product brief (Draft v1.0, May 2026). There is no application source, package manifest, build system, or tests yet. When implementation begins, update this file with the actual build/lint/test commands and architecture.

Read `nextinml-brief.md` before doing product or design work — it is the source of truth for what NextInML is and, just as importantly, what it deliberately is not.

## What NextInML Is

A **discovery and access platform** for early-stage ML students (primary focus: MENA and Africa, global in scope) who have finished foundational coursework and don't know what concrete next step to take. It sits between "I finished my first ML course" and "I know what I'm doing with my career."

It aggregates and contextualizes three opportunity types:
- **ML summer/winter schools** — the practical learning tracks inside programs (M2L, MENA.ML, Data Science Africa, AMMI), *not* the conference schedules around them.
- **Research fellowships & mentorship programs** (MATS, SPAR, Pivotal, MARS, CBAI).
- **Undergraduate-accessible internships** at research institutes and labs (e.g. MPIA).

It is **not** a course platform, not a job board, and not a paper aggregator.

## Design Constraints That Shape the Code

These come from the brief and should drive technical decisions — treat them as requirements, not nice-to-haves:

1. **The human/editorial layer is the core differentiator.** Every listing carries honest, first-person attendee writeups, not organizer marketing copy. Any data model must treat reviews/experience writeups as first-class entities tied to listings — not an afterthought bolted onto a directory.

2. **Stale data is the primary failure mode.** Opportunity aggregators die when deadlines pass and pages go unmaintained. The data model must support a "last verified" timestamp per listing with clear visual surfacing, and the maintenance workflow (editorial curation + community submissions) is a day-one design concern, not a later feature.

3. **Scope discipline.** Out of scope for now: general ML conferences, paid courses/MOOCs, senior job listings, academic paper aggregation. Resist feature creep toward these.

## Roadmap (from the brief)

- **Phase 1 — Foundation:** curated, manually maintained directory of 30–50 high-quality programs + a handful of honest writeups. Get data hygiene right first.
- **Phase 2 — Community:** open submissions; alumni-authored experiences.
- **Phase 3 — Expansion:** broader taxonomy; filtering by region/format/deadline/field; possible mentorship matching.
- **Phase 4 — Identity:** become the canonical answer to "what's next after my first ML course" for Global South students.

Default to Phase 1 assumptions (manual curation, small dataset) unless told otherwise.
