"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboardIcon,
    exact: true,
  },
  {
    href: "/dashboard/applications",
    label: "Applications",
    icon: ClipboardListIcon,
    exact: false,
  },
  {
    href: "/dashboard/applications/new",
    label: "Add application",
    icon: PlusIcon,
    exact: true,
  },
  {
    href: "/dashboard/analyzer",
    label: "Resume Analyzer",
    icon: SparklesIcon,
    exact: true,
  },
];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      <p className="px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
        Menu
      </p>
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href ||
            (pathname.startsWith(`${link.href}/`) &&
              pathname !== "/dashboard/applications/new");
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-r-full bg-brand w-0.5" />
            )}
            <link.icon
              className={cn(
                "size-4 transition-colors",
                active
                  ? "text-brand"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
