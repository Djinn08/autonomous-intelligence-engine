import OpenAI from "openai";
import { z } from "zod";
import type { AnalysisResult, NormalizedEntry } from "@/types";

const analysisSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
  category: z.string(),
  importanceScore: z.number().int().min(1).max(10),
  implications: z.string(),
});

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
}

export async function analyzeEntry(
  entry: NormalizedEntry,
  sourceName: string,
): Promise<AnalysisResult> {
  const client = getClient();
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const content = [
    `Source: ${sourceName}`,
    `Title: ${entry.title}`,
    `URL: ${entry.url}`,
    `Published: ${entry.publishedAt.toISOString()}`,
    "",
    "Content:",
    entry.rawContent.slice(0, 6000) || "(no body)",
  ].join("\n");

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an intelligence analyst. Analyze the item and respond with JSON only:
{
  "summary": "2-3 sentence overview",
  "keyPoints": ["bullet 1", "bullet 2", ...],
  "category": "e.g. technology, security, policy, business",
  "importanceScore": 1-10,
  "implications": "brief note on why this matters"
}`,
      },
      { role: "user", content },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI returned empty analysis");
  }

  const parsed = analysisSchema.parse(JSON.parse(raw));
  return parsed;
}
