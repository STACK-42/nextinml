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

const DAY_MS = 1000 * 60 * 60 * 24;

export function verifiedAgo(iso: string | null, now = Date.now()): string {
  if (!iso) return "Not verified";
  const days = Math.floor((now - new Date(iso).getTime()) / DAY_MS);
  if (days < 1) return "Verified today";
  if (days < 7) return `Verified ${days}d ago`;
  if (days < 30) return `Verified ${Math.floor(days / 7)}w ago`;
  if (days < 365) return `Verified ${Math.floor(days / 30)}mo ago`;
  return `Verified ${Math.floor(days / 365)}y ago`;
}

export function isPast(iso: string | null, now = Date.now()): boolean {
  return iso !== null && new Date(iso).getTime() + DAY_MS < now;
}

// Short label for cards: a date, "Closed", "TBA" when there is a note
// explaining the missing date, or "Rolling".
export function deadlineBadge(p: Pick<Program, "deadline" | "deadlineNote">): string {
  if (!p.deadline) return p.deadlineNote ? "TBA" : "Rolling";
  if (isPast(p.deadline)) return "Closed";
  return formatDate(p.deadline);
}

// Longer label for the detail page.
export function deadlineLabel(p: Pick<Program, "deadline" | "deadlineNote">): string {
  if (p.deadlineNote) return p.deadlineNote;
  if (!p.deadline) return "Rolling";
  return isPast(p.deadline) ? `Closed (${formatDate(p.deadline)})` : formatDate(p.deadline);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
