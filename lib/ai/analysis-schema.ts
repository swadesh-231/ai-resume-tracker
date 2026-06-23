import { z } from "zod";

export const VERDICTS = [
  "strong_match",
  "good_match",
  "fair_match",
  "weak_match",
] as const;

export const PRIORITIES = ["high", "medium", "low"] as const;

export const analysisSchema = z.object({
  atsScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "ATS (Applicant Tracking System) friendliness score from 0-100. Judge parseability, standard section headings, keyword coverage vs the job description, use of quantified achievements, formatting simplicity, and absence of ATS-hostile elements."
    ),
  matchScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "How well the resume matches THIS job description from 0-100, based on required skills, years of experience, seniority, domain, and responsibilities."
    ),
  verdict: z
    .enum(VERDICTS)
    .describe("Overall verdict on the candidate's fit for the role."),
  overallSummary: z
    .string()
    .describe(
      "A concise 2-4 sentence summary of how well the resume fits the role and its overall quality."
    ),
  strengths: z
    .array(z.string())
    .describe("3-6 concrete strengths of the resume relative to the job."),
  improvements: z
    .array(
      z.object({
        title: z.string().describe("Short title of the improvement."),
        detail: z
          .string()
          .describe("Specific, actionable explanation of what to change and why."),
        priority: z.enum(PRIORITIES),
      })
    )
    .describe(
      "3-7 prioritized, actionable improvements to raise the match and ATS scores."
    ),
  missingKeywords: z
    .array(z.string())
    .describe(
      "Important skills/keywords present in the job description but missing from the resume."
    ),
  matchedKeywords: z
    .array(z.string())
    .describe(
      "Important skills/keywords from the job description that the resume already covers."
    ),
});

export type ResumeAnalysis = z.infer<typeof analysisSchema>;

export const VERDICT_LABELS: Record<(typeof VERDICTS)[number], string> = {
  strong_match: "Strong match",
  good_match: "Good match",
  fair_match: "Fair match",
  weak_match: "Weak match",
};
