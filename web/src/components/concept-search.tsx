"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

export interface SearchDocument {
  title: string;
  path: string;
  kind: string;
  summary: string;
  content: string;
}

interface SearchResult extends SearchDocument {
  score: number;
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <circle cx="8.5" cy="8.5" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m12.5 12.5 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("de-DE");
}

function scoreDocument(doc: SearchDocument, terms: string[]): SearchResult | null {
  const title = normalize(doc.title);
  const summary = normalize(doc.summary);
  const content = normalize(doc.content);
  const allText = `${title} ${summary} ${content}`;

  if (!terms.every((term) => allText.includes(term))) return null;

  let score = 0;
  for (const term of terms) {
    if (title === term) score += 80;
    else if (title.startsWith(term)) score += 45;
    else if (title.includes(term)) score += 30;
    if (summary.includes(term)) score += 12;
    if (content.includes(term)) score += 4;
  }

  return { ...doc, score };
}

function createExcerpt(doc: SearchDocument, query: string) {
  const source = [doc.summary, doc.content].filter(Boolean).join(" ");
  if (!source) return "Konzeptdokument öffnen";

  const normalizedSource = normalize(source);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const firstMatch = terms
    .map((term) => normalizedSource.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const start = firstMatch === undefined ? 0 : Math.max(0, firstMatch - 60);
  const end = Math.min(source.length, start + 180);

  return `${start > 0 ? "…" : ""}${source.slice(start, end).trim()}${end < source.length ? "…" : ""}`;
}

export function ConceptSearchDialog({
  documents,
  open,
  onOpenChange,
}: {
  documents: SearchDocument[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    return documents
      .map((doc) => scoreDocument(doc, terms))
      .filter((result): result is SearchResult => result !== null)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "de"))
      .slice(0, 12);
  }, [documents, query]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  function close() {
    setQuery("");
    setActiveIndex(0);
    onOpenChange(false);
  }

  function openResult(result: SearchDocument) {
    close();
    router.push(result.path);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openResult(results[Math.min(activeIndex, results.length - 1)]);
    }
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-surface-0/75 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={close}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="concept-search-title"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-line-strong bg-surface-1 shadow-2xl shadow-black/40"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        <h2 id="concept-search-title" className="sr-only">Gesamtes Konzept durchsuchen</h2>
        <div className="flex h-16 items-center gap-3 border-b border-line px-5 text-muted">
          <span className="text-primary"><SearchIcon /></span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Systeme, Ideen und Fragen durchsuchen …"
            aria-label="Gesamtes Konzept durchsuchen"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="concept-search-results"
            aria-activedescendant={results.length > 0 ? `concept-search-result-${activeIndex}` : undefined}
            className="min-w-0 flex-1 appearance-none bg-transparent text-base text-text outline-none placeholder:text-faint"
          />
          <button
            type="button"
            onClick={close}
            className="rounded border border-line px-2 py-1 font-mono text-[11px] text-faint transition hover:border-line-strong hover:text-text"
          >
            ESC
          </button>
        </div>

        <div id="concept-search-results" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() ? (
            <p className="px-3 py-5 text-sm text-faint">
              Tippe, um alle Features, Entscheidungen und Dokumente zu durchsuchen.
            </p>
          ) : results.length > 0 ? (
            <>
              <p className="px-3 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-faint" aria-live="polite">
                {results.length} Treffer
              </p>
              {results.map((result, index) => (
                <Link
                  key={result.path}
                  id={`concept-search-result-${index}`}
                  href={result.path}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={close}
                  className={`block rounded-lg px-3 py-3 transition ${
                    index === activeIndex ? "bg-primary-soft/45" : "hover:bg-surface-2"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-medium text-text">{result.title}</span>
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {result.kind}
                    </span>
                  </span>
                  <span className="mt-1 block line-clamp-2 text-[12px] leading-relaxed text-faint">
                    {createExcerpt(result, query)}
                  </span>
                </Link>
              ))}
            </>
          ) : (
            <p role="status" className="px-3 py-8 text-center text-sm text-faint">
              Keine passenden Inhalte gefunden.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-5 py-3 text-[11px] text-faint">
          <span><kbd className="font-mono text-muted">↑ ↓</kbd> navigieren</span>
          <span><kbd className="font-mono text-muted">Enter</kbd> öffnen</span>
          <span><kbd className="font-mono text-muted">Esc</kbd> schließen</span>
        </div>
      </section>
    </div>
  );
}
