import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ALLOWED_CITIES, ALLOWED_LANGUAGES } from "@/lib/filter-providers";
import { loadTaxonomy } from "@/lib/taxonomy";

type Props = {
  locale: string;
  values: {
    q?: string;
    specialty?: string;
    city?: string;
    language?: string;
    verification?: string;
    internationalPatientService?: string;
  };
};

export async function ProviderFilters({ locale, values }: Props) {
  const t = await getTranslations("filters");
  const taxonomy = loadTaxonomy().filter((record) => record.active);
  const loc = locale === "bn" ? "bn" : "en";

  return (
    <form method="get" className="grid gap-4 rounded-lg bg-white p-4">
      <fieldset className="grid gap-4">
        <legend className="font-heading text-lg font-semibold">
          {t("legend")}
        </legend>
        <label className="grid gap-1 text-sm">
          {t("q")}
          <input
            name="q"
            defaultValue={values.q}
            className="tap-target rounded border border-slate-300 px-3"
            autoComplete="off"
          />
        </label>
        <label className="grid gap-1 text-sm">
          {t("specialty")}
          <select
            name="specialty"
            defaultValue={values.specialty ?? ""}
            className="tap-target rounded border border-slate-300 px-3"
          >
            <option value="">{t("any")}</option>
            {taxonomy.map((record) => (
              <option key={record.id} value={record.id}>
                {record.label[loc]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {t("city")}
          <select
            name="city"
            defaultValue={values.city ?? ""}
            className="tap-target rounded border border-slate-300 px-3"
          >
            <option value="">{t("any")}</option>
            {ALLOWED_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {t("language")}
          <select
            name="language"
            defaultValue={values.language ?? ""}
            className="tap-target rounded border border-slate-300 px-3"
          >
            <option value="">{t("any")}</option>
            {ALLOWED_LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {t("verification")}
          <select
            name="verification"
            defaultValue={values.verification ?? "verified"}
            className="tap-target rounded border border-slate-300 px-3"
          >
            <option value="verified">{t("verified")}</option>
            <option value="all">{t("all")}</option>
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="internationalPatientService"
            value="true"
            defaultChecked={values.internationalPatientService === "true"}
            className="h-5 w-5"
          />
          {t("international")}
        </label>
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="tap-target bg-primary rounded px-4 font-medium text-white"
        >
          {t("apply")}
        </button>
        <Link
          href="/providers"
          className="tap-target inline-flex items-center rounded border border-slate-300 px-4"
        >
          {t("reset")}
        </Link>
      </div>
    </form>
  );
}
