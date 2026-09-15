import { PageHeader } from "@/components/ui";
import { PILLARS, PILLAR_LABELS, RELEASES, STATUSES, STATUS_LABELS } from "@/lib/content";

export const metadata = { title: "Für KI-Agenten" };

const TEMPLATE = `---
id: multiblock-cooling
title: Kühlung für Maschinen
summary: Maschinen erzeugen Hitze; ohne Kühlung sinkt der Durchsatz.
status: draft        # ${STATUSES.join(" | ")}
pillar: multiblock   # ${PILLARS.join(" | ")}
release: v1.x        # ${RELEASES.join(" | ")}
owner: "@nick"
updated: 2026-09-13
order: 320
tags: [maschinen, balancing]
depends_on: [multiblock-machines, multiblock-energy]
uses: [surf-api]      # bestehende Systeme
---

## Problem

Worum geht es und warum ist das ein Problem?

## Lösung

Wie sieht das Feature aus?

<Note type="warning" title="Achtung">
  Tick-Kosten im Blick behalten — siehe <Ref id="multiblock-tick-budget" />.
</Note>

## Offene Punkte

<Open>Skaliert Hitze linear mit der Upgrade-Stufe?</Open>
`;

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-line bg-surface-1 p-4 font-mono text-[12px] leading-relaxed text-muted">
      <code>{children}</code>
    </pre>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-base font-semibold text-text">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function ContributingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Erweitern"
        title="Für KI-Agenten und Menschen"
        description="Diese Seite beschreibt, wie neue Inhalte entstehen. Kurzfassung: eine Datei anlegen, Frontmatter ausfüllen, fertig. Es gibt keinen Code, der angepasst werden müsste."
      />

      <Section title="Wo was liegt">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <code className="font-mono text-text">content/features/&lt;id&gt;.mdx</code> — ein Feature, eine
            Datei
          </li>
          <li>
            <code className="font-mono text-text">content/adr/&lt;id&gt;.mdx</code> — eine
            Architekturentscheidung
          </li>
          <li>
            <code className="font-mono text-text">content/docs/&lt;id&gt;.mdx</code> — Querschnittsdokumente
          </li>
        </ul>
        <p>
          Der Dateiname ist die URL. Navigation, Roadmap, Statusboard und der Abhängigkeitsgraph werden
          daraus generiert — nichts davon wird von Hand gepflegt.
        </p>
      </Section>

      <Section title="Vorlage">
        <Code>{TEMPLATE}</Code>
      </Section>

      <Section title="Frontmatter-Felder">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Feld", "Pflicht", "Werte"].map((head) => (
                  <th
                    key={head}
                    className="border border-line bg-surface-1 px-3 py-2 text-left font-semibold text-text"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["id", "ja", "Kleinbuchstaben mit Bindestrichen, muss dem Dateinamen entsprechen"],
                ["title", "ja", "Anzeigename"],
                ["summary", "ja", "Ein bis zwei Sätze, erscheint in Listen"],
                ["status", "ja", STATUSES.map((status) => STATUS_LABELS[status]).join(", ")],
                ["pillar", "Features", PILLARS.map((pillar) => PILLAR_LABELS[pillar]).join(", ")],
                ["release", "Features", RELEASES.join(", ")],
                ["depends_on", "nein", "Liste anderer ids — erzeugt Links in beide Richtungen"],
                [
                  "uses",
                  "nein",
                  "Bestehende Systeme, auf denen das Feature aufsetzt. Blanker Name = Repo in der SLNE-Org, sonst name|https://…",
                ],
                ["order", "nein", "Sortierung, kleinere Zahl zuerst (Default 1000)"],
                ["owner", "nein", "Verantwortliche Person"],
                ["updated", "nein", "JJJJ-MM-TT"],
                ["tags", "nein", "Freie Schlagworte, durchsuchbar"],
                ["decision", "nur ADR", "Die getroffene Entscheidung in einem Satz; weglassen = offen"],
              ].map(([field, required, values]) => (
                <tr key={field}>
                  <td className="border border-line px-3 py-2 font-mono text-text">{field}</td>
                  <td className="border border-line px-3 py-2 text-faint">{required}</td>
                  <td className="border border-line px-3 py-2">{values}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Komponenten im MDX">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <code className="font-mono text-text">
              &lt;Note type=&quot;info|success|warning|error|neutral&quot; title=&quot;…&quot;&gt;
            </code>{" "}
            — Hinweisbox
          </li>
          <li>
            <code className="font-mono text-text">&lt;Open&gt;…&lt;/Open&gt;</code> — ein offener Punkt
          </li>
          <li>
            <code className="font-mono text-text">&lt;Ref id=&quot;rpg-stats&quot; /&gt;</code> — Link auf ein
            anderes Dokument, egal in welcher Collection
          </li>
          <li>
            <code className="font-mono text-text">&lt;Cols&gt;…&lt;/Cols&gt;</code> — zwei Spalten
          </li>
        </ul>
        <p>
          Tabellen, Codeblöcke und Aufzählungen funktionieren als normales Markdown (GFM). Überschriften
          im Text beginnen bei <code className="font-mono text-text">##</code> — die H1 kommt aus{" "}
          <code className="font-mono text-text">title</code>.
        </p>
      </Section>

      <Section title="Regeln">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Ein Thema, eine Datei. Lieber ein neues Feature verlinken als eine Seite aufblähen.</li>
          <li>
            Bestehende Dateien werden ergänzt, nicht ersetzt. Wer etwas umwirft, setzt den alten Stand auf{" "}
            <code className="font-mono text-text">status: deprecated</code> statt ihn zu löschen.
          </li>
          <li>
            Jede schwer umkehrbare Entscheidung gehört als ADR erfasst, auch wenn sie noch offen ist.
          </li>
          <li>
            <code className="font-mono text-text">npm run check:content</code> prüft Frontmatter und
            Referenzen. Vor dem Commit laufen lassen.
          </li>
        </ul>
      </Section>
    </>
  );
}
