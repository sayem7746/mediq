import { notFound } from "next/navigation";
import { getProviderById } from "@/lib/providers/repository";
import { getAdminActor } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { listProviderHistory } from "@/lib/providers/publish";
import { can } from "@/lib/auth/rbac";
import { publishAction, saveDraftAction } from "../actions";

export default async function AdminProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await getAdminActor();
  const hospital = getProviderById(id);
  if (!hospital) notFound();
  const history = listProviderHistory(getDb(), id);
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">
        {hospital.displayName}
      </h1>
      <form className="mt-6 grid gap-3">
        <input type="hidden" name="id" value={hospital.id} />
        <label className="grid gap-1 text-sm">
          Official website
          <input
            name="officialWebsite"
            defaultValue={hospital.officialWebsite}
            className="tap-target rounded border px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Source URL
          <input
            name="sourceUrl"
            defaultValue={hospital.source.url}
            className="tap-target rounded border px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Verified at
          <input
            name="verifiedAt"
            defaultValue={hospital.verification.verifiedAt}
            className="tap-target rounded border px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Reviewer
          <input
            name="reviewer"
            defaultValue={hospital.verification.reviewer}
            className="tap-target rounded border px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          Next review
          <input
            name="nextReviewAt"
            defaultValue={hospital.nextReviewAt}
            className="tap-target rounded border px-3"
          />
        </label>
        {can(actor.role, "providers.draft") ? (
          <button
            formAction={saveDraftAction}
            className="tap-target rounded border px-3"
          >
            Save draft
          </button>
        ) : null}
        {can(actor.role, "providers.publish") ? (
          <button
            formAction={publishAction}
            className="tap-target bg-primary rounded px-3 text-white"
          >
            Publish
          </button>
        ) : null}
      </form>
      <h2 className="font-heading mt-8 text-xl">History</h2>
      <ul className="mt-3 space-y-2 text-xs">
        {history.map((event) => (
          <li key={event.id} className="rounded bg-white p-2">
            <p>{event.createdAt}</p>
            <pre className="overflow-auto">{event.beforeJson}</pre>
            <pre className="overflow-auto">{event.afterJson}</pre>
          </li>
        ))}
      </ul>
    </main>
  );
}
