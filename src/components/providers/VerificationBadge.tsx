import { getTranslations } from "next-intl/server";
import { isStale } from "@/lib/rank-providers";
import type { Hospital } from "@/lib/schemas/provider";

export async function VerificationBadge({ hospital }: { hospital: Hospital }) {
  const t = await getTranslations("common");
  if (hospital.verification.status === "verified" && !isStale(hospital)) {
    return (
      <span className="text-primary rounded-full bg-teal-50 px-3 py-1 text-xs font-medium">
        {t("verified")}
      </span>
    );
  }
  if (hospital.verification.status === "verified" && isStale(hospital)) {
    return (
      <span className="text-warning rounded-full bg-amber-50 px-3 py-1 text-xs font-medium">
        {t("stale")}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {t("unverified")}
    </span>
  );
}
