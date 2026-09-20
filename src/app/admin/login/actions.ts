"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  authenticateStaff,
  cookieOptions,
  issueSession,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { HttpError } from "@/lib/auth/rbac";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    const actor = authenticateStaff(getDb(), email, password);
    const session = issueSession(actor);
    const jar = await cookies();
    jar.set(SESSION_COOKIE, session.token, {
      ...cookieOptions(),
      expires: session.expires,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      redirect("/admin/login?error=1");
    }
    throw error;
  }
  redirect("/admin/requests");
}
