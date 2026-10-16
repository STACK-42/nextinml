import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

import { Nav } from "@/components/Nav";
import { ProgramCard } from "@/components/ProgramCard";
import { getPrograms } from "@/lib/airtable.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NextInML — Your next step in ML, finally visible." },
      {
        name: "description",
        content:
          "Discovery platform for ML summer schools, fellowships, and internships for early-stage students in MENA, Africa, and the Global South.",
      },
      { property: "og:title", content: "NextInML" },
      {
        property: "og:description",
        content: "Summer schools, fellowships, and internships for early-stage ML students.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const fetchPrograms = useServerFn(getPrograms);
  const { data } = useQuery({
    queryKey: ["programs"],
    queryFn: () => fetchPrograms(),
  });
  const programs = data?.programs ?? [];
  const featured = programs.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-[0.05] pointer-events-none"
          width="900"
          height="900"
          viewBox="0 0 900 900"
          fill="none"
        >
          <path d="M150 650 A300 300 0 0 1 750 650" stroke="#534AB7" strokeWidth="3" fill="none" />
          <path d="M260 680 A190 190 0 0 1 640 680" stroke="#534AB7" strokeWidth="3" fill="none" />
          <circle cx="450" cy="680" r="14" fill="#534AB7" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <p className="eyebrow mb-5">BUILT FOR STUDENTS OUTSIDE THE AMBIENT NETWORK</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl mx-auto leading-[1.12]">
            Your next step in ML
            <span className="block mt-1 text-2xl md:text-3xl font-bold text-foreground/75">
              Summer schools. Fellowships. Internships.
            </span>
            <span className="block mt-1" style={{ color: "var(--primary)" }}>
              All in one place.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            For early-stage ML students in MENA, Africa, and the Global South.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              to="/programs"
              className="pill bg-accent text-white hover:bg-[var(--accent-dark)] transition-colors px-6 py-3 text-sm font-semibold"
            >
              Browse opportunities
            </Link>
            <a
              href="#experiences"
              className="pill border-[1.5px] border-primary text-primary hover:bg-purple-50 transition-colors px-6 py-3 text-sm font-semibold"
            >
              Read experiences
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {["50+ programs", "30+ countries", "100% free to access"].map((s) => (
              <span key={s} className="pill bg-purple-50 text-primary text-[12px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity types */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              label: "Summer & Winter",
              title: "Summer & Winter Schools",
              desc: "Immersive, time-boxed programs with hands-on practicals and lectures from leading researchers.",
              count: programs.filter(
                (p) => p.type === "Summer School" || p.type === "Winter School",
              ).length,
            },
            {
              label: "Fellowships",
              title: "Research Fellowships",
              desc: "Structured programs connecting students with real research problems and dedicated mentors.",
              count: programs.filter((p) => p.type === "Fellowship").length,
            },
            {
              label: "Internships",
              title: "Internship Programs",
              desc: "Undergraduate-accessible roles at research institutes and industry labs around the world.",
              count: programs.filter((p) => p.type === "Internship").length,
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-surface border border-border rounded-lg p-7 hover:border-primary/60 transition-colors"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary mb-4">
                {c.label}
              </p>
              <h3 className="text-xl font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-foreground/75 leading-relaxed mb-5">{c.desc}</p>
              <div className="flex items-center justify-between">
                <span className="pill bg-teal-50 text-[var(--accent-dark)] text-[12px]">
                  {c.count} programs
                </span>
                <Link
                  to="/programs"
                  className="text-sm font-medium text-accent hover:text-[var(--accent-dark)]"
                >
                  Explore →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured programs */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow mb-2">Featured</p>
            <h2 className="text-3xl font-extrabold">Open right now</h2>
          </div>
          <Link
            to="/programs"
            className="text-sm font-medium text-accent hover:text-[var(--accent-dark)] hidden sm:inline"
          >
            See all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div
          className="rounded-lg p-10 md:p-14 text-center"
          style={{ background: "var(--primary)" }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Found your next step? Tell us about it.
          </h2>
          <p className="text-purple-50/90 mb-7 max-w-xl mx-auto">
            Write a review. Help the next student figure out whether to apply.
          </p>
          <a
            href="#submit"
            className="pill border-[1.5px] border-white text-white hover:bg-white hover:text-primary transition-colors px-6 py-3 text-sm font-semibold"
          >
            Share your experience
          </a>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        Built from inside the gap it closes.
      </footer>
    </div>
  );
}
