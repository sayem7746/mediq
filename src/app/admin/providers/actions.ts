"use server";

import { revalidatePath } from "next/cache";
import { HospitalSchema } from "@/lib/schemas/provider";
import { getDb } from "@/lib/db";
import { getAdminActor } from "@/lib/auth/server";
import { publishProvider, saveProviderDraft } from "@/lib/providers/publish";
import { getProviderById } from "@/lib/providers/repository";

function hospitalFromForm(formData: FormData) {
  const existing = getProviderById(String(formData.get("id")));
  if (!existing) {
    throw new Error("Unknown provider");
  }
  return HospitalSchema.parse({
    ...existing,
    officialWebsite: String(
      formData.get("officialWebsite") ?? existing.officialWebsite,
    ),
    source: {
      ...existing.source,
      url: String(formData.get("sourceUrl") ?? existing.source.url),
    },
    nextReviewAt: String(formData.get("nextReviewAt") ?? existing.nextReviewAt),
    verification: {
      ...existing.verification,
      reviewer: String(
        formData.get("reviewer") ?? existing.verification.reviewer ?? "",
      ),
      verifiedAt: String(
        formData.get("verifiedAt") ?? existing.verification.verifiedAt ?? "",
      ),
      status: "verified",
    },
  });
}

export async function saveDraftAction(formData: FormData) {
  const actor = await getAdminActor();
  saveProviderDraft(getDb(), actor, hospitalFromForm(formData));
  revalidatePath("/admin/providers");
}

export async function publishAction(formData: FormData) {
  const actor = await getAdminActor();
  publishProvider(getDb(), actor, hospitalFromForm(formData));
  revalidatePath("/admin/providers");
}
