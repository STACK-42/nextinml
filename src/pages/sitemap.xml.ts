import type { APIRoute } from "astro";

import { getPrograms } from "@/lib/content";

// Every public page. A program's lastmod is the day it was last verified,
// which is the last time its listing meaningfully changed.
export const GET: APIRoute = async ({ site }) => {
  const programs = await getPrograms();
  const url = (path: string) => new URL(path, site).href;

  const pages: { loc: string; lastmod?: string }[] = [
    { loc: url("/") },
    { loc: url("/programs/") },
    { loc: url("/share/") },
    ...programs.map((p) => ({
      loc: url(`/programs/${p.id}/`),
      lastmod: p.lastVerified ?? undefined,
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(
      (p) =>
        `  <url><loc>${p.loc}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}</url>`,
    ),
    "</urlset>",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
