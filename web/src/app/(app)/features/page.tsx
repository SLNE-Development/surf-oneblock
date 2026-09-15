import { FeatureBrowser } from "@/components/feature-browser";
import { PageHeader } from "@/components/ui";
import { PILLARS, PILLAR_LABELS, STATUSES, STATUS_LABELS, getCollection } from "@/lib/content";

export const metadata = { title: "Features" };

export default async function FeaturesPage() {
  const docs = await getCollection("features");

  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title="Features"
        description="Jedes Feature ist eine eigene MDX-Datei unter content/features/. Eine neue Datei erzeugt automatisch eine neue Seite, einen Navigationseintrag und einen Knoten im Abhängigkeitsgraph."
      />
      <FeatureBrowser
        docs={docs}
        pillars={PILLARS.map((value) => ({ value, label: PILLAR_LABELS[value] }))}
        statuses={STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }))}
      />
    </>
  );
}
