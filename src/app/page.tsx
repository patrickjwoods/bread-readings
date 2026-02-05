import TodayCard from "./today-card";
import { ThemeToggle } from "./theme-toggle";

export default function Page() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8 flex items-start justify-between pl-1">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-cinzel)' }}>BREAD 2026</h1>
            <p className="mt-2 text-[var(--muted)]">
              Yesterday, today, and tomorrow's scripture readings from the Reality SF BREAD reading plan.{" "}
              <a
                href="https://realitysf.com/wp-content/uploads/2025/12/BREAD-2026-Digital-Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--foreground)]"
              >
                View the whole year
              </a>.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <TodayCard />

        <footer className="mt-10 pl-1 text-sm text-[var(--muted)]">
          Created and maintained with 💜 by{" "}
          <a
            href="https://x.com/patrickjwoods"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--foreground)]"
          >
            @patrickjwoods
          </a>
          .
        </footer>
      </div>
    </main>
  );
}
