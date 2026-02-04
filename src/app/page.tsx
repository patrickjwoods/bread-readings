import TodayCard from "./today-card";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Daily Readings</h1>
          <p className="mt-2 text-zinc-600">
            Yesterday, today, and tomorrow — from your BREAD reading plan.
          </p>
        </header>

        <TodayCard />

        <footer className="mt-10 text-sm text-zinc-500">
          Tip: bookmark this page on your phone home screen.
        </footer>
      </div>
    </main>
  );
}