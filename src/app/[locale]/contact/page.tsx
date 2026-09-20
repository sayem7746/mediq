import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "./ContactForm";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { getDisclosures } from "@/lib/content";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const loc = locale === "bn" ? "bn" : "en";
  const disclosures = getDisclosures(loc);
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-4">
        <EmergencyBanner locale={loc} />
      </div>
      <p className="mt-4">{t("intro")}</p>
      <p className="mt-3 text-sm">{disclosures.complaintRoute}</p>
      <ContactForm />
    </main>
  );
}
