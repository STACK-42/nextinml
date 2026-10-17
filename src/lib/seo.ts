// Structured data (schema.org JSON-LD) for search engines. Pages pass the
// result to Base.astro's `jsonLd` prop, which writes it into <head>.

import type { Program } from "./programs";

type JsonLd = Record<string, unknown>;

const SITE_NAME = "NextInML";

export function websiteLd(site: URL): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "خطوتك التالية في تعلّم الآلة",
    url: new URL("/", site).href,
    description:
      "A directory of ML summer schools, fellowships, and internships for early-stage students in MENA, Africa, and the Global South.",
    inLanguage: "en",
  };
}

export function programListLd(programs: Program[], site: URL): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ML summer schools, fellowships, and internships",
    numberOfItems: programs.length,
    itemListElement: programs.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: new URL(`/programs/${p.id}/`, site).href,
      name: p.name,
    })),
  };
}

const programModes: Record<Program["format"], string> = {
  "In-person": "in-person",
  Remote: "online",
  Hybrid: "blended",
};

export function programLd(p: Program, site: URL): JsonLd[] {
  const url = new URL(`/programs/${p.id}/`, site).href;
  const program: JsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: p.name,
    description: p.description,
    url,
    sameAs: p.applicationUrl,
    programType: p.type,
    educationalProgramMode: programModes[p.format],
  };
  if (p.organizer) program.provider = { "@type": "Organization", name: p.organizer };
  if (p.deadline) program.applicationDeadline = p.deadline;
  if (p.location) program.location = p.location;
  if (p.topics.length > 0) program.about = p.topics;

  const breadcrumbs: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: new URL("/", site).href },
      {
        "@type": "ListItem",
        position: 2,
        name: "Programs",
        item: new URL("/programs/", site).href,
      },
      { "@type": "ListItem", position: 3, name: p.name, item: url },
    ],
  };

  return [program, breadcrumbs];
}

// JSON for a <script type="application/ld+json"> tag. Escaping "<" keeps
// content like "</script>" in a description from ending the tag early.
export function serializeLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
