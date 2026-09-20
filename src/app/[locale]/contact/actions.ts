"use server";

import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { getDb } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { ContactFormSchema } from "@/lib/schemas/request";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { auditEvents } from "@/lib/db/schema";
import { randomUUID } from "node:crypto";

export type ContactState = { error?: string; ok?: boolean };

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
  if (!checkRateLimit(`contact:${ip}`).ok) {
    return { error: "rate_limit" };
  }
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true };
  }
  const parsed = ContactFormSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    contactMethod: String(formData.get("contactMethod") ?? ""),
    contactValue: String(formData.get("contactValue") ?? ""),
    preferredLanguage: String(formData.get("preferredLanguage") ?? "en"),
    message: String(formData.get("message") ?? ""),
  });
  if (!parsed.success) {
    return { error: "invalid" };
  }
  const locale = (await getLocale()) === "bn" ? "bn" : "en";
  const db = getDb();
  db.insert(auditEvents)
    .values({
      id: randomUUID(),
      actorId: null,
      action: "contact_submitted",
      entityType: "contact",
      entityId: randomUUID(),
      metadataJson: JSON.stringify({
        locale,
        method: parsed.data.contactMethod,
      }),
      createdAt: new Date().toISOString(),
    })
    .run();
  recordAnalyticsEvent(db, {
    name: "complaint_opened",
    locale,
    anonymizedRef: parsed.data.contactMethod,
  });
  return { ok: true };
}
