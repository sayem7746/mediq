"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitRequestAction, type RequestFormState } from "./actions";
import type { Hospital } from "@/lib/schemas/provider";
import type { TaxonomyRecord } from "@/lib/taxonomy";

const initial: RequestFormState = {};

export function RequestForm({
  locale,
  consentLabel,
  providers,
  taxonomy,
  defaultProvider,
  feeText,
  emergency,
  directContact,
  successEn,
  successBn,
}: {
  locale: "en" | "bn";
  consentLabel: string;
  providers: Hospital[];
  taxonomy: TaxonomyRecord[];
  defaultProvider?: string;
  feeText: string;
  emergency: string;
  directContact: string;
  successEn: string;
  successBn: string;
}) {
  const t = useTranslations("request");
  const [state, action] = useActionState(submitRequestAction, initial);
  const loc = locale === "bn" ? "bn" : "en";

  if (state.token) {
    return (
      <div className="rounded-xl bg-white p-4">
        <h2 className="font-heading text-2xl font-semibold">
          {t("successTitle")}
        </h2>
        <p className="mt-3">{t("successBody")}</p>
        <p className="mt-3 text-sm">{successEn}</p>
        <p className="mt-2 text-sm">{successBn}</p>
        <p className="mt-3 text-sm">{directContact}</p>
        <p className="mt-3 text-sm">{emergency}</p>
        {!state.honeypot ? (
          <Link
            href={`/requests/${state.token}`}
            className="tap-target text-primary mt-6 inline-flex items-center underline"
          >
            {t("statusLink")}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 rounded-xl bg-white p-4">
      {state.error === "invalid" ? (
        <p role="alert">{t("errorInvalid")}</p>
      ) : null}
      {state.error === "consent" ? (
        <p role="alert">{t("errorConsent")}</p>
      ) : null}
      {state.error === "rate_limit" ? (
        <p role="alert">{t("errorRate")}</p>
      ) : null}
      <p className="text-warning text-sm">{t("warning")}</p>
      <p className="text-sm">{feeText}</p>
      <label className="grid gap-1 text-sm">
        {t("name")}
        <input
          name="name"
          required
          className="tap-target rounded border border-slate-300 px-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        {t("contactMethod")}
        <select
          name="contactMethod"
          className="tap-target rounded border border-slate-300 px-3"
        >
          <option value="email">{t("email")}</option>
          <option value="phone">{t("phone")}</option>
          <option value="whatsapp">{t("whatsapp")}</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        {t("contactValue")}
        <input
          name="contactValue"
          required
          className="tap-target rounded border border-slate-300 px-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        {t("preferredLanguage")}
        <select
          name="preferredLanguage"
          defaultValue={locale}
          className="tap-target rounded border border-slate-300 px-3"
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        {t("provider")}
        <select
          name="providerSlug"
          defaultValue={defaultProvider ?? ""}
          className="tap-target rounded border border-slate-300 px-3"
        >
          <option value="">{t("chooseOne")}</option>
          {providers.map((hospital) => (
            <option key={hospital.id} value={hospital.slug}>
              {hospital.displayName}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        {t("category")}
        <select
          name="categoryId"
          className="tap-target rounded border border-slate-300 px-3"
        >
          <option value="" />
          {taxonomy.map((record) => (
            <option key={record.id} value={record.id}>
              {record.label[loc]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        {t("message")}
        <textarea
          name="message"
          required
          rows={4}
          className="rounded border border-slate-300 px-3 py-2"
        />
      </label>
      <div className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
        <label>
          {t("honeypot")}
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex min-h-11 items-start gap-2 text-sm">
        <input type="checkbox" name="consent" className="mt-1 h-5 w-5" />
        {consentLabel}
      </label>
      <button
        type="submit"
        className="tap-target bg-primary rounded px-4 font-medium text-white"
      >
        {t("submit")}
      </button>
    </form>
  );
}
