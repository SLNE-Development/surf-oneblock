import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { findDoc, href } from "@/lib/content";

const NOTE_TONES = {
  info: "border-info/35 bg-info/10 text-info",
  success: "border-success/35 bg-success/10 text-success",
  warning: "border-warning/35 bg-warning/10 text-warning",
  error: "border-error/35 bg-error/10 text-error",
  neutral: "border-line bg-surface-1 text-muted",
} as const;

/** Hinweisbox: <Note type="warning" title="Achtung">…</Note> */
function Note({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof NOTE_TONES;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${NOTE_TONES[type]}`}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="[&_p]:!text-inherit [&_li]:!text-inherit [&>*+*]:mt-2">{children}</div>
    </div>
  );
}

/** Zweispaltiges Layout: <Cols>…</Cols> */
function Cols({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 [&>*]:!mt-0">{children}</div>;
}

/** Offener Punkt: <Open>Wer entscheidet über X?</Open> */
function Open({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-lg border border-dashed border-line-strong bg-surface-1 px-3.5 py-2.5 text-[13px] text-muted">
      <span className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
        offen
      </span>
      <span>{children}</span>
    </div>
  );
}

/** Querverweis auf ein anderes Dokument: <Ref id="rpg-stats" /> */
async function Ref({ id, children }: { id: string; children?: React.ReactNode }) {
  const doc = await findDoc(id);
  if (!doc) {
    return (
      <span className="rounded border border-error/40 bg-error/10 px-1.5 py-0.5 font-mono text-[12px] text-error">
        ?{id}
      </span>
    );
  }
  return (
    <Link href={href(doc)} className="font-medium text-primary underline underline-offset-2">
      {children ?? doc.title}
    </Link>
  );
}

const components = { Note, Cols, Open, Ref };

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
