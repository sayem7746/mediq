import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ProviderFilters } from "@/components/providers/ProviderFilters";
import { SponsoredLabel } from "@/components/providers/SponsoredLabel";
import { VerificationBadge } from "@/components/providers/VerificationBadge";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { filterProviders } from "@/lib/filter-providers";
import { getPublishedProviders } from "@/lib/providers/repository";
import { loadTaxonomy } from "@/lib/taxonomy";
import { isSponsoredAllowed } from "@/lib/schemas/provider";

export default async function ProvidersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const t = await getTranslations("filters");
  const loc = locale === "bn" ? "bn" : "en";
  const result = filterProviders(getPublishedProviders(), query, loc);
  const taxonomy = loadTaxonomy().filter((record) => record.active);

  return (
    <main id="main" className="mx-auto w-full max-w-5xl px-4 py-8">
      <EmergencyBanner locale={loc} />
      <div className="mt-4 grid gap-6 md:grid-cols-[16rem_1fr]">
        <ProviderFilters
          locale={loc}
          values={{
            q: typeof query.q === "string" ? query.q : undefined,
            specialty:
              typeof query.specialty === "string" ? query.specialty : undefined,
            city: typeof query.city === "string" ? query.city : undefined,
            language:
              typeof query.language === "string" ? query.language : undefined,
            verification:
              typeof query.verification === "string"
                ? query.verification
                : undefined,
            internationalPatientService:
              typeof query.internationalPatientService === "string"
                ? query.internationalPatientService
                : undefined,
          }}
        />
        <div className="grid gap-6">
          <Link href="/how-it-works" className="text-primary text-sm underline">
            {t("howOrdered")}
          </Link>
          {result.sponsored.length > 0 ? (
            <section aria-labelledby="sponsored-heading">
              <h2
                id="sponsored-heading"
                className="font-heading text-xl font-semibold"
              >
                {t("sponsoredHeading")}
              </h2>
              <ul className="mt-3 grid gap-3">
                {result.sponsored.map((hospital) => (
                  <li
                    key={hospital.id}
                    className="rounded-lg border border-amber-200 bg-white p-4"
                  >
                    {isSponsoredAllowed(hospital) ? (
                      <SponsoredLabel locale={loc} />
                    ) : null}
                    <Link
                      href={`/providers/${hospital.slug}`}
                      className="mt-2 block font-semibold"
                    >
                      {hospital.displayName}
                    </Link>
                    <p className="text-sm">{hospital.branch.city}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section aria-labelledby="organic-heading">
            <h2
              id="organic-heading"
              className="font-heading text-xl font-semibold"
            >
              {t("organicHeading")}
            </h2>
            {result.organic.length === 0 ? (
              <div className="mt-3 rounded-lg bg-white p-4">
                <h3 className="font-semibold">{t("emptyTitle")}</h3>
                <p className="mt-2 text-sm">{t("emptyBody")}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {taxonomy.slice(0, 8).map((record) => (
                    <li key={record.id}>
                      <Link
                        href={`/providers?specialty=${record.id}`}
                        className="tap-target bg-surface inline-flex items-center rounded-full px-3 text-sm"
                      >
                        {record.label[loc]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="mt-3 grid gap-3">
                {result.organic.map((hospital) => (
                  <li key={hospital.id} className="rounded-lg bg-white p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/providers/${hospital.slug}`}
                        className="font-semibold"
                      >
                        {hospital.displayName}
                      </Link>
                      <VerificationBadge hospital={hospital} />
                    </div>
                    <p className="text-sm">{hospital.branch.city}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <Disclaimer locale={loc} />
        </div>
      </div>
    </main>
  );
}
