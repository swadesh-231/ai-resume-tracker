import Link from "next/link";
import {
  ArrowRightIcon,
  ClipboardListIcon,
  LineChartIcon,
  LayoutDashboardIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const features = [
  {
    icon: ClipboardListIcon,
    title: "Track Applications",
    description:
      "Capture every company, role, status, and note in one organized place.",
  },
  {
    icon: LineChartIcon,
    title: "Monitor Progress",
    description:
      "Move applications through the full lifecycle — from applied to offer.",
  },
  {
    icon: LayoutDashboardIcon,
    title: "Dashboard Analytics",
    description:
      "See status distribution, monthly trends, and your acceptance rate at a glance.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            Your job search, organized
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Track Every Job Application In One Dashboard
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground text-balance">
            Stop losing track across spreadsheets and inboxes. Manage every
            application, monitor your pipeline, and see analytics that keep your
            search on course.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign-up">
                Get Started <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/20">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-20 sm:grid-cols-3 sm:px-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="mt-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
