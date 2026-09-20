import { getDb } from "@/lib/db";
import { getAdminActor } from "@/lib/auth/server";
import { assertCan } from "@/lib/auth/rbac";
import { getOperationsSnapshot, getWeeklyBetaReport } from "@/lib/operations";
import { listConsentForExport } from "@/lib/consent";
import { auditEvents } from "@/lib/db/schema";

export default async function OperationsPage() {
  const actor = await getAdminActor();
  assertCan(actor.role, "operations.dashboard");
  const db = getDb();
  const snapshot = getOperationsSnapshot(db);
  const weekly = getWeeklyBetaReport(db);
  let consentCount = 0;
  if (actor.role === "admin") {
    consentCount = listConsentForExport(db, actor).length;
  }
  const audits = db.select().from(auditEvents).all().length;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">Operations</h1>
      <ul className="mt-6 grid gap-3">
        <li>Request conversion: {snapshot.conversion.toFixed(2)}</li>
        <li>First responses: {snapshot.firstResponseCount}</li>
        <li>Stale rate: {snapshot.staleRate.toFixed(2)}</li>
        <li>Complaints: {snapshot.complaints}</li>
        {actor.role === "admin" ? (
          <li>Consent export rows: {consentCount}</li>
        ) : null}
        <li>Audit events: {audits}</li>
      </ul>
      <h2 className="font-heading mt-8 text-xl font-semibold">
        Weekly beta report
      </h2>
      <ul className="mt-3 grid gap-2 text-sm">
        <li>Request volume: {weekly.requestVolume}</li>
        <li>First-response events: {weekly.firstResponseSlaEvents}</li>
        <li>Complaints: {weekly.complaints}</li>
        <li>Stale listing rate: {weekly.staleListings.toFixed(2)}</li>
        <li>
          General launch enabled: {weekly.generalLaunchEnabled ? "yes" : "no"}
        </li>
      </ul>
    </main>
  );
}
