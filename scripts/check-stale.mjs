// Flags program listings that need a human to re-check them.
//
//   node scripts/check-stale.mjs [hashes.json]
//
// Writes a Markdown report to stdout (empty when nothing needs attention).
// When a hashes file is given, it compares each program page's text against
// the previous run and records the new hashes there, so a changed page
// (new dates, a new call for applications) gets flagged.

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const PROGRAMS_DIR = "content/programs";
const MAX_AGE_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

const hashesPath = process.argv[2];
const oldHashes =
  hashesPath && existsSync(hashesPath) ? JSON.parse(readFileSync(hashesPath, "utf8")) : {};
const newHashes = {};

function toDate(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Page text without markup, scripts, or whitespace differences, so cosmetic
// changes don't trigger a flag. Sites with rotating content will still be noisy.
function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchHash(url) {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
    headers: { "user-agent": "NextInML stale-check (+https://github.com/STACK-42/nextinml)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return createHash("sha256")
    .update(pageText(await res.text()))
    .digest("hex");
}

const now = Date.now();
const files = readdirSync(PROGRAMS_DIR)
  .filter((f) => f.endsWith(".yaml"))
  .sort();

const results = await Promise.all(
  files.map(async (file) => {
    const id = file.replace(/\.yaml$/, "");
    const p = parse(readFileSync(join(PROGRAMS_DIR, file), "utf8"));
    if (p.draft) return null;

    const reasons = [];
    const verified = toDate(p.lastVerified);
    if (!verified) reasons.push("never verified");
    else {
      const days = Math.floor((now - verified.getTime()) / DAY_MS);
      if (days > MAX_AGE_DAYS) reasons.push(`last verified ${days} days ago`);
    }

    const deadline = toDate(p.deadline);
    if (deadline && deadline.getTime() + DAY_MS < now) {
      reasons.push(`deadline ${deadline.toISOString().slice(0, 10)} has passed`);
    }

    try {
      const hash = await fetchHash(p.applicationUrl);
      newHashes[id] = hash;
      if (oldHashes[id] && oldHashes[id] !== hash)
        reasons.push("program page changed since last check");
    } catch (err) {
      if (oldHashes[id]) newHashes[id] = oldHashes[id];
      reasons.push(`page unreachable (${err.message})`);
    }

    return reasons.length > 0 ? { id, name: p.name, url: p.applicationUrl, reasons } : null;
  }),
);

if (hashesPath) writeFileSync(hashesPath, JSON.stringify(newHashes, null, 2) + "\n");

const flagged = results.filter(Boolean);
if (flagged.length > 0) {
  const lines = [
    `${flagged.length} of ${files.length} listings need a look. Check each against its page, update the YAML, and set \`lastVerified\` to the day you checked.`,
    "",
    ...flagged.map(
      (f) =>
        `- [ ] **${f.name}** (\`content/programs/${f.id}.yaml\`, [page](${f.url})): ${f.reasons.join("; ")}`,
    ),
  ];
  process.stdout.write(lines.join("\n") + "\n");
}
