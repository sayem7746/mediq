"use server";

import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { getDb } from "@/lib/db";
import { submitInformationRequest } from "@/lib/requests/submit";

export type RequestFormState = {
  error?: string;
  token?: string;
  honeypot?: boolean;
};

export async function submitRequestAction(
  _prev: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  const locale = (await getLocale()) === "bn" ? "bn" : "en";
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "0.0.0.0";
  const raw = {
    name: String(formData.get("name") ?? ""),
    contactMethod: String(formData.get("contactMethod") ?? ""),
    contactValue: String(formData.get("contactValue") ?? ""),
    preferredLanguage: String(formData.get("preferredLanguage") ?? locale),
    providerSlug: String(formData.get("providerSlug") ?? "") || undefined,
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") === "on",
    website: String(formData.get("website") ?? ""),
  };
  const result = submitInformationRequest(getDb(), raw, { ip, locale });
  if (!result.ok) {
    return { error: result.error };
  }
  return { token: result.token, honeypot: result.honeypot };
}
