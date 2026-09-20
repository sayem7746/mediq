import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  return (
    <header className="border-b border-teal-900/10 bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10 focus:bg-white focus:px-3 focus:py-2"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-heading text-primary text-xl font-semibold"
        >
          {t("logo")}
        </Link>
        <nav className="flex items-center gap-3" aria-label={t("logo")}>
          <Link
            href="/how-it-works"
            className="tap-target inline-flex items-center px-2 text-sm"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/providers"
            className="tap-target inline-flex items-center px-2 text-sm"
          >
            {t("directory")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
