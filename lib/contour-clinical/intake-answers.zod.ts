import { z } from "zod";
import { CL_INTAKE_CONTRA_ITEMS } from "./intake-contraindications";

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .refine((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), "Valid email is required");

const contraZ = z.object(
  Object.fromEntries(CL_INTAKE_CONTRA_ITEMS.map((item) => [item.id, z.boolean().default(false)])) as Record<
    string,
    z.ZodDefault<z.ZodBoolean>
  >
);

const demographicZ = z.object({
  full_name: z.string().trim().min(1).max(200),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .refine((s) => {
      const t = Date.parse(s + "T12:00:00Z");
      if (Number.isNaN(t)) return false;
      return t < Date.now();
    }, "Date of birth must be in the past"),
  phone: z.string().trim().min(7).max(50),
  email: emailField,
  address_line: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(50),
  zip: z.string().trim().min(3).max(20),
  emergency_contact_name: z.string().trim().min(1).max(200),
  emergency_contact_phone: z.string().trim().min(7).max(50),
  treatment_area_of_interest: z.string().trim().min(1).max(500),
  fitzpatrick: z.coerce.number().int().min(1).max(6),
  recent_uv_tanning: z.string().trim().min(1).max(500),
  self_tanner_use: z.boolean(),
  current_medications: z.string().trim().max(5000),
  allergies: z.string().trim().max(5000),
  medical_history: z.string().trim().min(1, "Please add relevant medical history (or “none”).").max(8000),
  height_in: z.union([z.coerce.number().min(20).max(100), z.null()]).optional(),
  weight_lb: z.union([z.coerce.number().min(50).max(800), z.null()]).optional(),
  bmi: z.union([z.coerce.number().min(10).max(100), z.null()]).optional(),
});

/** Client-submitted Contour/Quantum clinical intake (version 1.0.0) */
export const clIntakeAnswersV1Schema = demographicZ.merge(contraZ);

export type ClIntakeAnswersV1 = z.infer<typeof clIntakeAnswersV1Schema>;
