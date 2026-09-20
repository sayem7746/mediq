"use client";

import { useTranslations } from "next-intl";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">
        {t("unexpectedTitle")}
      </h1>
      <p className="mt-3">{t("unexpectedBody")}</p>
      <button
        type="button"
        className="tap-target bg-primary mt-6 rounded px-4 text-white"
        onClick={() => reset()}
      >
        {t("tryAgain")}
      </button>
    </main>
  );
}
