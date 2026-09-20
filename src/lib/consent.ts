import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/lib/db";
import { consentEvents } from "@/lib/db/schema";
import { HttpError, assertCan, type Actor } from "@/lib/auth/rbac";

export type ConsentInput = {
  requestId: string;
  consentVersion: string;
  locale: string;
  createdAt?: string;
};

export function appendConsentEvent(db: AppDatabase, input: ConsentInput) {
  db.insert(consentEvents)
    .values({
      id: randomUUID(),
      requestId: input.requestId,
      consentVersion: input.consentVersion,
      locale: input.locale,
      createdAt: input.createdAt ?? new Date().toISOString(),
    })
    .run();
}

export function listConsentForExport(db: AppDatabase, actor: Actor) {
  assertCan(actor.role, "consent.export");
  return db.select().from(consentEvents).all();
}

export function mutateConsentEvent(): never {
  throw new HttpError("Consent events are immutable", 403);
}

export function deleteConsentEvent(): never {
  throw new HttpError("Consent events are immutable", 403);
}

export function getConsentForRequest(db: AppDatabase, requestId: string) {
  return db
    .select()
    .from(consentEvents)
    .where(eq(consentEvents.requestId, requestId))
    .all();
}
