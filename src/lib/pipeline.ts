import { analyzeEntry } from "@/lib/analysis/openai";
import { ingestAllSources } from "@/lib/ingestion";
import { slugify } from "@/lib/rendering/slug";
import {
  isHashProcessed,
  saveReport,
} from "@/lib/storage/items";
import { loadSourcesConfig } from "@/lib/utilities/config";
import { entryHash } from "@/lib/utilities/hash";
import type { NormalizedEntry } from "@/types";

export interface IngestionRunResult {
  fetched: number;
  processed: number;
  skipped: number;
  errors: string[];
}

export async function runIngestionPipeline(): Promise<IngestionRunResult> {
  const config = await loadSourcesConfig();
  const sourceNames = new Map(
    config.sources.map((s) => [s.id, s.name] as const),
  );

  const entries = await ingestAllSources();
  const result: IngestionRunResult = {
    fetched: entries.length,
    processed: 0,
    skipped: 0,
    errors: [],
  };

  const seenInRun = new Set<string>();

  for (const entry of entries) {
    if (!entry.url) {
      result.skipped += 1;
      continue;
    }

    const hash = entryHash(entry);

    if (seenInRun.has(hash)) {
      result.skipped += 1;
      continue;
    }
    seenInRun.add(hash);

    try {
      const processed = await processEntryIfNew(
        entry,
        hash,
        sourceNames.get(entry.source) ?? entry.source,
      );
      if (processed) {
        result.processed += 1;
      } else {
        result.skipped += 1;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown processing error";
      result.errors.push(`${entry.title}: ${message}`);
    }
  }

  return result;
}

async function processEntryIfNew(
  entry: NormalizedEntry,
  hash: string,
  sourceName: string,
): Promise<boolean> {
  if (await isHashProcessed(hash)) {
    return false;
  }

  const analysis = await analyzeEntry(entry, sourceName);
  const slug = slugify(entry.title, entry.source);

  await saveReport(entry, sourceName, hash, slug, analysis);
  return true;
}
