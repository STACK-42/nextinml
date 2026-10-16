"use client";

import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Program } from "@/lib/programs";

interface FilterBarProps {
  programs: Program[];
}

interface FilterState {
  type?: string;
  region?: string;
  format?: string;
  deadline?: string;
}

const routeApi = getRouteApi("/programs");

// Radix Select forbids an empty-string item value (it's reserved for clearing
// the selection), so we use this sentinel for the "All / Any" options and map
// it back to undefined in the URL search params.
const ALL = "all";

const deadlineOptions = [
  { value: ALL, label: "Any deadline" },
  { value: "rolling", label: "Rolling / No deadline" },
  { value: "1m", label: "Within 1 month" },
  { value: "3m", label: "Within 3 months" },
  { value: "6m", label: "Within 6 months" },
];

function extractUnique(programs: Program[], key: keyof Program): string[] {
  const vals = new Set<string>();
  for (const p of programs) {
    const v = p[key];
    if (typeof v === "string" && v.length > 0) vals.add(v);
  }
  return Array.from(vals).sort();
}

export function FilterBar({ programs }: FilterBarProps) {
  const navigate = useNavigate({ from: "/programs" });
  const search = routeApi.useSearch();

  const filters: FilterState = {
    type: search.type ?? "",
    region: search.region ?? "",
    format: search.format ?? "",
    deadline: search.deadline ?? "",
  };

  const types = extractUnique(programs, "type");
  const regions = extractUnique(programs, "region");
  const formats = extractUnique(programs, "format");

  const activeCount = Object.values(filters).filter(Boolean).length;

  function updateFilter(key: keyof FilterState, value: string) {
    navigate({
      search: (prev: FilterState) => ({
        ...prev,
        [key]: value === ALL ? undefined : value || undefined,
      }),
    });
  }

  function clearFilters() {
    navigate({
      search: () => ({}),
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      <Select value={filters.type || ALL} onValueChange={(v) => updateFilter("type", v)}>
        <SelectTrigger className="w-[160px] bg-surface text-sm h-9 border-border focus:ring-primary">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All types</SelectItem>
          {types.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.region || ALL} onValueChange={(v) => updateFilter("region", v)}>
        <SelectTrigger className="w-[160px] bg-surface text-sm h-9 border-border focus:ring-primary">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All regions</SelectItem>
          {regions.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.format || ALL} onValueChange={(v) => updateFilter("format", v)}>
        <SelectTrigger className="w-[160px] bg-surface text-sm h-9 border-border focus:ring-primary">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All formats</SelectItem>
          {formats.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.deadline || ALL} onValueChange={(v) => updateFilter("deadline", v)}>
        <SelectTrigger className="w-[180px] bg-surface text-sm h-9 border-border focus:ring-primary">
          <SelectValue placeholder="Deadline" />
        </SelectTrigger>
        <SelectContent>
          {deadlineOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeCount > 0 && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-[var(--accent-dark)] transition-colors px-2 py-1.5 rounded-md"
        >
          <X className="h-3.5 w-3.5" />
          Clear ({activeCount})
        </button>
      )}
    </div>
  );
}

export function filterPrograms(programs: Program[], filters: FilterState): Program[] {
  return programs.filter((p) => {
    if (filters.type && p.type !== filters.type) return false;
    if (filters.region && p.region !== filters.region) return false;
    if (filters.format && p.format !== filters.format) return false;

    if (filters.deadline) {
      if (filters.deadline === "rolling") {
        if (p.deadline !== null) return false;
      } else {
        if (!p.deadline) return false;
        const months = parseInt(filters.deadline);
        const now = Date.now();
        const dl = new Date(p.deadline).getTime();
        const rangeMs = months * 30 * 24 * 60 * 60 * 1000;
        if (dl < now || dl > now + rangeMs) return false;
      }
    }

    return true;
  });
}
