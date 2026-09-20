import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/lib/db";
import { providerChangeEvents, providers } from "@/lib/db/schema";
import { HospitalSchema, type Hospital } from "@/lib/schemas/provider";
import { loadTaxonomy } from "@/lib/taxonomy";
import {
  assertCan,
  HttpError,
  requireActor,
  type Actor,
} from "@/lib/auth/rbac";

export function assertPublishGuard(hospital: Hospital) {
  const parsed = HospitalSchema.parse(hospital);
  if (!parsed.source.url) {
    throw new HttpError("Source URL is required to publish", 400);
  }
  if (!parsed.verification.verifiedAt || !parsed.verification.reviewer) {
    throw new HttpError(
      "Verification date and reviewer are required to publish",
      400,
    );
  }
  if (!parsed.nextReviewAt) {
    throw new HttpError("Next review date is required to publish", 400);
  }
  if (!["published", "contracted"].includes(parsed.relationship)) {
    throw new HttpError("Relationship is not approved for publish", 400);
  }
  const taxonomy = new Set(loadTaxonomy().map((record) => record.id));
  for (const offeringId of parsed.offeringIds) {
    if (!taxonomy.has(offeringId)) {
      throw new HttpError(`Unknown offering ${offeringId}`, 400);
    }
  }
  return parsed;
}

export function saveProviderDraft(
  db: AppDatabase,
  actor: Actor,
  hospital: Hospital,
) {
  requireActor(actor);
  assertCan(actor.role, "providers.draft");
  HospitalSchema.parse({ ...hospital, published: false });
  if (!hospital.source?.url) {
    throw new HttpError("Editors must supply a source URL", 400);
  }
  upsertProvider(db, actor, { ...hospital, published: false });
}

export function publishProvider(
  db: AppDatabase,
  actor: Actor,
  hospital: Hospital,
) {
  requireActor(actor);
  assertCan(actor.role, "providers.publish");
  const parsed = assertPublishGuard({ ...hospital, published: true });
  upsertProvider(db, actor, parsed);
}

function upsertProvider(db: AppDatabase, actor: Actor, hospital: Hospital) {
  const now = new Date().toISOString();
  const existing = db
    .select()
    .from(providers)
    .where(eq(providers.id, hospital.id))
    .get();
  const beforeJson = existing?.payloadJson ?? "{}";
  const afterJson = JSON.stringify(hospital);
  if (existing) {
    db.update(providers)
      .set({
        slug: hospital.slug,
        payloadJson: afterJson,
        published: hospital.published,
        sponsored: hospital.sponsored,
        relationship: hospital.relationship,
        nextReviewAt: hospital.nextReviewAt,
        updatedAt: now,
      })
      .where(eq(providers.id, hospital.id))
      .run();
  } else {
    db.insert(providers)
      .values({
        id: hospital.id,
        slug: hospital.slug,
        payloadJson: afterJson,
        published: hospital.published,
        sponsored: hospital.sponsored,
        relationship: hospital.relationship,
        nextReviewAt: hospital.nextReviewAt,
        stale: false,
        createdAt: now,
        updatedAt: now,
      })
      .run();
  }
  db.insert(providerChangeEvents)
    .values({
      id: randomUUID(),
      providerId: hospital.id,
      actorId: actor.id,
      beforeJson,
      afterJson,
      createdAt: now,
    })
    .run();
}

export function listProviderHistory(db: AppDatabase, providerId: string) {
  return db
    .select()
    .from(providerChangeEvents)
    .where(eq(providerChangeEvents.providerId, providerId))
    .all();
}
