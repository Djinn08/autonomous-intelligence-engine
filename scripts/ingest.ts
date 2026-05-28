import "dotenv/config";
import { runIngestionPipeline } from "../src/lib/pipeline";

async function main() {
  console.log("Starting ingestion pipeline...");
  const result = await runIngestionPipeline();
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
