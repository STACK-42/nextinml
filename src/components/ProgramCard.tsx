import { Link } from "@tanstack/react-router";

import type { Program } from "@/lib/programs";
import { formatDeadline, verifiedAgo } from "@/lib/programs";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="group bg-surface border border-border rounded-lg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_8px_24px_-12px_rgba(83,74,183,0.25)]">
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="pill bg-purple-50 text-primary text-[11px] uppercase tracking-wide">
          {program.type}
        </span>
        <span className="inline-flex items-center font-mono text-[11px] px-2 py-1 rounded border border-primary/40 text-primary bg-surface">
          {formatDeadline(program.deadline)}
        </span>
      </div>

      <h3 className="text-lg font-bold leading-snug mb-1">
        <Link
          to="/programs/$programId"
          params={{ programId: program.id }}
          className="hover:text-primary transition-colors"
        >
          {program.name}
        </Link>
      </h3>
      {program.organizer && (
        <p className="text-[13px] text-muted-foreground mb-3">
          {program.organizer}
        </p>
      )}
      <p className="text-sm text-foreground/75 mb-4 line-clamp-2 leading-relaxed">
        {program.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="pill bg-teal-50 text-[var(--accent-dark)] text-[11px]">
          {program.format}
        </span>
        <span className="pill bg-teal-50 text-[var(--accent-dark)] text-[11px]">
          {program.region}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {verifiedAgo(program.lastVerified)}
        </span>
        <Link
          to="/programs/$programId"
          params={{ programId: program.id }}
          className="text-[13px] font-medium text-accent hover:text-[var(--accent-dark)] transition-colors"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
