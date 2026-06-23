import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { Logo } from "@/components/shared/logo";

const points = [
  "Track every application in one place",
  "See live analytics and your acceptance rate",
  "Private and isolated to your account",
];

export function AuthShell({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-border/60 bg-card/30 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] hero-glow" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative space-y-6">
          <p className="text-2xl font-semibold leading-snug tracking-tight">
            The calm, organized way to run your job search.
          </p>
          <ul className="space-y-3">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <CheckIcon className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-sm text-muted-foreground">
          © {new Date().getFullYear()} ResumeTrack
        </div>
      </aside>

      {/* Form panel */}
      <div className="relative flex flex-col items-center justify-center px-4 py-12">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 lg:hidden" />
        <div className="relative flex w-full max-w-sm flex-col items-center">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subheading}</p>
          </div>
          {children}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to use ResumeTrack responsibly.{" "}
            <Link href="/" className="underline-offset-4 hover:underline">
              Back home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
