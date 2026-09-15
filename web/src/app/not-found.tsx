import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-faint">404</p>
        <h1 className="mt-2 text-xl font-semibold text-text">Diese Seite gibt es nicht.</h1>
        <p className="mt-2 text-sm text-muted">
          Vielleicht wurde die MDX-Datei umbenannt oder noch nicht angelegt.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg border border-line px-3.5 py-2 text-sm text-muted transition hover:border-line-strong hover:text-text"
        >
          Zur Übersicht
        </Link>
      </div>
    </main>
  );
}
