import { setRequestLocale } from "next-intl/server";
import { RequestForm } from "./RequestForm";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { getDisclosures, getFeeDisclosure } from "@/lib/content";
import { getPublishedProviders } from "@/lib/providers/repository";
import { loadTaxonomy } from "@/lib/taxonomy";
import { getTranslations } from "next-intl/server";
import en from "../../../../messages/en.json";
import bn from "../../../../messages/bn.json";

export default async function RequestInfoPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const loc = locale === "bn" ? "bn" : "en";
  const t = await getTranslations("request");
  const disclosures = getDisclosures(loc);
  const fees = getFeeDisclosure(loc);
  const defaultProvider =
    typeof query.provider === "string" ? query.provider : undefined;

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-4">
        <EmergencyBanner locale={loc} />
      </div>
      <div className="mt-4">
        <Disclaimer locale={loc} />
      </div>
      <p className="mt-3 text-sm">{disclosures.privacyNotice}</p>
      <div className="mt-6">
        <RequestForm
          locale={loc}
          consentLabel={disclosures.consentCheckbox}
          providers={getPublishedProviders()}
          taxonomy={loadTaxonomy().filter((record) => record.active)}
          defaultProvider={defaultProvider}
          feeText={`${fees.patientFeeBeforeConsent} ${fees.patientFeeAmountPlaceholder}`}
          emergency={disclosures.emergencyNotice}
          directContact={disclosures.directProviderContact}
          successEn={en.request.successBody}
          successBn={bn.request.successBody}
        />
      </div>
    </main>
  );
}
