# NextInML

NextInML is a directory for early-stage machine learning students. It lists summer schools, fellowships, and internships, and gives each one a detail page. Program data comes from Airtable when that is configured, and from a built-in sample set otherwise.

This file covers local development and deployment. For how the parts fit together, read [`docs/architecture.md`](docs/architecture.md).

## What it lists

The directory is aimed at students who have finished a first ML course and want a concrete next step. Its main audience is in MENA and Africa, though listings are not limited to those regions. It covers three kinds of opportunity:

- ML summer and winter schools, such as M2L, MENA.ML, Data Science Africa, and AMMI.
- Research fellowships and mentorship programs, such as MATS, SPAR, Pivotal, MARS, and CBAI.
- Internships at research institutes and labs that undergraduates can apply to.

General ML conferences, paid courses, senior job listings, and paper aggregation are out of scope.

Each listing shows when it was last verified, so entries that have gone stale are visible instead of hidden.

## Stack

- TanStack Start (React 19), server-rendered through Nitro.
- Vite 7 for the dev server and the build.
- Tailwind CSS v4 for styling.
- TanStack Router for file-based routes, TanStack Query for client-side data fetching.
- The production build targets Cloudflare Workers.

## Prerequisites

Node 22 (the version CI uses) or Bun. CI installs with npm from `package-lock.json`. A `bun.lock` is also checked in, so Bun works too. Pick one and stay with it, and if you add or change a dependency, update both lockfiles.

## Install

```bash
npm install   # or: bun install
```

## Run the dev server

```bash
npm run dev
```

> [!NOTE]
> The server starts on port 8080. If that port is busy it takes the next free one, so check the startup log for the real URL.

## Scripts

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Starts the Vite dev server.                           |
| `npm run build`     | Builds the app for Cloudflare Workers into `.output`. |
| `npm run preview`   | Serves the production build locally.                  |
| `npm run lint`      | Runs ESLint, including the Prettier check.            |
| `npm run typecheck` | Runs the TypeScript compiler without emitting files.  |
| `npm run format`    | Rewrites files with Prettier.                         |

## Environment variables

Program data loads from Airtable when these are set:

- `AIRTABLE_TOKEN`: a read-only Airtable personal access token.
- `AIRTABLE_BASE_ID`: the base that holds the Programs table.
- `AIRTABLE_TABLE_NAME`: optional, defaults to `Programs`.

Set them in your shell before starting the dev server, or in a gitignored env file your tooling loads (`.dev.vars` and `*.local` are already ignored). Without them, the app falls back to the sample programs in `src/lib/programs.ts`, and the directory shows a note that it is running on sample data. The token is read inside a server function, so it never reaches the browser.

## CI and deployment

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, typecheck, and build on every push and pull request. Run the same three commands locally before pushing to catch failures early.

Pushes to `main` also deploy the build to Cloudflare Workers with Wrangler. The deploy job needs two repository secrets:

- `CLOUDFLARE_API_TOKEN`: an API token with permission to edit Workers.
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account that owns the Worker.

> [!IMPORTANT]
> Until both secrets are set, the deploy job skips with a notice and the site is not published.

The Airtable variables are read at runtime, so they belong on the Worker rather than in GitHub. After the first deploy, set them once with Wrangler:

```bash
npx wrangler secret put AIRTABLE_TOKEN --name stack-42-nextinml
npx wrangler secret put AIRTABLE_BASE_ID --name stack-42-nextinml
```

## Where things live

- `src/routes`: pages and the root shell.
- `src/components`: shared components, with UI primitives under `src/components/ui`.
- `src/lib`: the `Program` type, the Airtable server function, and small date helpers.
- `docs`: architecture notes and the writing guide for project copy.

The full map is in [`docs/architecture.md`](docs/architecture.md).
