import disclosuresEn from "../../content/disclosures.en.json";
import disclosuresBn from "../../content/disclosures.bn.json";
import feeEn from "../../content/fee-disclosure.en.json";
import feeBn from "../../content/fee-disclosure.bn.json";
import templatesEn from "../../content/staff-templates.en.json";
import templatesBn from "../../content/staff-templates.bn.json";

export type AppLocale = "en" | "bn";

export function getDisclosures(locale: AppLocale) {
  return locale === "bn" ? disclosuresBn : disclosuresEn;
}

export function getFeeDisclosure(locale: AppLocale) {
  return locale === "bn" ? feeBn : feeEn;
}

export function getStaffTemplates(locale: AppLocale) {
  return locale === "bn" ? templatesBn : templatesEn;
}
