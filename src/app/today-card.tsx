"use client";

import { useEffect, useMemo, useState } from "react";

type ReadingEntry = {
  weekday: string;
  reading: string;
  week_title: string;
  sunday_label: string;
  season: string | null;
  week_start: string;
  is_sunday: boolean;
};

type Plan = {
  source: string;
  generated_at: string;
  by_date: Record<string, ReadingEntry>;
};

function isoDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, delta: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + delta);
  return copy;
}

function formatHuman(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

function Panel({
  label,
  iso,
  entry,
  emphasis,
}: {
  label: string;
  iso: string;
  entry?: ReadingEntry;
  emphasis?: boolean;
}) {
  return (
    <section
      className={[
        "rounded-2xl border bg-white p-5 shadow-sm",
        emphasis ? "border-zinc-900" : "border-zinc-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {label}
          </div>
          <div className="mt-1 text-sm text-zinc-600">{formatHuman(iso)}</div>
        </div>
        {emphasis ? <Badge>Today</Badge> : null}
      </div>

      {entry ? (
        <>
          <div className="mt-4">
            <div className="text-lg font-semibold leading-snug">{entry.reading}</div>
            <div className="mt-2 text-sm text-zinc-600">
              <span className="font-medium text-zinc-800">{entry.week_title}</span>
              {" · "}
              <span>{entry.sunday_label}</span>
              {entry.season ? (
                <>
                  {" · "}
                  <span>{entry.season}</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-4 border-t pt-4 text-xs text-zinc-500">
            Week begins: {entry.week_start}
          </div>
        </>
      ) : (
        <div className="mt-4 text-sm text-zinc-600">
          No reading found for this date in the JSON.
        </div>
      )}
    </section>
  );
}

export default function TodayCard() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/bread_readings_2026.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load JSON (${res.status})`);
        const data = (await res.json()) as Plan;
        setPlan(data);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, []);

  const dates = useMemo(() => {
    const now = new Date();
    return {
      yesterday: isoDateLocal(addDays(now, -1)),
      today: isoDateLocal(now),
      tomorrow: isoDateLocal(addDays(now, +1)),
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
        <div className="font-semibold">Couldn’t load readings</div>
        <div className="mt-1 text-sm">{error}</div>
        <div className="mt-3 text-sm text-red-700">
          Make sure the file exists at{" "}
          <code className="font-mono">/public/bread_readings_2026.json</code>.
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-28 rounded bg-zinc-100" />
          <div className="h-6 w-3/4 rounded bg-zinc-100" />
          <div className="h-4 w-2/3 rounded bg-zinc-100" />
          <div className="h-4 w-1/2 rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  const byDate = plan.by_date;

  return (
    <div className="grid gap-4">
      <Panel label="Yesterday" iso={dates.yesterday} entry={byDate[dates.yesterday]} />
      <Panel label="Today" iso={dates.today} entry={byDate[dates.today]} emphasis />
      <Panel label="Tomorrow" iso={dates.tomorrow} entry={byDate[dates.tomorrow]} />
    </div>
  );
}