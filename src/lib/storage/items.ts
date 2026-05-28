import { prisma } from "./prisma";
import type { AnalysisResult, NormalizedEntry, ReportView } from "@/types";

export async function isHashProcessed(hash: string): Promise<boolean> {
  const existing = await prisma.processedHash.findUnique({
    where: { hash },
  });
  return Boolean(existing);
}

export async function markHashProcessed(hash: string): Promise<void> {
  await prisma.processedHash.upsert({
    where: { hash },
    create: { hash },
    update: {},
  });
}

export async function saveReport(
  entry: NormalizedEntry,
  sourceName: string,
  hash: string,
  slug: string,
  analysis: AnalysisResult,
): Promise<void> {
  await prisma.report.create({
    data: {
      slug,
      sourceId: entry.source,
      sourceName,
      title: entry.title,
      url: entry.url,
      publishedAt: entry.publishedAt,
      rawContent: entry.rawContent || null,
      summary: analysis.summary,
      keyPoints: JSON.stringify(analysis.keyPoints),
      category: analysis.category,
      importanceScore: analysis.importanceScore,
      implications: analysis.implications,
      entryHash: hash,
    },
  });

  await markHashProcessed(hash);
}

export async function listLatestReports(limit = 50): Promise<ReportView[]> {
  const rows = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map(mapReport);
}

export async function getReportBySlug(slug: string): Promise<ReportView | null> {
  const row = await prisma.report.findUnique({ where: { slug } });
  return row ? mapReport(row) : null;
}

export async function getAllReportSlugs(): Promise<string[]> {
  const rows = await prisma.report.findMany({
    select: { slug: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => r.slug);
}

function mapReport(row: {
  slug: string;
  sourceName: string;
  title: string;
  url: string;
  publishedAt: Date;
  summary: string;
  keyPoints: string;
  category: string;
  importanceScore: number;
  implications: string;
  createdAt: Date;
}): ReportView {
  let keyPoints: string[] = [];
  try {
    keyPoints = JSON.parse(row.keyPoints) as string[];
  } catch {
    keyPoints = [];
  }

  return {
    slug: row.slug,
    sourceName: row.sourceName,
    title: row.title,
    url: row.url,
    publishedAt: row.publishedAt,
    summary: row.summary,
    keyPoints,
    category: row.category,
    importanceScore: row.importanceScore,
    implications: row.implications,
    createdAt: row.createdAt,
  };
}
