import { DocCard, EmptyState, PageHeader } from "@/components/ui";
import { getCollection } from "@/lib/content";

export const metadata = { title: "Dokumente" };

export default async function DocsPage() {
  const docs = await getCollection("docs");

  return (
    <>
      <PageHeader
        eyebrow="Querschnitt"
        title="Dokumente"
        description="Alles, was kein einzelnes Feature ist: Vision, Architektur, Glossar, Konventionen, Balancing-Leitplanken."
      />

      {docs.length === 0 ? (
        <EmptyState title="Noch keine Dokumente." hint="Lege eine Datei in content/docs/ an." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {docs.map((doc) => (
            <DocCard key={doc.slug} doc={doc} />
          ))}
        </div>
      )}
    </>
  );
}
