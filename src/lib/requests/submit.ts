import { randomUUID } from "node:crypto";
import type { AppDatabase } from "@/lib/db";
import { navigationRequests } from "@/lib/db/schema";
import { appendConsentEvent } from "@/lib/consent";
import { InformationRequestSchema } from "@/lib/schemas/request";
import { checkRateLimit } from "@/lib/rate-limit";
import { storeAccessToken } from "@/lib/request-access";
import { getDisclosures } from "@/lib/content";
import { anonymizeRef, recordAnalyticsEvent } from "@/lib/analytics";

export type SubmitContext = {
  ip: string;
  locale: "en" | "bn";
  now?: Date;
};

export type SubmitResult =
  | { ok: true; requestId: string; token: string; honeypot: boolean }
  | { ok: false; error: "invalid" | "consent" | "rate_limit" };

export function submitInformationRequest(
  db: AppDatabase,
  input: Record<string, unknown>,
  ctx: SubmitContext,
): SubmitResult {
  const limited = checkRateLimit(`request:${ctx.ip}`);
  if (!limited.ok) {
    return { ok: false, error: "rate_limit" };
  }

  const honeypot =
    typeof input.website === "string" && input.website.trim().length > 0;
  if (honeypot) {
    return { ok: true, requestId: "ignored", token: "ignored", honeypot: true };
  }

  if (
    input.consent !== true &&
    input.consent !== "true" &&
    input.consent !== "on"
  ) {
    recordAnalyticsEvent(db, {
      name: "consent_rejected",
      locale: ctx.locale,
      anonymizedRef: anonymizeRef(ctx.ip),
    });
    return { ok: false, error: "consent" };
  }

  const parsed = InformationRequestSchema.safeParse({
    ...input,
    consent: true,
    website: undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const now = (ctx.now ?? new Date()).toISOString();
  const requestId = randomUUID();
  const disclosures = getDisclosures(ctx.locale);

  db.transaction((tx) => {
    tx.insert(navigationRequests)
      .values({
        id: requestId,
        status: "received",
        ownerId: null,
        locale: ctx.locale,
        displayName: parsed.data.name,
        contactMethod: parsed.data.contactMethod,
        contactValue: parsed.data.contactValue,
        preferredLanguage: parsed.data.preferredLanguage,
        providerSlug: parsed.data.providerSlug,
        categoryId: parsed.data.categoryId,
        message: parsed.data.message,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    appendConsentEvent(tx as unknown as AppDatabase, {
      requestId,
      consentVersion: disclosures.consentVersion,
      locale: ctx.locale,
      createdAt: now,
    });
  });

  const { token } = storeAccessToken(db, requestId, { now: ctx.now });
  recordAnalyticsEvent(db, {
    name: "request_submitted",
    locale: ctx.locale,
    anonymizedRef: requestId.slice(0, 8),
  });
  return { ok: true, requestId, token, honeypot: false };
}
