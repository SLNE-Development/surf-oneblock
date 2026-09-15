#!/usr/bin/env node
/**
 * Prüft alle MDX-Dateien unter content/ auf gültiges Frontmatter und
 * auflösbare Referenzen. Vor dem Commit laufen lassen:
 *
 *   npm run check:content
 *
 * Exit-Code 1, wenn etwas nicht stimmt — damit auch in CI brauchbar.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.join(process.cwd(), "content");
const COLLECTIONS = ["features", "adr", "docs"];

const STATUSES = ["idea", "draft", "spec", "in-progress", "shipped", "deprecated"];
const PILLARS = ["platform", "core", "island", "clans", "multiblock", "rpg", "economy", "ops"];
const RELEASES = ["v1", "v1.x", "v2", "backlog"];

const problems = [];
const warnings = [];

function parseFrontmatter(raw, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) {
    problems.push(`${file}: kein Frontmatter-Block gefunden`);
    return null;
  }

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    value = value.replace(/\s+#.*$/, "").trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return data;
}

const docs = new Map();

for (const collection of COLLECTIONS) {
  const dir = path.join(ROOT, collection);
  let files;
  try {
    files = (await readdir(dir)).filter((name) => name.endsWith(".mdx"));
  } catch {
    warnings.push(`content/${collection}/ existiert nicht`);
    continue;
  }

  for (const file of files) {
    const rel = `content/${collection}/${file}`;
    const raw = await readFile(path.join(dir, file), "utf8");
    const data = parseFrontmatter(raw, rel);
    if (!data) continue;

    const expectedId = file.replace(/\.mdx$/, "");
    if (!data.id) problems.push(`${rel}: id fehlt`);
    else if (data.id !== expectedId) problems.push(`${rel}: id "${data.id}" passt nicht zum Dateinamen`);

    if (!data.title) problems.push(`${rel}: title fehlt`);
    if (!data.summary) warnings.push(`${rel}: summary fehlt — die Datei erscheint in Listen ohne Text`);

    if (!data.status) problems.push(`${rel}: status fehlt`);
    else if (!STATUSES.includes(data.status))
      problems.push(`${rel}: status "${data.status}" unbekannt (erlaubt: ${STATUSES.join(", ")})`);

    if (collection === "features") {
      if (!data.pillar) problems.push(`${rel}: pillar fehlt`);
      else if (!PILLARS.includes(data.pillar))
        problems.push(`${rel}: pillar "${data.pillar}" unbekannt (erlaubt: ${PILLARS.join(", ")})`);

      if (data.release && !RELEASES.includes(data.release))
        problems.push(`${rel}: release "${data.release}" unbekannt (erlaubt: ${RELEASES.join(", ")})`);
      if (!data.release) warnings.push(`${rel}: release fehlt — taucht in der Roadmap unter "Backlog" auf`);
    }

    if (data.updated && !/^\d{4}-\d{2}-\d{2}$/.test(data.updated))
      problems.push(`${rel}: updated "${data.updated}" ist kein JJJJ-MM-TT`);

    for (const entry of data.uses ?? []) {
      const [name, url] = String(entry).split("|");
      if (!/^[A-Za-z0-9._-]+$/.test(name.trim()))
        problems.push(`${rel}: uses-Eintrag "${entry}" ist kein Repo-Name`);
      if (url !== undefined && !/^https?:\/\//.test(url.trim()))
        problems.push(`${rel}: uses-Eintrag "${entry}" hat keine gültige URL nach dem |`);
    }

    docs.set(data.id ?? expectedId, { rel, data, body: raw });
  }
}

// Referenzen prüfen
for (const [id, { rel, data, body }] of docs) {
  for (const dependency of data.depends_on ?? []) {
    if (!docs.has(dependency)) problems.push(`${rel}: depends_on verweist auf unbekanntes "${dependency}"`);
    if (dependency === id) problems.push(`${rel}: depends_on verweist auf sich selbst`);
  }

  for (const match of body.matchAll(/<Ref\s+id="([^"]+)"/g)) {
    if (!docs.has(match[1])) problems.push(`${rel}: <Ref id="${match[1]}" /> zeigt ins Leere`);
  }
}

// Zyklen in depends_on
const state = new Map();
function visit(id, trail) {
  if (state.get(id) === "done") return;
  if (state.get(id) === "open") {
    problems.push(`Zyklus in depends_on: ${[...trail, id].join(" → ")}`);
    return;
  }
  state.set(id, "open");
  for (const dependency of docs.get(id)?.data.depends_on ?? []) {
    if (docs.has(dependency)) visit(dependency, [...trail, id]);
  }
  state.set(id, "done");
}
for (const id of docs.keys()) visit(id, []);

console.log(`${docs.size} Dokumente geprüft.`);
for (const warning of warnings) console.log(`  warn  ${warning}`);
for (const problem of problems) console.log(`  FEHLER ${problem}`);

if (problems.length > 0) {
  console.log(`\n${problems.length} Fehler.`);
  process.exit(1);
}
console.log("Alles in Ordnung.");
