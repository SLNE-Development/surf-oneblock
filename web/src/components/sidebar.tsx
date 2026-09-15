"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { ConceptSearchDialog, type SearchDocument } from "@/components/concept-search";

export interface NavItem {
  title: string;
  path: string;
  status?: string;
}

export interface NavGroup {
  label: string;
  icon: NavGroupIcon;
  items: NavItem[];
}

export type NavGroupIcon =
  | "general"
  | "platform"
  | "core"
  | "island"
  | "clans"
  | "multiblock"
  | "rpg"
  | "economy"
  | "ops"
  | "decisions"
  | "documents";

const TOP_LINKS: NavItem[] = [
  { title: "Übersicht", path: "/" },
  { title: "Features", path: "/features" },
  { title: "Roadmap", path: "/roadmap" },
  { title: "Entscheidungen", path: "/adr" },
  { title: "Dokumente", path: "/docs" },
  { title: "Für KI-Agenten", path: "/contributing" },
];

const MIN_SIDEBAR_WIDTH = 208;
const MAX_SIDEBAR_WIDTH = 480;
const DEFAULT_SIDEBAR_WIDTH = 256;
const COLLAPSED_SIDEBAR_WIDTH = 64;
const WIDTH_STORAGE_KEY = "surf-oneblock:sidebar-width";
const COLLAPSED_STORAGE_KEY = "surf-oneblock:sidebar-collapsed";
const GROUPS_STORAGE_KEY = "surf-oneblock:sidebar-groups";

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`size-3.5 shrink-0 transition-transform ${collapsed ? "-rotate-90" : ""}`}
      fill="none"
    >
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarIcon({ direction }: { direction: "collapse" | "expand" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <rect x="2.5" y="3" width="15" height="14" rx="2" stroke="currentColor" />
      <path d="M7 3v14" stroke="currentColor" />
      <path
        d={direction === "collapse" ? "m13 7-3 3 3 3" : "m11 7 3 3-3 3"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <circle cx="8.5" cy="8.5" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m12.5 12.5 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function CategoryIcon({ icon }: { icon: NavGroupIcon }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.6,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4.5">
      {icon === "general" ? (
        <>
          <circle cx="12" cy="12" r="8" {...commonProps} />
          <path d="m15 9-2 4-4 2 2-4 4-2Z" {...commonProps} />
        </>
      ) : null}
      {icon === "platform" ? (
        <>
          <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" {...commonProps} />
          <path d="m4 12 8 4 8-4M4 16.5l8 4 8-4" {...commonProps} />
        </>
      ) : null}
      {icon === "core" ? (
        <>
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" {...commonProps} />
          <path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v8.5" {...commonProps} />
        </>
      ) : null}
      {icon === "island" ? (
        <>
          <path d="M6 9.5h12l-2.5 4.2h-7L6 9.5Z" {...commonProps} />
          <path d="M4 17c1.4-1.1 2.8-1.1 4.2 0 1.4 1.1 2.8 1.1 4.2 0 1.4-1.1 2.8-1.1 4.2 0 1.1.8 2.2 1 3.4.4M9 9.5l3-4 3 4" {...commonProps} />
        </>
      ) : null}
      {icon === "clans" ? (
        <>
          <circle cx="9" cy="9" r="3" {...commonProps} />
          <circle cx="17" cy="10" r="2.3" {...commonProps} />
          <path d="M3.5 19c.6-3.1 2.4-4.8 5.5-4.8s4.9 1.7 5.5 4.8M14.5 15c2.9-.7 5 .7 5.8 3.5" {...commonProps} />
        </>
      ) : null}
      {icon === "multiblock" ? (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" {...commonProps} />
          <rect x="14" y="4" width="6" height="6" rx="1" {...commonProps} />
          <rect x="4" y="14" width="6" height="6" rx="1" {...commonProps} />
          <rect x="14" y="14" width="6" height="6" rx="1" {...commonProps} />
        </>
      ) : null}
      {icon === "rpg" ? (
        <>
          <path d="m14.5 4 5.5-.8-.8 5.5-8.7 8.7-4-4L14.5 4Z" {...commonProps} />
          <path d="m8 15.5-4 4M5.5 16l2.5 2.5" {...commonProps} />
        </>
      ) : null}
      {icon === "economy" ? (
        <>
          <ellipse cx="12" cy="7" rx="7.5" ry="3" {...commonProps} />
          <path d="M4.5 7v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V7M4.5 12v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-5" {...commonProps} />
        </>
      ) : null}
      {icon === "ops" ? (
        <>
          <circle cx="12" cy="12" r="3" {...commonProps} />
          <path d="M19 13.5v-3l-2.2-.6a7 7 0 0 0-.7-1.6l1.1-2-2.1-2.1-2 1.1a7 7 0 0 0-1.6-.7L11 2.5H8l-.6 2.2a7 7 0 0 0-1.6.7l-2-1.1-2.1 2.1 1.1 2a7 7 0 0 0-.7 1.6L0 10.5v3l2.2.6c.2.6.4 1.1.7 1.6l-1.1 2 2.1 2.1 2-1.1c.5.3 1 .5 1.6.7l.6 2.1h3l.6-2.2c.6-.2 1.1-.4 1.6-.7l2 1.1 2.1-2.1-1.1-2c.3-.5.5-1 .7-1.6l2-.5Z" transform="translate(2.5) scale(.8)" {...commonProps} />
        </>
      ) : null}
      {icon === "decisions" ? (
        <>
          <path d="M6 4v11M6 8h7a3 3 0 0 1 3 3v1" {...commonProps} />
          <circle cx="6" cy="18" r="2" {...commonProps} />
          <circle cx="16" cy="15" r="2" {...commonProps} />
        </>
      ) : null}
      {icon === "documents" ? (
        <>
          <path d="M6 3h8l4 4v14H6V3Z" {...commonProps} />
          <path d="M14 3v5h4M9 12h6M9 16h6" {...commonProps} />
        </>
      ) : null}
    </svg>
  );
}

function NavLink({
  item,
  active,
  onNavigate,
  nested = false,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
  nested?: boolean;
}) {
  return (
    <Link
      href={item.path}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group/link relative block truncate rounded-md py-1.5 text-[13px] transition ${
        nested ? "pl-4 pr-2" : "px-2.5"
      } ${
        active
          ? "bg-primary-soft/60 font-medium text-primary"
          : "text-muted hover:bg-surface-2 hover:text-text"
      }`}
    >
      {nested ? (
        <span
          aria-hidden="true"
          className={`absolute left-1.5 top-1/2 size-1 -translate-y-1/2 rounded-full transition ${
            active ? "bg-primary" : "bg-line-strong group-hover/link:bg-muted"
          }`}
        />
      ) : null}
      {item.title}
    </Link>
  );
}

function clampSidebarWidth(width: number) {
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width));
}

export function Sidebar({
  groups,
  searchDocuments,
}: {
  groups: NavGroup[];
  searchDocuments: SearchDocument[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => new Set());
  const [resizing, setResizing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const storedWidth = Number.parseInt(localStorage.getItem(WIDTH_STORAGE_KEY) ?? "", 10);
    if (Number.isFinite(storedWidth)) {
      setSidebarWidth(clampSidebarWidth(storedWidth));
    }

    setDesktopCollapsed(localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true");

    try {
      const storedGroups = JSON.parse(localStorage.getItem(GROUPS_STORAGE_KEY) ?? "[]");
      if (Array.isArray(storedGroups)) {
        setCollapsedGroups(new Set(storedGroups.filter((value): value is string => typeof value === "string")));
      }
    } catch {
      localStorage.removeItem(GROUPS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase("de-DE") === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function toggleDesktop() {
    setDesktopCollapsed((current) => {
      const next = !current;
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      return next;
    });
  }

  function toggleGroup(label: string) {
    setCollapsedGroups((current) => {
      const next = new Set(current);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function startResize(event: ReactPointerEvent<HTMLElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = sidebarWidth;
    setResizing(true);

    function resize(pointerEvent: PointerEvent) {
      setSidebarWidth(clampSidebarWidth(startWidth + pointerEvent.clientX - startX));
    }

    function stopResize(pointerEvent: PointerEvent) {
      const nextWidth = clampSidebarWidth(startWidth + pointerEvent.clientX - startX);
      setSidebarWidth(nextWidth);
      localStorage.setItem(WIDTH_STORAGE_KEY, String(nextWidth));
      setResizing(false);
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    }

    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  }

  function resizeWithKeyboard(event: ReactKeyboardEvent<HTMLElement>) {
    let nextWidth: number | null = null;

    if (event.key === "ArrowLeft") nextWidth = sidebarWidth - 16;
    if (event.key === "ArrowRight") nextWidth = sidebarWidth + 16;
    if (event.key === "Home") nextWidth = MIN_SIDEBAR_WIDTH;
    if (event.key === "End") nextWidth = MAX_SIDEBAR_WIDTH;

    if (nextWidth === null) return;

    event.preventDefault();
    const clampedWidth = clampSidebarWidth(nextWidth);
    setSidebarWidth(clampedWidth);
    localStorage.setItem(WIDTH_STORAGE_KEY, String(clampedWidth));
  }

  function renderNav(instance: "mobile" | "desktop") {
    const navigationGroups: Array<NavGroup & { topLevel?: boolean }> = [
      { label: "Allgemein", icon: "general", items: TOP_LINKS, topLevel: true },
      ...groups,
    ];

    return (
      <nav aria-label="Hauptnavigation" className="flex h-full flex-col overflow-y-auto px-3 pb-10 pt-4">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-haspopup="dialog"
          aria-keyshortcuts="Control+K Meta+K"
          className="group flex min-h-14 w-full items-center gap-2.5 rounded-xl border border-line-strong bg-surface-0 px-3 py-2.5 text-left shadow-sm transition hover:border-primary/55 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft/60 text-primary transition group-hover:bg-primary-soft">
            <SearchIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-text">Konzept durchsuchen</span>
            <span className="mt-0.5 block truncate text-[11px] text-faint">
              Volltext in {searchDocuments.length} Dokumenten
            </span>
          </span>
          <kbd className="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">Strg K</kbd>
        </button>

        <div className="mt-4 space-y-2">
          {navigationGroups.map((group, index) => {
            const collapsed = collapsedGroups.has(group.label);
            const groupId = `${instance}-sidebar-group-${index}`;

            return (
              <section key={group.label}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  aria-expanded={!collapsed}
                  aria-controls={groupId}
                  className="flex w-full items-center gap-2.5 rounded-lg border border-line/80 bg-surface-2/55 px-2.5 py-2 text-left transition hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-md border border-primary/20 bg-primary-soft/45 text-primary">
                    <CategoryIcon icon={group.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-text">{group.label}</span>
                    <span className="block text-[10px] leading-tight text-faint">
                      {group.items.length} {group.items.length === 1 ? "Eintrag" : "Einträge"}
                    </span>
                  </span>
                  <span className="text-faint">
                    <ChevronIcon collapsed={collapsed} />
                  </span>
                </button>
                <div
                  id={groupId}
                  hidden={collapsed}
                  className="ml-3 mt-1.5 space-y-0.5 border-l border-line pl-2"
                >
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      item={item}
                      nested
                      active={
                        group.topLevel
                          ? item.path === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.path)
                          : pathname === item.path
                      }
                      onNavigate={instance === "mobile" ? () => setMobileOpen(false) : undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface-0/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/surf-oneblock-logo.png" alt="" width={32} height={32} className="size-8 object-contain" priority />
          <span className="text-sm font-semibold">surf-oneblock</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-md border border-line px-2.5 py-1 text-xs text-muted"
          aria-expanded={mobileOpen}
          aria-controls="mobile-sidebar-navigation"
        >
          {mobileOpen ? "Schließen" : "Menü"}
        </button>
      </div>

      {mobileOpen ? (
        <div id="mobile-sidebar-navigation" className="border-b border-line bg-surface-1 lg:hidden">
          {renderNav("mobile")}
        </div>
      ) : null}

      {/* Desktop */}
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 border-r border-line bg-surface-1 lg:block ${
          resizing ? "select-none" : "transition-[width] duration-200"
        }`}
        style={{ width: desktopCollapsed ? COLLAPSED_SIDEBAR_WIDTH : sidebarWidth }}
      >
        <div
          className={`flex h-[4.25rem] items-center border-b border-line ${
            desktopCollapsed ? "justify-center" : "gap-2.5 px-4"
          }`}
        >
          <Link
            href="/"
            aria-label="Zur Übersicht"
            className={desktopCollapsed ? "hidden" : "flex min-w-0 flex-1 items-center gap-2.5"}
          >
            <Image
              src="/surf-oneblock-logo.png"
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 object-contain"
              priority
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight text-text">surf-oneblock</span>
              <span className="block truncate text-[11px] leading-tight text-faint">Konzept &amp; Spec</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={toggleDesktop}
            aria-label={desktopCollapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
            title={desktopCollapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
            className="grid size-8 shrink-0 place-items-center rounded-md text-faint transition hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <SidebarIcon direction={desktopCollapsed ? "expand" : "collapse"} />
          </button>
        </div>

        {desktopCollapsed ? (
          <div className="mt-4 flex flex-col items-center gap-2">
            <Link
              href="/"
              aria-label="Zur Übersicht"
              title="surf-oneblock"
              className="grid size-11 place-items-center rounded-lg transition hover:bg-surface-2"
            >
              <Image src="/surf-oneblock-logo.png" alt="" width={44} height={44} className="size-11 object-contain" />
            </Link>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Gesamtes Konzept durchsuchen"
              aria-haspopup="dialog"
              aria-keyshortcuts="Control+K Meta+K"
              title="Konzept durchsuchen (Strg/⌘ + K)"
              className="grid size-10 place-items-center rounded-lg text-primary transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <SearchIcon />
            </button>
          </div>
        ) : (
          <div className="h-[calc(100dvh-4.25rem)]">{renderNav("desktop")}</div>
        )}

        {!desktopCollapsed ? (
          <div
            role="separator"
            tabIndex={0}
            onPointerDown={startResize}
            onKeyDown={resizeWithKeyboard}
            aria-label="Breite der Sidebar ändern"
            aria-orientation="vertical"
            aria-valuemin={MIN_SIDEBAR_WIDTH}
            aria-valuemax={MAX_SIDEBAR_WIDTH}
            aria-valuenow={sidebarWidth}
            title="Sidebar-Breite ziehen"
            className="group absolute inset-y-0 -right-1.5 z-10 w-3 cursor-col-resize touch-none focus-visible:outline-none"
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent transition group-hover:bg-primary group-focus-visible:bg-primary" />
          </div>
        ) : null}
      </aside>

      <ConceptSearchDialog documents={searchDocuments} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
