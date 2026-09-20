import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getDisclosures } from "@/lib/content";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const loc = locale === "bn" ? "bn" : "en";
  const disclosures = getDisclosures(loc);
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4">{disclosures.privacyNotice}</p>
      <p className="mt-3">{disclosures.consentCheckbox}</p>
      <p className="mt-3">{disclosures.complaintRoute}</p>
    </main>
  );
}
