import Link from "next/link";

import { PageHeader, Stat, StatusBadge } from "@/components/ui";
import {
  PILLARS,
  PILLAR_DESCRIPTIONS,
  PILLAR_LABELS,
  STATUSES,
  STATUS_LABELS,
  getCollection,
  href,
} from "@/lib/content";

export default async function OverviewPage() {
  const [features, adrs, docs] = await Promise.all([
    getCollection("features"),
    getCollection("adr"),
    getCollection("docs"),
  ]);

  const openAdrs = adrs.filter((adr) => !adr.decision);
  const counted = STATUSES.map((status) => ({
    status,
    count: features.filter((feature) => feature.status === status).length,
  })).filter((entry) => entry.count > 0);

  const v1 = features.filter((feature) => feature.release === "v1");
  const recent = [...features, ...docs, ...adrs]
    .filter((doc) => doc.updated)
    .sort((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="surf-oneblock"
        title="OneBlock, Clans, Multiblocks und RPG in einem Modus"
        description="Dieses Dokument ist die gemeinsame Wahrheit für Konzept, Architektur und Reihenfolge. Jede Seite ist eine MDX-Datei im Repo — Menschen und KI-Agenten schreiben in dieselben Dateien."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Features" value={features.length} />
        <Stat label="In V1" value={v1.length} tone="text-primary" />
        <Stat label="Offene ADRs" value={openAdrs.length} tone={openAdrs.length > 0 ? "text-accent" : undefined} />
        <Stat label="Dokumente" value={docs.length} />
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-base font-semibold text-text">Statusverteilung</h2>
        <div className="flex flex-wrap gap-2">
          {counted.map((entry) => (
            <span
              key={entry.status}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface-1 px-3 py-1.5 text-[13px] text-muted"
            >
              {STATUS_LABELS[entry.status]}
              <span className="font-semibold tabular-nums text-text">{entry.count}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-base font-semibold text-text">Bereiche</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PILLARS.map((pillar) => {
            const items = features.filter((feature) => feature.pillar === pillar);
            if (items.length === 0) return null;
            return (
              <div key={pillar} className="rounded-xl border border-line bg-surface-1 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-semibold text-text">{PILLAR_LABELS[pillar]}</h3>
                  <span className="text-xs tabular-nums text-faint">{items.length}</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{PILLAR_DESCRIPTIONS[pillar]}</p>
                <ul className="mt-3 space-y-1">
                  {items.slice(0, 5).map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={href(item)}
                        className="text-[13px] text-muted underline-offset-2 hover:text-primary hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  {items.length > 5 ? (
                    <li className="text-[12px] text-faint">+ {items.length - 5} weitere</li>
                  ) : null}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {openAdrs.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-1 text-base font-semibold text-text">Offene Entscheidungen</h2>
          <p className="mb-3 text-[13px] text-muted">
            Diese blockieren oder verteuern Arbeit, solange sie offen sind.
          </p>
          <ul className="space-y-2">
            {openAdrs.map((adr) => (
              <li key={adr.slug}>
                <Link
                  href={href(adr)}
                  className="group flex items-start gap-3 rounded-lg border border-accent/25 bg-accent/[0.06] px-3.5 py-2.5 transition hover:border-accent/50"
                >
                  <span className="mt-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
                    offen
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-text group-hover:text-primary">
                      {adr.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted">{adr.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recent.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 text-base font-semibold text-text">Zuletzt geändert</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface-1">
            {recent.map((doc) => (
              <li key={`${doc.collection}/${doc.slug}`}>
                <Link
                  href={href(doc)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-surface-2"
                >
                  <span className="font-mono text-[11px] tabular-nums text-faint">{doc.updated}</span>
                  <span className="min-w-0 flex-1 truncate text-muted">{doc.title}</span>
                  <StatusBadge status={doc.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
