import { SparklesIcon } from "lucide-react";

import { ResumeAnalyzer } from "@/components/analyzer/resume-analyzer";

export const metadata = {
  title: "Resume Analyzer — ResumeTrack",
};

export default function AnalyzerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-card text-brand">
          <SparklesIcon className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Resume Analyzer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your résumé and paste a job description to get an ATS score, a
            match score, and concrete improvements.
          </p>
        </div>
      </div>

      <ResumeAnalyzer />
    </div>
  );
}
