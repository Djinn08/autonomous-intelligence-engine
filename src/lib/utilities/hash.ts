import { createHash } from "crypto";
import type { NormalizedEntry } from "@/types";

export function entryHash(entry: NormalizedEntry): string {
  const payload = `${entry.source}|${entry.id}|${entry.url}`;
  return createHash("sha256").update(payload).digest("hex");
}
