# Architecture

This document describes how the NextInML web app is put together. For setup and commands, see the root `README.md`.

## Overview

NextInML is a server-rendered React app built on TanStack Start. Routes are plain files under `src/routes`. The TanStack Router plugin reads those files and generates `src/routeTree.gen.ts`, so you do not edit the route tree by hand. SSR runs through Nitro, with `src/server.ts` as the server entry (a thin error wrapper around the bundled entry).

## Routing

File-based, under `src/routes`:

- `__root.tsx`: the shell. It sets the HTML document, the head meta, the `QueryClientProvider`, and the error and not-found boundaries. Child routes render through its `Outlet`.
- `index.tsx`: the home page.
- `programs.tsx`: the directory at `/programs`. Filter state lives in the URL search params, validated with zod.
- `programs_.$programId.tsx`: the detail page at `/programs/$programId`. The trailing underscore keeps this route out of the `/programs` layout, so it renders on its own rather than inside the listing. (We hit that early: without the underscore, navigating to a program showed the listing again and the detail body never appeared.)

## Data flow

Program data has one source: `getPrograms` in `src/lib/airtable.functions.ts`. It is a TanStack server function, so it runs on the server only. When `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` are set, it calls the Airtable REST API, pages through all records, keeps the ones with `Status` set to `Published`, maps each record to the `Program` type, and sorts by deadline. When those variables are missing, or the request fails, it returns the sample programs from `src/lib/programs.ts` and marks the source as `mock`.

Pages call this through `useServerFn(getPrograms)` inside a TanStack Query `useQuery` keyed `["programs"]`. The fetch runs on the client after hydration, and the directory and the detail page share the same cached result, so opening a program does not refetch.

The `Program` type and two helpers (`verifiedAgo`, `formatDeadline`) live in `src/lib/programs.ts`. A program carries the core fields plus optional ones: `longDescription`, `location`, `dates`, `duration`, `deadlineNote`, `cost`, `eligibility`, and `topics`. The detail page hides any section whose field is empty, so a sparse program still renders cleanly.

## Styling

Tailwind v4 through the Vite plugin. Global styles and CSS variables (for example `--primary` and `--accent`) sit in `src/styles.css`.

## Web features

What a visitor can actually do:

- Home page. A short intro, the three program types, a count per type drawn from the loaded data, a small featured set, and links into the directory.
- Programs directory (`/programs`). All published programs as cards. Filters for type, region, format, and deadline. Filter state is held in the URL, so a filtered view can be shared or bookmarked, and a count shows how many programs match.
- Program detail (`/programs/$programId`). Full information for one program: deadline (or a custom note when there is no open date), format, region, and whichever of location, dates, and duration exist, followed by the description and the topics, eligibility, and cost sections when present. An external link points to the program's own application page. A program id that does not exist gets a not-found state with a link back to the directory.
- Last-verified indicator. Each card and detail page shows how long ago the listing was checked, derived from `lastVerified`. The point is to make stale entries visible instead of hiding them.
- Sample-data fallback. When Airtable is not configured, the app still runs on the built-in sample programs, and the directory says so plainly.

## Build and deploy

The default Nitro target is Cloudflare Workers. On Cloudflare, environment values bind per request, not at module load. So server code reads `process.env` inside handlers rather than at module scope. `src/lib/config.server.ts` documents the pattern and the `.server.ts` suffix that keeps a file out of the client bundle.
