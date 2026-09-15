"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { DocMeta, Pillar, Status } from "@/lib/content";

interface Props {
  docs: DocMeta[];
  pillars: { value: Pillar; label: string }[];
  statuses: { value: Status; label: string }[];
}

const STATUS_DOT: Record<Status, string> = {
  idea: "bg-faint",
  draft: "bg-secondary",
  spec: "bg-info",
  "in-progress": "bg-warning",
  shipped: "bg-success",
  deprecated: "bg-error",
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition ${
        active
          ? "border-primary/50 bg-primary-soft/60 text-primary"
          : "border-line bg-surface-1 text-muted hover:border-line-strong hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

export function FeatureBrowser({ docs, pillars, statuses }: Props) {
  const [query, setQuery] = useState("");
  const [pillar, setPillar] = useState<Pillar | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return docs.filter((doc) => {
      if (pillar && doc.pillar !== pillar) return false;
      if (status && doc.status !== status) return false;
      if (!needle) return true;
      return (
        doc.title.toLowerCase().includes(needle) ||
        doc.summary.toLowerCase().includes(needle) ||
        doc.slug.includes(needle) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [docs, query, pillar, status]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Feature, Tag oder Stichwort suchen …"
        className="w-full rounded-lg border border-line bg-surface-1 px-3.5 py-2.5 text-sm text-text outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Chip active={pillar === null} onClick={() => setPillar(null)}>
          Alle Bereiche
        </Chip>
        {pillars.map((item) => (
          <Chip
            key={item.value}
            active={pillar === item.value}
            onClick={() => setPillar(pillar === item.value ? null : item.value)}
          >
            {item.label}
          </Chip>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <Chip active={status === null} onClick={() => setStatus(null)}>
          Jeder Status
        </Chip>
        {statuses.map((item) => (
          <Chip
            key={item.value}
            active={status === item.value}
            onClick={() => setStatus(status === item.value ? null : item.value)}
          >
            {item.label}
          </Chip>
        ))}
      </div>

      <p className="mt-5 text-xs text-faint">
        {filtered.length} von {docs.length} Features
      </p>

      <ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface-1">
        {filtered.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={`/features/${doc.slug}`}
              className="group flex items-start gap-3 px-4 py-3.5 transition hover:bg-surface-2"
            >
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${STATUS_DOT[doc.status]}`} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-medium text-text group-hover:text-primary">
                    {doc.title}
                  </span>
                  <span className="font-mono text-[11px] text-faint">{doc.slug}</span>
                </span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{doc.summary}</span>
              </span>
              {doc.release ? (
                <span className="mt-0.5 shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] text-accent">
                  {doc.release}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-faint">Nichts gefunden.</li>
        ) : null}
      </ul>
    </div>
  );
}
