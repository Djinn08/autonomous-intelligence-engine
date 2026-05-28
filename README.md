# Intelligence Monitor

Lightweight autonomous intelligence monitoring: poll public RSS sources, detect new entries, analyze with OpenAI, store structured results, and publish static report pages.

## Location

Project root: `C:\Users\recon\intelligence-monitor`

## Stack

- Next.js (App Router) + TypeScript
- SQLite + Prisma
- OpenAI for analysis
- Vercel Cron for scheduled ingestion

## Quick start

```bash
cd C:\Users\recon\intelligence-monitor
cp .env.example .env
# Add OPENAI_API_KEY to .env

npm install
npm run db:migrate
npm run dev
```

Run a manual ingestion (fetches RSS, analyzes new items only):

```bash
npm run ingest
```

Open [http://localhost:3000](http://localhost:3000) for the report list.

## Configuration

Edit `config/sources.json` to add or disable RSS feeds:

```json
{
  "pollIntervalMinutes": 360,
  "sources": [
    {
      "id": "hn-frontpage",
      "name": "Hacker News — Front Page",
      "type": "rss",
      "url": "https://hnrss.org/frontpage",
      "enabled": true
    }
  ]
}
```

## Architecture

| Module | Path | Role |
|--------|------|------|
| Ingestion | `src/lib/ingestion/` | Source adapters (RSS), normalization |
| Analysis | `src/lib/analysis/` | OpenAI structured briefings |
| Storage | `src/lib/storage/` | Prisma + dedup hashes |
| Rendering | `src/lib/rendering/` | Slugs for `/report/[slug]` |
| Utilities | `src/lib/utilities/` | Config loader, entry hashing |
| Pipeline | `src/lib/pipeline.ts` | End-to-end orchestration |

**Cost control:** Each entry is hashed (`source|id|url`). Processed hashes are stored before AI runs; duplicates are skipped.

## API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cron/ingest` | GET | Vercel Cron (Bearer `CRON_SECRET`) |
| `/api/ingest` | POST | Manual trigger (Bearer `INGEST_SECRET` in production) |

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Set environment variables: `DATABASE_URL`, `OPENAI_API_KEY`, `CRON_SECRET`, `INGEST_SECRET`.
4. Cron is defined in `vercel.json` (every 6 hours).

**Note:** Vercel serverless filesystem is ephemeral. For production persistence, use a hosted SQLite-compatible database (e.g. [Turso](https://turso.tech)) and point `DATABASE_URL` at it. Local development uses `file:./prisma/data.db`.

## GitHub

```bash
cd C:\Users\recon\intelligence-monitor
git init
git add .
git commit -m "Initial intelligence monitor scaffold"
gh repo create intelligence-monitor --public --source=. --push
```

(Requires [GitHub CLI](https://cli.github.com/) and `gh auth login`.)
