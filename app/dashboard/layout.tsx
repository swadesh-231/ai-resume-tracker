import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { BriefcaseBusinessIcon } from "lucide-react";

import { NavLinks } from "@/components/dashboard/nav-links";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <BriefcaseBusinessIcon className="size-5 text-primary" />
            <span className="hidden sm:inline">AI Resume Tracker</span>
          </Link>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <aside className="hidden w-60 shrink-0 border-r p-4 md:block">
          <NavLinks />
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
