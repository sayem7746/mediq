import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { getDisclosures } from "@/lib/content";
import { getEnv } from "@/lib/env";
import { ALLOWED_CITIES } from "@/lib/filter-providers";
import { loadTaxonomy } from "@/lib/taxonomy";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const loc = locale === "bn" ? "bn" : "en";
  const disclosures = getDisclosures(loc);
  const taxonomy = loadTaxonomy()
    .filter((record) => record.active)
    .slice(0, 12);

  return (
    <main id="main" className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("home.title")}</h1>
      <p className="mt-3 max-w-2xl">{t("home.intro")}</p>
      {!getEnv().GENERAL_LAUNCH_ENABLED ? (
        <p className="text-warning mt-3 text-sm">{t("home.betaNotice")}</p>
      ) : null}
      <div className="mt-6">
        <EmergencyBanner locale={loc} />
      </div>
      <form
        action={`/${locale}/providers`}
        method="get"
        className="mt-8 grid gap-4 rounded-xl bg-white p-4"
      >
        <p className="text-sm">{t("home.symptomsHelper")}</p>
        <label className="grid gap-1 text-sm">
          {t("home.searchName")}
          <input
            name="q"
            className="tap-target rounded border border-slate-300 px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          {t("home.searchSpecialty")}
          <select
            name="specialty"
            className="tap-target rounded border border-slate-300 px-3"
          >
            <option value="">{t("filters.any")}</option>
            {loadTaxonomy()
              .filter((record) => record.active)
              .map((record) => (
                <option key={record.id} value={record.id}>
                  {record.label[loc]}
                </option>
              ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {t("home.searchCity")}
          <select
            name="city"
            className="tap-target rounded border border-slate-300 px-3"
          >
            <option value="">{t("filters.any")}</option>
            {ALLOWED_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="tap-target bg-primary rounded px-4 font-medium text-white"
        >
          {t("home.searchSubmit")}
        </button>
      </form>
      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">
          {t("home.categoriesHeading")}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {taxonomy.map((record) => (
            <li key={record.id}>
              <Link
                href={`/providers?specialty=${record.id}`}
                className="tap-target inline-flex items-center rounded-full bg-white px-4 text-sm"
              >
                {record.label[loc]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10 rounded-xl bg-white p-4">
        <h2 className="font-heading text-xl font-semibold">
          {t("home.trustTitle")}
        </h2>
        <div className="mt-3">
          <Disclaimer locale={loc} />
        </div>
        <p className="mt-3 text-sm">{disclosures.feeDisclosure}</p>
      </section>
    </main>
  );
}
