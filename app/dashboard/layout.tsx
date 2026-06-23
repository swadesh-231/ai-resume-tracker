import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

import { NavLinks } from "@/components/dashboard/nav-links";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/shared/logo";

// Every dashboard route depends on the authenticated user.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border/60 bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-border/60 px-5">
          <Logo href="/dashboard" />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks />
        </div>
        <div className="border-t border-border/60 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Pro tip</p>
          <p className="mt-1 leading-relaxed">
            Update a status the moment it changes to keep your analytics sharp.
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <MobileNav />
            <span className="text-sm font-medium text-muted-foreground md:hidden">
              ResumeTrack
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <div className="ml-1 flex items-center">
              <UserButton />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
