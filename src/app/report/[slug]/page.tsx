import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllReportSlugs,
  getReportBySlug,
} from "@/lib/storage/items";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllReportSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await getReportBySlug(slug);

  if (!report) {
    notFound();
  }

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-medium text-sky-700 hover:underline">
            ← All reports
          </Link>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {report.category}
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-zinc-500">
          {report.sourceName} ·{" "}
          {report.publishedAt.toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {report.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-800">
            Importance {report.importanceScore}/10
          </span>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-700 hover:underline"
          >
            View original →
          </a>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Summary</h2>
          <p className="mt-2 leading-relaxed text-zinc-700">{report.summary}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Key points</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
            {report.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Implications</h2>
          <p className="mt-2 leading-relaxed text-zinc-700">
            {report.implications}
          </p>
        </section>
      </article>
    </div>
  );
}
