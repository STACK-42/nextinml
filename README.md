<a href="https://nextinml.stack42.tech">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner-dark.png" />
    <img alt="NextInML: your next step in ML, finally visible." src=".github/assets/banner-light.png" />
  </picture>
</a>

[![CI](https://img.shields.io/github/actions/workflow/status/STACK-42/nextinml/ci.yml?branch=main&label=CI)](https://github.com/STACK-42/nextinml/actions/workflows/ci.yml)

NextInML is a directory for early-stage machine learning students. It lists summer schools, fellowships, and internships, gives each one a detail page, and carries first-person writeups from people who attended.

The site is static. All content lives in this repo as YAML and Markdown, and Astro builds it to plain HTML. There is no backend, database, or third-party data service.

For how the parts fit together, read [`docs/architecture.md`](docs/architecture.md).

## Stack

- [Astro](https://astro.build) 7, static output, with content collections for the data.
- React for the one interactive part, the filter bar on `/programs`.
- Tailwind CSS v4.
- Cloudflare (static assets on Workers) for hosting.

## Develop

Node 22.22 or newer. npm is what CI uses; a `bun.lock` is kept in sync too.

```bash
npm install
npm run dev       # http://localhost:4321
```

Other scripts:

```bash
npm run build     # static site into dist/
npm run preview   # serve dist/ locally
npm run check     # typecheck, including .astro files
npm run lint
npm run format
```

## Adding or updating a program

Each program is one file in `content/programs/`. The file name is the program's id and its URL, so `content/programs/m2l.yaml` becomes `/programs/m2l`.

```yaml
name: Mediterranean Machine Learning Summer School
type: Summer School # Summer School | Winter School | Fellowship | Internship
organizer: Google DeepMind scientists & University of Split (FESB)
description: One or two sentences for the card.
region: Mediterranean # Global | Africa | MENA | Mediterranean | Europe | Asia | Americas
format: In-person # In-person | Remote | Hybrid
deadline: 2027-03-01 # or null for rolling / not announced
deadlineNote: 2027 call to be announced # optional, explains a null or unusual deadline
applicationUrl: https://www.m2lschool.org/
lastVerified: 2026-10-17 # the day you checked it against the program's page
```

Optional fields for the detail page: `longDescription`, `location`, `dates`, `duration`, `eligibility`, `cost`, `topics` (a list), and `draft: true` to keep a listing off the site while you work on it. The full schema is in [`src/content.config.ts`](src/content.config.ts).

> [!IMPORTANT]
> Only set `lastVerified` after checking the listing against the program's own page. Every card shows "Verified <date>", and that label is only useful if it is true. Listings unverified or verified more than 90 days ago are marked in vermilion.

A file that breaks the schema (an unknown `type`, a malformed date, a missing field) fails the build with an error naming the file.

## Adding a writeup

Copy [`content/writeups/_template.md`](content/writeups/_template.md) to `content/writeups/<program>-<cohort>-<author>.md`, fill in the frontmatter, and write the body in Markdown. The `program` field must match a program's file name. The writeup then appears on that program's page. A writeup pointing at a program that doesn't exist fails the build.

## Keeping listings fresh

A weekly workflow ([`.github/workflows/stale-check.yml`](.github/workflows/stale-check.yml)) flags listings that were never verified, were verified more than 90 days ago, have a passed deadline, have an unreachable page, or whose page text changed since the last run. It keeps one open issue labeled `stale-check` up to date. Run it locally with:

```bash
node scripts/check-stale.mjs
```

## Deploy

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) lints, typechecks, and builds on every push and pull request, then deploys `dist/` to Cloudflare from `main`. It also rebuilds daily, because deadline and "verified" labels are computed at build time.

Deploys need two repository secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Without them the deploy step is skipped and the rest of CI still runs.
