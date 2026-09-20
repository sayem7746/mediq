import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getDisclosures } from "@/lib/content";

export async function SiteFooter() {
  const t = await getTranslations();
  const locale = await getLocale();
  const disclosures = getDisclosures(locale === "bn" ? "bn" : "en");
  return (
    <footer className="mt-auto border-t border-teal-900/10 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm">
        <nav className="flex flex-wrap gap-4" aria-label={t("nav.logo")}>
          <Link href="/trust" className="tap-target inline-flex items-center">
            {t("trust.title")}
          </Link>
          <Link
            href="/how-it-works"
            className="tap-target inline-flex items-center"
          >
            {t("nav.howItWorks")}
          </Link>
          <Link href="/fees" className="tap-target inline-flex items-center">
            {t("fees.title")}
          </Link>
          <Link href="/privacy" className="tap-target inline-flex items-center">
            {t("privacy.title")}
          </Link>
          <Link href="/contact" className="tap-target inline-flex items-center">
            {t("contact.title")}
          </Link>
        </nav>
        <p>{disclosures.serviceBoundary}</p>
      </div>
    </footer>
  );
}
