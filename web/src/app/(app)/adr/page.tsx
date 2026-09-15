import Link from "next/link";

import { EmptyState, PageHeader, StatusBadge } from "@/components/ui";
import { getCollection } from "@/lib/content";

export const metadata = { title: "Entscheidungen" };

export default async function AdrPage() {
  const docs = await getCollection("adr");

  return (
    <>
      <PageHeader
        eyebrow="Architecture Decision Records"
        title="Entscheidungen"
        description="Jede Entscheidung, die schwer rückgängig zu machen ist, bekommt hier einen Eintrag: Kontext, Optionen, Trade-offs und — sobald gefallen — die Entscheidung mit Begründung. Offene ADRs sind bewusst offen."
      />

      {docs.length === 0 ? (
        <EmptyState title="Noch keine Entscheidungen erfasst." hint="Lege eine Datei in content/adr/ an." />
      ) : (
        <ul className="space-y-3">
          {docs.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/adr/${doc.slug}`}
                className="group block rounded-xl border border-line bg-surface-1 p-4 transition hover:border-line-strong hover:bg-surface-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-text group-hover:text-primary">{doc.title}</h2>
                  <StatusBadge status={doc.status} />
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{doc.summary}</p>
                {doc.decision ? (
                  <p className="mt-2.5 border-l-2 border-primary pl-3 text-[13px] text-text">{doc.decision}</p>
                ) : (
                  <p className="mt-2.5 text-[12px] font-medium uppercase tracking-wider text-accent">
                    Noch offen
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
