export const staffRoles = ["staff", "editor", "approver", "admin"] as const;
export type StaffRole = (typeof staffRoles)[number];

export const permissions = {
  "requests.read": ["staff", "editor", "approver", "admin"],
  "requests.assign": ["staff", "approver", "admin"],
  "requests.updateStatus": ["staff", "approver", "admin"],
  "requests.close": ["staff", "approver", "admin"],
  "providers.draft": ["editor", "approver", "admin"],
  "providers.publish": ["approver", "admin"],
  "consent.export": ["admin"],
  "audit.view": ["approver", "admin"],
  "operations.dashboard": ["staff", "editor", "approver", "admin"],
} as const;

export type Permission = keyof typeof permissions;

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function can(role: StaffRole, permission: Permission): boolean {
  return (permissions[permission] as readonly StaffRole[]).includes(role);
}

export function assertCan(role: StaffRole, permission: Permission): void {
  if (!can(role, permission)) {
    throw new HttpError("Forbidden", 403);
  }
}

export type Actor = {
  id: string;
  email: string;
  role: StaffRole;
};

export function requireActor(actor: Actor | null | undefined): Actor {
  if (!actor) {
    throw new HttpError("Unauthorized", 401);
  }
  return actor;
}

export function assertCanAccessRequest(
  actor: Actor,
  request: { id: string; ownerId: string | null },
): void {
  requireActor(actor);
  assertCan(actor.role, "requests.read");
  if (actor.role === "admin" || actor.role === "approver") {
    return;
  }
  if (request.ownerId && request.ownerId !== actor.id) {
    throw new HttpError("Forbidden", 403);
  }
}
