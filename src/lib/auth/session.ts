import {
  createHmac,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { eq } from "drizzle-orm";
import { getEnv } from "@/lib/env";
import type { AppDatabase } from "@/lib/db";
import { auditEvents, staffUsers } from "@/lib/db/schema";
import { HttpError, type Actor, type StaffRole, staffRoles } from "./rbac";

export const SESSION_COOKIE = "mediq_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export type SessionPayload = {
  sub: string;
  email: string;
  role: StaffRole;
  exp: number;
};

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(
  payload: SessionPayload,
  secret = getEnv().SESSION_SECRET,
): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret = getEnv().SESSION_SECRET,
): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body, secret);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    if (!staffRoles.includes(payload.role)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64).toString("hex");
  const left = Buffer.from(hash, "hex");
  const right = Buffer.from(next, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function authenticateStaff(
  db: AppDatabase,
  email: string,
  password: string,
): Actor {
  const row = db
    .select()
    .from(staffUsers)
    .where(eq(staffUsers.email, email.trim().toLowerCase()))
    .get();
  if (!row || !verifyPassword(password, row.passwordHash)) {
    throw new HttpError("Unauthorized", 401);
  }
  db.insert(auditEvents)
    .values({
      id: randomUUID(),
      actorId: row.id,
      action: "staff_login",
      entityType: "staff_user",
      entityId: row.id,
      metadataJson: "{}",
      createdAt: new Date().toISOString(),
    })
    .run();
  return { id: row.id, email: row.email, role: row.role as StaffRole };
}

export function issueSession(actor: Actor): { token: string; expires: Date } {
  const expires = new Date(Date.now() + SESSION_TTL_MS);
  const token = createSessionToken({
    sub: actor.id,
    email: actor.email,
    role: actor.role,
    exp: expires.getTime(),
  });
  return { token, expires };
}

export function actorFromCookie(token: string | undefined): Actor | null {
  const payload = verifySessionToken(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, role: payload.role };
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}
