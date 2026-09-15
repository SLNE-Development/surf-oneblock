import { type SearchDocument } from "@/components/concept-search";
import { Sidebar, type NavGroup } from "@/components/sidebar";
import {
  COLLECTIONS,
  COLLECTION_LABELS,
  PILLARS,
  PILLAR_LABELS,
  getAllDocs,
  href,
} from "@/lib/content";
import { requireSession } from "@/lib/session";

function toSearchText(source: string) {
  return source
    .replace(/```([\s\S]*?)```/g, "$1")
    .replace(/<Ref\s+id=["']([^"']+)["'][^>]*\/?>(?:<\/Ref>)?/g, " $1 ")
    .replace(/<Note[^>]*title=["']([^"']+)["'][^>]*>/g, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_#>|~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Zweite Prüfschicht neben der Middleware — nichts wird ohne Session gerendert.
  const session = await requireSession();
  const docs = await getAllDocs();

  const featureGroups: NavGroup[] = PILLARS.map((pillar) => ({
    label: PILLAR_LABELS[pillar],
    icon: pillar,
    items: docs
      .filter((doc) => doc.collection === "features" && doc.pillar === pillar)
      .map((doc) => ({ title: doc.title, path: href(doc) })),
  })).filter((group) => group.items.length > 0);

  const otherGroups: NavGroup[] = COLLECTIONS.filter((collection) => collection !== "features")
    .map((collection) => ({
      label: collection === "adr" ? "Entscheidungen" : "Dokumente",
      icon: collection === "adr" ? "decisions" as const : "documents" as const,
      items: docs
        .filter((doc) => doc.collection === collection)
        .map((doc) => ({ title: doc.title, path: href(doc) })),
    }))
    .filter((group) => group.items.length > 0);

  const searchDocuments: SearchDocument[] = docs.map((doc) => ({
    title: doc.title,
    path: href(doc),
    kind: COLLECTION_LABELS[doc.collection],
    summary: doc.summary,
    content: toSearchText(
      [
        doc.body,
        doc.slug,
        doc.decision,
        doc.tags.join(" "),
        doc.uses.join(" "),
        doc.dependsOn.join(" "),
        COLLECTION_LABELS[doc.collection],
        doc.pillar ? PILLAR_LABELS[doc.pillar] : null,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" "),
    ),
  }));

  return (
    <div className="lg:flex">
      <Sidebar groups={[...featureGroups, ...otherGroups]} searchDocuments={searchDocuments} />

      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:py-12">{children}</div>

        <footer className="mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-xs text-faint">
            <span>
              Angemeldet als <span className="font-mono text-muted">{session.label}</span> · internes
              Dokument, nicht weitergeben
            </span>
            <form action="/api/logout" method="post">
              <button type="submit" className="rounded-md border border-line px-2.5 py-1 transition hover:text-text">
                Abmelden
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
}
