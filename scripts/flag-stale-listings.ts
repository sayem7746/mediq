import { getDb } from "../src/lib/db";
import { runFlagStaleListingsJob } from "../src/lib/jobs/flag-stale-listings";

const result = runFlagStaleListingsJob(getDb());
console.log(
  JSON.stringify(
    { job: "flag-stale-listings", ...result, deleted: false },
    null,
    2,
  ),
);
