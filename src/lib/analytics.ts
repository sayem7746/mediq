import { createHash, randomUUID } from "node:crypto";
import type { AppDatabase } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";
import { getEnv } from "@/lib/env";

export const ANALYTICS_EVENTS = [
  "provider_search",
  "filter_applied",
  "provider_profile_viewed",
  "request_submitted",
  "consent_rejected",
  "staff_first_response",
  "listing_stale",
  "complaint_opened",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export const ANALYTICS_VERSION = 1;

const FORBIDDEN_PAYLOAD_KEYS = [
  "email",
  "phone",
  "message",
  "diagnosis",
  "symptom",
  "name",
  "enquiry",
  "contactValue",
  "contact",
];

export class AnalyticsValidationError extends Error {}

export type AnalyticsInput = {
  name: AnalyticsEventName;
  locale: string;
  anonymizedRef: string;
  timestamp?: string;
  payload?: Record<string, unknown>;
};

export function assertNoPii(payload: Record<string, unknown> = {}): void {
  for (const key of Object.keys(payload)) {
    if (FORBIDDEN_PAYLOAD_KEYS.includes(key)) {
      throw new AnalyticsValidationError(`PII key is not allowed: ${key}`);
    }
    const value = payload[key];
    if (
      typeof value === "string" &&
      (value.includes("@") || /\+?\d{8,}/.test(value))
    ) {
      throw new AnalyticsValidationError("Payload looks like PII");
    }
  }
}

export function anonymizeRef(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function recordAnalyticsEvent(
  db: AppDatabase,
  input: AnalyticsInput,
): boolean {
  if (!getEnv().ANALYTICS_ENABLED && getEnv().NODE_ENV !== "test") {
    return false;
  }
  if (!ANALYTICS_EVENTS.includes(input.name)) {
    throw new AnalyticsValidationError("Event is not allowlisted");
  }
  const payload = input.payload ?? {};
  assertNoPii(payload);
  db.insert(analyticsEvents)
    .values({
      id: randomUUID(),
      name: input.name,
      version: ANALYTICS_VERSION,
      locale: input.locale,
      anonymizedRef: input.anonymizedRef,
      timestamp: input.timestamp ?? new Date().toISOString(),
      payloadJson: JSON.stringify(payload),
    })
    .run();
  return true;
}
