import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

/* ------------------------------------------------------------------ *
 * Vokabular
 * ------------------------------------------------------------------ */

export const STATUSES = ["idea", "draft", "spec", "in-progress", "shipped", "deprecated"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  idea: "Idee",
  draft: "Entwurf",
  spec: "Spezifiziert",
  "in-progress": "In Arbeit",
  shipped: "Live",
  deprecated: "Verworfen",
};

export const PILLARS = [
  "platform",
  "core",
  "island",
  "clans",
  "multiblock",
  "rpg",
  "economy",
  "ops",
] as const;
export type Pillar = (typeof PILLARS)[number];

export const PILLAR_LABELS: Record<Pillar, string> = {
  platform: "Plattform",
  core: "OneBlock-Core",
  island: "Inseln",
  clans: "Clans",
  multiblock: "Multiblocks",
  rpg: "RPG",
  economy: "Wirtschaft",
  ops: "Betrieb",
};

export const PILLAR_DESCRIPTIONS: Record<Pillar, string> = {
  platform: "Fundament: Modulsystem, Services, Registries, GUI, i18n.",
  core: "Der Block selbst — Abbau, Phasen, Loot, Progression.",
  island: "Inseln, Presets, Platzierung, Rechte, Welt-Zuweisung.",
  clans: "Anbindung des bestehenden Clansystems und Clan-Content.",
  multiblock: "Strukturen, Maschinen, Rezepte, Transport und Energie.",
  rpg: "Stats, Damage, Skills, Items, Mobs, Quests.",
  economy: "Währungen, Handel, Bazaar, Sinks und Balancing.",
  ops: "Deployment, Telemetrie, Admin-Werkzeuge, Migrationen.",
};

export const RELEASES = ["v1", "v1.x", "v2", "backlog"] as const;
export type Release = (typeof RELEASES)[number];

export const RELEASE_LABELS: Record<Release, string> = {
  v1: "V1 — Launch",
  "v1.x": "V1.x — Nachliefern",
  v2: "V2 — Später",
  backlog: "Backlog",
};

export const COLLECTIONS = ["features", "adr", "docs"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export const COLLECTION_LABELS: Record<Collection, string> = {
  features: "Features",
  adr: "Entscheidungen",
  docs: "Dokumente",
};

/* ------------------------------------------------------------------ *
 * Typen
 * ------------------------------------------------------------------ */

export interface DocMeta {
  slug: string;
  collection: Collection;
  title: string;
  summary: string;
  status: Status;
  pillar: Pillar | null;
  release: Release | null;
  owner: string | null;
  tags: string[];
  /** Slugs anderer Dokumente, die dieses hier voraussetzt. */
  dependsOn: string[];
  /** Bestehende Systeme (Repos in der SLNE-Org o. ä.), auf denen dieses Feature aufsetzt. */
  uses: string[];
  updated: string | null;
  order: number;
  /** Nur für ADRs: getroffene Entscheidung in einem Satz. */
  decision: string | null;
}

export interface Doc extends DocMeta {
  body: string;
}

/* ------------------------------------------------------------------ *
 * Laden
 * ------------------------------------------------------------------ */

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim())
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  return [];
}

/** YAML parst unquotierte Datumsangaben zu Date — hier wieder auf JJJJ-MM-TT bringen. */
function asDate(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value).trim();
  return text.length > 0 ? text.slice(0, 10) : null;
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T | null): T | null {
  const candidate = typeof value === "string" ? (value.trim() as T) : null;
  return candidate && allowed.includes(candidate) ? candidate : fallback;
}

function parseDoc(collection: Collection, fileName: string, raw: string): Doc {
  const { data, content } = matter(raw);
  const slug = String(data.id ?? fileName.replace(/\.mdx?$/, ""));

  return {
    slug,
    collection,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    status: asEnum(data.status, STATUSES, "draft") as Status,
    pillar: asEnum(data.pillar, PILLARS, null),
    release: asEnum(data.release, RELEASES, null),
    owner: data.owner ? String(data.owner) : null,
    tags: asArray(data.tags),
    dependsOn: asArray(data.depends_on ?? data.dependsOn),
    uses: asArray(data.uses),
    updated: asDate(data.updated),
    order: Number.isFinite(Number(data.order)) ? Number(data.order) : 1000,
    decision: data.decision ? String(data.decision) : null,
    body: content,
  };
}

async function readCollection(collection: Collection): Promise<Doc[]> {
  const dir = path.join(CONTENT_ROOT, collection);
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }

  const files = entries.filter((name) => /\.mdx?$/.test(name) && !name.startsWith("_"));
  const docs = await Promise.all(
    files.map(async (name) => parseDoc(collection, name, await readFile(path.join(dir, name), "utf8"))),
  );

  return docs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "de"));
}

/** Alle Dokumente einer Collection. Pro Request gecacht. */
export const getCollection = cache(readCollection);

/** Alle Dokumente aller Collections. */
export const getAllDocs = cache(async (): Promise<Doc[]> => {
  const groups = await Promise.all(COLLECTIONS.map((collection) => getCollection(collection)));
  return groups.flat();
});

export const getDoc = cache(async (collection: Collection, slug: string): Promise<Doc | null> => {
  const docs = await getCollection(collection);
  return docs.find((doc) => doc.slug === slug) ?? null;
});

/** Findet ein Dokument über alle Collections hinweg — für Querverweise. */
export const findDoc = cache(async (slug: string): Promise<Doc | null> => {
  const docs = await getAllDocs();
  return docs.find((doc) => doc.slug === slug) ?? null;
});

/** Dokumente, die das übergebene Dokument voraussetzen. */
export const getDependents = cache(async (slug: string): Promise<DocMeta[]> => {
  const docs = await getAllDocs();
  return docs.filter((doc) => doc.dependsOn.includes(slug));
});

export function href(doc: Pick<DocMeta, "collection" | "slug">): string {
  return `/${doc.collection}/${doc.slug}`;
}

/** GitHub-Organisation, in der die bestehenden Systeme liegen. */
export const REPO_ORG = "https://github.com/SLNE-Development";

/**
 * Link zu einem bestehenden System. Einträge in `uses` sind entweder ein
 * Repo-Name in der SLNE-Org oder `name|https://…` für alles außerhalb.
 */
export function repoLink(entry: string): { label: string; url: string | null } {
  const [label, url] = entry.split("|").map((part) => part.trim());
  if (url) return { label, url };
  return { label, url: `${REPO_ORG}/${label}` };
}

export function groupBy<T, K extends string>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const group = key(item);
    const existing = map.get(group);
    if (existing) existing.push(item);
    else map.set(group, [item]);
  }
  return map;
}
