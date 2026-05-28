export function slugify(title: string, sourceId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const suffix = sourceId.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const stamp = Date.now().toString(36).slice(-6);

  return `${base || "report"}-${suffix}-${stamp}`;
}
