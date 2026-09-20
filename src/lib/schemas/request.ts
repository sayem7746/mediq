import { z } from "zod";

export const contactMethods = ["email", "phone", "whatsapp"] as const;
export const requestLanguages = ["en", "bn"] as const;

export const InformationRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    contactMethod: z.enum(contactMethods),
    contactValue: z.string().trim().min(3).max(200),
    preferredLanguage: z.enum(requestLanguages),
    providerSlug: z.string().trim().max(120).optional(),
    categoryId: z.string().trim().max(80).optional(),
    message: z.string().trim().min(1).max(1000),
    consent: z.literal(true),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasProvider = Boolean(data.providerSlug);
    const hasCategory = Boolean(data.categoryId);
    if (hasProvider === hasCategory) {
      ctx.addIssue({
        code: "custom",
        path: ["providerSlug"],
        message: "Choose exactly one of provider or category",
      });
    }
    if (data.contactMethod === "email" && !data.contactValue.includes("@")) {
      ctx.addIssue({
        code: "custom",
        path: ["contactValue"],
        message: "Enter an email address",
      });
    }
  });

export type InformationRequestInput = z.infer<typeof InformationRequestSchema>;

export const ContactFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  contactMethod: z.enum(contactMethods),
  contactValue: z.string().trim().min(3).max(200),
  preferredLanguage: z.enum(requestLanguages),
  message: z.string().trim().min(1).max(1000),
  website: z.string().optional(),
});
