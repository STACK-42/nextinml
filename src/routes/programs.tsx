import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

import { Nav } from "@/components/Nav";
import { ProgramCard } from "@/components/ProgramCard";
import { FilterBar, filterPrograms } from "@/components/FilterBar";
import { getPrograms } from "@/lib/airtable.functions";

const programsSearchSchema = z.object({
  type: fallback(z.string(), "").default(""),
  region: fallback(z.string(), "").default(""),
  format: fallback(z.string(), "").default(""),
  deadline: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/programs")({
  validateSearch: zodValidator(programsSearchSchema),
  head: () => ({
    meta: [
      { title: "Programs — NextInML" },
      {
        name: "description",
        content:
          "Browse ML summer schools, fellowships, and internships open to students worldwide.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const search = Route.useSearch();
  const fetchPrograms = useServerFn(getPrograms);
  const { data, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: () => fetchPrograms(),
  });
  const programs = data?.programs ?? [];

  const filtered = filterPrograms(programs, search);

  return (
    <div className="min-h-screen">
      <Nav />
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <p className="eyebrow mb-3">Directory</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">All programs</h1>
        <p className="text-muted-foreground mb-2">
          {isLoading
            ? "Loading…"
            : `Showing ${filtered.length} of ${programs.length} program${programs.length === 1 ? "" : "s"}`}
          {data?.source === "mock" && (
            <span className="ml-2 text-xs italic">(sample data — connect Airtable to go live)</span>
          )}
        </p>

        <FilterBar programs={programs} />

        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {filtered.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-semibold text-lg mb-1">No programs found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
          </div>
        )}
      </section>
    </div>
  );
}
