import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Clock, Globe, MapPin, ShieldCheck } from "lucide-react";

import { Nav } from "@/components/Nav";
import { getPrograms } from "@/lib/airtable.functions";
import { formatDeadline, verifiedAgo } from "@/lib/programs";

export const Route = createFileRoute("/programs_/$programId")({
  head: () => ({
    meta: [{ title: "Program — NextInML" }],
  }),
  component: ProgramDetailPage,
});

function ProgramDetailPage() {
  const { programId } = Route.useParams();
  const fetchPrograms = useServerFn(getPrograms);
  const { data, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: () => fetchPrograms(),
  });

  const program = data?.programs.find((p) => p.id === programId);

  return (
    <div className="min-h-screen">
      <Nav />
      <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Link
          to="/programs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All programs
        </Link>

        {isLoading && <p className="text-muted-foreground">Loading…</p>}

        {!isLoading && !program && (
          <div className="py-16">
            <h1 className="text-2xl font-bold mb-2">Program not found</h1>
            <p className="text-muted-foreground mb-6">
              This program may have been removed or the link is incorrect.
            </p>
            <Link
              to="/programs"
              className="pill bg-accent text-white hover:bg-[var(--accent-dark)] transition-colors px-5 py-2.5 text-sm font-semibold"
            >
              Browse all programs
            </Link>
          </div>
        )}

        {program && (
          <article>
            <div className="flex items-center gap-3 mb-4">
              <span className="pill bg-purple-50 text-primary text-[11px] uppercase tracking-wide">
                {program.type}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                {verifiedAgo(program.lastVerified)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{program.name}</h1>
            {program.organizer && <p className="text-muted-foreground mb-6">{program.organizer}</p>}

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <DetailStat icon={<CalendarDays className="h-4 w-4" />} label="Deadline">
                {program.deadlineNote ?? formatDeadline(program.deadline)}
              </DetailStat>
              <DetailStat icon={<Globe className="h-4 w-4" />} label="Format">
                {program.format}
              </DetailStat>
              <DetailStat icon={<MapPin className="h-4 w-4" />} label="Region">
                {program.region}
              </DetailStat>
              {program.location && (
                <DetailStat icon={<MapPin className="h-4 w-4" />} label="Location">
                  {program.location}
                </DetailStat>
              )}
              {program.dates && (
                <DetailStat icon={<CalendarDays className="h-4 w-4" />} label="Dates">
                  {program.dates}
                </DetailStat>
              )}
              {program.duration && (
                <DetailStat icon={<Clock className="h-4 w-4" />} label="Duration">
                  {program.duration}
                </DetailStat>
              )}
            </div>

            <p className="text-foreground/80 leading-relaxed mb-8 whitespace-pre-line">
              {program.longDescription || program.description || "No description available yet."}
            </p>

            {program.topics && program.topics.length > 0 && (
              <DetailSection title="Topics covered">
                <div className="flex flex-wrap gap-2">
                  {program.topics.map((t) => (
                    <span key={t} className="pill bg-teal-50 text-[var(--accent-dark)] text-[12px]">
                      {t}
                    </span>
                  ))}
                </div>
              </DetailSection>
            )}

            {program.eligibility && (
              <DetailSection title="Who can apply">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {program.eligibility}
                </p>
              </DetailSection>
            )}

            {program.cost && (
              <DetailSection title="Cost & funding">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                  {program.cost}
                </p>
              </DetailSection>
            )}

            <div className="mt-10">
              <a
                href={program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill bg-accent text-white hover:bg-[var(--accent-dark)] transition-colors px-6 py-3 text-sm font-semibold"
              >
                Apply / Learn more →
              </a>
            </div>
          </article>
        )}
      </section>
    </div>
  );
}

function DetailStat({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
        {icon}
        {label}
      </p>
      <p className="font-semibold">{children}</p>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">{title}</h2>
      {children}
    </section>
  );
}
