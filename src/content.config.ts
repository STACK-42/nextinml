import { defineCollection } from "astro:content";
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

export const collections = { programs };
