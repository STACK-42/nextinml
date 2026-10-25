import { getCollection, type CollectionEntry } from "astro:content";

import { programStatus, type Program } from "./programs";

function isoDate(d: Date | null | undefined): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}

export function toProgram(entry: CollectionEntry<"programs">): Program {
  const { draft: _draft, deadline, lastVerified, ...rest } = entry.data;
  return {
    ...rest,
    id: entry.id,
    deadline: isoDate(deadline),
    lastVerified: isoDate(lastVerified),
  };
}

// Published writeups for one program, newest first.
export async function getWriteups(programId: string) {
  const entries = await getCollection(
    "writeups",
    (e) => !e.data.draft && e.data.program.id === programId,
  );
  return entries.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

// Astro only logs a broken reference, so a writeup pointing at a missing or
// draft program would silently vanish. Throwing here fails the build instead.
export async function assertWriteupsHavePrograms(programs: Program[]) {
  const ids = new Set(programs.map((p) => p.id));
  const orphans = (await getCollection("writeups", (e) => !e.data.draft)).filter(
    (w) => !ids.has(w.data.program.id),
  );
  if (orphans.length > 0) {
    const list = orphans.map((w) => `${w.id} -> ${w.data.program.id}`).join(", ");
    throw new Error(`Writeups reference programs that don't exist or are drafts: ${list}`);
  }
}

// Published programs, open deadlines first (soonest at the top), then
// rolling or unannounced ones, then closed ones.
export async function getPrograms(): Promise<Program[]> {
  const entries = await getCollection("programs", (e) => !e.data.draft);
  const rank = (p: Program) => (programStatus(p) === "closed" ? 2 : p.deadline === null ? 1 : 0);  return entries.map(toProgram).sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    return (a.deadline ?? "").localeCompare(b.deadline ?? "") || a.name.localeCompare(b.name);
  });
}
