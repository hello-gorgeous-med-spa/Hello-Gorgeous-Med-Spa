// ============================================================
// API: SEED CONSENT TEMPLATES - Load default consent forms
// ============================================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

const DEFAULT_TEMPLATES = [
  {
    name: 'HIPAA Acknowledgment',
    slug: 'hipaa-acknowledgment',
    description: 'Privacy practices acknowledgment required for all clients',
    content: `NOTICE OF PRIVACY PRACTICES

Hello Gorgeous Med Spa is committed to protecting your health information. This notice describes how medical information about you may be used and disclosed and how you can get access to this information.

YOUR RIGHTS:
• You have the right to request restrictions on certain uses and disclosures of your health information
• You have the right to receive confidential communications
• You have the right to inspect and copy your health information
• You have the right to request amendments to your health information
• You have the right to receive an accounting of disclosures
• You have the right to a paper copy of this notice

OUR RESPONSIBILITIES:
• We are required by law to maintain the privacy of your health information
• We are required to provide you with this notice of our legal duties and privacy practices
• We will not use or share your information other than as described here unless you tell us we can in writing

By signing below, you acknowledge that you have received and understand this Notice of Privacy Practices.`,
    is_active: true,
    requires_witness: false,
    version: 1,
  },
  {
    name: 'General Treatment Consent',
    slug: 'general-treatment-consent',
    description: 'General consent for aesthetic treatments',
    content: `GENERAL CONSENT FOR AESTHETIC TREATMENT

I hereby authorize Hello Gorgeous Med Spa and its licensed practitioners to perform aesthetic treatments as discussed during my consultation.

I understand that:
• Results vary from person to person and are not guaranteed
• I may require multiple treatments to achieve desired results
• I must follow all pre and post-treatment instructions provided
• I am responsible for disclosing my complete medical history
• I may experience temporary side effects such as redness, swelling, or bruising

ACKNOWLEDGMENTS:
• I confirm I am not pregnant or breastfeeding (or have disclosed this to my provider)
• I have disclosed all medications, supplements, and medical conditions
• I have had the opportunity to ask questions and have them answered
• I consent to before and after photographs for my medical record

I voluntarily consent to treatment and accept the associated risks.`,
    is_active: true,
    requires_witness: false,
    version: 1,
  },
  {
    name: 'Neurotoxin Treatment Consent',
    slug: 'neurotoxin-consent',
    description: 'Botox, Dysport, Jeuveau, Xeomin treatment consent',
    content: `INFORMED CONSENT FOR NEUROTOXIN TREATMENT
(Botox®, Dysport®, Jeuveau®, Xeomin®)

I understand that I am receiving treatment with botulinum toxin for the purpose of temporarily reducing facial wrinkles and/or treating other conditions as discussed with my provider.

RISKS AND POSSIBLE COMPLICATIONS:
• Bruising, swelling, or redness at injection sites
• Headache or flu-like symptoms
• Temporary drooping of eyelid or eyebrow (ptosis)
• Asymmetry or uneven results
• Allergic reaction (rare)
• Spread of toxin effect (rare)

CONTRAINDICATIONS - I confirm that:
• I am NOT pregnant or breastfeeding
• I do NOT have a neuromuscular disease (such as myasthenia gravis or ALS)
• I am NOT allergic to botulinum toxin or human albumin
• I have disclosed all medications, especially blood thinners

EXPECTATIONS:
• Results typically appear within 3-14 days
• Results are temporary and typically last 3-4 months
• Touch-up treatments may be recommended after 2 weeks
• Individual results vary

I have read and understand this consent form and have had the opportunity to ask questions.`,
    is_active: true,
    requires_witness: false,
    version: 1,
  },
  {
    name: 'Dermal Filler Consent',
    slug: 'dermal-filler-consent',
    description: 'Hyaluronic acid filler treatment consent',
    content: `INFORMED CONSENT FOR DERMAL FILLER TREATMENT

I understand that I am receiving treatment with hyaluronic acid dermal filler (such as Juvederm®, Restylane®, RHA®, Versa®, or similar products) for facial volume restoration and/or enhancement.

RISKS AND POSSIBLE COMPLICATIONS:
• Bruising, swelling, redness, tenderness at injection sites
• Lumps, bumps, or irregularities (usually temporary)
• Asymmetry
• Infection (rare)
• Allergic reaction (rare)
• Vascular occlusion - blockage of blood vessels (rare but serious)
• Skin necrosis or tissue death (rare)
• Blindness (extremely rare, with periorbital injections)

CONTRAINDICATIONS - I confirm that:
• I am NOT pregnant or breastfeeding
• I do NOT have a history of severe allergies or anaphylaxis
• I do NOT have active skin infections in the treatment area
• I have disclosed all medications including blood thinners and supplements

EXPECTATIONS:
• Results are typically immediate with some swelling
• Final results visible after swelling subsides (1-2 weeks)
• Results typically last 6-18 months depending on product and area
• Touch-up treatments may be recommended

REVERSAL:
I understand that hyaluronic acid fillers can be dissolved with hyaluronidase if needed.

I have read and understand this consent form.`,
    is_active: true,
    requires_witness: false,
    version: 1,
  },
  {
    name: 'Financial & Cancellation Policy',
    slug: 'financial-policy',
    description: 'Payment and cancellation policy agreement',
    content: `FINANCIAL POLICY & CANCELLATION AGREEMENT

PAYMENT POLICY:
• Payment is due in full at the time of service
• We accept cash, credit cards, debit cards, and CareCredit/financing
• Deposits may be required for certain services or packages
• Gift cards are non-refundable and have no cash value

CANCELLATION POLICY:
• Please provide at least 24 hours notice for cancellations or rescheduling
• Late cancellations (less than 24 hours) may incur a 50% service fee
• No-shows may be charged the full service amount
• Repeated no-shows or late cancellations may require a deposit for future bookings

REFUND POLICY:
• Services are non-refundable once performed
• Product returns accepted within 14 days with receipt (unopened only)
• Package and membership refunds are prorated based on services used

By signing below, I acknowledge that I have read, understand, and agree to these policies.`,
    is_active: true,
    requires_witness: false,
    version: 1,
  },
  {
    name: 'Photo/Video Release',
    slug: 'photo-release',
    description: 'Consent for before/after photos and marketing use',
    content: `PHOTO AND VIDEO RELEASE AUTHORIZATION

I hereby grant Hello Gorgeous Med Spa permission to take photographs and/or videos of me before, during, and after treatment.

I authorize the use of these images for:

□ My Medical Record Only (required)
□ Internal Training and Education
□ Marketing Materials (website, social media, print)

TERMS:
• I understand I will NOT be identified by name without additional written consent
• I understand images may be edited, cropped, or enhanced
• I waive any right to inspect or approve the finished images
• This release is valid indefinitely unless revoked in writing

I understand that I may decline marketing use while still consenting to medical record photographs. My treatment will not be affected by my decision.`,
    is_active: true,
    requires_witness: false,
    version: 1,
  },
  {
    name: 'Weight Loss Program Consent',
    slug: 'weight-loss-consent',
    description: 'Semaglutide/Tirzepatide weight loss treatment consent',
    content: `INFORMED CONSENT FOR MEDICAL WEIGHT LOSS TREATMENT
(Semaglutide/Tirzepatide/GLP-1 Agonist Therapy)

I understand that I am participating in a medical weight loss program that may include GLP-1 receptor agonist medications.

POTENTIAL SIDE EFFECTS:
• Nausea, vomiting, diarrhea, constipation
• Decreased appetite
• Abdominal pain or discomfort
• Injection site reactions
• Fatigue or dizziness
• Hypoglycemia (low blood sugar)

SERIOUS RISKS (rare):
• Pancreatitis (inflammation of the pancreas)
• Gallbladder problems
• Kidney problems
• Allergic reactions
• Thyroid tumors (observed in animal studies)

CONTRAINDICATIONS - I confirm that:
• I do NOT have a personal or family history of medullary thyroid carcinoma
• I do NOT have Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)
• I am NOT pregnant, planning pregnancy, or breastfeeding
• I do NOT have a history of pancreatitis

PROGRAM REQUIREMENTS:
• I commit to attending regular follow-up appointments
• I will follow the recommended diet and exercise program
• I will report any concerning symptoms immediately
• I understand results vary and are not guaranteed

I have discussed this treatment with my provider and understand the risks and benefits.`,
    is_active: true,
    requires_witness: false,
    version: 1,
  },
];

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();

    // Insert templates, handling conflicts by name
    const results = [];
    for (const template of DEFAULT_TEMPLATES) {
      const { data, error } = await supabase
        .from('consent_templates')
        .upsert(
          {
            ...template,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        )
        .select()
        .single();

      if (error) {
        console.error(`Error inserting ${template.name}:`, error);
        // Try insert without upsert if upsert fails
        const { data: insertData, error: insertError } = await supabase
          .from('consent_templates')
          .insert({
            ...template,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (!insertError && insertData) {
          results.push(insertData);
        }
      } else if (data) {
        results.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Loaded ${results.length} consent templates`,
      templates: results,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed consent templates' },
      { status: 500 }
    );
  }
}
