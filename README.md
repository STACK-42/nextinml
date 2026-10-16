# NextInML

NextInML is a directory for early-stage machine learning students. It lists summer schools, fellowships, and internships, and gives each one a detail page. Program data comes from Airtable when that is configured, and from a built-in sample set otherwise.

This file covers local development. For how the parts fit together, read `docs/architecture.md`.

## Stack

- TanStack Start (React 19), server-rendered through Nitro.
- Vite 7 for the dev server and the build.
- Tailwind CSS v4 for styling.
- TanStack Router for file-based routes, TanStack Query for client-side data fetching.
- Default build target is Cloudflare Workers.

## Prerequisites

A recent Node LTS, or Bun. Bun is set up here (there is a `bun.lock` and a `bunfig.toml`). npm works too, since a `package-lock.json` is checked in. Pick one and stay with it.

## Install

```bash
bun install   # or: npm install
```

## Run the dev server

```bash
bun run dev   # or: npm run dev
```

> ![NOTE]
> The server starts on port 8080. If that port is busy it takes the next free one, so check the startup log for the real URL.

## Build and preview

```bash
bun run build
bun run preview
```

## Lint and format

```bash
bun run lint
bun run format
```

## Environment variables

Program data loads from Airtable when these are set:

- `AIRTABLE_TOKEN`: a read-only Airtable personal access token.
- `AIRTABLE_BASE_ID`: the base that holds the Programs table.
- `AIRTABLE_TABLE_NAME`: optional, defaults to `Programs`.

Set them in your shell before starting the dev server, or in a gitignored env file your tooling loads (`.dev.vars` and `*.local` are already ignored). Without them, the app falls back to the sample programs in `src/lib/programs.ts`, and the directory shows a note that it is running on sample data. The token is read inside a server function, so it never reaches the browser.

## Where things live

- `src/routes`: pages and the root shell.
- `src/components`: shared components, with UI primitives under `src/components/ui`.
- `src/lib`: the `Program` type, the Airtable server function, and small date helpers.

The full map is in `docs/architecture.md`.
