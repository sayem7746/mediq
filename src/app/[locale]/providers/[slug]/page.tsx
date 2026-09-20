import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { SponsoredLabel } from "@/components/providers/SponsoredLabel";
import { VerificationBadge } from "@/components/providers/VerificationBadge";
import { getPublishedProviderBySlug } from "@/lib/providers/repository";
import { isSponsoredAllowed } from "@/lib/schemas/provider";
import { loadTaxonomy } from "@/lib/taxonomy";
import { getDisclosures } from "@/lib/content";
import { getDb } from "@/lib/db";
import { recordAnalyticsEvent } from "@/lib/analytics";
import { anonymizeRef } from "@/lib/analytics";

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const hospital = getPublishedProviderBySlug(slug);
  if (!hospital) {
    notFound();
  }
  const t = await getTranslations("profile");
  const loc = locale === "bn" ? "bn" : "en";
  const taxonomy = loadTaxonomy();
  const disclosures = getDisclosures(loc);
  try {
    recordAnalyticsEvent(getDb(), {
      name: "provider_profile_viewed",
      locale: loc,
      anonymizedRef: anonymizeRef(hospital.id),
      payload: { slug: hospital.slug },
    });
  } catch {
    // Analytics must never break the profile.
  }

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <EmergencyBanner locale={loc} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-3xl font-semibold">
          {hospital.displayName}
        </h1>
        <VerificationBadge hospital={hospital} />
        {isSponsoredAllowed(hospital) ? <SponsoredLabel locale={loc} /> : null}
      </div>
      <dl className="mt-6 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold">{t("branch")}</dt>
          <dd>{hospital.branch.name ?? hospital.displayName}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("city")}</dt>
          <dd>
            {hospital.branch.city}, {hospital.branch.country}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("offerings")}</dt>
          <dd>
            {hospital.offeringIds
              .map(
                (id) =>
                  taxonomy.find((record) => record.id === id)?.label[loc] ?? id,
              )
              .join(", ")}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("languages")}</dt>
          <dd>{hospital.languages.join(", ")}</dd>
        </div>
        {hospital.internationalPatientContact ? (
          <div>
            <dt className="font-semibold">{t("internationalContact")}</dt>
            <dd>
              {hospital.internationalPatientContact.phone}{" "}
              {hospital.internationalPatientContact.email}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="font-semibold">{t("website")}</dt>
          <dd>
            <a
              className="text-primary underline"
              href={hospital.officialWebsite}
            >
              {hospital.officialWebsite}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("source")}</dt>
          <dd>
            <a className="text-primary underline" href={hospital.source.url}>
              {hospital.source.url}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-semibold">{t("verifiedAt")}</dt>
          <dd>{hospital.verification.verifiedAt ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t("nextReview")}</dt>
          <dd>{hospital.nextReviewAt}</dd>
        </div>
      </dl>
      <div className="mt-8">
        <Disclaimer locale={loc} />
      </div>
      <p className="mt-3 text-sm">{disclosures.directProviderContact}</p>
      <Link
        href={`/request-info?provider=${hospital.slug}`}
        className="tap-target bg-primary mt-6 inline-flex items-center rounded px-4 font-medium text-white"
      >
        {t("enquiryCta")}
      </Link>
    </main>
  );
}
