import type { NormalizedEntry, RssSourceConfig } from "@/types";
import { loadSourcesConfig } from "@/lib/utilities/config";
import { RssAdapter } from "./rss-adapter";

const rssAdapter = new RssAdapter();

export async function ingestAllSources(): Promise<NormalizedEntry[]> {
  const config = await loadSourcesConfig();
  const entries: NormalizedEntry[] = [];

  for (const source of config.sources) {
    if (!source.enabled || source.type !== "rss") continue;

    const fetched = await fetchFromSource(source);
    entries.push(...fetched);
  }

  return entries;
}

async function fetchFromSource(
  source: RssSourceConfig,
): Promise<NormalizedEntry[]> {
  switch (source.type) {
    case "rss":
      return rssAdapter.fetchEntries(source);
    default:
      return [];
  }
}

export { RssAdapter } from "./rss-adapter";
