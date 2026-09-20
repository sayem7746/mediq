import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getFeeDisclosure } from "@/lib/content";

export default async function FeesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("fees");
  const loc = locale === "bn" ? "bn" : "en";
  const fees = getFeeDisclosure(loc);
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <ul className="mt-6 space-y-3 text-sm">
        <li>{fees.browseIsFree}</li>
        <li>{fees.patientFeeBeforeConsent}</li>
        <li>{fees.patientFeeAmountPlaceholder}</li>
        <li>{fees.patientFeeRefund}</li>
        <li>{fees.providerCompensation}</li>
        <li>{fees.sponsoredDisclosure}</li>
        <li>{fees.noKickbacks}</li>
        <li>{fees.invoiceOwner}</li>
        <li>{fees.notMedicalFee}</li>
      </ul>
    </main>
  );
}
