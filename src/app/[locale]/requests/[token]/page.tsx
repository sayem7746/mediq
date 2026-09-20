import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getDb } from "@/lib/db";
import { lookupAccessToken } from "@/lib/request-access";
import { navigationRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import type { CaseStatus } from "@/lib/case-status";

const statusKey: Record<CaseStatus, string> = {
  received: "received",
  "being-routed": "beingRouted",
  "provider-contacted": "providerContacted",
  "provider-response-received": "providerResponseReceived",
  closed: "closed",
};

export default async function RequestStatusPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("status");
  const loc = locale === "bn" ? "bn" : "en";
  const lookup = lookupAccessToken(getDb(), token);
  const request = lookup.ok
    ? getDb()
        .select()
        .from(navigationRequests)
        .where(eq(navigationRequests.id, lookup.requestId))
        .get()
    : null;

  return (
    <main id="main" className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-4">
        <EmergencyBanner locale={loc} />
      </div>
      {!request ? (
        <p className="mt-6">{t("invalid")}</p>
      ) : (
        <p className="mt-6 text-lg font-medium">
          {t(statusKey[request.status as CaseStatus] ?? "invalid")}
        </p>
      )}
      <p className="mt-4 text-sm">{t("notClinical")}</p>
    </main>
  );
}
