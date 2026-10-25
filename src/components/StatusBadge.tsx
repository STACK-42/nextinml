import { programStatus, type Program } from "@/lib/programs";

// Open / Closed marker for a program. The word is always shown, so the colour
// is never the only signal.
export function StatusBadge({
  program,
}: {
  program: Pick<Program, "deadline" | "deadlineNote" | "status">;
}) {
  const open = programStatus(program) === "open";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${
        open ? "text-primary-text" : "text-muted-foreground"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 ${open ? "bg-primary-text" : "border border-muted-foreground"}`}
      />
      {open ? "Open" : "Closed"}
    </span>
  );
}