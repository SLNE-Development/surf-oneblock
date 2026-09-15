"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface NavItem {
  title: string;
  path: string;
  status?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const TOP_LINKS: NavItem[] = [
  { title: "Übersicht", path: "/" },
  { title: "Features", path: "/features" },
  { title: "Roadmap", path: "/roadmap" },
  { title: "Entscheidungen", path: "/adr" },
  { title: "Dokumente", path: "/docs" },
  { title: "Für KI-Agenten", path: "/contributing" },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.path}
      className={`block truncate rounded-md px-2.5 py-1.5 text-[13px] transition ${
        active
          ? "bg-primary-soft/60 font-medium text-primary"
          : "text-muted hover:bg-surface-2 hover:text-text"
      }`}
    >
      {item.title}
    </Link>
  );
}

export function Sidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 pb-10 pt-4">
      <div className="space-y-0.5">
        {TOP_LINKS.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            active={item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)}
          />
        ))}
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink key={item.path} item={item} active={pathname === item.path} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface-0/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-primary-soft text-[11px] font-bold text-primary">
            OB
          </span>
          <span className="text-sm font-semibold">surf-oneblock</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-md border border-line px-2.5 py-1 text-xs text-muted"
          aria-expanded={open}
        >
          {open ? "Schließen" : "Menü"}
        </button>
      </div>

      {open ? (
        <div className="border-b border-line bg-surface-1 lg:hidden" onClick={() => setOpen(false)}>
          {nav}
        </div>
      ) : null}

      {/* Desktop */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-line bg-surface-1 lg:block">
        <Link href="/" className="flex items-center gap-2.5 border-b border-line px-4 py-4">
          <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
            OB
          </span>
          <span>
            <span className="block text-sm font-semibold leading-tight text-text">surf-oneblock</span>
            <span className="block text-[11px] leading-tight text-faint">Konzept &amp; Spec</span>
          </span>
        </Link>
        <div className="h-[calc(100dvh-4.25rem)]">{nav}</div>
      </aside>
    </>
  );
}
