import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const providers = sqliteTable(
  "providers",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    payloadJson: text("payload_json").notNull(),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(false),
    sponsored: integer("sponsored", { mode: "boolean" })
      .notNull()
      .default(false),
    relationship: text("relationship").notNull(),
    nextReviewAt: text("next_review_at"),
    stale: integer("stale", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [uniqueIndex("providers_slug_idx").on(table.slug)],
);

export const providerVerifications = sqliteTable("provider_verifications", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").notNull(),
  status: text("status").notNull(),
  verifiedAt: text("verified_at"),
  reviewer: text("reviewer"),
  nextReviewAt: text("next_review_at"),
  sourceUrl: text("source_url"),
  createdAt: text("created_at").notNull(),
});

export const providerChangeEvents = sqliteTable("provider_change_events", {
  id: text("id").primaryKey(),
  providerId: text("provider_id").notNull(),
  actorId: text("actor_id").notNull(),
  beforeJson: text("before_json").notNull(),
  afterJson: text("after_json").notNull(),
  createdAt: text("created_at").notNull(),
});

export const navigationRequests = sqliteTable(
  "navigation_requests",
  {
    id: text("id").primaryKey(),
    status: text("status").notNull(),
    ownerId: text("owner_id"),
    locale: text("locale").notNull(),
    displayName: text("display_name").notNull(),
    contactMethod: text("contact_method").notNull(),
    contactValue: text("contact_value").notNull(),
    preferredLanguage: text("preferred_language").notNull(),
    providerSlug: text("provider_slug"),
    categoryId: text("category_id"),
    message: text("message").notNull(),
    closedReason: text("closed_reason"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("navigation_requests_status_idx").on(table.status)],
);

export const requestAccessTokens = sqliteTable("request_access_tokens", {
  hashedToken: text("hashed_token").primaryKey(),
  requestId: text("request_id").notNull(),
  expiry: text("expiry").notNull(),
  usedAt: text("used_at"),
  revokedAt: text("revoked_at"),
});

export const consentEvents = sqliteTable("consent_events", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  consentVersion: text("consent_version").notNull(),
  locale: text("locale").notNull(),
  createdAt: text("created_at").notNull(),
});

export const staffUsers = sqliteTable("staff_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(),
  createdAt: text("created_at").notNull(),
});

export const staffRoles = sqliteTable("staff_roles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  createdAt: text("created_at").notNull(),
});

export const auditEvents = sqliteTable("audit_events", {
  id: text("id").primaryKey(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const deletionJobs = sqliteTable("deletion_jobs", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  dryRun: integer("dry_run", { mode: "boolean" }).notNull().default(true),
  detailsJson: text("details_json").notNull().default("{}"),
  createdAt: text("created_at").notNull(),
  completedAt: text("completed_at"),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  version: integer("version").notNull(),
  locale: text("locale").notNull(),
  anonymizedRef: text("anonymized_ref").notNull(),
  timestamp: text("timestamp").notNull(),
  payloadJson: text("payload_json").notNull().default("{}"),
});

export const schema = {
  providers,
  providerVerifications,
  providerChangeEvents,
  navigationRequests,
  requestAccessTokens,
  consentEvents,
  staffUsers,
  staffRoles,
  auditEvents,
  deletionJobs,
  analyticsEvents,
};
