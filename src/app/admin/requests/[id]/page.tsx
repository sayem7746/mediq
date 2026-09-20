import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { getAdminActor } from "@/lib/auth/server";
import { getRequestForActor } from "@/lib/requests/admin";
import { getStaffTemplates } from "@/lib/content";
import { flagProhibitedPhrases } from "@/lib/content-policy";
import { assignAction, statusAction } from "../actions";
import { caseStatuses } from "@/lib/case-status";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await getAdminActor();
  let row;
  try {
    row = getRequestForActor(getDb(), actor, id);
  } catch {
    notFound();
  }
  const templates = getStaffTemplates("en");
  const flags = flagProhibitedPhrases(
    Object.values(templates.templates).join(" "),
  );
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">{row.displayName}</h1>
      <p className="mt-2 text-sm">
        {row.status} · {row.preferredLanguage} · owner{" "}
        {row.ownerId ?? "unassigned"}
      </p>
      <p className="mt-4 text-sm">{row.message}</p>
      {flags.length > 0 ? (
        <p className="text-warning mt-4">
          Template contains a prohibited phrase
        </p>
      ) : null}
      <form action={assignAction} className="mt-6 grid gap-2">
        <input type="hidden" name="requestId" value={row.id} />
        <button className="tap-target rounded border px-3">Assign to me</button>
      </form>
      <form action={statusAction} className="mt-6 grid gap-3">
        <input type="hidden" name="requestId" value={row.id} />
        <label className="text-sm">
          Next status
          <select name="status" className="tap-target ml-2 rounded border px-2">
            {caseStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Template
          <textarea
            name="template"
            rows={4}
            className="rounded border px-3 py-2"
            defaultValue={templates.templates.receivedAck}
          />
        </label>
        <label className="grid gap-1 text-sm">
          Closure reason
          <input name="reason" className="tap-target rounded border px-3" />
        </label>
        <button className="tap-target bg-primary rounded px-4 text-white">
          Update
        </button>
      </form>
    </main>
  );
}
