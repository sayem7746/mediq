import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface min-h-full">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl gap-4 px-4 py-3 text-sm">
          <Link
            href="/admin/requests"
            className="tap-target inline-flex items-center"
          >
            Requests
          </Link>
          <Link
            href="/admin/providers"
            className="tap-target inline-flex items-center"
          >
            Providers
          </Link>
          <Link
            href="/admin/operations"
            className="tap-target inline-flex items-center"
          >
            Operations
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
