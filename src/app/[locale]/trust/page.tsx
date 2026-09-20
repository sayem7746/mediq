import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { getDisclosures, getFeeDisclosure } from "@/lib/content";

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trust");
  const loc = locale === "bn" ? "bn" : "en";
  const disclosures = getDisclosures(loc);
  const fees = getFeeDisclosure(loc);
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-4">
        <EmergencyBanner locale={loc} />
      </div>
      <div className="mt-4">
        <Disclaimer locale={loc} />
      </div>
      <p className="mt-4">{disclosures.providerDataLimitation}</p>
      <p className="mt-3">{disclosures.feeDisclosure}</p>
      <p className="mt-3">{fees.sponsoredDisclosure}</p>
      <p className="mt-3">{disclosures.complaintRoute}</p>
      <Link
        href="/how-it-works"
        className="text-primary mt-6 inline-block underline"
      >
        {t("rankingLink")}
      </Link>
    </main>
  );
}
