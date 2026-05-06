export type TestimonialRecord = {
  id: string;
  treatment: string;
  concern: string;
  provider: string;
  device: string;
  approved: boolean;
  beforeAfterPermission: "none" | "internal-only" | "public-approved";
  quote: string;
  source: "google" | "in-clinic" | "sms-followup";
};

// Placeholder architecture only. Keep approved=false until content is approved for public use.
export const TESTIMONIAL_RECORDS: TestimonialRecord[] = [
  {
    id: "placeholder-morpheus8-1",
    treatment: "morpheus8",
    concern: "skin-tightening",
    provider: "clinical-team",
    device: "morpheus8",
    approved: false,
    beforeAfterPermission: "none",
    quote: "Reserved for approved Morpheus8 review.",
    source: "in-clinic",
  },
  {
    id: "placeholder-quantum-1",
    treatment: "quantum-rf",
    concern: "jowls",
    provider: "clinical-team",
    device: "quantum-rf",
    approved: false,
    beforeAfterPermission: "none",
    quote: "Reserved for approved Quantum RF review.",
    source: "in-clinic",
  },
  {
    id: "placeholder-glp1-1",
    treatment: "weight-loss",
    concern: "weight-loss",
    provider: "ryan-kent",
    device: "glp-1",
    approved: false,
    beforeAfterPermission: "none",
    quote: "Reserved for approved GLP-1 review.",
    source: "sms-followup",
  },
  {
    id: "placeholder-botox-1",
    treatment: "botox",
    concern: "fine-lines",
    provider: "clinical-team",
    device: "neuromodulator",
    approved: false,
    beforeAfterPermission: "none",
    quote: "Reserved for approved Botox review.",
    source: "google",
  },
];

export type TestimonialFilters = {
  treatment?: string;
  concern?: string;
  provider?: string;
  device?: string;
  includeUnapproved?: boolean;
};

export function filterTestimonials(filters: TestimonialFilters): TestimonialRecord[] {
  return TESTIMONIAL_RECORDS.filter((item) => {
    if (!filters.includeUnapproved && !item.approved) return false;
    if (filters.treatment && item.treatment !== filters.treatment) return false;
    if (filters.concern && item.concern !== filters.concern) return false;
    if (filters.provider && item.provider !== filters.provider) return false;
    if (filters.device && item.device !== filters.device) return false;
    return true;
  });
}
