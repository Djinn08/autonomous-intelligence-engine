import { readFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import type { SourcesConfig } from "@/types";

const sourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.literal("rss"),
  url: z.string().url(),
  enabled: z.boolean(),
});

const configSchema = z.object({
  pollIntervalMinutes: z.number().int().positive(),
  sources: z.array(sourceSchema),
});

let cachedConfig: SourcesConfig | null = null;

export async function loadSourcesConfig(): Promise<SourcesConfig> {
  if (cachedConfig) return cachedConfig;

  const configPath = path.join(process.cwd(), "config", "sources.json");
  const raw = await readFile(configPath, "utf-8");
  const parsed = configSchema.parse(JSON.parse(raw));
  cachedConfig = parsed;
  return parsed;
}

export function clearConfigCache(): void {
  cachedConfig = null;
}
