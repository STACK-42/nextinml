// Plain program shape shared by Astro pages and the React filter island.
// Dates are ISO strings (YYYY-MM-DD) so the data serializes cleanly into
// island props. Load programs through src/lib/content.ts, not from here.

export type ProgramType = "Summer School" | "Winter School" | "Fellowship" | "Internship";

export type ProgramFormat = "In-person" | "Remote" | "Hybrid";

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  region: string;
  format: ProgramFormat;
  deadline: string | null;
  deadlineNote?: string;
  applicationUrl: string;
  lastVerified: string | null;
  organizer?: string;

  // Optional detail, shown on the program page when present.
  longDescription?: string;
  location?: string;
  dates?: string;
  duration?: string;
  cost?: string;
  eligibility?: string;
  topics: string[];
}

// The three opportunity types from the brief. Summer and winter schools are
// one section; the directory's type filter and the home page use these ids.
export const sections = [
  { id: "schools", label: "Summer & Winter Schools", types: ["Summer School", "Winter School"] },
  { id: "fellowships", label: "Fellowships", types: ["Fellowship"] },
  { id: "internships", label: "Internships", types: ["Internship"] },
] as const satisfies readonly { id: string; label: string; types: readonly ProgramType[] }[];

export type SectionId = (typeof sections)[number]["id"];

export function inSection(p: Pick<Program, "type">, id: string): boolean {
  const section = sections.find((s) => s.id === id);
  return section !== undefined && (section.types as readonly string[]).includes(p.type);
}

const DAY_MS = 1000 * 60 * 60 * 24;

// After this many days a verified listing is shown as possibly out of date.
export const STALE_AFTER_DAYS = 90;

export function verifiedLabel(iso: string | null): string {
  return iso ? `Verified ${formatDate(iso, true)}` : "Not verified";
}

export function isStale(iso: string | null, now = Date.now()): boolean {
  return iso === null || now - new Date(iso).getTime() > STALE_AFTER_DAYS * DAY_MS;
}

export function isPast(iso: string | null, now = Date.now()): boolean {
  return iso !== null && new Date(iso).getTime() + DAY_MS < now;
}

export type DeadlineState = "open" | "closed" | "tba" | "rolling";

export function deadlineState(p: Pick<Program, "deadline" | "deadlineNote">): DeadlineState {
  if (!p.deadline) return p.deadlineNote ? "tba" : "rolling";
  return isPast(p.deadline) ? "closed" : "open";
}

// Text for the bar at the bottom of a card.
export function deadlineCta(p: Pick<Program, "deadline" | "deadlineNote">): string {
  switch (deadlineState(p)) {
    case "open":
      return `Apply by ${formatDate(p.deadline!, false)}`;
    case "closed":
      return `Closed ${formatDate(p.deadline!, true)}`;
    case "tba":
      return "Dates to be announced";
    case "rolling":
      return "Rolling applications";
  }
}

// Longer label for the detail page.
export function deadlineLabel(p: Pick<Program, "deadline" | "deadlineNote">): string {
  if (p.deadlineNote) return p.deadlineNote;
  if (!p.deadline) return "Rolling";
  const date = formatDate(p.deadline, true);
  return isPast(p.deadline) ? `Closed (${date})` : date;
}

function formatDate(iso: string, withYear: boolean): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });
}
