import Link from "next/link";

import { PageHeader, StatusBadge } from "@/components/ui";
import {
  PILLAR_LABELS,
  RELEASES,
  RELEASE_LABELS,
  getCollection,
  groupBy,
  href,
  type Release,
} from "@/lib/content";

export const metadata = { title: "Roadmap" };

export default async function RoadmapPage() {
  const docs = await getCollection("features");
  const byRelease = groupBy(docs, (doc) => (doc.release ?? "backlog") as Release);

  return (
    <>
      <PageHeader
        eyebrow="Reihenfolge"
        title="Roadmap"
        description="Gruppiert nach dem release-Feld im Frontmatter. Die Reihenfolge innerhalb einer Stufe folgt dem order-Feld — und damit den Abhängigkeiten: was andere Module voraussetzen, steht oben."
      />

      <div className="space-y-10">
        {RELEASES.map((release) => {
          const items = byRelease.get(release) ?? [];
          if (items.length === 0) return null;

          return (
            <section key={release}>
              <div className="mb-3 flex items-baseline gap-3">
                <h2 className="text-base font-semibold text-text">{RELEASE_LABELS[release]}</h2>
                <span className="text-xs text-faint">{items.length} Features</span>
              </div>

              <ol className="relative space-y-2 border-l border-line pl-5">
                {items.map((doc) => (
                  <li key={doc.slug} className="relative">
                    <span className="absolute -left-[1.4rem] top-3 size-2 rounded-full bg-line-strong" />
                    <Link
                      href={href(doc)}
                      className="group flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-line bg-surface-1 px-3.5 py-2.5 transition hover:border-line-strong hover:bg-surface-2"
                    >
                      <span className="text-sm font-medium text-text group-hover:text-primary">
                        {doc.title}
                      </span>
                      {doc.pillar ? (
                        <span className="text-[11px] text-faint">{PILLAR_LABELS[doc.pillar]}</span>
                      ) : null}
                      <span className="ml-auto">
                        <StatusBadge status={doc.status} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
