import { getDb } from "../src/lib/db";
import { runRetentionJob } from "../src/lib/jobs/retention";

const live = process.argv.includes("--live");
const result = runRetentionJob(getDb(), { dryRun: !live });
console.log(JSON.stringify({ job: "retention", ...result }, null, 2));
