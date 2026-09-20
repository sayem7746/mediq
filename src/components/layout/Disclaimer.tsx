import { getDisclosures, type AppLocale } from "@/lib/content";

export function Disclaimer({ locale }: { locale: AppLocale }) {
  const disclosures = getDisclosures(locale);
  return (
    <p className="border-primary text-ink border-l-4 bg-white px-4 py-3 text-sm">
      {disclosures.serviceBoundary} {disclosures.providerDataLimitation}
    </p>
  );
}
