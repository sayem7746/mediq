import { getDisclosures, type AppLocale } from "@/lib/content";

export function EmergencyBanner({ locale }: { locale: AppLocale }) {
  const disclosures = getDisclosures(locale);
  return (
    <div
      role="note"
      className="text-ink border border-amber-300 bg-[var(--color-warning-bg)] px-4 py-3 text-sm"
    >
      {disclosures.emergencyNotice}
    </div>
  );
}
