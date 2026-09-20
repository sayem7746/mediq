import { NextResponse } from "next/server";
import { getAdminActor } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { exportCase } from "@/lib/requests/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const actor = await getAdminActor();
  const { id } = await params;
  const payload = exportCase(getDb(), actor, id);
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="mediq-case-${id}.json"`,
    },
  });
}
