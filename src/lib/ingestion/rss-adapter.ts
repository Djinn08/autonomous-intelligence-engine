import Parser from "rss-parser";
import type { NormalizedEntry, RssSourceConfig } from "@/types";
import type { SourceAdapter } from "./types";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "IntelligenceMonitor/1.0",
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export class RssAdapter implements SourceAdapter {
  readonly type = "rss";

  async fetchEntries(source: RssSourceConfig): Promise<NormalizedEntry[]> {
    const feed = await parser.parseURL(source.url);

    return (feed.items ?? []).map((item) => {
      const id = item.guid ?? item.id ?? item.link ?? item.title ?? "";
      const raw =
        item.contentSnippet ??
        item.content ??
        item.summary ??
        item.description ??
        "";

      return {
        id: String(id),
        source: source.id,
        title: item.title?.trim() || "Untitled",
        url: item.link ?? "",
        publishedAt: item.isoDate
          ? new Date(item.isoDate)
          : item.pubDate
            ? new Date(item.pubDate)
            : new Date(),
        rawContent: typeof raw === "string" ? stripHtml(raw) : "",
      } satisfies NormalizedEntry;
    });
  }
}
