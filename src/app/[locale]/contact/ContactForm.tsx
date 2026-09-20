"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitContactAction, type ContactState } from "./actions";

const initial: ContactState = {};

export function ContactForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [state, action] = useActionState(submitContactAction, initial);
  if (state.ok) {
    return <p>{t("contact.success")}</p>;
  }
  return (
    <form action={action} className="mt-6 grid gap-4 rounded-xl bg-white p-4">
      {state.error ? <p role="alert">{t("request.errorInvalid")}</p> : null}
      <p className="text-warning text-sm">{t("request.warning")}</p>
      <label className="grid gap-1 text-sm">
        {t("request.name")}
        <input
          name="name"
          required
          className="tap-target rounded border border-slate-300 px-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        {t("request.contactMethod")}
        <select
          name="contactMethod"
          className="tap-target rounded border border-slate-300 px-3"
        >
          <option value="email">{t("request.email")}</option>
          <option value="phone">{t("request.phone")}</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        {t("request.contactValue")}
        <input
          name="contactValue"
          required
          className="tap-target rounded border border-slate-300 px-3"
        />
      </label>
      <input type="hidden" name="preferredLanguage" value={locale} />
      <label className="grid gap-1 text-sm">
        {t("request.message")}
        <textarea
          name="message"
          required
          rows={4}
          className="rounded border px-3 py-2"
        />
      </label>
      <div className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        className="tap-target bg-primary rounded px-4 text-white"
      >
        {t("contact.submit")}
      </button>
    </form>
  );
}
