import Link from "next/link";
import { notFound } from "next/navigation";

import { Mdx } from "@/components/mdx";
import { PillarBadge, ReleaseBadge, StatusBadge } from "@/components/ui";
import {
  COLLECTION_LABELS,
  findDoc,
  getDependents,
  getDoc,
  href,
  repoLink,
  type Collection,
  type DocMeta,
} from "@/lib/content";

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line py-2 last:border-0">
      <dt className="w-28 shrink-0 text-[11px] font-medium uppercase tracking-wider text-faint">{label}</dt>
      <dd className="min-w-0 flex-1 text-[13px] text-muted">{children}</dd>
    </div>
  );
}

function DocLinkList({ docs }: { docs: DocMeta[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {docs.map((doc) => (
        <li key={`${doc.collection}/${doc.slug}`}>
          <Link href={href(doc)} className="text-primary underline underline-offset-2">
            {doc.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function DocPage({ collection, slug }: { collection: Collection; slug: string }) {
  const doc = await getDoc(collection, slug);
  if (!doc) notFound();

  const dependencies = (await Promise.all(doc.dependsOn.map((id) => findDoc(id)))).filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
  const dependents = await getDependents(doc.slug);
  const missing = doc.dependsOn.filter((id) => !dependencies.some((dep) => dep.slug === id));

  return (
    <article>
      <nav className="mb-4 text-xs text-faint">
        <Link href={`/${collection}`} className="hover:text-muted">
          {COLLECTION_LABELS[collection]}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-mono">{doc.slug}</span>
      </nav>

      <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{doc.title}</h1>
      {doc.summary ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{doc.summary}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={doc.status} />
        {doc.pillar ? <PillarBadge pillar={doc.pillar} /> : null}
        {doc.release ? <ReleaseBadge release={doc.release} /> : null}
      </div>

      {doc.decision ? (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary-soft/25 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-primary">Entscheidung</p>
          <p className="mt-1 text-sm text-text">{doc.decision}</p>
        </div>
      ) : null}

      <dl className="mt-6 rounded-xl border border-line bg-surface-1 px-4 py-1">
        {doc.owner ? <MetaRow label="Owner">{doc.owner}</MetaRow> : null}
        {doc.updated ? <MetaRow label="Aktualisiert">{doc.updated}</MetaRow> : null}
        {dependencies.length > 0 || missing.length > 0 ? (
          <MetaRow label="Setzt voraus">
            <DocLinkList docs={dependencies} />
            {missing.length > 0 ? (
              <span className="mt-1 block font-mono text-[12px] text-error">
                Unbekannt: {missing.join(", ")}
              </span>
            ) : null}
          </MetaRow>
        ) : null}
        {dependents.length > 0 ? (
          <MetaRow label="Benötigt von">
            <DocLinkList docs={dependents} />
          </MetaRow>
        ) : null}
        {doc.uses.length > 0 ? (
          <MetaRow label="Nutzt">
            <ul className="flex flex-wrap gap-1.5">
              {doc.uses.map((entry) => {
                const { label, url } = repoLink(entry);
                return (
                  <li key={entry}>
                    <a
                      href={url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-md border border-secondary/30 bg-secondary/10 px-2 py-0.5 font-mono text-[12px] text-secondary transition hover:border-secondary/60"
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </MetaRow>
        ) : null}
        {doc.tags.length > 0 ? (
          <MetaRow label="Tags">
            <span className="font-mono text-[12px] text-faint">{doc.tags.join(" · ")}</span>
          </MetaRow>
        ) : null}
      </dl>

      <div className="mt-10">
        <Mdx source={doc.body} />
      </div>

      <p className="mt-14 border-t border-line pt-4 font-mono text-[11px] text-faint">
        Quelle: content/{collection}/{doc.slug}.mdx
      </p>
    </article>
  );
}

export async function docMetadata(collection: Collection, slug: string) {
  const doc = await getDoc(collection, slug);
  return { title: doc?.title ?? "Nicht gefunden", description: doc?.summary };
}
