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

function formatMonthDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

const bookAbbreviations: Record<string, string> = {
  "Genesis": "GEN",
  "Exodus": "EXO",
  "Deuteronomy": "DEU",
  "Joshua": "JOS",
  "1 Kings": "1KI",
  "Nehemiah": "NEH",
  "Psalm": "PSA",
  "Isaiah": "ISA",
  "Jeremiah": "JER",
  "Ezekiel": "EZK",
  "Hosea": "HOS",
  "Zephaniah": "ZEP",
  "Matthew": "MAT",
  "Mark": "MRK",
  "Luke": "LUK",
  "John": "JHN",
  "Acts": "ACT",
  "Romans": "ROM",
  "1 Corinthians": "1CO",
  "2 Corinthians": "2CO",
  "Galatians": "GAL",
  "Ephesians": "EPH",
  "Philippians": "PHP",
  "Colossians": "COL",
  "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH",
  "1 Timothy": "1TI",
  "2 Timothy": "2TI",
  "Titus": "TIT",
  "Philemon": "PHM",
  "Hebrews": "HEB",
  "James": "JAS",
  "1 Peter": "1PE",
  "2 Peter": "2PE",
  "1 John": "1JN",
  "Revelation": "REV",
};

function getBibleUrl(reading: string): string {
  // "Book Chapter:Verses" (e.g., "Psalm 89:1-18", "1 Corinthians 13:1-13")
  const matchChapterVerses = reading.match(/^(.+?)\s+(\d+):(.+)$/);
  if (matchChapterVerses) {
    const [, book, chapter, verses] = matchChapterVerses;
    const abbrev = bookAbbreviations[book];
    if (!abbrev) return "#";
    return `https://www.bible.com/bible/111/${abbrev}.${chapter}.${verses}.NIV`;
  }

  // "Book Chapter" — whole chapter (e.g., "Psalm 32", "Isaiah 55")
  const matchWholeChapter = reading.match(/^(.+?)\s+(\d+)$/);
  if (matchWholeChapter) {
    const [, book, chapter] = matchWholeChapter;
    const abbrev = bookAbbreviations[book];
    if (!abbrev) return "#";
    return `https://www.bible.com/bible/111/${abbrev}.${chapter}.NIV`;
  }

  // "Book Verses" — single-chapter books (e.g., "Philemon 1-25")
  const matchVerseRange = reading.match(/^(.+?)\s+(\d+[-–]\d+)$/);
  if (matchVerseRange) {
    const [, book, verses] = matchVerseRange;
    const abbrev = bookAbbreviations[book];
    if (!abbrev) return "#";
    return `https://www.bible.com/bible/111/${abbrev}.1.${verses}.NIV`;
  }

  return "#";
}

function Panel({
  label,
  iso,
  entry,
  emphasis,
  compact,
}: {
  label: string;
  iso: string;
  entry?: ReadingEntry;
  emphasis?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <section className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-6 shadow-xs">
        <div
          className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {label}
        </div>
        {entry ? (
          <a
            href={getBibleUrl(entry.reading)}
            target="_blank"
            rel="noopener noreferrer"
            className="scripture-link mt-4 block text-lg font-semibold leading-snug"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {entry.reading}<span className="scripture-arrows"> ››</span>
          </a>
        ) : (
          <div className="mt-4 text-sm text-[var(--muted-foreground)]">No reading</div>
        )}
      </section>
    );
  }

  return (
    <section
      className={[
        "rounded-lg border bg-[var(--card-bg)] px-5 py-6 shadow-xs",
        emphasis ? "border-[var(--card-border-emphasis)] gradient-border" : "border-[var(--card-border)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {label}
          </div>
          <div className="mt-1 text-sm text-[var(--muted)]">{formatHuman(iso)}</div>
        </div>
      </div>

      {entry ? (
        <>
          <div className="mt-4">
            <a
              href={getBibleUrl(entry.reading)}
              target="_blank"
              rel="noopener noreferrer"
              className="scripture-link text-2xl font-semibold leading-snug"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              {entry.reading}<span className="scripture-arrows"> ››</span>
            </a>
            <div className="mt-4 text-sm text-[var(--muted)]">
              <span>{entry.week_title}</span>
              {entry.season ? (
                <>
                  {" · "}
                  <span>{entry.season}</span>
                </>
              ) : null}
              {" · "}
              <span>{entry.sunday_label}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 text-sm text-[var(--muted)]">
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
      <div className="rounded-lg border border-red-400/50 bg-red-500/10 p-5 text-red-600 dark:text-red-400">
        <div className="font-semibold">Couldn't load readings</div>
        <div className="mt-1 text-sm">{error}</div>
        <div className="mt-3 text-sm opacity-80">
          Make sure the file exists at{" "}
          <code className="font-mono">/public/bread_readings_2026.json</code>.
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-xs">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-28 rounded bg-[var(--card-border)]" />
          <div className="h-6 w-3/4 rounded bg-[var(--card-border)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--card-border)]" />
          <div className="h-4 w-1/2 rounded bg-[var(--card-border)]" />
        </div>
      </div>
    );
  }

  const byDate = plan.by_date;

  return (
    <div className="grid gap-4">
      <Panel label="Yesterday" iso={dates.yesterday} entry={byDate[dates.yesterday]} compact />
      <Panel label="Today" iso={dates.today} entry={byDate[dates.today]} emphasis />
      <Panel label="Tomorrow" iso={dates.tomorrow} entry={byDate[dates.tomorrow]} compact />
    </div>
  );
}