"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getAdminActor } from "@/lib/auth/server";
import { assignRequest, updateRequestStatus } from "@/lib/requests/admin";
import type { CaseStatus } from "@/lib/case-status";

export async function assignAction(formData: FormData) {
  const actor = await getAdminActor();
  assignRequest(
    getDb(),
    actor,
    String(formData.get("requestId")),
    String(formData.get("ownerId") || actor.id),
  );
  revalidatePath("/admin/requests");
}

export async function statusAction(formData: FormData) {
  const actor = await getAdminActor();
  updateRequestStatus(
    getDb(),
    actor,
    String(formData.get("requestId")),
    String(formData.get("status")) as CaseStatus,
    {
      reason: String(formData.get("reason") ?? "") || undefined,
      template: String(formData.get("template") ?? "") || undefined,
    },
  );
  revalidatePath("/admin/requests");
}
