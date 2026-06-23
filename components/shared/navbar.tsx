import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { BriefcaseBusinessIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BriefcaseBusinessIcon className="size-5 text-primary" />
          <span>AI Resume Tracker</span>
        </Link>
        <nav className="flex items-center gap-2">
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
