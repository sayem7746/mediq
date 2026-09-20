import { getDb } from "@/lib/db";
import { getAdminActor } from "@/lib/auth/server";
import { assertCan } from "@/lib/auth/rbac";
import { getOperationsSnapshot } from "@/lib/operations";
import { listConsentForExport } from "@/lib/consent";
import { auditEvents } from "@/lib/db/schema";

export default async function OperationsPage() {
  const actor = await getAdminActor();
  assertCan(actor.role, "operations.dashboard");
  const snapshot = getOperationsSnapshot(getDb());
  let consentCount = 0;
  if (actor.role === "admin") {
    consentCount = listConsentForExport(getDb(), actor).length;
  }
  const audits = getDb().select().from(auditEvents).all().length;
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
    </main>
  );
}
