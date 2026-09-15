# surf-oneblock — Konzept & Spezifikation

Internes Design-Dokument für den OneBlock-Spielmodus. Next.js App Router, hinter einem
Token-Gate, Inhalte als MDX im Repo.

## Lokal starten

```bash
npm install
cp .env.example .env.local     # ACCESS_TOKENS und SESSION_SECRET setzen
npm run dev
```

Token erzeugen: `openssl rand -base64 32`

## Zugang

Es gibt keine Benutzerkonten. In `ACCESS_TOKENS` steht eine kommagetrennte Liste von Tokens,
jeweils optional mit Label:

```
ACCESS_TOKENS="team:AbC...,builder:XyZ...,gast:Q1w..."
```

Wer einen dieser Tokens auf `/login` eingibt, bekommt ein signiertes, httpOnly-Cookie. Das
Cookie enthält den Token **nicht**, nur eine HMAC-Signatur über Label, Ablaufzeit und Token.
Einen Token aus der Liste entfernen invalidiert sofort alle damit erzeugten Sessions — so
entzieht man einer Person den Zugang, ohne alle anderen auszusperren.

Geprüft wird zweifach: in der Middleware (vor jedem Request) und noch einmal serverseitig im
Layout der geschützten Routen. Ohne gültige Session wird nichts gerendert.

## Inhalte bearbeiten

```
content/
  features/<id>.mdx    ein Feature, eine Datei
  adr/<id>.mdx         eine Architekturentscheidung
  docs/<id>.mdx        Querschnittsdokumente
```

Eine neue Datei erzeugt automatisch Seite, Navigationseintrag, Roadmap-Zeile und Knoten im
Abhängigkeitsgraph — es gibt keinen Code, der angepasst werden müsste. Die vollständige
Beschreibung des Formats steht in `AGENTS.md` und in der App unter **Für KI-Agenten**.

```bash
npm run check:content   # Frontmatter und Referenzen prüfen
```

## Deployment auf Coolify

1. Neue Ressource → **Dockerfile** (das Repo bringt eins mit).
2. Environment Variables setzen: `ACCESS_TOKENS`, `SESSION_SECRET`.
3. Port `3000`, Healthcheck ist im Image hinterlegt.
4. Domain zuweisen — Coolify terminiert TLS, das Cookie wird in Produktion als `Secure` gesetzt.

Das Image ist ein `standalone`-Build; `content/` wird zur Laufzeit gelesen und liegt deshalb
mit im Image. Inhaltsänderungen brauchen also einen Redeploy — das ist gewollt, damit die
Doku versioniert bleibt.

## Struktur

```
src/
  app/
    (app)/            geschützte Seiten: Übersicht, Features, Roadmap, ADRs, Docs
    login/            einzige öffentliche Seite
    api/login|logout  Token-Prüfung, Cookie setzen/löschen
  components/         UI und MDX-Komponenten
  lib/
    auth.ts           Token-Prüfung und Cookie-Signatur (Edge-kompatibel)
    content.ts        MDX-Loader, Vokabular, Abhängigkeiten
  middleware.ts       das Gate
content/              alle Inhalte
scripts/              Content-Linter
```
