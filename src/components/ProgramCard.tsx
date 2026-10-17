import type { Program } from "@/lib/programs";
import { deadlineCta, deadlineState, isStale, verifiedLabel } from "@/lib/programs";

export function ProgramCard({ program }: { program: Program }) {
  const href = `/programs/${program.id}/`;
  const open = deadlineState(program) === "open";
  const stale = isStale(program.lastVerified);

  return (
    <article className="group bg-surface border border-border p-5 flex flex-col gap-2.5 transition-colors hover:border-primary-text">
      <div className="flex items-center justify-between gap-3">
        <span className="type-tag">{program.type}</span>
        <span
          className={`text-[11px] ${stale ? "text-vermilion" : "text-muted-foreground"}`}
          title={stale ? "This listing may be out of date" : undefined}
        >
          {verifiedLabel(program.lastVerified)}
        </span>
      </div>

      <h3 className="text-[17px] font-semibold leading-snug tracking-normal">
        <a href={href} className="hover:text-primary-text transition-colors">
          {program.name}
        </a>
      </h3>
      {program.organizer && (
        <p className="text-[13px] text-muted-foreground -mt-1">{program.organizer}</p>
      )}
      <p className="text-sm text-subtle line-clamp-2 leading-relaxed">{program.description}</p>
      <p className="text-xs text-muted-foreground">
        {program.format} · {program.region}
      </p>

      <a
        href={href}
        className={`btn mt-auto text-[13px] py-2.5 px-3 ${
          open
            ? "bg-primary text-white hover:bg-foreground hover:text-background"
            : "border border-border text-foreground hover:border-primary-text hover:text-primary-text"
        }`}
      >
        <span>{deadlineCta(program)}</span>
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
