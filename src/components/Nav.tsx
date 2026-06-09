import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-foreground/80">
          <Link to="/programs" className="hover:text-primary transition-colors">
            Browse
          </Link>
          <a href="#experiences" className="hover:text-primary transition-colors">
            Experiences
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            About
          </a>
        </div>
        <a
          href="#submit"
          className="pill bg-accent text-white hover:bg-[var(--accent-dark)] transition-colors"
        >
          Submit experience
        </a>
      </nav>
    </header>
  );
}
