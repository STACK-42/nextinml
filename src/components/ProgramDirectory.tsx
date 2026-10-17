import { useEffect, useState } from "react";

import { FilterBar, emptyFilters, filterPrograms, type FilterState } from "@/components/FilterBar";
import { ProgramCard } from "@/components/ProgramCard";
import type { Program } from "@/lib/programs";

const filterKeys = Object.keys(emptyFilters) as (keyof FilterState)[];

function readFilters(): FilterState {
  const params = new URLSearchParams(window.location.search);
  const filters = { ...emptyFilters };
  for (const key of filterKeys) filters[key] = params.get(key) ?? "";
  return filters;
}

function writeFilters(filters: FilterState) {
  const params = new URLSearchParams();
  for (const key of filterKeys) if (filters[key]) params.set(key, filters[key]);
  const query = params.toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

// The /programs listing. The page is prerendered with every program shown;
// after hydration it reads filters from the URL, and every filter change is
// written back to the URL so a filtered view can be shared or bookmarked.
export function ProgramDirectory({ programs }: { programs: Program[] }) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  useEffect(() => setFilters(readFilters()), []);

  function onChange(next: FilterState) {
    setFilters(next);
    writeFilters(next);
  }

  const filtered = filterPrograms(programs, filters);

  return (
    <>
      <p className="text-muted-foreground mb-2">
        Showing {filtered.length} of {programs.length} program{programs.length === 1 ? "" : "s"}
      </p>

      <FilterBar programs={programs} filters={filters} onChange={onChange} />

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {filtered.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-semibold text-lg mb-1">No programs found</p>
          <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
        </div>
      )}
    </>
  );
}
