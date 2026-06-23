"use client";

import { useRef, useState, useTransition } from "react";
import {
  UploadCloudIcon,
  FileTextIcon,
  XIcon,
  SparklesIcon,
  Loader2Icon,
  CheckCircle2Icon,
  ArrowUpRightIcon,
  TypeIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScoreRing } from "@/components/analyzer/score-ring";
import { analyzeResume } from "@/actions/analyze.actions";
import {
  VERDICT_LABELS,
  type ResumeAnalysis,
} from "@/lib/ai/analysis-schema";

const MAX_BYTES = 6 * 1024 * 1024;

const verdictStyles: Record<string, string> = {
  strong_match: "bg-green-500/10 text-green-500 border-green-500/20",
  good_match: "bg-brand/10 text-brand border-brand/20",
  fair_match: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  weak_match: "bg-red-500/10 text-red-500 border-red-500/20",
};

const priorityStyles: Record<string, string> = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  low: "bg-muted text-muted-foreground border-border",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [pasteMode, setPasteMode] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(f: File | undefined) {
    if (!f) return;
    const ok =
      f.type === "application/pdf" ||
      f.type === "text/plain" ||
      /\.(pdf|txt|md)$/i.test(f.name);
    if (!ok) {
      toast.error("Please upload a PDF or text file.");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("That file is too large (max 6MB).");
      return;
    }
    setFile(f);
    setPasteMode(false);
  }

  const hasResume = pasteMode ? resumeText.trim().length > 50 : Boolean(file);
  const hasJob = jobDescription.trim().length >= 30;
  const canSubmit = hasResume && hasJob && !isPending;

  function handleAnalyze() {
    if (!canSubmit) return;
    const formData = new FormData();
    formData.set("jobDescription", jobDescription);
    if (pasteMode) formData.set("resumeText", resumeText);
    else if (file) formData.set("resume", file);

    startTransition(async () => {
      const res = await analyzeResume(formData);
      if (res.ok) {
        setResult(res.data);
        toast.success("Analysis complete.");
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Resume */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your résumé</CardTitle>
                <CardDescription>PDF or text, up to 6MB</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPasteMode((m) => !m);
                  setFile(null);
                }}
              >
                <TypeIcon />
                {pasteMode ? "Upload file" : "Paste text"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pasteMode ? (
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your résumé text here…"
                className="min-h-60 resize-none"
              />
            ) : file ? (
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                <span className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-background text-brand">
                  <FileTextIcon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove file"
                  onClick={() => {
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <XIcon />
                </Button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  acceptFile(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "flex min-h-60 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-center transition-colors hover:border-brand/40 hover:bg-muted/40",
                  dragging && "border-brand/60 bg-brand/5"
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background text-brand">
                  <UploadCloudIcon className="size-6" />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Drop your résumé or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF works best · TXT also supported
                  </p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.txt,.md,application/pdf,text/plain"
                  className="hidden"
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Job description */}
        <Card>
          <CardHeader>
            <CardTitle>Job description</CardTitle>
            <CardDescription>
              Paste the full posting for the best match
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here…"
              className="min-h-60 resize-none"
            />
            <p className="mt-2 text-right text-xs text-muted-foreground">
              {jobDescription.trim().length} characters
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Analysis is generated by OpenAI and is a guide, not a guarantee.
        </p>
        <Button
          size="lg"
          className="h-11 w-full px-6 sm:w-auto"
          disabled={!canSubmit}
          onClick={handleAnalyze}
        >
          {isPending ? (
            <>
              <Loader2Icon className="animate-spin" /> Analyzing résumé…
            </>
          ) : (
            <>
              <SparklesIcon /> Analyze résumé
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {isPending && !result && <AnalyzingSkeleton />}
      {result && <Results result={result} />}
    </div>
  );
}

function AnalyzingSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <Loader2Icon className="size-8 animate-spin text-brand" />
        <div>
          <p className="font-medium">Reading your résumé…</p>
          <p className="text-sm text-muted-foreground">
            Scoring ATS-friendliness and matching against the job description.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Results({ result }: { result: ResumeAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Results</h2>
        <Badge
          variant="outline"
          className={cn("border", verdictStyles[result.verdict])}
        >
          {VERDICT_LABELS[result.verdict]}
        </Badge>
      </div>

      {/* Scores + summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex items-center justify-around gap-4 py-6">
            <ScoreRing score={result.atsScore} label="ATS score" />
            <ScoreRing score={result.matchScore} label="JD match" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            {result.overallSummary}
          </CardContent>
        </Card>
      </div>

      {/* Strengths + improvements */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>What&apos;s working in your favor</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-green-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Improvements</CardTitle>
            <CardDescription>Prioritized, actionable fixes</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {result.improvements.map((imp, i) => (
                <li key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border capitalize",
                        priorityStyles[imp.priority]
                      )}
                    >
                      {imp.priority}
                    </Badge>
                    <span className="text-sm font-medium">{imp.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{imp.detail}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword coverage</CardTitle>
          <CardDescription>
            Terms from the job description matched against your résumé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
              <CheckCircle2Icon className="size-4 text-green-500" /> Matched
              <span className="text-muted-foreground">
                ({result.matchedKeywords.length})
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.matchedKeywords.length ? (
                result.matchedKeywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs text-green-500"
                  >
                    {k}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None found.</span>
              )}
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
              <ArrowUpRightIcon className="size-4 text-amber-500" /> Missing — add
              these
              <span className="text-muted-foreground">
                ({result.missingKeywords.length})
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {result.missingKeywords.length ? (
                result.missingKeywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-500"
                  >
                    {k}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Nothing major missing.
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
