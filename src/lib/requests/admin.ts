import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/lib/db";
import { auditEvents, navigationRequests } from "@/lib/db/schema";
import { canTransitionCase, type CaseStatus } from "@/lib/case-status";
import {
  assertCan,
  assertCanAccessRequest,
  HttpError,
  requireActor,
  type Actor,
} from "@/lib/auth/rbac";
import { flagProhibitedPhrases } from "@/lib/content-policy";
import { recordAnalyticsEvent } from "@/lib/analytics";

export type RequestFilters = {
  status?: string;
  owner?: string;
  language?: string;
  from?: string;
  to?: string;
};

export function listRequests(
  db: AppDatabase,
  actor: Actor,
  filters: RequestFilters = {},
) {
  requireActor(actor);
  assertCan(actor.role, "requests.read");
  let rows = db.select().from(navigationRequests).all();
  if (filters.status)
    rows = rows.filter((row) => row.status === filters.status);
  if (filters.owner) rows = rows.filter((row) => row.ownerId === filters.owner);
  if (filters.language) {
    rows = rows.filter((row) => row.preferredLanguage === filters.language);
  }
  if (filters.from) rows = rows.filter((row) => row.createdAt >= filters.from!);
  if (filters.to) rows = rows.filter((row) => row.createdAt <= filters.to!);
  if (actor.role === "staff") {
    rows = rows.filter((row) => !row.ownerId || row.ownerId === actor.id);
  }
  return rows;
}

export function getRequestForActor(
  db: AppDatabase,
  actor: Actor,
  requestId: string,
) {
  requireActor(actor);
  const row = db
    .select()
    .from(navigationRequests)
    .where(eq(navigationRequests.id, requestId))
    .get();
  if (!row) throw new HttpError("Not found", 404);
  assertCanAccessRequest(actor, row);
  db.insert(auditEvents)
    .values({
      id: randomUUID(),
      actorId: actor.id,
      action: "request_viewed",
      entityType: "navigation_request",
      entityId: requestId,
      metadataJson: "{}",
      createdAt: new Date().toISOString(),
    })
    .run();
  return row;
}

export function assignRequest(
  db: AppDatabase,
  actor: Actor,
  requestId: string,
  ownerId: string,
) {
  requireActor(actor);
  assertCan(actor.role, "requests.assign");
  const row = getRequestForActor(db, actor, requestId);
  db.update(navigationRequests)
    .set({ ownerId, updatedAt: new Date().toISOString() })
    .where(eq(navigationRequests.id, row.id))
    .run();
  audit(db, actor, "request_assigned", requestId, { ownerId });
}

export function updateRequestStatus(
  db: AppDatabase,
  actor: Actor,
  requestId: string,
  next: CaseStatus,
  options: { reason?: string; template?: string } = {},
) {
  requireActor(actor);
  assertCan(actor.role, "requests.updateStatus");
  const row = getRequestForActor(db, actor, requestId);
  if (!canTransitionCase(row.status as CaseStatus, next)) {
    throw new HttpError("Status transition is not allowed", 400);
  }
  if (next === "closed") {
    assertCan(actor.role, "requests.close");
    if (!options.reason?.trim()) {
      throw new HttpError("Closure requires a reason", 400);
    }
  }
  const flags = options.template ? flagProhibitedPhrases(options.template) : [];
  db.update(navigationRequests)
    .set({
      status: next,
      closedReason: next === "closed" ? options.reason : row.closedReason,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(navigationRequests.id, row.id))
    .run();
  audit(db, actor, "request_status_updated", requestId, {
    from: row.status,
    to: next,
    templateFlags: flags,
  });
  if (row.status === "received" && next !== "received") {
    recordAnalyticsEvent(db, {
      name: "staff_first_response",
      locale: row.locale,
      anonymizedRef: requestId.slice(0, 8),
    });
  }
  return flags;
}

function audit(
  db: AppDatabase,
  actor: Actor,
  action: string,
  entityId: string,
  metadata: Record<string, unknown>,
) {
  db.insert(auditEvents)
    .values({
      id: randomUUID(),
      actorId: actor.id,
      action,
      entityType: "navigation_request",
      entityId,
      metadataJson: JSON.stringify(metadata),
      createdAt: new Date().toISOString(),
    })
    .run();
}
