import { getCollection, type CollectionEntry } from "astro:content";

import type { Program } from "./programs";

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

// Published programs, open deadlines first (soonest at the top), then
// rolling or unannounced ones, then closed ones.
export async function getPrograms(): Promise<Program[]> {
  const entries = await getCollection("programs", (e) => !e.data.draft);
  const today = new Date().toISOString().slice(0, 10);
  const rank = (p: Program) => (p.deadline === null ? 1 : p.deadline < today ? 2 : 0);
  return entries.map(toProgram).sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    return (a.deadline ?? "").localeCompare(b.deadline ?? "") || a.name.localeCompare(b.name);
  });
}
