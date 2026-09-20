import { getDisclosures, type AppLocale } from "@/lib/content";
import { Link } from "@/i18n/navigation";

export function SponsoredLabel({ locale }: { locale: AppLocale }) {
  const disclosures = getDisclosures(locale);
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wide text-amber-900 uppercase">
      {disclosures.sponsoredLabel}
      <Link href="/fees" className="underline">
        Fees
      </Link>
    </span>
  );
}
