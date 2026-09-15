import Link from "next/link";

import {
  PILLAR_LABELS,
  RELEASE_LABELS,
  STATUS_LABELS,
  href,
  type DocMeta,
  type Pillar,
  type Release,
  type Status,
} from "@/lib/content";

const STATUS_CLASSES: Record<Status, string> = {
  idea: "border-line-strong/70 bg-surface-2 text-faint",
  draft: "border-secondary/35 bg-secondary/10 text-secondary",
  spec: "border-info/35 bg-info/10 text-info",
  "in-progress": "border-warning/35 bg-warning/10 text-warning",
  shipped: "border-success/35 bg-success/10 text-success",
  deprecated: "border-error/35 bg-error/10 text-error",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PillarBadge({ pillar }: { pillar: Pillar }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
      {PILLAR_LABELS[pillar]}
    </span>
  );
}

export function ReleaseBadge({ release }: { release: Release }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
      {RELEASE_LABELS[release]}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8 border-b border-line pb-6">
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-faint">{eyebrow}</p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </header>
  );
}

export function DocCard({ doc }: { doc: DocMeta }) {
  return (
    <Link
      href={href(doc)}
      className="group flex flex-col rounded-xl border border-line bg-surface-1 p-4 transition hover:border-line-strong hover:bg-surface-2"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-text group-hover:text-primary">
          {doc.title}
        </h3>
        <StatusBadge status={doc.status} />
      </div>
      <p className="line-clamp-3 text-[13px] leading-relaxed text-muted">{doc.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {doc.pillar ? <PillarBadge pillar={doc.pillar} /> : null}
        {doc.release ? <ReleaseBadge release={doc.release} /> : null}
      </div>
    </Link>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-10 text-center">
      <p className="text-sm font-medium text-muted">{title}</p>
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}

export function Stat({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-1 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${tone ?? "text-text"}`}>{value}</p>
    </div>
  );
}
