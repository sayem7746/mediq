import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("errors");
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-3">{t("notFoundBody")}</p>
      <Link href="/" className="text-primary mt-6 inline-block underline">
        {t("home")}
      </Link>
    </main>
  );
}
