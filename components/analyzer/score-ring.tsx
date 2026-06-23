import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function ScoreRing({
  score,
  label,
  sublabel,
  className,
}: {
  score: number;
  label: string;
  sublabel?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = scoreColor(pct);

  return (
    <div className={cn("flex flex-col items-center gap-3 text-center", className)}>
      <div className="relative size-32">
        <svg className="size-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="9"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 900ms ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums">{pct}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
