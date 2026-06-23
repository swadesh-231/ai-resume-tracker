"use server";

import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

import { analysisSchema, type ResumeAnalysis } from "@/lib/ai/analysis-schema";
import type { ActionResult } from "@/types";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const MAX_BYTES = 6 * 1024 * 1024; // 6MB

// Accept either the standard `OPENAI_API_KEY` or this project's `OPEN_AI_KEY`.
const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;

const SYSTEM_PROMPT = `You are an expert technical recruiter and ATS (Applicant Tracking System) analyst.
You are given a candidate's RESUME and a target JOB DESCRIPTION.

Evaluate strictly and honestly, using ONLY the provided content. Do not invent experience the resume does not contain.

Scoring rubric:
- atsScore (0-100): how well an automated ATS would parse and rank this resume for THIS job. Reward standard section headings, clear formatting, relevant keyword coverage from the job description, quantified achievements, and a clean single-column structure. Penalize missing key skills, vague responsibilities, and ATS-hostile formatting.
- matchScore (0-100): how well the candidate's actual skills, years of experience, seniority, domain, and responsibilities align with the job description's requirements.

Be specific and practical. Improvements must be concrete actions the candidate can take (e.g. "Add a 'Skills' section listing React, TypeScript, and PostgreSQL" rather than "improve skills"). Keep the summary tight. Keyword lists should contain real terms drawn from the job description.`;

type ContentPart =
  | { type: "text"; text: string }
  | { type: "file"; data: Uint8Array; mediaType: string; filename?: string };

export async function analyzeResume(
  formData: FormData
): Promise<ActionResult<ResumeAnalysis>> {
  try {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Unauthorized" };

    if (!OPENAI_API_KEY) {
      return {
        ok: false,
        error:
          "OpenAI API key is not configured on the server. Set OPENAI_API_KEY (or OPEN_AI_KEY) in your .env file.",
      };
    }

    const openai = createOpenAI({ apiKey: OPENAI_API_KEY });

    const jobDescription = String(formData.get("jobDescription") ?? "").trim();
    const resumeText = String(formData.get("resumeText") ?? "").trim();
    const file = formData.get("resume");

    if (jobDescription.length < 30) {
      return {
        ok: false,
        error: "Please paste a job description (at least a few sentences).",
      };
    }

    const parts: ContentPart[] = [
      {
        type: "text",
        text: `JOB DESCRIPTION:\n${jobDescription}`,
      },
    ];

    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_BYTES) {
        return { ok: false, error: "Resume file is too large (max 6MB)." };
      }
      const buffer = new Uint8Array(await file.arrayBuffer());
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        parts.push({
          type: "file",
          data: buffer,
          mediaType: "application/pdf",
          filename: file.name,
        });
      } else {
        const text = new TextDecoder().decode(buffer).trim();
        if (!text) {
          return {
            ok: false,
            error: "Could not read any text from that file.",
          };
        }
        parts.push({ type: "text", text: `RESUME:\n${text}` });
      }
    } else if (resumeText) {
      parts.push({ type: "text", text: `RESUME:\n${resumeText}` });
    } else {
      return {
        ok: false,
        error: "Upload a PDF resume or paste your resume text.",
      };
    }

    const { object } = await generateObject({
      model: openai(MODEL),
      schema: analysisSchema,
      schemaName: "ResumeAnalysis",
      schemaDescription:
        "Structured evaluation of a resume against a job description.",
      system: SYSTEM_PROMPT,
      temperature: 0.3,
      messages: [{ role: "user", content: parts }],
    });

    return { ok: true, data: object };
  } catch (err) {
    console.error("analyzeResume failed", err);
    return {
      ok: false,
      error:
        "Analysis failed. The model may not support this file, or the request timed out. Please try again.",
    };
  }
}
