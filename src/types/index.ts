export interface NormalizedEntry {
  id: string;
  source: string;
  title: string;
  url: string;
  publishedAt: Date;
  rawContent: string;
}

export interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  category: string;
  importanceScore: number;
  implications: string;
}

export interface RssSourceConfig {
  id: string;
  name: string;
  type: "rss";
  url: string;
  enabled: boolean;
}

export interface SourcesConfig {
  pollIntervalMinutes: number;
  sources: RssSourceConfig[];
}

export interface ReportView {
  slug: string;
  sourceName: string;
  title: string;
  url: string;
  publishedAt: Date;
  summary: string;
  keyPoints: string[];
  category: string;
  importanceScore: number;
  implications: string;
  createdAt: Date;
}
