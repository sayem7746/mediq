import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { actorFromCookie, SESSION_COOKIE } from "@/lib/auth/session";
import { requireActor, type Actor } from "@/lib/auth/rbac";

export async function getAdminActor(): Promise<Actor> {
  const jar = await cookies();
  const actor = actorFromCookie(jar.get(SESSION_COOKIE)?.value);
  if (!actor) {
    redirect("/admin/login");
  }
  return requireActor(actor);
}
