# Hinweise für KI-Agenten

Dieses Repo ist ein Design-Dokument für den Minecraft-Spielmodus **surf-oneblock**, ausgeliefert
als Next.js-App hinter einem Token-Gate. Der Inhalt liegt als MDX in `content/`.

## Das Wichtigste zuerst

**Inhalt ändern heißt: eine Datei in `content/` anlegen oder bearbeiten.** Es gibt keinen Code,
der dafür angepasst werden müsste. Navigation, Roadmap, Statusboard, Abhängigkeitsgraph und
Suche werden zur Laufzeit aus den Dateien generiert.

Nach jeder Änderung:

```bash
npm run check:content
```

Der Check prüft Frontmatter, `depends_on`, `<Ref>`-Ziele und Zyklen. Er muss grün sein.

## Verzeichnisse

| Pfad | Inhalt |
| --- | --- |
| `content/features/<id>.mdx` | ein Feature |
| `content/adr/<id>.mdx` | eine Architekturentscheidung |
| `content/docs/<id>.mdx` | Querschnittsdokument (Vision, Architektur, Glossar, …) |
| `src/` | die App. Nur anfassen, wenn sich das *Format* ändern soll, nicht der Inhalt. |

Der Dateiname ohne `.mdx` ist die `id` und die URL. Beides muss übereinstimmen.

## Frontmatter

```yaml
---
id: multiblock-cooling        # = Dateiname, Kleinbuchstaben und Bindestriche
title: Kühlung für Maschinen
summary: Ein bis zwei Sätze. Erscheint in Listen und auf Karten.
status: draft                 # idea | draft | spec | in-progress | shipped | deprecated
pillar: multiblock            # platform | core | island | clans | multiblock | rpg | economy | ops
release: v1.x                 # v1 | v1.x | v2 | backlog
owner: "@nick"                # optional
updated: 2026-09-13           # optional, JJJJ-MM-TT
order: 320                    # optional, Sortierung; kleiner = weiter oben
tags: [maschinen, balancing]  # optional
depends_on: [multiblock-machines, multiblock-energy]   # optional, ids
uses: [surf-api, mistra]      # optional, bestehende Systeme, auf denen das Feature aufsetzt
decision: "…"                 # nur ADRs; weglassen bedeutet "noch offen"
---
```

`uses` verlinkt auf bestehende Systeme. Ein blanker Name wird zu
`github.com/SLNE-Development/<name>`; für alles außerhalb der Org `name|https://…` schreiben.
Welches System was abdeckt, steht in `content/docs/existing-systems.mdx` — wer dort etwas ändert,
ändert auch das `uses` des betroffenen Features und umgekehrt.

`pillar` und `release` sind nur bei Features Pflicht. Bei ADRs entscheidet das Vorhandensein von
`decision`, ob die Entscheidung als offen oder getroffen gilt — offene ADRs erscheinen auf der
Startseite.

Vergebene `order`-Bereiche: Plattform 100–199, OneBlock 200–249, Inseln 250–299, Clans 300–349,
Multiblocks 400–449, RPG 500–599, Wirtschaft 600–649, Betrieb 700–749.

## MDX-Komponenten

```mdx
<Note type="info|success|warning|error|neutral" title="Optional">Hinweisbox</Note>
<Open>Ein ungeklärter Punkt.</Open>
<Ref id="rpg-stats" />                    Link auf ein anderes Dokument
<Ref id="rpg-stats">eigener Text</Ref>
<Cols>…</Cols>                            zwei Spalten
```

Ansonsten normales Markdown mit GFM-Tabellen. Überschriften im Fließtext beginnen bei `##` —
die H1 kommt aus `title`.

## Schreibregeln

- **Ein Thema, eine Datei.** Wird eine Seite zu lang, entsteht ein neues Feature und wird verlinkt.
- **Bestehendes ergänzen, nicht ersetzen.** Wer eine Festlegung umwirft, setzt die alte Datei auf
  `status: deprecated` und schreibt eine neue, statt Inhalt zu löschen.
- **Jede schwer umkehrbare Entscheidung wird ein ADR**, auch wenn sie noch offen ist. Offene ADRs
  sind wertvoll — sie zeigen, was blockiert.
- **Offene Punkte gehören in `<Open>`**, nicht in Fließtext. Sie sind so als solche erkennbar.
- **Deutsch**, im Ton sachlich und ohne Marketing. Trade-offs werden benannt, nicht weggelassen —
  ein Abschnitt, der nur Vorteile aufzählt, ist unvollständig.
- **Keine erfundenen Zahlen als Fakten.** Wo ein Wert ein Vorschlag ist, wird er als Vorschlag
  gekennzeichnet.

## Was im Code liegt

| Datei | Zweck |
| --- | --- |
| `src/lib/content.ts` | Vokabular (Status, Pillars, Releases) und MDX-Loader |
| `src/components/mdx.tsx` | die MDX-Komponenten oben |
| `src/lib/auth.ts`, `src/middleware.ts` | das Token-Gate |
| `scripts/check-content.mjs` | der Content-Linter |

Ein neuer Status, eine neue Säule oder eine neue Komponente wird an genau diesen Stellen ergänzt —
und im Linter, damit der Check sie kennt.

## Nicht tun

- Das Token-Gate aufweichen oder Routen aus der Middleware ausnehmen. Keine Seite ist öffentlich.
- Tokens, Secrets oder `.env`-Inhalte ins Repo schreiben.
- Navigationslisten von Hand pflegen — sie werden generiert.
- Eine `id` ändern. Links und Referenzen zeigen darauf; wenn es sein muss, neue Datei plus
  `status: deprecated` auf der alten.
