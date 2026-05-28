import type { NormalizedEntry, RssSourceConfig } from "@/types";

export interface SourceAdapter {
  readonly type: string;
  fetchEntries(source: RssSourceConfig): Promise<NormalizedEntry[]>;
}
