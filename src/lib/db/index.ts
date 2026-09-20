import fs from "node:fs";
import path from "node:path";
import { randomUUID, scryptSync, randomBytes } from "node:crypto";
import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { getEnv } from "@/lib/env";
import { schema, staffUsers } from "./schema";

const CREATE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS providers (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    payload_json TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 0,
    sponsored INTEGER NOT NULL DEFAULT 0,
    relationship TEXT NOT NULL,
    next_review_at TEXT,
    stale INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS provider_verifications (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    status TEXT NOT NULL,
    verified_at TEXT,
    reviewer TEXT,
    next_review_at TEXT,
    source_url TEXT,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS provider_change_events (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    before_json TEXT NOT NULL,
    after_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS navigation_requests (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    owner_id TEXT,
    locale TEXT NOT NULL,
    display_name TEXT NOT NULL,
    contact_method TEXT NOT NULL,
    contact_value TEXT NOT NULL,
    preferred_language TEXT NOT NULL,
    provider_slug TEXT,
    category_id TEXT,
    message TEXT NOT NULL,
    closed_reason TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS request_access_tokens (
    hashed_token TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    expiry TEXT NOT NULL,
    used_at TEXT,
    revoked_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS consent_events (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    consent_version TEXT NOT NULL,
    locale TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS staff_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS staff_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    actor_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS deletion_jobs (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    dry_run INTEGER NOT NULL DEFAULT 1,
    details_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    completed_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    version INTEGER NOT NULL,
    locale TEXT NOT NULL,
    anonymized_ref TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    payload_json TEXT NOT NULL DEFAULT '{}'
  )`,
];

export type AppDatabase = BetterSQLite3Database<typeof schema>;

export type DbHandle = {
  db: AppDatabase;
  sqlite: Database.Database;
};

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function ensureTables(sqlite: Database.Database) {
  for (const statement of CREATE_STATEMENTS) {
    sqlite.exec(statement);
  }
}

function bootstrapStaff(db: AppDatabase) {
  const env = getEnv();
  const existing = db
    .select()
    .from(staffUsers)
    .where(eq(staffUsers.email, env.STAFF_BOOTSTRAP_EMAIL))
    .all();
  if (existing.length > 0) return;
  const now = new Date().toISOString();
  db.insert(staffUsers)
    .values({
      id: randomUUID(),
      email: env.STAFF_BOOTSTRAP_EMAIL.toLowerCase(),
      passwordHash: hashPassword(env.STAFF_BOOTSTRAP_PASSWORD),
      role: "admin",
      createdAt: now,
    })
    .run();
}

export function createDb(databasePath = getEnv().DATABASE_PATH): DbHandle {
  if (databasePath !== ":memory:") {
    const directory = path.dirname(path.resolve(databasePath));
    fs.mkdirSync(directory, { recursive: true });
  }
  const sqlite = new Database(databasePath);
  sqlite.pragma("foreign_keys = ON");
  ensureTables(sqlite);
  const db = drizzle(sqlite, { schema });
  bootstrapStaff(db);
  return { db, sqlite };
}

let singleton: DbHandle | undefined;

export function getDb(): AppDatabase {
  if (!singleton) {
    singleton = createDb();
  }
  return singleton.db;
}

export function getSqlite(): Database.Database {
  if (!singleton) {
    singleton = createDb();
  }
  return singleton.sqlite;
}

export function resetDbSingleton() {
  singleton?.sqlite.close();
  singleton = undefined;
}
