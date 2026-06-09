export type ProgramType =
  | "Summer School"
  | "Winter School"
  | "Fellowship"
  | "Internship";

export type ProgramFormat = "In-person" | "Remote" | "Hybrid";

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  region: string;
  format: ProgramFormat;
  deadline: string | null; // ISO date
  applicationUrl: string;
  lastVerified: string | null; // ISO date
  organizer?: string;

  // Optional rich detail — shown on the program detail page when present.
  // Most programs leave these blank for now; fill in as we curate each one.
  longDescription?: string;
  location?: string;
  dates?: string; // human-readable, e.g. "Sep 8–12, 2025"
  duration?: string; // e.g. "5 days"
  deadlineNote?: string; // overrides the formatted deadline label when set
  cost?: string;
  eligibility?: string;
  topics?: string[];
}

export const mockPrograms: Program[] = [
  {
    id: "ammi-2026",
    name: "AMMI — African Master's in Machine Intelligence",
    type: "Fellowship",
    description:
      "Fully funded one-year intensive program training the next generation of African ML researchers and engineers.",
    region: "Africa",
    format: "In-person",
    deadline: "2026-08-15",
    applicationUrl: "https://aimsammi.org/",
    lastVerified: "2026-05-20",
    organizer: "AIMS",
  },
  {
    id: "m2l",
    name: "Mediterranean Machine Learning Summer School",
    type: "Summer School",
    description:
      "Intensive five-day school of keynotes, lectures, and hands-on practicals across the core, fast-moving areas of modern machine learning.",
    region: "Mediterranean",
    format: "In-person",
    deadline: null,
    deadlineNote: "Closed for 2025 · 2027 call to be announced",
    applicationUrl: "https://www.m2lschool.org/",
    lastVerified: "2026-06-09",
    organizer: "Google DeepMind scientists & University of Split (FESB)",
    location: "Split, Croatia (2025)",
    dates: "Sep 8–12, 2025 · next edition Sep 2027 (Spain)",
    duration: "5 days",
    longDescription:
      "The Mediterranean Machine Learning Summer School (M2L) is an intensive five-day program of keynotes, lectures, and hands-on practical sessions covering the core, fast-developing areas of modern machine learning. It is organized by a team of Google DeepMind scientists in collaboration with the Faculty of Electrical Engineering, Mechanical Engineering and Naval Architecture (FESB) at the University of Split, and is built around knowledge transfer between early-stage researchers and world-leading experts, with poster sessions, networking, and informal time with speakers.\n\nThe 5th edition (M2L 2025) ran September 8–12, 2025 in Split, Croatia and drew more than 300 young AI talents. The 2026 edition was cancelled; the next edition is planned for Spain in September 2027. Watch the official site for the 2027 public call and its application deadline.",
    eligibility:
      "Doctoral candidates and exceptional Master's and Bachelor's students, plus academics and practitioners worldwide, with emphasis on the Mediterranean region. A technical background and prior ML experience are expected. Selection is merit-based through a public call, with scholarships to promote diversity.",
    cost:
      "Students attend free of charge; academia and industry pay a symbolic registration fee. Diversity scholarships and targeted outreach are available.",
    topics: [
      "Natural Language Processing",
      "Computer Vision",
      "Generative & diffusion models",
      "Reinforcement learning",
      "Applied deep learning",
      "Ethics & fairness",
      "Neuroscience",
    ],
  },
  {
    id: "mats-2026",
    name: "MATS — ML Alignment & Theory Scholars",
    type: "Fellowship",
    description:
      "Research fellowship pairing aspiring alignment researchers with experienced mentors for a structured 10-week program.",
    region: "Global",
    format: "Hybrid",
    deadline: "2026-09-12",
    applicationUrl: "https://www.matsprogram.org/",
    lastVerified: "2026-06-01",
    organizer: "MATS",
  },
  {
    id: "dsa-2026",
    name: "Data Science Africa",
    type: "Summer School",
    description:
      "Annual summer school bringing together African researchers, students and practitioners around practical data science.",
    region: "Africa",
    format: "In-person",
    deadline: "2026-06-30",
    applicationUrl: "https://www.datascienceafrica.org/",
    lastVerified: "2026-05-15",
    organizer: "DSA",
  },
  {
    id: "mpia-internship",
    name: "MPIA Student Summer Internship",
    type: "Internship",
    description:
      "Eight-week summer research internship at the Max Planck Institute for Astronomy with mentorship and a final talk.",
    region: "Global",
    format: "In-person",
    deadline: "2026-11-15",
    applicationUrl: "https://www.mpia.de/internships",
    lastVerified: "2026-04-22",
    organizer: "Max Planck Institute",
  },
  {
    id: "spar-2026",
    name: "SPAR — Supervised Program for Alignment Research",
    type: "Fellowship",
    description:
      "Remote, part-time research program pairing students with mentors working on real AI safety problems.",
    region: "Global",
    format: "Remote",
    deadline: "2026-08-01",
    applicationUrl: "https://supervisedprogramforalignmentresearch.com/",
    lastVerified: "2026-05-30",
    organizer: "SPAR",
  },
];

export function verifiedAgo(iso: string | null): string {
  if (!iso) return "Not verified";
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
  if (days < 1) return "Verified today";
  if (days < 7) return `Verified ${days}d ago`;
  if (days < 30) return `Verified ${Math.floor(days / 7)}w ago`;
  if (days < 365) return `Verified ${Math.floor(days / 30)}mo ago`;
  return `Verified ${Math.floor(days / 365)}y ago`;
}

export function formatDeadline(iso: string | null): string {
  if (!iso) return "Rolling";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
