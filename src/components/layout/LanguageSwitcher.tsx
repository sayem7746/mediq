"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <div className="flex gap-1" role="group" aria-label={t("language")}>
      {routing.locales.map((nextLocale) => (
        <button
          key={nextLocale}
          type="button"
          className="tap-target text-ink rounded-md px-3 text-sm font-medium hover:bg-white"
          aria-current={nextLocale === locale ? "true" : undefined}
          onClick={() => {
            document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;samesite=lax`;
            router.replace(pathname, { locale: nextLocale });
          }}
        >
          {nextLocale === "en" ? t("english") : t("bangla")}
        </button>
      ))}
    </div>
  );
}
