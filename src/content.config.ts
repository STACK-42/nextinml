import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Program data lives in content/programs/<slug>.yaml. The file name is the
// program's id and its URL slug. A build fails if any file breaks this schema,
// so a typo in a type or a date never reaches the site.

export const programTypes = ["Summer School", "Winter School", "Fellowship", "Internship"] as const;
export const programFormats = ["In-person", "Remote", "Hybrid"] as const;
export const programRegions = [
  "Global",
  "Africa",
  "MENA",
  "Mediterranean",
  "Europe",
  "Asia",
  "Americas",
] as const;

// for the program status
export const programStatuses = ["Open", "Closed", "Unknown"] as const;

const programs = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./content/programs" }),
  schema: z.object({
    name: z.string(),
    type: z.enum(programTypes),
    organizer: z.string().optional(),
    // One or two sentences for cards. The detail page uses longDescription when set.
    description: z.string(),
    region: z.enum(programRegions),
    format: z.enum(programFormats),
    // null means rolling or not announced; use deadlineNote to say which.
    deadline: z.coerce.date().nullable(),
    deadlineNote: z.string().optional(),
    // Open or closed is worked out from the deadline. Set this only to
    // override that, e.g. "closed" for a rolling listing whose call has ended.
    // A deadline in the past is always closed, whatever this says.
    status: z.enum(["open", "closed"]).optional(),
    applicationUrl: z.url(),
    // The date someone last checked this listing against the program's own page.
    // Leave it out until that has happened.
    lastVerified: z.coerce.date().optional(),
    draft: z.boolean().default(false),

    location: z.string().optional(),
    dates: z.string().optional(),
    duration: z.string().optional(),
    longDescription: z.string().optional(),
    eligibility: z.string().optional(),
    cost: z.string().optional(),
    topics: z.array(z.string()).default([]),
  }),
});

// First-person writeups from people who attended a program, in
// content/writeups/<program>-<cohort>-<author>.md. Files starting with "_"
// are ignored, which keeps _template.md out of the site.
const writeups = defineCollection({
  loader: glob({ pattern: "**/[!_]*.md", base: "./content/writeups" }),
  schema: z.object({
    program: reference("programs"),
    title: z.string(),
    author: z.string(),
    // What the author was at the time, e.g. "3rd-year CS undergrad, Khartoum".
    authorContext: z.string().optional(),
    // The edition attended, e.g. "2025".
    cohort: z.string(),
    published: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { programs, writeups };
