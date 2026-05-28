import Link from "next/link";
import { listLatestReports } from "@/lib/storage/items";

export const revalidate = 300;

export default async function HomePage() {
  const reports = await listLatestReports(30);

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Intelligence Monitor
          </h1>
          <p className="mt-2 text-zinc-600">
            Autonomous monitoring of public sources with AI-generated briefings.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {reports.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <p className="text-zinc-600">No reports yet.</p>
            <p className="mt-2 text-sm text-zinc-500">
              Run ingestion:{" "}
              <code className="rounded bg-zinc-100 px-1.5 py-0.5">
                npm run ingest
              </code>
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.slug}>
                <Link
                  href={`/report/${report.slug}`}
                  className="block rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        {report.sourceName} · {report.category}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                        {report.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                        {report.summary}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                      {report.importanceScore}/10
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
