import { createServerFn } from "@tanstack/react-start";

import { mockPrograms, type Program, type ProgramFormat, type ProgramType } from "./programs";

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function mapRecord(r: AirtableRecord): Program | null {
  const f = r.fields;
  const name = asString(f.Name);
  const type = asString(f.Type) as ProgramType | undefined;
  if (!name || !type) return null;
  const region = asString(f.Region) ?? "Global";
  const format = (asString(f.Format) as ProgramFormat | undefined) ?? "In-person";
  return {
    id: r.id,
    name,
    type,
    description: asString(f.Description) ?? "",
    region,
    format,
    deadline: asString(f.Deadline) ?? null,
    applicationUrl: asString(f.ApplicationURL) ?? "#",
    lastVerified: asString(f.LastVerified) ?? null,
    organizer: asString(f.Organizer),
  };
}

export const getPrograms = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ programs: Program[]; source: "airtable" | "mock" }> => {
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const table = process.env.AIRTABLE_TABLE_NAME ?? "Programs";

    if (!token || !baseId) {
      return { programs: mockPrograms, source: "mock" };
    }

    try {
      const all: AirtableRecord[] = [];
      let offset: string | undefined;
      do {
        const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`);
        if (offset) url.searchParams.set("offset", offset);
        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Airtable ${res.status}`);
        const json = (await res.json()) as AirtableResponse;
        all.push(...json.records);
        offset = json.offset;
      } while (offset);

      const programs = all
        .filter((r) => (r.fields.Status ?? "Published") === "Published")
        .map(mapRecord)
        .filter((p): p is Program => p !== null)
        .sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        });

      return { programs, source: "airtable" };
    } catch (err) {
      console.error("Airtable fetch failed, using mock:", err);
      return { programs: mockPrograms, source: "mock" };
    }
  },
);
