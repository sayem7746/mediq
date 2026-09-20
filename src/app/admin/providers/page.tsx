import Link from "next/link";
import {
  getPublishedProviders,
  loadProviderRecords,
} from "@/lib/providers/repository";
import { getAdminActor } from "@/lib/auth/server";

export default async function AdminProvidersPage() {
  await getAdminActor();
  const rows = loadProviderRecords();
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">Providers</h1>
      <p className="mt-2 text-sm">{getPublishedProviders().length} published</p>
      <ul className="mt-6 grid gap-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded bg-white p-3">
            <Link
              href={`/admin/providers/${row.id}`}
              className="font-medium underline"
            >
              {row.displayName}
            </Link>
            <p className="text-sm">
              {row.relationship} · {row.published ? "published" : "draft"}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
