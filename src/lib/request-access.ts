import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/lib/db";
import { requestAccessTokens } from "@/lib/db/schema";

export const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function storeAccessToken(
  db: AppDatabase,
  requestId: string,
  options: { now?: Date; ttlMs?: number; token?: string } = {},
): { token: string; hashedToken: string; expiry: string } {
  const token = options.token ?? generateAccessToken();
  const now = options.now ?? new Date();
  const expiry = new Date(
    now.getTime() + (options.ttlMs ?? TOKEN_TTL_MS),
  ).toISOString();
  const hashedToken = hashToken(token);
  db.insert(requestAccessTokens)
    .values({
      hashedToken,
      requestId,
      expiry,
    })
    .run();
  return { token, hashedToken, expiry };
}

export type TokenLookup =
  { ok: true; requestId: string } | { ok: false; reason: "invalid" };

export function lookupAccessToken(
  db: AppDatabase,
  token: string,
  now = new Date(),
): TokenLookup {
  const hashedToken = hashToken(token);
  const row = db
    .select()
    .from(requestAccessTokens)
    .where(eq(requestAccessTokens.hashedToken, hashedToken))
    .get();
  if (!row) return { ok: false, reason: "invalid" };
  if (row.revokedAt) return { ok: false, reason: "invalid" };
  if (new Date(row.expiry).getTime() <= now.getTime()) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true, requestId: row.requestId };
}

export function revokeAccessToken(
  db: AppDatabase,
  hashedToken: string,
  now = new Date(),
) {
  db.update(requestAccessTokens)
    .set({ revokedAt: now.toISOString() })
    .where(eq(requestAccessTokens.hashedToken, hashedToken))
    .run();
}
