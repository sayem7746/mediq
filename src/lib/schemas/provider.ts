import { z } from "zod";

const isoDateTime = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Must be an ISO datetime",
  });

export const ProviderRelationshipSchema = z.enum([
  "none",
  "invited",
  "documents_pending",
  "verified",
  "contracted",
  "published",
  "suspended",
  "terminated",
]);

export type ProviderRelationship = z.infer<typeof ProviderRelationshipSchema>;

export const BranchSchema = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
  name: z.string().min(1).optional(),
});

export const PublicContactSchema = z.object({
  phone: z.string().min(1).optional(),
  email: z.email().optional(),
});

export const SourceSchema = z.object({
  url: z.url(),
  kind: z.enum(["official_website", "provider_document", "registry", "other"]),
});

export const VerificationRecordSchema = z.object({
  status: z.enum(["unverified", "verified"]),
  verifiedAt: isoDateTime.optional(),
  reviewer: z.string().min(1).optional(),
});

export const SpecialtyOfferingSchema = z.object({
  id: z.string().min(1),
  taxonomyId: z.string().min(1),
  statedLabel: z.string().min(1).optional(),
});

export const InternationalPatientContactSchema = z.object({
  phone: z.string().min(1).optional(),
  email: z.email().optional(),
});

const APPROVED_PUBLISH_RELATIONSHIPS: ProviderRelationship[] = [
  "published",
  "contracted",
];

export const HospitalSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().min(1),
    legalName: z.string().min(1),
    displayName: z.string().min(1),
    branch: BranchSchema,
    publicContact: PublicContactSchema,
    officialWebsite: z.url(),
    offeringIds: z.array(z.string().min(1)),
    source: SourceSchema,
    verification: VerificationRecordSchema,
    nextReviewAt: isoDateTime,
    relationship: ProviderRelationshipSchema,
    sponsored: z.boolean(),
    published: z.boolean(),
    languages: z.array(z.string().min(1)),
    internationalPatientContact: InternationalPatientContactSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sponsored && data.relationship === "none") {
      ctx.addIssue({
        code: "custom",
        path: ["sponsored"],
        message: "sponsored is forbidden when relationship is none",
      });
    }

    if (!data.published) {
      return;
    }

    if (!data.source?.url) {
      ctx.addIssue({
        code: "custom",
        path: ["source", "url"],
        message: "published listings require source.url",
      });
    }
    if (!data.verification.verifiedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["verification", "verifiedAt"],
        message: "published listings require verifiedAt",
      });
    }
    if (!data.verification.reviewer) {
      ctx.addIssue({
        code: "custom",
        path: ["verification", "reviewer"],
        message: "published listings require a reviewer",
      });
    }
    if (!data.nextReviewAt) {
      ctx.addIssue({
        code: "custom",
        path: ["nextReviewAt"],
        message: "published listings require nextReviewAt",
      });
    }
    if (!APPROVED_PUBLISH_RELATIONSHIPS.includes(data.relationship)) {
      ctx.addIssue({
        code: "custom",
        path: ["relationship"],
        message:
          "published listings require an approved relationship (published or contracted)",
      });
    }
  });

export type Hospital = z.infer<typeof HospitalSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type VerificationRecord = z.infer<typeof VerificationRecordSchema>;
export type SpecialtyOffering = z.infer<typeof SpecialtyOfferingSchema>;

export function parseHospital(input: unknown): Hospital {
  return HospitalSchema.parse(input);
}

export function isSponsoredAllowed(hospital: Hospital): boolean {
  return hospital.sponsored && hospital.relationship !== "none";
}
