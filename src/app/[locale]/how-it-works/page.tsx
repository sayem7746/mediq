import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { getDisclosures } from "@/lib/content";

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howItWorks");
  const loc = locale === "bn" ? "bn" : "en";
  const disclosures = getDisclosures(loc);
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4">{t("intro")}</p>
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-sm">
        <li>Specialty match</li>
        <li>Verified and not stale</li>
        <li>City match</li>
        <li>Language match</li>
        <li>Locale-aware A–Z name</li>
      </ol>
      <p className="mt-4 text-sm">{disclosures.feeDisclosure}</p>
      <div className="mt-6">
        <Disclaimer locale={loc} />
      </div>
    </main>
  );
}
