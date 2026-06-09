# Plan: NextInML — Airtable-backed Next.js listing site (minimal Phase 1)

## Context

NextInML (see `nextinml-brief.md`) is a discovery platform for early-stage ML students. Phase 1 is a curated directory of 30–50 programs that a non-technical editor maintains by hand, where **stale data is the primary failure mode** (every listing needs a visible "last verified" signal).

The repo is currently empty except the brief. We're scaffolding the first working version. **Airtable** acts as the content database (a spreadsheet-like grid the editor uses with no code), and a **Next.js** site reads it. To keep the Airtable API token secret and the site fast/free, the site is **statically built** and **rebuilt on a schedule** — so "fetch periodically" is implemented as "regenerate periodically" rather than browser polling.

Confirmed decisions:
- **Data refresh:** scheduled rebuild (static generation + Incremental Static Regeneration).
- **Framework:** Next.js (App Router, TypeScript), deployed free on Vercel.
- **Schema scope:** a single `Programs` table for now; reviews come later.

No existing code to reuse — this is greenfield.

## How the pieces fit

```
Editor edits grid → Airtable base (Programs table)
                          │  REST API (Bearer token, server-side only)
                          ▼
        Next.js build / ISR revalidate reads records
                          │
                          ▼
        Static HTML pages (program cards) → Vercel CDN → visitor
                          ▲
        Vercel Cron (hourly) triggers revalidate so data refreshes
        even with zero traffic
```

The Airtable token lives only in server-side build/runtime env vars — it is never shipped to the browser.

## Step 1 — Airtable setup (done in the Airtable UI, no code)

Create a base "NextInML" with one table **Programs** and these fields:

| Field | Type | Notes |
|---|---|---|
| Name | Single line text | |
| Type | Single select | Summer School / Winter School / Fellowship / Internship |
| Description | Long text | |
| Region | Single line or multi-select | e.g. MENA, Africa, Global |
| Format | Single select | In-person / Remote / Hybrid |
| Deadline | Date | |
| ApplicationURL | URL | |
| LastVerified | Date | drives the stale-data badge |
| Status | Single select | Published / Draft — only `Published` is shown |

Add ~3–5 sample rows. Then create a **Personal Access Token** scoped **read-only** (`data.records:read`) to this one base. Note the **Base ID** (from the API docs page for the base).

## Step 2 — Scaffold the Next.js app

In the repo root:
- `npx create-next-app@latest` — TypeScript, App Router, ESLint, no `src/` needed. Keeps the brief and CLAUDE.md in place.
- Add `.env.local` (gitignored) and document the keys in `.env.example`:
  ```
  AIRTABLE_TOKEN=...
  AIRTABLE_BASE_ID=...
  AIRTABLE_TABLE_NAME=Programs
  ```

## Step 3 — Airtable data module (`lib/airtable.ts`)

A single thin module — no SDK needed, use `fetch` so it plugs into Next's cache:
- `getPrograms()`: `fetch` `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}` with `Authorization: Bearer ${TOKEN}` and `next: { revalidate: 3600 }` (this is the periodic-refresh knob).
- Map each record's `fields` into a typed `Program` object; filter to `Status === "Published"`; sort by `Deadline` ascending.
- Handle Airtable pagination (`offset`) — trivial at this scale but include the loop so it doesn't silently cap at 100 records.

## Step 4 — UI (App Router, server components)

- `app/page.tsx` — server component; calls `getPrograms()` and renders a responsive grid of cards. Because it's a server component, the token stays server-side and the data is baked into static HTML.
- `components/ProgramCard.tsx` — Name, a Type badge, Region · Format, Deadline, an **"Verified <relative time> ago"** indicator derived from `LastVerified` (the brief's anti-stale-data requirement), and an "Apply / Learn more" link to `ApplicationURL`.
- Minimal styling via the Tailwind option from create-next-app (or plain CSS modules). No client-side filtering in Phase 1 — keep it to the list; filtering is a Phase 3 item.

## Step 5 — Deploy + scheduled rebuild

- Push to GitHub, import into **Vercel**, set the three env vars in the Vercel dashboard.
- Guarantee periodic freshness even with no traffic: add `vercel.json` with a **Cron** entry hitting a small `app/api/revalidate/route.ts` (calls `revalidatePath('/')`) on an hourly schedule. (ISR's `revalidate: 3600` already refreshes on traffic; the cron covers idle periods.)

## Verification

1. `npm run dev` → home page lists the sample programs pulled from Airtable, only `Published` rows, sorted by deadline, each card showing the "Verified … ago" badge.
2. Edit a record in Airtable (e.g. change a name or `LastVerified`); after the revalidate window (or by hitting the `/api/revalidate` route locally) the change appears — confirms the periodic-read path works.
3. Confirm the token is server-only: search the built client bundle / browser network tab — there should be **no** request to `api.airtable.com` from the browser and no token string in client JS.
4. Set a row to `Draft` → it disappears from the site.

## Out of scope for this plan (later phases)
Reviews/experience writeups (Phase 1→2), community submissions, region/format/deadline filtering and mentorship matching (Phase 3). Schema is intentionally a single table now.
