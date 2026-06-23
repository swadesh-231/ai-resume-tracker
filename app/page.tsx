import Link from "next/link";
import {
  ArrowRightIcon,
  ClipboardListIcon,
  LineChartIcon,
  LayoutDashboardIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { DashboardPreview } from "@/components/landing/preview";
import { STATUS_META } from "@/types";
import { STATUSES } from "@/lib/validators";
import { STATUS_COLORS } from "@/components/charts/chart-colors";

const features = [
  {
    icon: ClipboardListIcon,
    title: "Every application, organized",
    description:
      "Company, role, status, salary, links, and notes — captured in one structured place instead of a dozen browser tabs.",
  },
  {
    icon: LineChartIcon,
    title: "Analytics that matter",
    description:
      "Status distribution, monthly trends, and your live acceptance rate — so you know exactly where your search stands.",
  },
  {
    icon: SearchIcon,
    title: "Find anything instantly",
    description:
      "Full-text search, status filters, sorting, and pagination — built to stay fast even when you're 200 applications deep.",
  },
  {
    icon: LayoutDashboardIcon,
    title: "A real dashboard",
    description:
      "Server-rendered, responsive, and quick. The recent-activity view keeps your next move always in sight.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private by design",
    description:
      "Authenticated with Clerk and isolated per user at the database layer. Your pipeline is yours alone.",
  },
  {
    icon: SparklesIcon,
    title: "Built to feel premium",
    description:
      "Thoughtful dark mode, crisp typography, and considered motion — a tool you'll actually want to open every day.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-150 hero-glow" />

          <div className="relative mx-auto w-full max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
              >
                <span className="inline-block size-1.5 rounded-full bg-brand" />
                Your job search, finally under control
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                <span className="text-gradient">Track every job application</span>
                <br />
                in one calm dashboard
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Stop losing track across spreadsheets and inboxes. ResumeTrack
                gives you one authenticated place to manage applications, monitor
                your pipeline, and see the analytics that keep your search on
                course.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 px-6 text-sm">
                  <Link href="/sign-up">
                    Start tracking free
                    <ArrowRightIcon />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 text-sm"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative mx-auto mt-16 max-w-4xl">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Lifecycle band */}
        <section className="border-y border-border/60 bg-card/30">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-10 sm:px-6">
            <p className="text-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Follow every stage of the hunt
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {STATUSES.map((status) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3 py-1.5 text-sm"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[status] }}
                  />
                  {STATUS_META[status].label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-4 text-muted-foreground">
              Purpose-built for one job: helping you run a focused, organized
              search from first application to signed offer.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card p-7 transition-colors hover:bg-accent/40"
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-background text-brand transition-colors group-hover:border-brand/40">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <div className="border-gradient relative overflow-hidden rounded-3xl px-6 py-16 text-center">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-64 hero-glow" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Bring order to your job search
              </h2>
              <p className="mt-4 text-muted-foreground">
                Create your account and add your first application in under a
                minute. No clutter, no noise — just your pipeline.
              </p>
              <Button asChild size="lg" className="mt-8 h-11 px-6 text-sm">
                <Link href="/sign-up">
                  Get started
                  <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
