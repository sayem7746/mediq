import Link from "next/link";
import { getDb } from "@/lib/db";
import { getAdminActor } from "@/lib/auth/server";
import { listRequests } from "@/lib/requests/admin";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await getAdminActor();
  const query = await searchParams;
  const rows = listRequests(getDb(), actor, {
    status: typeof query.status === "string" ? query.status : undefined,
    owner: typeof query.owner === "string" ? query.owner : undefined,
    language: typeof query.language === "string" ? query.language : undefined,
    from: typeof query.from === "string" ? query.from : undefined,
    to: typeof query.to === "string" ? query.to : undefined,
  });
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">Requests</h1>
      <form method="get" className="mt-4 flex flex-wrap gap-3">
        <label className="text-sm">
          Status
          <select name="status" className="tap-target ml-2 rounded border px-2">
            <option value="">All</option>
            <option value="received">received</option>
            <option value="being-routed">being-routed</option>
            <option value="provider-contacted">provider-contacted</option>
            <option value="provider-response-received">
              provider-response-received
            </option>
            <option value="closed">closed</option>
          </select>
        </label>
        <label className="text-sm">
          Language
          <select
            name="language"
            className="tap-target ml-2 rounded border px-2"
          >
            <option value="">All</option>
            <option value="en">en</option>
            <option value="bn">bn</option>
          </select>
        </label>
        <button className="tap-target rounded border px-3">Filter</button>
      </form>
      <ul className="mt-6 grid gap-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded bg-white p-3">
            <Link
              href={`/admin/requests/${row.id}`}
              className="font-medium underline"
            >
              {row.displayName}
            </Link>
            <p className="text-sm">
              {row.status} · {row.preferredLanguage} · {row.createdAt}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
