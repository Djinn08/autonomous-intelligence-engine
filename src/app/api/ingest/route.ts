import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { runIngestionPipeline } from "@/lib/pipeline";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.INGEST_SECRET;
    const header = request.headers.get("authorization");
    if (!secret || header !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await runIngestionPipeline();
    revalidatePath("/");
    revalidatePath("/report", "layout");

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ingestion failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
