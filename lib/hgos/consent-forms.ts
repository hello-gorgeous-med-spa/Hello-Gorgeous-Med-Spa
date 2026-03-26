// ============================================================
// HELLO GORGEOUS OS - CONSENT & LEGAL FORMS
// Med Spa Protection: Liability, Arbitration, Insurance, HIPAA
// ============================================================

export type ConsentFormType = 
  | 'general_consent'
  | 'hipaa_authorization'
  | 'arbitration_agreement'
  | 'liability_waiver'
  | 'photo_release'
  | 'cancellation_policy'
  | 'treatment_consent'
  | 'injectable_consent'
  | 'laser_consent'
  | 'weight_loss_consent'
  | 'chemical_peel_consent'
  | 'microneedling_consent'
  | 'sms_consent'
  | 'morpheus8_consent'
  | 'rf_microneedling_consent'
  | 'ipl_photofacial_consent'
  | 'laser_hair_removal_consent'
  | 'laser_skin_resurfacing_consent'
  | 'prp_prf_consent'
  | 'iv_therapy_consent'
  | 'bhrt_consent'
  | 'hydrafacial_consent'
  | 'dermaplaning_consent'
  | 'lash_brow_consent'
  | 'body_contouring_consent'
  | 'kybella_consent'
  | 'pdo_threads_consent'
  /** Same-day confirmation before procedure (all services); use with modality-specific informed consent. */
  | 'same_day_pre_treatment_confirmation'
  /** Post-visit discharge & aftercare acknowledgment (all services). */
  | 'post_treatment_discharge_acknowledgment';

/** Use in requiredForServices to attach a form to every service category */
export const CONSENT_ALL_SERVICES = '*' as const;

export type ConsentStatus = 'pending' | 'signed' | 'declined' | 'expired';

export interface ConsentForm {
  id: ConsentFormType;
  name: string;
  shortName: string;
  description: string;
  version: string;
  lastUpdated: string;
  isRequired: boolean;
  requiresWitness: boolean;
  expiresAfterDays: number | null; // null = never expires
  content: string; // HTML content
  requiredForServices?: string[]; // Service category slugs; use ['*'] for all services
  /** pre = informed consent / screening; post = discharge / aftercare acknowledgment */
  phase?: 'pre' | 'post';
  order: number;
}

export interface SignedConsent {
  id: string;
  clientId: string;
  formType: ConsentFormType;
  formVersion: string;
  signedAt: string;
  signatureData: string; // Base64 signature image or typed name
  signatureType: 'drawn' | 'typed';
  ipAddress?: string;
  userAgent?: string;
  witnessName?: string;
  witnessSignature?: string;
  expiresAt?: string;
  status: ConsentStatus;
}

// ============================================================
// CONSENT FORM TEMPLATES
// ============================================================

export const CONSENT_FORMS: ConsentForm[] = [
  // ========================
  // GENERAL & REQUIRED FORMS
  // ========================
  {
    id: 'general_consent',
    name: 'General Consent for Treatment',
    shortName: 'Treatment Consent',
    description: 'Authorization for medical aesthetic treatments',
    version: '2.0',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365, // Annual renewal
    order: 1,
    content: `
      <h2>CONSENT FOR MEDICAL AESTHETIC TREATMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. CONSENT TO TREATMENT</h3>
      <p>I, the undersigned patient, hereby authorize Hello Gorgeous Med Spa and its healthcare providers to perform medical aesthetic treatments and procedures as discussed during my consultation. I understand that medicine is not an exact science and that no guarantees have been made to me regarding the outcome of any treatment or procedure.</p>
      
      <h3>2. NATURE OF TREATMENTS</h3>
      <p>I understand that medical aesthetic treatments may include, but are not limited to: injectable treatments (Botox, dermal fillers), laser treatments, chemical peels, microneedling, facials, and body contouring procedures. Each specific treatment will be explained to me, and I will have the opportunity to ask questions before proceeding.</p>
      
      <h3>3. RISKS AND COMPLICATIONS</h3>
      <p>I acknowledge that all medical procedures carry inherent risks. General risks may include, but are not limited to:</p>
      <ul>
        <li>Pain, swelling, bruising, or redness at treatment sites</li>
        <li>Infection</li>
        <li>Allergic reactions</li>
        <li>Scarring</li>
        <li>Asymmetry or uneven results</li>
        <li>Temporary or permanent nerve damage</li>
        <li>Unsatisfactory aesthetic results</li>
        <li>Need for additional treatments</li>
      </ul>
      
      <h3>4. ALTERNATIVE TREATMENTS</h3>
      <p>I understand that alternative treatments may exist, including no treatment at all. I have had the opportunity to discuss these alternatives with my provider.</p>
      
      <h3>5. PROVIDER QUALIFICATIONS</h3>
      <p>I understand that treatments will be performed by licensed healthcare providers operating within their scope of practice under applicable Illinois state law.</p>
      
      <h3>6. QUESTIONS AND CONCERNS</h3>
      <p>I have been given the opportunity to ask questions about my treatment, the procedures involved, and the risks and benefits. All of my questions have been answered to my satisfaction.</p>
      
      <h3>7. VOLUNTARY CONSENT</h3>
      <p>I certify that I have read and fully understand this consent form. I am signing this consent voluntarily, and I am not under the influence of any substances that would impair my judgment. I understand that I may withdraw my consent at any time prior to treatment.</p>
      
      <p class="signature-block"><strong>By signing below, I acknowledge that I have read, understand, and agree to the terms of this consent form.</strong></p>
    `,
  },

  {
    id: 'hipaa_authorization',
    name: 'HIPAA Privacy Authorization',
    shortName: 'HIPAA',
    description: 'Authorization for use and disclosure of health information',
    version: '1.5',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: null, // Never expires unless revoked
    order: 2,
    content: `
      <h2>HIPAA PRIVACY PRACTICES & AUTHORIZATION</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>NOTICE OF PRIVACY PRACTICES</h3>
      <p>This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.</p>
      
      <h3>1. OUR COMMITMENT TO YOUR PRIVACY</h3>
      <p>Hello Gorgeous Med Spa is committed to protecting the privacy of your personal health information (PHI). We are required by the Health Insurance Portability and Accountability Act (HIPAA) to maintain the privacy of your PHI and to provide you with this notice of our legal duties and privacy practices.</p>
      
      <h3>2. HOW WE MAY USE AND DISCLOSE YOUR INFORMATION</h3>
      <p>We may use and disclose your PHI for the following purposes:</p>
      <ul>
        <li><strong>Treatment:</strong> To provide, coordinate, or manage your healthcare and related services</li>
        <li><strong>Payment:</strong> To obtain payment for healthcare services provided to you</li>
        <li><strong>Healthcare Operations:</strong> For quality assessment, employee review, training, and other administrative operations</li>
        <li><strong>As Required by Law:</strong> When required by federal, state, or local law</li>
        <li><strong>Public Health:</strong> For public health activities as permitted by law</li>
        <li><strong>Health Oversight:</strong> To health oversight agencies for legally authorized activities</li>
      </ul>
      
      <h3>3. YOUR RIGHTS</h3>
      <p>You have the following rights regarding your PHI:</p>
      <ul>
        <li>Right to request restrictions on certain uses and disclosures</li>
        <li>Right to receive confidential communications</li>
        <li>Right to inspect and copy your health information</li>
        <li>Right to request amendments to your health information</li>
        <li>Right to receive an accounting of disclosures</li>
        <li>Right to obtain a paper copy of this notice</li>
        <li>Right to revoke this authorization at any time in writing</li>
      </ul>
      
      <h3>4. AUTHORIZATION FOR SPECIFIC DISCLOSURES</h3>
      <p>By signing below, I authorize Hello Gorgeous Med Spa to:</p>
      <ul>
        <li>Discuss my treatment and records with individuals I designate</li>
        <li>Send appointment reminders via phone, text, or email</li>
        <li>Leave voicemail messages regarding my appointments or treatment</li>
        <li>Contact me for follow-up care and promotional purposes</li>
      </ul>
      
      <h3>5. ACKNOWLEDGMENT</h3>
      <p>I acknowledge that I have received a copy of Hello Gorgeous Med Spa's Notice of Privacy Practices. I understand that I may revoke this authorization at any time by submitting a written request, except to the extent that action has already been taken based on this authorization.</p>
      
      <p class="signature-block"><strong>By signing below, I acknowledge that I have read, understand, and agree to the terms of this HIPAA authorization.</strong></p>
    `,
  },

  {
    id: 'arbitration_agreement',
    name: 'Binding Arbitration Agreement',
    shortName: 'Arbitration',
    description: 'Agreement to resolve disputes through arbitration',
    version: '1.2',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: null,
    order: 3,
    content: `
      <h2>BINDING ARBITRATION AGREEMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <div class="important-notice">
        <p><strong>IMPORTANT: PLEASE READ THIS DOCUMENT CAREFULLY.</strong></p>
        <p>This agreement affects your legal rights. By signing this agreement, you are agreeing to have any dispute arising out of the healthcare services you receive at this facility resolved by neutral binding arbitration rather than a jury trial.</p>
      </div>
      
      <h3>1. AGREEMENT TO ARBITRATE</h3>
      <p>It is understood that any dispute as to medical malpractice, that is as to whether any medical services rendered under this contract were unnecessary or unauthorized or were improperly, negligently, or incompetently rendered, will be determined by submission to arbitration as provided by Illinois law, and not by a lawsuit or resort to court process, except as Illinois law provides for judicial review of arbitration proceedings.</p>
      
      <h3>2. SCOPE OF AGREEMENT</h3>
      <p>This agreement covers all claims arising out of or relating to:</p>
      <ul>
        <li>Any treatment or procedure performed at Hello Gorgeous Med Spa</li>
        <li>Any products sold or recommended by Hello Gorgeous Med Spa</li>
        <li>Any advice or consultation provided by Hello Gorgeous Med Spa staff</li>
        <li>Any claims against Hello Gorgeous Med Spa, its owners, employees, agents, or affiliates</li>
        <li>Any claims for personal injury, wrongful death, loss of consortium, emotional distress, or any other damages</li>
      </ul>
      
      <h3>3. ARBITRATION PROCEDURES</h3>
      <p>All disputes subject to arbitration shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association (AAA) for healthcare disputes. The arbitration shall take place in Kendall County, Illinois, unless otherwise agreed upon by the parties.</p>
      
      <h3>4. SELECTION OF ARBITRATOR</h3>
      <p>The arbitration shall be conducted by a single arbitrator who is a retired judge or an attorney with experience in medical malpractice law. The arbitrator shall be selected by mutual agreement of the parties or, if the parties cannot agree, in accordance with AAA rules.</p>
      
      <h3>5. COSTS AND FEES</h3>
      <p>Each party shall bear their own costs and attorney's fees. The costs of the arbitration, including the arbitrator's fees, shall be shared equally by the parties, unless the arbitrator determines otherwise.</p>
      
      <h3>6. BINDING DECISION</h3>
      <p>The arbitrator's decision shall be final and binding on all parties. Judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof.</p>
      
      <h3>7. WAIVER OF JURY TRIAL</h3>
      <p><strong>BY SIGNING THIS AGREEMENT, YOU ARE WAIVING YOUR RIGHT TO A JURY TRIAL.</strong> You understand that you have the right to have any medical malpractice claim decided by a jury, and you are voluntarily giving up that right in favor of binding arbitration.</p>
      
      <h3>8. VOLUNTARY AGREEMENT</h3>
      <p>I understand that I am not required to sign this agreement as a condition of receiving treatment. I am signing this agreement voluntarily, and I have had the opportunity to seek legal counsel before signing.</p>
      
      <h3>9. RIGHT TO RESCIND</h3>
      <p>I understand that I have the right to rescind (cancel) this agreement within 30 days of signing by providing written notice to Hello Gorgeous Med Spa. After 30 days, or after receiving treatment, whichever comes first, this agreement cannot be rescinded.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS ARBITRATION AGREEMENT, AND I VOLUNTARILY AGREE TO BINDING ARBITRATION FOR ANY DISPUTES.</strong></p>
    `,
  },

  {
    id: 'liability_waiver',
    name: 'Liability Waiver & Release',
    shortName: 'Liability Waiver',
    description: 'Release of liability for treatments and services',
    version: '1.3',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 4,
    content: `
      <h2>LIABILITY WAIVER AND RELEASE</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. ASSUMPTION OF RISK</h3>
      <p>I understand and acknowledge that medical aesthetic treatments carry inherent risks, including but not limited to adverse reactions, complications, and unsatisfactory results. I voluntarily assume full responsibility for any risks of loss, property damage, or personal injury, including death, that may be sustained by me as a result of receiving treatments at Hello Gorgeous Med Spa.</p>
      
      <h3>2. RELEASE OF LIABILITY</h3>
      <p>I, for myself and on behalf of my heirs, assigns, personal representatives, and next of kin, hereby release, indemnify, and hold harmless Hello Gorgeous Med Spa, its owners, officers, employees, agents, contractors, and affiliates from and against any and all claims, damages, losses, and expenses, including but not limited to attorney's fees, arising out of or resulting from my participation in treatments, EXCEPT those caused by the gross negligence or willful misconduct of Hello Gorgeous Med Spa.</p>
      
      <h3>3. ACCURATE INFORMATION</h3>
      <p>I certify that I have provided accurate and complete information regarding my medical history, current medications, allergies, and any other relevant health information. I understand that withholding information or providing inaccurate information may affect my treatment outcomes and safety.</p>
      
      <h3>4. COMPLIANCE WITH INSTRUCTIONS</h3>
      <p>I agree to follow all pre-treatment and post-treatment instructions provided by Hello Gorgeous Med Spa. I understand that failure to comply with these instructions may affect my results and increase my risk of complications.</p>
      
      <h3>5. NO GUARANTEE OF RESULTS</h3>
      <p>I understand that individual results vary and that Hello Gorgeous Med Spa makes no guarantees regarding the outcome of any treatment. I acknowledge that I may require multiple treatments to achieve desired results, and that some treatments may not produce visible results.</p>
      
      <h3>6. FINANCIAL RESPONSIBILITY</h3>
      <p>I understand that I am financially responsible for all services rendered, regardless of outcome. Refunds are not guaranteed for unsatisfactory results if treatments were performed according to standard protocols.</p>
      
      <h3>7. INDEPENDENT DECISION</h3>
      <p>I certify that I have made the decision to receive treatment independently and voluntarily. I have not been coerced or pressured into signing this waiver or receiving treatment.</p>
      
      <h3>8. SEVERABILITY</h3>
      <p>If any provision of this waiver is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ THIS LIABILITY WAIVER AND RELEASE, I UNDERSTAND ITS TERMS, AND I SIGN IT VOLUNTARILY.</strong></p>
    `,
  },

  {
    id: 'photo_release',
    name: 'Photo & Media Release',
    shortName: 'Photo Release',
    description: 'Permission to use before/after photos for marketing',
    version: '1.1',
    lastUpdated: '2026-01-30',
    isRequired: false,
    requiresWitness: false,
    expiresAfterDays: null,
    order: 5,
    content: `
      <h2>PHOTO AND MEDIA RELEASE AUTHORIZATION</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. AUTHORIZATION</h3>
      <p>I hereby authorize Hello Gorgeous Med Spa to take photographs, videos, and other recordings of me before, during, and after treatment for the following purposes:</p>
      <ul>
        <li>Inclusion in my medical record for treatment documentation</li>
        <li>Educational and training purposes</li>
        <li>Marketing and promotional materials (website, social media, print advertising)</li>
        <li>Presentations at professional conferences</li>
      </ul>
      
      <h3>2. USAGE RIGHTS</h3>
      <p>I grant Hello Gorgeous Med Spa the irrevocable right to use, reproduce, modify, publish, and distribute the photographs and recordings in any media format, now known or hereafter developed, for the purposes described above.</p>
      
      <h3>3. PRIVACY OPTIONS</h3>
      <p>I understand that I may choose the level of privacy for my images:</p>
      <ul>
        <li><strong>Option A:</strong> Full release - Images may be used with or without identifying information</li>
        <li><strong>Option B:</strong> Anonymous release - Images may be used only without identifying information (face obscured or cropped)</li>
        <li><strong>Option C:</strong> Medical record only - Images for my medical record only, no marketing use</li>
      </ul>
      
      <h3>4. NO COMPENSATION</h3>
      <p>I understand that I will not receive any compensation for the use of my photographs or recordings.</p>
      
      <h3>5. REVOCATION</h3>
      <p>I understand that I may revoke this authorization at any time by providing written notice to Hello Gorgeous Med Spa. However, any use of my images prior to revocation shall remain authorized.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I AUTHORIZE THE USE OF MY PHOTOGRAPHS AND RECORDINGS AS DESCRIBED ABOVE.</strong></p>
    `,
  },

  {
    id: 'cancellation_policy',
    name: 'Cancellation & No-Show Policy',
    shortName: 'Cancellation Policy',
    description: 'Acknowledgment of cancellation and no-show policies',
    version: '1.0',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: null,
    order: 6,
    content: `
      <h2>CANCELLATION AND NO-SHOW POLICY ACKNOWLEDGMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. CANCELLATION POLICY</h3>
      <p>We understand that circumstances may arise that require you to cancel or reschedule your appointment. We kindly request that you provide at least <strong>24 hours notice</strong> for any cancellation or rescheduling.</p>
      
      <h3>2. LATE CANCELLATION FEE</h3>
      <p>Appointments cancelled with less than 24 hours notice may be subject to a cancellation fee of <strong>50% of the scheduled service price</strong>. This fee helps us compensate for the time that was reserved for you.</p>
      
      <h3>3. NO-SHOW POLICY</h3>
      <p>A "no-show" is defined as failing to arrive for your scheduled appointment without providing any advance notice. No-shows may be subject to:</p>
      <ul>
        <li>A fee equal to <strong>100% of the scheduled service price</strong></li>
        <li>Forfeiture of any deposit paid</li>
        <li>Requirement to prepay for future appointments</li>
      </ul>
      
      <h3>4. REPEAT NO-SHOWS</h3>
      <p>Clients with <strong>three (3) or more no-shows</strong> may be required to prepay in full for all future appointments or may be discharged from our practice at our discretion.</p>
      
      <h3>5. DEPOSITS</h3>
      <p>Certain services may require a deposit at the time of booking. Deposits are applied to your service cost if you attend your appointment. Deposits may be forfeited if you:</p>
      <ul>
        <li>Cancel with less than 24 hours notice</li>
        <li>Fail to show for your appointment</li>
        <li>Reschedule more than twice for the same appointment</li>
      </ul>
      
      <h3>6. LATE ARRIVALS</h3>
      <p>If you arrive more than 15 minutes late for your appointment, we may need to reschedule your service to avoid delays for other clients. Late arrivals may be treated as a no-show at our discretion.</p>
      
      <h3>7. HOW TO CANCEL OR RESCHEDULE</h3>
      <p>To cancel or reschedule your appointment, please contact us via:</p>
      <ul>
        <li>Phone: (630) 636-6193</li>
        <li>Email: hello.gorgeous@hellogorgeousmedspa.com</li>
        <li>Online booking portal</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THE CANCELLATION AND NO-SHOW POLICY.</strong></p>
    `,
  },

  // ========================
  // TREATMENT-SPECIFIC FORMS
  // ========================
  {
    id: 'injectable_consent',
    name: 'Injectable Treatment Consent',
    shortName: 'Injectable Consent',
    description: 'Consent for Botox, fillers, and other injectables',
    version: '2.1',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 10,
    requiredForServices: ['injectables', 'botox', 'fillers', 'weight-loss'],
    content: `
      <h2>INFORMED CONSENT FOR INJECTABLE TREATMENTS</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>TREATMENT TYPES COVERED</h3>
      <p>This consent applies to: Botulinum toxin (Botox®, Dysport®, Jeuveau®, Xeomin®), Dermal fillers (Juvederm®, Restylane®, Sculptra®, Radiesse®), and other injectable treatments including vitamin injections and weight loss medications (Semaglutide, Tirzepatide).</p>
      
      <h3>1. NATURE OF TREATMENT</h3>
      <p>I understand that injectable treatments involve the injection of substances into or under my skin to achieve cosmetic or therapeutic effects. The specific substance(s) to be used and the treatment areas will be discussed with me prior to treatment.</p>
      
      <h3>2. BENEFITS</h3>
      <p>Potential benefits include, but are not limited to:</p>
      <ul>
        <li>Reduction of wrinkles and fine lines</li>
        <li>Restoration of facial volume</li>
        <li>Enhanced facial contours</li>
        <li>Temporary improvement in appearance</li>
        <li>Weight management (for GLP-1 medications)</li>
      </ul>
      
      <h3>3. RISKS AND SIDE EFFECTS</h3>
      <p>I understand the following risks and side effects may occur:</p>
      <ul>
        <li><strong>Common:</strong> Bruising, swelling, redness, tenderness at injection sites, headache</li>
        <li><strong>Less Common:</strong> Asymmetry, lumps or irregularities, migration of product, infection</li>
        <li><strong>Rare but Serious:</strong> Vascular occlusion (blocking blood flow), skin necrosis, blindness, allergic reaction, scarring</li>
        <li><strong>Neurotoxin-specific:</strong> Drooping eyelid (ptosis), difficulty swallowing, muscle weakness</li>
        <li><strong>GLP-1 medications:</strong> Nausea, vomiting, diarrhea, constipation, pancreatitis, gallbladder issues</li>
      </ul>
      
      <h3>4. CONTRAINDICATIONS</h3>
      <p>I confirm that I do NOT have any of the following conditions:</p>
      <ul>
        <li>Pregnancy or breastfeeding</li>
        <li>Allergy to any component of the injectable products</li>
        <li>Neuromuscular disorders (for neurotoxins)</li>
        <li>Active skin infection at treatment site</li>
        <li>History of severe allergic reactions (anaphylaxis)</li>
        <li>Personal or family history of medullary thyroid carcinoma or MEN 2 (for GLP-1 medications)</li>
      </ul>
      
      <h3>5. POST-TREATMENT CARE</h3>
      <p>I agree to follow all post-treatment instructions provided, including:</p>
      <ul>
        <li>Avoiding touching, rubbing, or massaging treated areas (unless instructed)</li>
        <li>Avoiding strenuous exercise for 24 hours</li>
        <li>Avoiding alcohol for 24 hours</li>
        <li>Reporting any concerning symptoms immediately</li>
      </ul>
      
      <h3>6. RESULTS AND LONGEVITY</h3>
      <p>I understand that results vary by individual and are not permanent. Repeat treatments will be necessary to maintain results. I understand that the longevity of results depends on many factors including the product used, treatment area, and individual metabolism.</p>
      
      <h3>7. OFF-LABEL USE</h3>
      <p>I understand that some injectable treatments may be used "off-label," meaning for purposes not specifically approved by the FDA. I consent to such use when recommended by my provider.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO INJECTABLE TREATMENT.</strong></p>
    `,
  },

  {
    id: 'laser_consent',
    name: 'Laser Treatment Consent',
    shortName: 'Laser Consent',
    description: 'Consent for laser hair removal, IPL, and other laser procedures',
    version: '1.4',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 11,
    requiredForServices: ['laser', 'hair-removal', 'ipl', 'photofacial'],
    content: `
      <h2>INFORMED CONSENT FOR LASER TREATMENTS</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>TREATMENT TYPES COVERED</h3>
      <p>This consent applies to: Laser hair removal, IPL (Intense Pulsed Light) treatments, photofacials, skin resurfacing, and other light-based treatments.</p>
      
      <h3>1. NATURE OF TREATMENT</h3>
      <p>I understand that laser and light-based treatments use focused light energy to achieve cosmetic results. The specific device and settings will be determined by my provider based on my skin type and treatment goals.</p>
      
      <h3>2. BENEFITS</h3>
      <p>Potential benefits include:</p>
      <ul>
        <li>Permanent hair reduction</li>
        <li>Improvement in skin tone and texture</li>
        <li>Reduction of pigmentation, sun damage, and age spots</li>
        <li>Reduction of redness and visible blood vessels</li>
        <li>Overall skin rejuvenation</li>
      </ul>
      
      <h3>3. RISKS AND SIDE EFFECTS</h3>
      <p>I understand the following risks may occur:</p>
      <ul>
        <li><strong>Common:</strong> Redness, swelling, tenderness, mild blistering, temporary darkening or lightening of skin</li>
        <li><strong>Less Common:</strong> Burns, scarring, permanent skin color changes, herpes reactivation (if history of cold sores)</li>
        <li><strong>Rare:</strong> Eye injury (if proper protection not used), infection, allergic reaction</li>
      </ul>
      
      <h3>4. PRE-TREATMENT REQUIREMENTS</h3>
      <p>I confirm that I have followed all pre-treatment instructions, including:</p>
      <ul>
        <li>Avoiding sun exposure and tanning for at least 2-4 weeks</li>
        <li>Discontinuing use of retinoids and exfoliating products as directed</li>
        <li>Shaving the treatment area (for hair removal) as instructed</li>
        <li>Removing all makeup and skincare products from the treatment area</li>
        <li>Informing my provider of any medications I am taking, including Accutane</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <p>I confirm that I do NOT have:</p>
      <ul>
        <li>Active tan or recent sun exposure</li>
        <li>Use of photosensitizing medications</li>
        <li>Active skin infections or open wounds in treatment area</li>
        <li>History of keloid scarring</li>
        <li>Pregnancy</li>
        <li>Use of Accutane within the past 6 months</li>
      </ul>
      
      <h3>6. MULTIPLE TREATMENTS</h3>
      <p>I understand that multiple treatment sessions are typically required to achieve optimal results, particularly for laser hair removal. Treatment intervals and the number of sessions will be discussed with me.</p>
      
      <h3>7. EYE PROTECTION</h3>
      <p>I understand that proper eye protection is essential during laser treatments. I agree to keep my eyes closed and/or wear the protective eyewear provided at all times during treatment.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO LASER TREATMENT.</strong></p>
    `,
  },

  {
    id: 'chemical_peel_consent',
    name: 'Chemical Peel Consent',
    shortName: 'Chemical Peel Consent',
    description: 'Consent for chemical peel treatments',
    version: '1.2',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 12,
    requiredForServices: ['chemical-peel', 'peels'],
    content: `
      <h2>INFORMED CONSENT FOR CHEMICAL PEEL TREATMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. NATURE OF TREATMENT</h3>
      <p>I understand that a chemical peel involves the application of a chemical solution to the skin to remove damaged outer layers and stimulate new skin growth. The type and strength of peel will be determined by my provider based on my skin condition and goals.</p>
      
      <h3>2. TYPES OF PEELS</h3>
      <ul>
        <li><strong>Superficial peels:</strong> Gentle acids that treat the outer layer of skin (epidermis)</li>
        <li><strong>Medium peels:</strong> Stronger acids that reach the middle layer of skin (dermis)</li>
        <li><strong>Deep peels:</strong> Powerful acids that penetrate deeper into the dermis (not typically performed at med spas)</li>
      </ul>
      
      <h3>3. RISKS AND SIDE EFFECTS</h3>
      <p>I understand the following risks may occur:</p>
      <ul>
        <li><strong>Expected:</strong> Redness, peeling, flaking, dryness, tightness, sensitivity</li>
        <li><strong>Possible:</strong> Prolonged redness, hyperpigmentation (darkening), hypopigmentation (lightening), infection, scarring</li>
        <li><strong>Rare:</strong> Allergic reaction, permanent skin color changes, herpes reactivation</li>
      </ul>
      
      <h3>4. POST-TREATMENT CARE</h3>
      <p>I agree to follow all post-treatment instructions, including:</p>
      <ul>
        <li>Avoiding sun exposure and using SPF 30+ sunscreen daily</li>
        <li>Not picking or peeling flaking skin</li>
        <li>Using gentle, hydrating skincare products as recommended</li>
        <li>Avoiding active ingredients (retinoids, acids) until healed</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO CHEMICAL PEEL TREATMENT.</strong></p>
    `,
  },

  {
    id: 'microneedling_consent',
    name: 'Microneedling Consent',
    shortName: 'Microneedling Consent',
    description: 'Consent for microneedling and PRP treatments',
    version: '1.3',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 13,
    requiredForServices: ['microneedling', 'prp', 'collagen-induction'],
    content: `
      <h2>INFORMED CONSENT FOR MICRONEEDLING TREATMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. NATURE OF TREATMENT</h3>
      <p>I understand that microneedling (also known as collagen induction therapy) uses tiny needles to create controlled micro-injuries in the skin. This stimulates the body's natural healing response, promoting collagen and elastin production.</p>
      
      <h3>2. ENHANCED TREATMENTS</h3>
      <p>I understand that microneedling may be combined with:</p>
      <ul>
        <li>Hyaluronic acid serums</li>
        <li>Growth factors (e.g., AnteAGE)</li>
        <li>PRP (Platelet-Rich Plasma) from my own blood</li>
        <li>Exosomes</li>
      </ul>
      
      <h3>3. BENEFITS</h3>
      <p>Potential benefits include:</p>
      <ul>
        <li>Improved skin texture and tone</li>
        <li>Reduction of fine lines and wrinkles</li>
        <li>Reduction of acne scars and other scarring</li>
        <li>Reduction of pore size</li>
        <li>Improved product absorption</li>
        <li>Overall skin rejuvenation</li>
      </ul>
      
      <h3>4. RISKS AND SIDE EFFECTS</h3>
      <p>I understand the following risks may occur:</p>
      <ul>
        <li><strong>Common:</strong> Redness (like a sunburn), swelling, mild bleeding, tenderness, dryness, peeling</li>
        <li><strong>Less Common:</strong> Bruising, prolonged redness, infection, hyperpigmentation</li>
        <li><strong>Rare:</strong> Scarring, allergic reaction to topical products, herpes reactivation</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <p>I confirm that I do NOT have:</p>
      <ul>
        <li>Active acne, eczema, psoriasis, or rosacea in treatment area</li>
        <li>Active skin infections (including cold sores)</li>
        <li>History of keloid or hypertrophic scarring</li>
        <li>Blood clotting disorders or taking blood thinners</li>
        <li>Pregnancy or breastfeeding</li>
        <li>Use of Accutane within the past 6 months</li>
        <li>Skin cancer or suspicious lesions in treatment area</li>
      </ul>
      
      <h3>6. POST-TREATMENT CARE</h3>
      <p>I agree to follow all post-treatment instructions, including:</p>
      <ul>
        <li>Avoiding sun exposure and using SPF 30+ sunscreen</li>
        <li>Using only approved products for 24-72 hours</li>
        <li>Avoiding makeup for at least 24 hours</li>
        <li>Avoiding exercise and sweating for 24-48 hours</li>
        <li>Not touching my face with unwashed hands</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO MICRONEEDLING TREATMENT.</strong></p>
    `,
  },

  {
    id: 'weight_loss_consent',
    name: 'Medical Weight Loss Consent',
    shortName: 'Weight Loss Consent',
    description: 'Consent for GLP-1 medications (Semaglutide, Tirzepatide)',
    version: '2.0',
    lastUpdated: '2026-01-30',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 180, // 6 month renewal for ongoing treatment
    order: 14,
    requiredForServices: ['weight-loss', 'semaglutide', 'tirzepatide', 'glp-1'],
    content: `
      <h2>INFORMED CONSENT FOR MEDICAL WEIGHT LOSS TREATMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>MEDICATIONS COVERED</h3>
      <p>This consent applies to: Semaglutide (Ozempic®, Wegovy®), Tirzepatide (Mounjaro®, Zepbound®), Retatrutide, and other GLP-1 receptor agonist medications.</p>
      
      <h3>1. NATURE OF TREATMENT</h3>
      <p>I understand that GLP-1 receptor agonist medications are injectable medications that help with weight loss by:</p>
      <ul>
        <li>Reducing appetite and food cravings</li>
        <li>Slowing stomach emptying (increasing fullness)</li>
        <li>Improving blood sugar control</li>
        <li>Potentially improving cardiovascular health</li>
      </ul>
      
      <h3>2. FDA STATUS</h3>
      <p>I understand that some medications may be used "off-label" for weight loss, meaning for a purpose not specifically approved by the FDA. I understand that compounded versions of these medications are also not FDA-approved. I consent to such use when recommended by my provider.</p>
      
      <h3>3. RISKS AND SIDE EFFECTS</h3>
      <p>I understand the following risks may occur:</p>
      <ul>
        <li><strong>Very Common:</strong> Nausea, vomiting, diarrhea, constipation, stomach pain, decreased appetite</li>
        <li><strong>Common:</strong> Injection site reactions, headache, fatigue, dizziness, heartburn</li>
        <li><strong>Less Common:</strong> Gallbladder problems (gallstones), low blood sugar (especially with diabetes medications), rapid heart rate</li>
        <li><strong>Rare but Serious:</strong> Pancreatitis, kidney problems, allergic reactions, thyroid tumors (including cancer), suicidal thoughts</li>
      </ul>
      
      <h3>4. BOXED WARNING - THYROID CANCER</h3>
      <div class="warning-box">
        <p><strong>WARNING:</strong> In animal studies, GLP-1 receptor agonists have caused thyroid tumors, including thyroid cancer. It is unknown if these medications cause thyroid tumors or thyroid cancer in humans. These medications should NOT be used if you or any family member has had:</p>
        <ul>
          <li>Medullary thyroid carcinoma (MTC)</li>
          <li>Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)</li>
        </ul>
      </div>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <p>I confirm that I do NOT have:</p>
      <ul>
        <li>Personal or family history of medullary thyroid carcinoma or MEN 2</li>
        <li>History of pancreatitis</li>
        <li>Severe gastrointestinal disease</li>
        <li>History of diabetic retinopathy (if diabetic)</li>
        <li>Pregnancy, planning to become pregnant, or breastfeeding</li>
        <li>Allergy to any component of the medication</li>
        <li>History of suicidal thoughts or attempts</li>
      </ul>
      
      <h3>6. TREATMENT PROTOCOL</h3>
      <p>I understand that:</p>
      <ul>
        <li>Treatment involves weekly subcutaneous injections</li>
        <li>Dosage will be gradually increased to minimize side effects</li>
        <li>I must attend regular follow-up appointments</li>
        <li>I should combine medication with diet and exercise for best results</li>
        <li>Weight may be regained if I stop the medication</li>
      </ul>
      
      <h3>7. MONITORING</h3>
      <p>I agree to:</p>
      <ul>
        <li>Report any side effects or concerning symptoms immediately</li>
        <li>Attend all scheduled follow-up appointments</li>
        <li>Inform my primary care physician that I am taking this medication</li>
        <li>Notify my provider if I become pregnant or plan to become pregnant</li>
      </ul>
      
      <h3>8. STORAGE AND HANDLING</h3>
      <p>I understand that the medication must be stored properly (refrigerated) and I will follow all storage instructions provided.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM, INCLUDING THE BOXED WARNING ABOUT THYROID CANCER RISK, AND I VOLUNTARILY CONSENT TO MEDICAL WEIGHT LOSS TREATMENT.</strong></p>
    `,
  },

  // ========================
  // SMS/TEXT MESSAGE CONSENT (TCPA COMPLIANCE)
  // ========================
  {
    id: 'sms_consent',
    name: 'SMS/Text Message Consent',
    shortName: 'SMS Consent',
    description: 'Authorization to receive text messages for appointments and promotions',
    version: '1.0',
    lastUpdated: '2026-01-30',
    isRequired: false, // Optional but needed for marketing
    requiresWitness: false,
    expiresAfterDays: null, // Never expires, but can be revoked
    order: 15,
    content: `
      <h2>SMS/TEXT MESSAGE CONSENT FORM</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <div class="important-notice">
        <strong>TELEPHONE CONSUMER PROTECTION ACT (TCPA) DISCLOSURE</strong>
        <p>This consent is required by law before we can send you text messages. You have the right to decline and still receive our services.</p>
      </div>
      
      <h3>1. CONSENT TO RECEIVE TEXT MESSAGES</h3>
      <p>By signing below, I expressly consent to receive text messages (SMS and MMS) from Hello Gorgeous Med Spa at the phone number I have provided. I understand that:</p>
      <ul>
        <li>Message and data rates may apply based on my mobile carrier plan</li>
        <li>I am not required to consent as a condition of purchasing any goods or services</li>
        <li>I may receive approximately 2-8 messages per month</li>
        <li>Messages may be sent using an automatic telephone dialing system</li>
      </ul>
      
      <h3>2. TYPES OF MESSAGES</h3>
      <p>I consent to receive the following types of text messages:</p>
      
      <p><strong>☐ TRANSACTIONAL MESSAGES (Required for appointment management)</strong></p>
      <ul>
        <li>Appointment confirmations and reminders</li>
        <li>Appointment changes or cancellations</li>
        <li>Important service updates</li>
        <li>Billing and payment notifications</li>
      </ul>
      
      <p><strong>☐ PROMOTIONAL MESSAGES (Optional)</strong></p>
      <ul>
        <li>Special offers and discounts</li>
        <li>New service announcements</li>
        <li>Seasonal promotions</li>
        <li>Loyalty rewards and birthday offers</li>
        <li>Event invitations</li>
      </ul>
      
      <h3>3. HOW TO OPT-OUT</h3>
      <p>You may revoke this consent at any time by:</p>
      <ul>
        <li><strong>Replying STOP</strong> to any text message you receive from us</li>
        <li>Calling us at (630) 636-6193</li>
        <li>Emailing hello.gorgeous@hellogorgeousmedspa.com with "Unsubscribe SMS" in the subject</li>
        <li>Notifying us in person at your next appointment</li>
      </ul>
      <p>After opting out, you will receive one final confirmation message. You will no longer receive text messages unless you opt back in.</p>
      
      <h3>4. HOW TO GET HELP</h3>
      <p>Reply <strong>HELP</strong> to any message for assistance, or contact us directly at (630) 636-6193.</p>
      
      <h3>5. MESSAGE FREQUENCY</h3>
      <p>Message frequency varies. Transactional messages are sent as needed based on your appointments. Promotional messages are sent no more than 2 times per week.</p>
      
      <h3>6. PRIVACY</h3>
      <p>Your phone number and messaging preferences are protected under our Privacy Policy. We will never sell your phone number to third parties. For more information, visit our Privacy Policy at hellogorgeousmedspa.com/privacy</p>
      
      <h3>7. SUPPORTED CARRIERS</h3>
      <p>Text messaging is supported by most major carriers including AT&T, Verizon, T-Mobile, Sprint, and others. Carrier message and data rates may apply.</p>
      
      <h3>8. PHONE NUMBER VERIFICATION</h3>
      <p>By providing my phone number below, I confirm that:</p>
      <ul>
        <li>The phone number I provided is my own</li>
        <li>I am authorized to receive text messages at this number</li>
        <li>I will notify Hello Gorgeous Med Spa if my phone number changes</li>
      </ul>
      
      <p><strong>Phone Number for Text Messages:</strong> _______________________</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS SMS CONSENT FORM AND I VOLUNTARILY AGREE TO RECEIVE TEXT MESSAGES FROM HELLO GORGEOUS MED SPA.</strong></p>
      
      <p style="font-size: 10pt; color: #666; margin-top: 20px;">
        <em>Note: If you do not sign this form, you may still receive essential appointment-related communications via phone call or email. Text messaging is optional but helps us serve you better.</em>
      </p>
    `,
  },

  // ========================
  // ADVANCED TREATMENT CONSENT FORMS
  // ========================

  {
    id: 'morpheus8_consent',
    name: 'Morpheus8 RF Microneedling Consent',
    shortName: 'Morpheus8 Consent',
    description: 'Consent for Morpheus8 radiofrequency microneedling treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 20,
    requiredForServices: ['morpheus8', 'rf-microneedling', 'skin-tightening'],
    content: `
      <h2>INFORMED CONSENT FOR MORPHEUS8 RF MICRONEEDLING</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF PROCEDURE</h3>
      <p>Morpheus8 is a minimally invasive treatment that combines microneedling with radiofrequency (RF) energy to remodel and contour the face and body. The device uses gold-plated needles that penetrate the skin to deliver RF energy to the deeper layers of tissue, stimulating collagen production and promoting skin tightening.</p>
      
      <h3>2. TREATMENT AREAS</h3>
      <p>Morpheus8 can be used on various areas including:</p>
      <ul>
        <li>Face (forehead, cheeks, jawline, periorbital area)</li>
        <li>Neck and décolletage</li>
        <li>Abdomen and flanks</li>
        <li>Arms, thighs, and knees</li>
        <li>Buttocks</li>
        <li>Areas with acne scarring or stretch marks</li>
      </ul>
      
      <h3>3. EXPECTED BENEFITS</h3>
      <p>Potential benefits include:</p>
      <ul>
        <li>Skin tightening and lifting</li>
        <li>Reduction of fine lines and wrinkles</li>
        <li>Improvement in skin texture and tone</li>
        <li>Reduction of acne scars and other scarring</li>
        <li>Fat remodeling (with deeper settings)</li>
        <li>Reduction of stretch marks</li>
        <li>Overall skin rejuvenation</li>
      </ul>
      
      <h3>4. RISKS AND SIDE EFFECTS</h3>
      <p>I understand the following risks may occur:</p>
      <ul>
        <li><strong>Common (Expected):</strong> Redness, swelling, warmth, pinpoint bleeding, crusting, mild bruising lasting 3-7 days</li>
        <li><strong>Less Common:</strong> Prolonged redness or swelling, hyperpigmentation (especially in darker skin tones), hypopigmentation, infection</li>
        <li><strong>Rare but Serious:</strong> Burns, blistering, scarring (including hypertrophic or keloid scars), nerve damage, fat atrophy (loss), skin texture irregularities, permanent skin color changes</li>
        <li><strong>Procedural:</strong> Discomfort during treatment despite numbing, herpes simplex reactivation (cold sores)</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <p>I confirm that I do NOT have any of the following:</p>
      <ul>
        <li>Active skin infections, wounds, or inflammatory conditions in treatment area</li>
        <li>History of keloid or hypertrophic scarring</li>
        <li>Pacemaker, defibrillator, or other implanted electronic device</li>
        <li>Metal implants in the treatment area</li>
        <li>Pregnancy or breastfeeding</li>
        <li>Use of Accutane (isotretinoin) within the past 6 months</li>
        <li>Active cold sores or history of frequent herpes outbreaks (without prophylaxis)</li>
        <li>Blood clotting disorders or current use of blood thinners</li>
        <li>Autoimmune diseases affecting the skin</li>
        <li>History of poor wound healing</li>
        <li>Current cancer treatment</li>
      </ul>
      
      <h3>6. PRE-TREATMENT INSTRUCTIONS</h3>
      <p>I confirm I have followed all pre-treatment instructions, including:</p>
      <ul>
        <li>Discontinuing retinoids and exfoliating products 5-7 days prior</li>
        <li>Avoiding sun exposure and tanning for 2 weeks prior</li>
        <li>Arriving with clean skin free of makeup and skincare products</li>
        <li>Taking prescribed antiviral medication if I have a history of cold sores</li>
        <li>Avoiding alcohol, aspirin, and NSAIDs for 24-48 hours prior</li>
      </ul>
      
      <h3>7. POST-TREATMENT CARE</h3>
      <p>I agree to follow all post-treatment instructions, including:</p>
      <ul>
        <li>Using only approved healing products for the first 72 hours</li>
        <li>Avoiding direct sun exposure and wearing SPF 30+ sunscreen daily</li>
        <li>Not picking at crusts or scabs</li>
        <li>Avoiding makeup for 24-48 hours</li>
        <li>Avoiding strenuous exercise, saunas, and hot tubs for 48-72 hours</li>
        <li>Sleeping elevated for the first 1-2 nights if face was treated</li>
        <li>Keeping the treatment area clean and hydrated</li>
      </ul>
      
      <h3>8. TREATMENT SERIES</h3>
      <p>I understand that optimal results typically require 1-3 treatment sessions spaced 4-6 weeks apart, depending on the condition being treated. Results develop gradually over 3-6 months as collagen remodeling occurs.</p>
      
      <h3>9. NO GUARANTEE OF RESULTS</h3>
      <p>I understand that individual results vary significantly and no specific outcome can be guaranteed. Some patients may see dramatic improvement while others may see modest results or no improvement.</p>
      
      <h3>10. ALTERNATIVE TREATMENTS</h3>
      <p>I have been informed of alternative treatments including surgical facelift, traditional microneedling, other RF devices, laser resurfacing, and topical skincare. I have chosen to proceed with Morpheus8.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM, ALL MY QUESTIONS HAVE BEEN ANSWERED, AND I VOLUNTARILY CONSENT TO MORPHEUS8 TREATMENT.</strong></p>
    `,
  },

  {
    id: 'rf_microneedling_consent',
    name: 'RF Microneedling Consent (General)',
    shortName: 'RF Microneedling',
    description: 'Consent for radiofrequency microneedling devices',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 21,
    requiredForServices: ['rf-microneedling', 'skin-tightening', 'scarless'],
    content: `
      <h2>INFORMED CONSENT FOR RADIOFREQUENCY MICRONEEDLING</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF PROCEDURE</h3>
      <p>Radiofrequency (RF) microneedling is an advanced skin rejuvenation treatment that combines traditional microneedling with radiofrequency energy. Insulated or non-insulated needles penetrate the skin while delivering controlled RF energy to heat the deeper layers of tissue. This dual-action treatment stimulates natural collagen and elastin production while tightening existing collagen fibers.</p>
      
      <h3>2. DEVICES</h3>
      <p>This consent covers RF microneedling devices which may include but are not limited to: Morpheus8, Vivace, Potenza, Genius, Virtue RF, Secret RF, or similar devices. The specific device used will be discussed prior to treatment.</p>
      
      <h3>3. EXPECTED BENEFITS</h3>
      <ul>
        <li>Skin tightening and firming</li>
        <li>Wrinkle and fine line reduction</li>
        <li>Improved skin texture and pore size</li>
        <li>Acne scar improvement</li>
        <li>Stretch mark reduction</li>
        <li>Surgical scar improvement</li>
        <li>Overall skin rejuvenation</li>
      </ul>
      
      <h3>4. RISKS AND COMPLICATIONS</h3>
      <ul>
        <li><strong>Expected:</strong> Redness, swelling, pinpoint bleeding, warmth, tightness (3-7 days)</li>
        <li><strong>Possible:</strong> Bruising, prolonged redness, temporary or permanent hyperpigmentation/hypopigmentation, infection, acne flare</li>
        <li><strong>Rare:</strong> Burns, blistering, scarring, nerve damage, fat loss, skin texture changes</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <p>Treatment should NOT be performed if you have:</p>
      <ul>
        <li>Pacemaker or implanted defibrillator</li>
        <li>Metal implants in treatment area</li>
        <li>Pregnancy or nursing</li>
        <li>Active skin infection or inflammation</li>
        <li>History of keloid scarring</li>
        <li>Accutane use within 6 months</li>
        <li>Bleeding disorders or anticoagulant therapy</li>
        <li>Autoimmune skin conditions</li>
      </ul>
      
      <h3>6. TREATMENT PROTOCOL</h3>
      <p>Multiple treatments (typically 3-4) spaced 4-6 weeks apart are recommended for optimal results. Results continue to improve for 3-6 months post-treatment as collagen remodeling occurs.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO RF MICRONEEDLING TREATMENT.</strong></p>
    `,
  },

  {
    id: 'ipl_photofacial_consent',
    name: 'IPL/Photofacial Consent',
    shortName: 'IPL Consent',
    description: 'Consent for Intense Pulsed Light (IPL) treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 22,
    requiredForServices: ['ipl', 'photofacial', 'bbl', 'photorejuvenation'],
    content: `
      <h2>INFORMED CONSENT FOR IPL/PHOTOFACIAL TREATMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENT</h3>
      <p>Intense Pulsed Light (IPL), also known as photofacial or photorejuvenation, uses broad-spectrum light pulses to target and treat various skin concerns. The light energy is absorbed by pigmented lesions (brown spots) and blood vessels (redness), causing them to break down and be naturally eliminated by the body.</p>
      
      <h3>2. INDICATIONS (CONDITIONS TREATED)</h3>
      <ul>
        <li>Sun damage and age spots (hyperpigmentation)</li>
        <li>Freckles and sun freckles</li>
        <li>Rosacea and facial redness</li>
        <li>Broken capillaries and spider veins</li>
        <li>Uneven skin tone</li>
        <li>Mild acne and acne redness</li>
        <li>Fine lines (mild improvement)</li>
      </ul>
      
      <h3>3. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Common:</strong> Redness, warmth, mild swelling (sunburn-like sensation), darkening of pigmented spots before they flake off</li>
        <li><strong>Less Common:</strong> Blistering, crusting, bruising, prolonged redness</li>
        <li><strong>Rare:</strong> Burns, scarring, permanent hyperpigmentation or hypopigmentation, eye injury (if protective eyewear not used properly)</li>
      </ul>
      
      <h3>4. CRITICAL PRE-TREATMENT REQUIREMENTS</h3>
      <div class="important-notice">
        <p><strong>SUN EXPOSURE WARNING:</strong> You MUST avoid sun exposure, tanning beds, and self-tanners for a minimum of 2-4 weeks before AND after treatment. Treatment CANNOT be performed on tanned skin due to increased risk of burns and pigmentation changes.</p>
      </div>
      <ul>
        <li>No active tan or recent sun exposure</li>
        <li>Discontinue retinoids 5-7 days prior</li>
        <li>Discontinue photosensitizing medications as advised</li>
        <li>Inform provider of any herpes simplex history</li>
        <li>Arrive with clean skin, no makeup</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <ul>
        <li>Pregnancy</li>
        <li>Recent tan or sun exposure</li>
        <li>Use of photosensitizing medications (certain antibiotics, Accutane)</li>
        <li>Active herpes outbreak in treatment area</li>
        <li>History of keloid scarring</li>
        <li>Seizure disorders triggered by light</li>
        <li>Skin cancer in treatment area</li>
        <li>Very dark skin types (higher risk of pigmentation changes)</li>
      </ul>
      
      <h3>6. TREATMENT SERIES</h3>
      <p>Most conditions require 3-6 treatment sessions spaced 3-4 weeks apart for optimal results. Maintenance treatments may be needed 1-2 times per year.</p>
      
      <h3>7. EYE PROTECTION</h3>
      <p>I understand that proper eye protection is MANDATORY during IPL treatment. I agree to keep my eyes closed and wear the protective eyewear provided at all times.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO IPL/PHOTOFACIAL TREATMENT.</strong></p>
    `,
  },

  {
    id: 'laser_hair_removal_consent',
    name: 'Laser Hair Removal Consent',
    shortName: 'Laser Hair Removal',
    description: 'Consent for laser hair removal treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 23,
    requiredForServices: ['laser-hair-removal', 'hair-removal', 'laser-hair'],
    content: `
      <h2>INFORMED CONSENT FOR LASER HAIR REMOVAL</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF PROCEDURE</h3>
      <p>Laser hair removal uses concentrated light energy to target and destroy hair follicles. The laser is attracted to melanin (pigment) in the hair, which heats and damages the follicle to prevent or reduce future hair growth. Multiple treatments are required as hair grows in cycles, and the laser can only effectively treat hair in the active growth (anagen) phase.</p>
      
      <h3>2. REALISTIC EXPECTATIONS</h3>
      <ul>
        <li>Laser hair removal provides <strong>permanent hair REDUCTION</strong>, not complete permanent removal</li>
        <li>Most patients achieve 70-90% reduction after completing a full series</li>
        <li>6-8+ treatments are typically required, spaced 4-8 weeks apart depending on body area</li>
        <li>Annual maintenance treatments may be needed</li>
        <li>Results vary based on hair color, skin type, hormones, and treatment area</li>
        <li>Light-colored (blonde, gray, white, red) hair does NOT respond well to laser treatment</li>
      </ul>
      
      <h3>3. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Common:</strong> Redness, swelling, warmth (like mild sunburn), temporary skin sensitivity</li>
        <li><strong>Less Common:</strong> Blistering, crusting, temporary hyperpigmentation (darkening) or hypopigmentation (lightening)</li>
        <li><strong>Rare:</strong> Burns, permanent pigment changes, scarring, paradoxical hair growth (more hair growth)</li>
        <li><strong>Area-specific:</strong> Eye injury if treating near eyes without proper protection</li>
      </ul>
      
      <h3>4. PRE-TREATMENT REQUIREMENTS</h3>
      <ul>
        <li><strong>SHAVE</strong> the treatment area 24 hours before appointment</li>
        <li><strong>NO WAXING, PLUCKING, OR THREADING</strong> for 4-6 weeks before treatment (the hair root must be present)</li>
        <li><strong>NO SUN EXPOSURE OR TANNING</strong> for 2-4 weeks before and after treatment</li>
        <li>Discontinue retinoids and exfoliating products 5-7 days prior</li>
        <li>Arrive with clean skin, no lotions, deodorant, or makeup on treatment area</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <ul>
        <li>Active tan or recent sun exposure</li>
        <li>Pregnancy</li>
        <li>Use of photosensitizing medications</li>
        <li>Accutane use within 6 months</li>
        <li>Active skin infection in treatment area</li>
        <li>History of keloid scarring</li>
        <li>Seizure disorders triggered by light</li>
        <li>Tattoos in treatment area (laser will damage tattoo)</li>
      </ul>
      
      <h3>6. HORMONAL CONSIDERATIONS</h3>
      <p>Hormonal conditions (PCOS, menopause, certain medications) may affect treatment results and may cause new hair growth in treated areas. Additional maintenance treatments may be needed.</p>
      
      <h3>7. POST-TREATMENT CARE</h3>
      <ul>
        <li>Apply cool compresses if needed for comfort</li>
        <li>Use SPF 30+ sunscreen daily on treated areas</li>
        <li>Avoid sun exposure, hot baths, saunas, and exercise for 24-48 hours</li>
        <li>Shedding of treated hairs will occur 1-3 weeks post-treatment (this is normal)</li>
        <li>Do not wax, pluck, or tweeze between sessions—shaving only</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO LASER HAIR REMOVAL TREATMENT.</strong></p>
    `,
  },

  {
    id: 'laser_skin_resurfacing_consent',
    name: 'Laser Skin Resurfacing Consent',
    shortName: 'Laser Resurfacing',
    description: 'Consent for ablative and non-ablative laser skin resurfacing',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 24,
    requiredForServices: ['laser-resurfacing', 'co2-laser', 'erbium-laser', 'fraxel', 'halo'],
    content: `
      <h2>INFORMED CONSENT FOR LASER SKIN RESURFACING</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF PROCEDURE</h3>
      <p>Laser skin resurfacing uses laser energy to remove damaged outer skin layers and stimulate new collagen formation in the deeper layers. This treatment can range from mild (non-ablative) to aggressive (ablative) depending on your skin concerns and desired downtime.</p>
      
      <h3>2. TYPES OF LASER RESURFACING</h3>
      <ul>
        <li><strong>Non-ablative (gentler):</strong> Heats tissue without removing skin layers; minimal downtime</li>
        <li><strong>Fractional:</strong> Creates microscopic treatment zones; moderate downtime</li>
        <li><strong>Ablative (more aggressive):</strong> Removes outer skin layers; significant downtime but more dramatic results</li>
      </ul>
      
      <h3>3. INDICATIONS</h3>
      <ul>
        <li>Fine lines and wrinkles</li>
        <li>Sun damage and age spots</li>
        <li>Acne scars and surgical scars</li>
        <li>Uneven skin texture and tone</li>
        <li>Enlarged pores</li>
        <li>Skin laxity</li>
      </ul>
      
      <h3>4. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Expected:</strong> Redness, swelling, peeling, warmth, tightness (duration depends on treatment intensity)</li>
        <li><strong>Possible:</strong> Prolonged redness (weeks to months), hyperpigmentation, hypopigmentation, infection, acne flare, milia (small white bumps)</li>
        <li><strong>Rare but Serious:</strong> Scarring, permanent pigment changes, ectropion (eyelid pulling), delayed wound healing, herpes reactivation</li>
      </ul>
      
      <h3>5. RECOVERY AND DOWNTIME</h3>
      <p>Recovery varies significantly based on treatment type:</p>
      <ul>
        <li><strong>Non-ablative:</strong> 1-3 days of redness</li>
        <li><strong>Fractional:</strong> 3-7 days of redness, peeling</li>
        <li><strong>Ablative:</strong> 7-14+ days; skin will weep, crust, and peel; significant redness may persist weeks to months</li>
      </ul>
      
      <h3>6. CRITICAL POST-TREATMENT CARE</h3>
      <ul>
        <li>Keep treated area clean and moisturized</li>
        <li>Use only approved products as directed</li>
        <li>STRICT sun avoidance for 2-4 weeks minimum; SPF 30+ required daily for months</li>
        <li>Do not pick or peel flaking skin</li>
        <li>Take prescribed antiviral medication if provided</li>
        <li>Report any signs of infection immediately</li>
      </ul>
      
      <h3>7. CONTRAINDICATIONS</h3>
      <ul>
        <li>Active tan or recent sun exposure</li>
        <li>Pregnancy or nursing</li>
        <li>Accutane use within 6-12 months</li>
        <li>Active skin infection</li>
        <li>History of keloid scarring</li>
        <li>Immunocompromised state</li>
        <li>Unrealistic expectations regarding results or downtime</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM, INCLUDING THE RISKS AND EXPECTED DOWNTIME, AND I VOLUNTARILY CONSENT TO LASER SKIN RESURFACING.</strong></p>
    `,
  },

  {
    id: 'prp_prf_consent',
    name: 'PRP/PRF Treatment Consent',
    shortName: 'PRP/PRF Consent',
    description: 'Consent for Platelet-Rich Plasma and Platelet-Rich Fibrin treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 25,
    requiredForServices: ['prp', 'prf', 'vampire-facial', 'hair-restoration', 'prp-injections'],
    content: `
      <h2>INFORMED CONSENT FOR PRP/PRF TREATMENTS</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENT</h3>
      <p>Platelet-Rich Plasma (PRP) and Platelet-Rich Fibrin (PRF) treatments use your own blood components to stimulate healing and rejuvenation. A small amount of blood is drawn, processed to concentrate platelets and growth factors, and then applied to the treatment area via injection, topically with microneedling, or both.</p>
      
      <h3>2. APPLICATIONS</h3>
      <ul>
        <li><strong>Facial Rejuvenation (Vampire Facial):</strong> PRP/PRF applied with microneedling for skin texture, tone, and collagen stimulation</li>
        <li><strong>Hair Restoration:</strong> PRP/PRF injected into scalp to stimulate hair follicles</li>
        <li><strong>Under-Eye Rejuvenation:</strong> PRF injected to improve dark circles and hollowing</li>
        <li><strong>Scar Treatment:</strong> PRP/PRF to improve acne scars and other scarring</li>
        <li><strong>Joint/Muscle Therapy:</strong> PRP for pain and healing (if offered)</li>
      </ul>
      
      <h3>3. EXPECTED BENEFITS</h3>
      <ul>
        <li>Natural rejuvenation using your own growth factors</li>
        <li>Improved skin texture and tone</li>
        <li>Reduced appearance of fine lines</li>
        <li>Hair growth stimulation (for hair restoration)</li>
        <li>Minimal risk of allergic reaction (uses your own blood)</li>
      </ul>
      
      <h3>4. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>From Blood Draw:</strong> Bruising, soreness, lightheadedness, fainting, infection at draw site</li>
        <li><strong>From Treatment:</strong> Redness, swelling, bruising, tenderness, headache (for scalp), temporary lumpiness</li>
        <li><strong>Less Common:</strong> Infection, scarring, prolonged swelling, nerve damage, unsatisfactory results</li>
        <li><strong>Note:</strong> PRP/PRF relies on your body's own healing response; results vary significantly between individuals</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <ul>
        <li>Blood disorders or platelet dysfunction</li>
        <li>Current anticoagulant therapy (blood thinners)</li>
        <li>Active infections or illness</li>
        <li>Cancer, especially blood-related cancers</li>
        <li>Pregnancy or nursing</li>
        <li>Chronic liver disease</li>
        <li>Low platelet count</li>
        <li>HIV, Hepatitis B or C</li>
        <li>Use of NSAIDs or aspirin within 48-72 hours (may affect platelet function)</li>
      </ul>
      
      <h3>6. TREATMENT SERIES</h3>
      <p>Most patients require a series of 3-4 treatments spaced 4-6 weeks apart for optimal results. Maintenance treatments every 6-12 months may be recommended.</p>
      
      <h3>7. HYDRATION</h3>
      <p>I understand the importance of being well-hydrated before my blood draw. I will drink plenty of water in the 24 hours before my appointment.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO PRP/PRF TREATMENT.</strong></p>
    `,
  },

  {
    id: 'iv_therapy_consent',
    name: 'IV Vitamin Therapy Consent',
    shortName: 'IV Therapy Consent',
    description: 'Consent for IV vitamin drips and infusions',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 26,
    requiredForServices: ['iv-therapy', 'iv-drip', 'vitamin-drip', 'myers-cocktail', 'nad'],
    content: `
      <h2>INFORMED CONSENT FOR IV VITAMIN THERAPY</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENT</h3>
      <p>IV (Intravenous) Vitamin Therapy delivers vitamins, minerals, antioxidants, and other nutrients directly into the bloodstream through an IV catheter. This bypasses the digestive system, allowing for higher absorption rates than oral supplements.</p>
      
      <h3>2. COMMON IV FORMULATIONS</h3>
      <ul>
        <li><strong>Myers' Cocktail:</strong> B vitamins, Vitamin C, Magnesium, Calcium</li>
        <li><strong>Hydration Drip:</strong> Electrolytes and fluids</li>
        <li><strong>Immune Boost:</strong> High-dose Vitamin C, Zinc, B vitamins</li>
        <li><strong>Beauty/Glow:</strong> Biotin, Glutathione, Vitamin C</li>
        <li><strong>NAD+:</strong> Nicotinamide Adenine Dinucleotide for cellular energy</li>
        <li><strong>Athletic Recovery:</strong> Amino acids, B vitamins, minerals</li>
      </ul>
      
      <h3>3. POTENTIAL BENEFITS</h3>
      <ul>
        <li>Rapid rehydration</li>
        <li>Increased energy</li>
        <li>Immune system support</li>
        <li>Improved skin appearance</li>
        <li>Hangover relief</li>
        <li>Athletic recovery</li>
      </ul>
      <p><strong>Note:</strong> These benefits are based on general nutrition science. IV therapy is not intended to diagnose, treat, cure, or prevent any disease. Results vary by individual.</p>
      
      <h3>4. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Common:</strong> Mild discomfort during IV insertion, bruising at IV site, cool sensation during infusion, temporary flushing</li>
        <li><strong>Less Common:</strong> Vein inflammation (phlebitis), infection at IV site, allergic reaction, nausea, headache, dizziness</li>
        <li><strong>Rare but Serious:</strong> Air embolism, electrolyte imbalance, fluid overload, severe allergic reaction (anaphylaxis), cardiac arrhythmia (with certain minerals)</li>
        <li><strong>NAD+ Specific:</strong> Chest tightness, nausea, cramping during infusion (rate-dependent)</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <ul>
        <li>Congestive heart failure or kidney disease (risk of fluid overload)</li>
        <li>Allergy to any components of the IV formulation</li>
        <li>G6PD deficiency (for high-dose Vitamin C)</li>
        <li>Hemochromatosis (iron overload disorders)</li>
        <li>Active infection at potential IV sites</li>
        <li>Pregnancy (certain formulations only)</li>
        <li>Currently on certain medications that may interact (e.g., chemotherapy)</li>
      </ul>
      
      <h3>6. MEDICAL HISTORY DISCLOSURE</h3>
      <p>I confirm I have disclosed all relevant medical conditions, medications, supplements, and allergies. I understand that incomplete information could affect my safety.</p>
      
      <h3>7. POST-TREATMENT</h3>
      <ul>
        <li>Keep IV site bandaged for 1 hour; monitor for signs of infection</li>
        <li>Stay hydrated after treatment</li>
        <li>Report any unusual symptoms immediately</li>
      </ul>
      
      <h3>8. NOT A SUBSTITUTE FOR MEDICAL CARE</h3>
      <p>I understand that IV vitamin therapy is a wellness service and is NOT a substitute for evaluation and treatment by a physician. I should consult my primary care provider for any concerning symptoms or medical conditions.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO IV VITAMIN THERAPY.</strong></p>
    `,
  },

  {
    id: 'bhrt_consent',
    name: 'Bioidentical Hormone Therapy Consent',
    shortName: 'BHRT Consent',
    description: 'Consent for BioTE and other bioidentical hormone replacement therapy',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 180,
    order: 27,
    requiredForServices: ['bhrt', 'biote', 'hormone-therapy', 'pellet-therapy', 'testosterone'],
    content: `
      <h2>INFORMED CONSENT FOR BIOIDENTICAL HORMONE REPLACEMENT THERAPY (BHRT)</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENT</h3>
      <p>Bioidentical Hormone Replacement Therapy (BHRT) uses hormones that are chemically identical to those produced by the human body. Hormones may be delivered via subcutaneous pellets (such as BioTE), injections, creams, or other methods. The goal is to restore hormone levels to optimal ranges to address symptoms of hormonal imbalance.</p>
      
      <h3>2. HORMONES THAT MAY BE PRESCRIBED</h3>
      <ul>
        <li><strong>Testosterone:</strong> For energy, libido, muscle mass, mood (men and women)</li>
        <li><strong>Estrogen:</strong> For hot flashes, vaginal dryness, bone health (women)</li>
        <li><strong>Progesterone:</strong> For sleep, mood, uterine protection (women)</li>
        <li><strong>DHEA:</strong> For energy and hormone precursor support</li>
        <li><strong>Thyroid hormones:</strong> For metabolism support (if indicated)</li>
      </ul>
      
      <h3>3. PELLET INSERTION PROCEDURE</h3>
      <p>For pellet therapy, small hormone pellets are inserted under the skin (typically in the hip/buttock area) through a small incision under local anesthesia. Pellets dissolve over 3-6 months, providing steady hormone release.</p>
      
      <h3>4. POTENTIAL BENEFITS</h3>
      <ul>
        <li>Increased energy and reduced fatigue</li>
        <li>Improved mood and mental clarity</li>
        <li>Enhanced libido and sexual function</li>
        <li>Better sleep quality</li>
        <li>Increased muscle mass and strength</li>
        <li>Improved bone density</li>
        <li>Reduced hot flashes and night sweats</li>
        <li>Weight management support</li>
      </ul>
      
      <h3>5. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Pellet Insertion Site:</strong> Bruising, swelling, infection, pellet extrusion, scarring</li>
        <li><strong>Testosterone (Women):</strong> Acne, facial hair growth, deepening voice (usually dose-dependent and reversible), hair thinning on scalp, clitoral enlargement</li>
        <li><strong>Testosterone (Men):</strong> Acne, testicular shrinkage, increased red blood cell count, potential prostate effects, mood changes, hair loss</li>
        <li><strong>Estrogen:</strong> Breast tenderness, bloating, mood changes, increased clotting risk, potential breast/uterine concerns</li>
        <li><strong>General:</strong> Hormone levels may fluctuate; dosing adjustments may be needed</li>
      </ul>
      
      <h3>6. SERIOUS RISKS (RARE)</h3>
      <div class="warning-box">
        <ul>
          <li>Blood clots (deep vein thrombosis, pulmonary embolism)</li>
          <li>Stroke or heart attack (particularly with certain risk factors)</li>
          <li>Potential increased risk of certain cancers (breast, prostate, uterine) - research is ongoing</li>
          <li>Liver issues (rare with pellets)</li>
          <li>Polycythemia (elevated red blood cells) with testosterone</li>
        </ul>
      </div>
      
      <h3>7. REQUIRED MONITORING</h3>
      <p>I understand that regular blood work and follow-up appointments are REQUIRED to monitor hormone levels and ensure safety. I commit to:</p>
      <ul>
        <li>Pre-treatment lab work</li>
        <li>Follow-up labs approximately 4-6 weeks after pellet insertion</li>
        <li>Regular monitoring labs every 3-6 months</li>
        <li>Annual comprehensive lab panel</li>
        <li>Reporting any concerning symptoms immediately</li>
      </ul>
      
      <h3>8. CONTRAINDICATIONS</h3>
      <ul>
        <li>Personal history of hormone-sensitive cancers (breast, prostate, uterine)</li>
        <li>Active or history of blood clots</li>
        <li>Active liver disease</li>
        <li>Undiagnosed vaginal bleeding</li>
        <li>Pregnancy or nursing</li>
        <li>Allergy to any component of the hormone preparation</li>
      </ul>
      
      <h3>9. POST-PELLET INSERTION INSTRUCTIONS</h3>
      <ul>
        <li>Keep insertion site dry for 24-48 hours</li>
        <li>No strenuous lower body exercise for 72 hours</li>
        <li>No swimming, baths, or hot tubs for 5-7 days</li>
        <li>Monitor for signs of infection (increasing redness, warmth, drainage, fever)</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM, INCLUDING THE REQUIREMENT FOR ONGOING MONITORING, AND I VOLUNTARILY CONSENT TO BHRT.</strong></p>
    `,
  },

  {
    id: 'hydrafacial_consent',
    name: 'HydraFacial Consent',
    shortName: 'HydraFacial',
    description: 'Consent for HydraFacial treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 28,
    requiredForServices: ['hydrafacial', 'hydra-facial', 'aqua-facial'],
    content: `
      <h2>INFORMED CONSENT FOR HYDRAFACIAL TREATMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENT</h3>
      <p>HydraFacial is a multi-step facial treatment that uses patented technology to cleanse, extract, and hydrate the skin. The treatment combines exfoliation, deep cleansing, extraction, and infusion of serums using a specialized device with vortex technology.</p>
      
      <h3>2. TREATMENT STEPS</h3>
      <ul>
        <li><strong>Cleanse + Peel:</strong> Gentle exfoliation to resurface the skin</li>
        <li><strong>Extract + Hydrate:</strong> Painless suction to remove debris from pores while infusing hydrating serums</li>
        <li><strong>Fuse + Protect:</strong> Antioxidants and peptides to maximize glow</li>
        <li><strong>Optional Boosters:</strong> Targeted serums for specific concerns (pigmentation, aging, etc.)</li>
      </ul>
      
      <h3>3. EXPECTED BENEFITS</h3>
      <ul>
        <li>Improved skin texture and tone</li>
        <li>Reduced appearance of fine lines</li>
        <li>Clearer, less congested pores</li>
        <li>Improved hydration</li>
        <li>Brighter, more radiant skin</li>
        <li>No downtime—immediate glow</li>
      </ul>
      
      <h3>4. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Common:</strong> Mild redness (usually resolves within hours), temporary tightness, slight sensitivity</li>
        <li><strong>Uncommon:</strong> Breakouts (purging), allergic reaction to serums, prolonged redness</li>
        <li><strong>Rare:</strong> Infection, scarring, hyperpigmentation</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <ul>
        <li>Active rashes, sunburn, or open wounds on face</li>
        <li>Active cold sores or herpes outbreak</li>
        <li>Recent facial procedures (consult provider)</li>
        <li>Allergy to any ingredients in the serums used</li>
        <li>Rosacea (certain steps may be modified or avoided)</li>
        <li>Pregnancy (certain serums may be avoided)</li>
      </ul>
      
      <h3>6. POST-TREATMENT CARE</h3>
      <ul>
        <li>Avoid direct sun exposure and wear SPF for 48 hours</li>
        <li>Avoid harsh products, retinoids, and exfoliants for 24-48 hours</li>
        <li>Stay hydrated</li>
        <li>Makeup can typically be applied immediately</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO HYDRAFACIAL TREATMENT.</strong></p>
    `,
  },

  {
    id: 'dermaplaning_consent',
    name: 'Dermaplaning Consent',
    shortName: 'Dermaplaning',
    description: 'Consent for dermaplaning treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 29,
    requiredForServices: ['dermaplaning', 'dermaplane'],
    content: `
      <h2>INFORMED CONSENT FOR DERMAPLANING</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENT</h3>
      <p>Dermaplaning is a manual exfoliation treatment that uses a sterile surgical scalpel to gently scrape the surface of the skin. This removes dead skin cells and fine vellus hair (peach fuzz), revealing smoother, brighter skin underneath and allowing for better product penetration.</p>
      
      <h3>2. EXPECTED BENEFITS</h3>
      <ul>
        <li>Smoother skin texture</li>
        <li>Removal of peach fuzz for smoother makeup application</li>
        <li>Brighter, more radiant complexion</li>
        <li>Enhanced product absorption</li>
        <li>Reduced appearance of superficial acne scars</li>
        <li>No downtime</li>
      </ul>
      
      <h3>3. COMMON MYTH ADDRESSED</h3>
      <p><strong>Hair will NOT grow back thicker or darker.</strong> Vellus hair (peach fuzz) is cut at the surface and will grow back the same as before. This is scientifically proven and dermaplaning does not change the hair follicle.</p>
      
      <h3>4. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Common:</strong> Mild redness (usually resolves within hours), slight skin sensitivity</li>
        <li><strong>Uncommon:</strong> Small nicks or cuts (rare with trained provider), breakouts, irritation</li>
        <li><strong>Rare:</strong> Infection, scarring, hyperpigmentation</li>
      </ul>
      
      <h3>5. CONTRAINDICATIONS</h3>
      <ul>
        <li>Active acne (inflamed pustules or cysts)</li>
        <li>Active rosacea flare</li>
        <li>Active eczema or psoriasis on face</li>
        <li>Open wounds, cuts, or sunburn</li>
        <li>Active cold sores</li>
        <li>Recent chemical peel or laser treatment (wait period required)</li>
        <li>Use of blood thinners (increased bleeding risk)</li>
        <li>Accutane use within 6 months</li>
      </ul>
      
      <h3>6. POST-TREATMENT CARE</h3>
      <ul>
        <li>Avoid direct sun exposure and wear SPF 30+</li>
        <li>Avoid harsh products, retinoids, and acids for 3-5 days</li>
        <li>Keep skin hydrated</li>
        <li>Avoid touching face unnecessarily</li>
        <li>Makeup can typically be applied after treatment</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO DERMAPLANING TREATMENT.</strong></p>
    `,
  },

  {
    id: 'lash_brow_consent',
    name: 'Lash & Brow Services Consent',
    shortName: 'Lash/Brow Consent',
    description: 'Consent for lash extensions, lifts, brow lamination, and tinting',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 30,
    requiredForServices: ['lash', 'lash-extensions', 'lash-lift', 'brow', 'brow-lamination', 'lash-spa', 'brow-spa'],
    content: `
      <h2>INFORMED CONSENT FOR LASH & BROW SERVICES</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>SERVICES COVERED</h3>
      <ul>
        <li>Eyelash Extensions (Classic, Volume, Hybrid)</li>
        <li>Lash Lift and Tint</li>
        <li>Brow Lamination</li>
        <li>Brow Tinting</li>
        <li>Brow Shaping/Waxing</li>
        <li>Lash & Brow Fills</li>
      </ul>
      
      <h3>1. EYELASH EXTENSIONS</h3>
      <p><strong>Description:</strong> Individual synthetic or mink lash fibers are adhered to natural lashes using professional-grade adhesive.</p>
      <p><strong>Risks:</strong></p>
      <ul>
        <li>Allergic reaction to adhesive (itching, redness, swelling)</li>
        <li>Eye irritation or sensitivity</li>
        <li>Natural lash damage if improperly applied or removed</li>
        <li>Infection (rare, from poor aftercare)</li>
        <li>Temporary lash loss</li>
      </ul>
      <p><strong>Aftercare Requirements:</strong></p>
      <ul>
        <li>Avoid water/steam for 24-48 hours</li>
        <li>No oil-based products near eyes</li>
        <li>Avoid rubbing eyes</li>
        <li>Brush lashes daily</li>
        <li>Fill appointments every 2-3 weeks</li>
      </ul>
      
      <h3>2. LASH LIFT</h3>
      <p><strong>Description:</strong> Chemical solution lifts and curls natural lashes from the root.</p>
      <p><strong>Risks:</strong></p>
      <ul>
        <li>Allergic reaction to lifting solution</li>
        <li>Over-processing (frizzy or damaged lashes)</li>
        <li>Eye irritation</li>
        <li>Uneven curl</li>
      </ul>
      
      <h3>3. BROW LAMINATION</h3>
      <p><strong>Description:</strong> Chemical solution restructures brow hairs for a fuller, brushed-up look.</p>
      <p><strong>Risks:</strong></p>
      <ul>
        <li>Allergic reaction to solution</li>
        <li>Skin irritation or sensitivity</li>
        <li>Over-processing (brittle brow hairs)</li>
      </ul>
      
      <h3>4. TINTING</h3>
      <p><strong>Description:</strong> Semi-permanent dye applied to lashes or brows.</p>
      <p><strong>Risks:</strong></p>
      <ul>
        <li>Allergic reaction to dye</li>
        <li>Eye/skin irritation</li>
        <li>Color may not match expectations</li>
      </ul>
      
      <h3>5. PATCH TEST RECOMMENDATION</h3>
      <p>For first-time clients, a patch test 24-48 hours before service is recommended to check for allergic reactions. I understand that declining a patch test increases my risk of allergic reaction.</p>
      
      <h3>6. CONTRAINDICATIONS</h3>
      <ul>
        <li>Active eye infection or stye</li>
        <li>Recent eye surgery (consult surgeon)</li>
        <li>Chemotherapy (may affect lash retention)</li>
        <li>Trichotillomania (hair-pulling disorder)</li>
        <li>Known allergy to adhesive, latex, or dye components</li>
        <li>Blepharitis or severe dry eye</li>
      </ul>
      
      <h3>7. CONSENT FOR EYE AREA WORK</h3>
      <p>I understand that services performed around the eye area carry inherent risks. I will keep my eyes closed during treatment and follow all provider instructions.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO LASH AND/OR BROW SERVICES.</strong></p>
    `,
  },

  {
    id: 'body_contouring_consent',
    name: 'Body Contouring Consent',
    shortName: 'Body Contouring',
    description: 'Consent for non-surgical body contouring treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 31,
    requiredForServices: ['body-contouring', 'coolsculpting', 'emsculpt', 'cavitation', 'body-spa'],
    content: `
      <h2>INFORMED CONSENT FOR NON-SURGICAL BODY CONTOURING</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENTS</h3>
      <p>Non-surgical body contouring uses various technologies to reduce fat, tighten skin, and/or build muscle without surgery. Specific treatments may include:</p>
      <ul>
        <li><strong>Cryolipolysis (e.g., CoolSculpting):</strong> Freezes and destroys fat cells</li>
        <li><strong>RF Body Tightening:</strong> Heats tissue to stimulate collagen and tighten skin</li>
        <li><strong>Ultrasonic Cavitation:</strong> Uses ultrasound to break down fat cells</li>
        <li><strong>Muscle Stimulation (e.g., Emsculpt):</strong> Electromagnetic energy to contract muscles</li>
        <li><strong>Laser Lipolysis:</strong> Laser energy to target fat</li>
      </ul>
      
      <h3>2. REALISTIC EXPECTATIONS</h3>
      <ul>
        <li>Body contouring is NOT weight loss—it targets specific areas of stubborn fat</li>
        <li>Best results in patients at or near their goal weight</li>
        <li>Multiple treatments typically required</li>
        <li>Results develop gradually over weeks to months</li>
        <li>Maintaining results requires healthy lifestyle</li>
      </ul>
      
      <h3>3. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Common:</strong> Redness, swelling, tenderness, bruising, numbness, tingling (temporary)</li>
        <li><strong>Less Common:</strong> Prolonged numbness or pain, skin irregularities, blistering</li>
        <li><strong>Rare:</strong> Burns, nerve damage, paradoxical adipose hyperplasia (fat growth instead of reduction with cryolipolysis), hernia (with muscle stimulation if pre-existing weakness)</li>
      </ul>
      
      <h3>4. CONTRAINDICATIONS</h3>
      <ul>
        <li>Pregnancy or nursing</li>
        <li>Pacemaker or electronic implant (for RF/electromagnetic treatments)</li>
        <li>Metal implants in treatment area</li>
        <li>Cryoglobulinemia or cold urticaria (for cryolipolysis)</li>
        <li>Hernia in treatment area (for muscle stimulation)</li>
        <li>Recent surgery in treatment area</li>
        <li>Active skin infection or inflammation</li>
        <li>Bleeding disorders</li>
      </ul>
      
      <h3>5. POST-TREATMENT</h3>
      <ul>
        <li>Stay hydrated to help body process eliminated fat</li>
        <li>Mild massage of treated area may be recommended</li>
        <li>Maintain healthy diet and exercise for optimal results</li>
        <li>Avoid extreme temperatures on treated area for 24-48 hours</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO BODY CONTOURING TREATMENT.</strong></p>
    `,
  },

  {
    id: 'kybella_consent',
    name: 'Kybella Consent',
    shortName: 'Kybella',
    description: 'Consent for Kybella (deoxycholic acid) injection for submental fat',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 32,
    requiredForServices: ['kybella', 'double-chin', 'submental-fat'],
    content: `
      <h2>INFORMED CONSENT FOR KYBELLA® (DEOXYCHOLIC ACID) INJECTION</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF TREATMENT</h3>
      <p>Kybella® is an FDA-approved injectable treatment for reduction of moderate to severe submental fat (double chin). The active ingredient, synthetic deoxycholic acid, destroys fat cells when injected into the fat beneath the chin. Once destroyed, these cells can no longer store or accumulate fat.</p>
      
      <h3>2. TREATMENT PROTOCOL</h3>
      <ul>
        <li>Multiple small injections are administered in a grid pattern under the chin</li>
        <li>Most patients require 2-4 treatment sessions</li>
        <li>Sessions are spaced at least 1 month apart</li>
        <li>Maximum of 6 treatment sessions</li>
      </ul>
      
      <h3>3. EXPECTED BENEFITS</h3>
      <ul>
        <li>Permanent reduction of submental fat</li>
        <li>Improved chin profile</li>
        <li>Non-surgical alternative to liposuction</li>
        <li>Fat cells destroyed do not return</li>
      </ul>
      
      <h3>4. EXPECTED SIDE EFFECTS</h3>
      <p>The following side effects are common and expected:</p>
      <ul>
        <li><strong>Swelling:</strong> Significant swelling under the chin lasting 1-2 weeks (may be substantial—"bullfrog" appearance)</li>
        <li><strong>Bruising:</strong> Common, may last 1-2 weeks</li>
        <li><strong>Pain/Tenderness:</strong> At injection site, lasting days to weeks</li>
        <li><strong>Numbness:</strong> Temporary numbness in treatment area</li>
        <li><strong>Redness and Hardness:</strong> In treatment area</li>
      </ul>
      
      <h3>5. SERIOUS RISKS (RARE)</h3>
      <div class="warning-box">
        <ul>
          <li><strong>Nerve injury:</strong> Can cause facial muscle weakness, asymmetric smile, or difficulty swallowing (usually temporary but may be permanent)</li>
          <li><strong>Injection site problems:</strong> Ulceration, necrosis (tissue death), scarring</li>
          <li><strong>Dysphagia:</strong> Trouble swallowing</li>
          <li><strong>Severe allergic reaction</strong></li>
        </ul>
      </div>
      
      <h3>6. CONTRAINDICATIONS</h3>
      <ul>
        <li>Infection at treatment site</li>
        <li>Pregnancy or nursing</li>
        <li>Previous surgical or aesthetic procedures in treatment area that may have altered anatomy</li>
        <li>Difficulty swallowing</li>
        <li>Excessive skin laxity (may need surgical approach)</li>
        <li>Bleeding disorders or anticoagulant therapy</li>
      </ul>
      
      <h3>7. IMPORTANT TIMING CONSIDERATIONS</h3>
      <p>Due to significant swelling lasting 1-2 weeks, I should NOT schedule Kybella treatment before important events, photos, or travel within 2-3 weeks.</p>
      
      <h3>8. POST-TREATMENT CARE</h3>
      <ul>
        <li>Apply ice to reduce swelling (20 minutes on/20 minutes off)</li>
        <li>Sleep elevated to reduce swelling</li>
        <li>Avoid strenuous activity for 24-48 hours</li>
        <li>Report any difficulty swallowing, facial weakness, or unusual symptoms immediately</li>
      </ul>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM, INCLUDING THE EXPECTED SIGNIFICANT SWELLING AND POTENTIAL SERIOUS RISKS, AND I VOLUNTARILY CONSENT TO KYBELLA TREATMENT.</strong></p>
    `,
  },

  {
    id: 'pdo_threads_consent',
    name: 'PDO Threads Consent',
    shortName: 'PDO Threads',
    description: 'Consent for PDO thread lift treatments',
    version: '1.0',
    lastUpdated: '2026-03-11',
    isRequired: true,
    requiresWitness: false,
    expiresAfterDays: 365,
    order: 33,
    requiredForServices: ['pdo-threads', 'thread-lift', 'threads'],
    content: `
      <h2>INFORMED CONSENT FOR PDO THREAD LIFT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>
      
      <h3>1. DESCRIPTION OF PROCEDURE</h3>
      <p>PDO (Polydioxanone) thread lift is a minimally invasive procedure that uses dissolvable sutures to lift and tighten sagging skin. The threads are inserted under the skin using needles or cannulas. Over time, the threads dissolve while stimulating collagen production for continued improvement.</p>
      
      <h3>2. TYPES OF PDO THREADS</h3>
      <ul>
        <li><strong>Smooth/Mono Threads:</strong> Stimulate collagen; used for skin rejuvenation</li>
        <li><strong>Barbed/Cog Threads:</strong> Have tiny barbs to grip and lift tissue</li>
        <li><strong>Screw/Twist Threads:</strong> Intertwined for volume and support</li>
      </ul>
      
      <h3>3. TREATMENT AREAS</h3>
      <ul>
        <li>Mid-face and cheeks</li>
        <li>Jawline and jowls</li>
        <li>Neck</li>
        <li>Brow</li>
        <li>Nasolabial folds</li>
        <li>Body areas (arms, abdomen, knees)</li>
      </ul>
      
      <h3>4. EXPECTED BENEFITS</h3>
      <ul>
        <li>Immediate lifting effect (with barbed threads)</li>
        <li>Continued improvement over 2-6 months as collagen builds</li>
        <li>Results typically last 12-18 months</li>
        <li>Minimal downtime compared to surgical facelift</li>
        <li>Natural-looking results</li>
      </ul>
      
      <h3>5. RISKS AND SIDE EFFECTS</h3>
      <ul>
        <li><strong>Common:</strong> Bruising, swelling, tenderness, tightness, mild asymmetry (usually resolves)</li>
        <li><strong>Less Common:</strong> Thread visibility or palpability under skin, dimpling, puckering, migration of threads</li>
        <li><strong>Rare but Serious:</strong> Infection, thread extrusion (poking through skin), nerve damage, hematoma, prolonged pain, scarring, granuloma formation</li>
      </ul>
      
      <h3>6. CONTRAINDICATIONS</h3>
      <ul>
        <li>Active skin infection in treatment area</li>
        <li>Bleeding disorders or anticoagulant therapy</li>
        <li>Autoimmune conditions</li>
        <li>History of keloid or hypertrophic scarring</li>
        <li>Pregnancy or nursing</li>
        <li>Allergy to PDO or similar materials</li>
        <li>Previous permanent threads in treatment area</li>
        <li>Severe skin laxity (may require surgical approach)</li>
      </ul>
      
      <h3>7. POST-PROCEDURE INSTRUCTIONS</h3>
      <ul>
        <li>Sleep on back with head elevated for 1 week</li>
        <li>Avoid extreme facial movements, chewing hard foods for 2 weeks</li>
        <li>No facials, massage, or manipulation of treatment area for 3-4 weeks</li>
        <li>Avoid dental procedures for 2 weeks</li>
        <li>No strenuous exercise for 1-2 weeks</li>
        <li>Report any signs of infection, thread extrusion, or severe pain immediately</li>
      </ul>
      
      <h3>8. ADDITIONAL TREATMENTS</h3>
      <p>Threads may be combined with fillers, Botox, or other treatments for enhanced results. Additional touch-up threads may be needed for optimal outcomes.</p>
      
      <p class="signature-block"><strong>BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ AND UNDERSTAND THIS CONSENT FORM AND VOLUNTARILY CONSENT TO PDO THREAD TREATMENT.</strong></p>
    `,
  },

  // ========================
  // VISIT-LEVEL PRE & POST (all services)
  // Use: send same-day pre before treatment; post after treatment same visit.
  // ========================
  {
    id: 'same_day_pre_treatment_confirmation',
    name: 'Same-Day Pre-Treatment Confirmation',
    shortName: 'Pre-Treatment (Visit)',
    description: 'Same-day health confirmation and consent to proceed — use before any service',
    version: '1.0',
    lastUpdated: '2026-03-24',
    isRequired: false,
    requiresWitness: false,
    expiresAfterDays: null,
    phase: 'pre',
    order: 8,
    requiredForServices: [CONSENT_ALL_SERVICES],
    content: `
      <h2>SAME-DAY PRE-TREATMENT CONFIRMATION &amp; CONSENT TO PROCEED</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>

      <div class="important-notice">
        <p><strong>Complete before treatment begins.</strong> This form works together with your procedure-specific informed consent(s) and your general consent on file.</p>
      </div>

      <h3>1. ACCURATE INFORMATION</h3>
      <p>I confirm that the health information I provided today is complete and accurate to the best of my knowledge. I agree to notify my provider immediately if anything changes before or during my visit.</p>

      <h3>2. MEDICATIONS &amp; SUPPLEMENTS</h3>
      <p>I confirm I have disclosed all prescription medications, over-the-counter drugs, supplements, and herbal products relevant to today's treatment. I have not started or stopped any medication since my last disclosure without informing the practice when medically relevant.</p>

      <h3>3. ALLERGIES</h3>
      <p>I have disclosed all known allergies (including to drugs, latex, lidocaine, topical products, metals, and injectable materials). I understand that failure to disclose allergies may increase risk.</p>

      <h3>4. PREGNANCY &amp; NURSING</h3>
      <p>I confirm I am not pregnant, or if I could be pregnant, I have discussed this with my provider. I understand that certain treatments are contraindicated in pregnancy or while nursing and I have disclosed nursing status when asked.</p>

      <h3>5. ALCOHOL, BLOOD THINNERS &amp; PRE-PROCEDURE RULES</h3>
      <p>I confirm I have followed pre-procedure instructions given to me (including restrictions on alcohol, NSAIDs, aspirin, fish oil, or other blood thinners when applicable to today's procedure). If I have not followed instructions, I have told my provider.</p>

      <h3>6. TODAY'S PLAN</h3>
      <p>I understand which procedure(s) or service(s) are planned today, the principal risks and benefits as explained to me, and I have had the opportunity to ask questions. I may refuse or delay treatment.</p>

      <h3>7. CONSENT TO PROCEED</h3>
      <p>I voluntarily consent to proceed with the treatment(s) discussed today, performed by Hello Gorgeous Med Spa and its licensed providers, subject to the informed consent form(s) applicable to my procedure(s).</p>

      <p class="signature-block"><strong>By signing below, I confirm the statements above are true and I consent to proceed with today's planned care.</strong></p>
    `,
  },

  {
    id: 'post_treatment_discharge_acknowledgment',
    name: 'Post-Treatment Discharge Acknowledgment',
    shortName: 'Post-Treatment (Visit)',
    description: 'Acknowledgment of discharge instructions after any service — sign before leaving',
    version: '1.0',
    lastUpdated: '2026-03-24',
    isRequired: false,
    requiresWitness: false,
    expiresAfterDays: null,
    phase: 'post',
    order: 9,
    requiredForServices: [CONSENT_ALL_SERVICES],
    content: `
      <h2>POST-TREATMENT DISCHARGE ACKNOWLEDGMENT</h2>
      <p class="clinic-name"><strong>Hello Gorgeous Med Spa</strong><br>74 W. Washington St, Oswego, IL 60543<br>(630) 636-6193</p>

      <div class="important-notice">
        <p><strong>Complete after your treatment, before you leave.</strong> Applies to injectables, lasers, skin treatments, body services, IV/wellness visits, and other services performed today.</p>
      </div>

      <h3>1. INSTRUCTIONS RECEIVED</h3>
      <p>I acknowledge that I received <strong>verbal</strong> and, when provided, <strong>written</strong> post-treatment instructions appropriate to the service(s) I received today (including activity restrictions, skin care, sun protection, hydration, compression or garment use when applicable, and medication guidance).</p>

      <h3>2. COMMON EFFECTS VS. URGENT SYMPTOMS</h3>
      <p>I understand that mild redness, swelling, tenderness, bruising, or similar effects may be expected depending on my procedure. I understand which symptoms would be unusual or urgent for my treatment and that I should contact the practice or seek emergency care if I experience severe pain, sudden vision changes, difficulty breathing, signs of infection (fever, spreading redness, pus), or other symptoms as explained to me.</p>

      <h3>3. FOLLOW-UP</h3>
      <p>I understand whether a follow-up visit or check-in was recommended and how to reach the practice during business hours. I understand that <strong>911</strong> or the nearest emergency department is appropriate for life-threatening emergencies.</p>

      <h3>4. RESULTS &amp; SATISFACTION</h3>
      <p>I understand that aesthetic and medical results vary by individual, that multiple sessions may be needed, and that no outcome was guaranteed. I had the opportunity to ask questions about my results and aftercare.</p>

      <h3>5. PHOTOGRAPHY (IF APPLICABLE)</h3>
      <p>If clinical photos were taken today for my medical record, I understand they are part of my chart. Use of images for marketing is governed by my separate photo/media authorization, if any.</p>

      <h3>6. ACKNOWLEDGMENT</h3>
      <p>I confirm I am not under the influence of alcohol or drugs that would prevent me from understanding these instructions. I accept responsibility to follow aftercare as explained.</p>

      <p class="signature-block"><strong>By signing below, I acknowledge that I received discharge instructions for today's treatment(s) and understand when and how to seek help if needed.</strong></p>
    `,
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all required consent forms
 */
export function getRequiredConsentForms(): ConsentForm[] {
  return CONSENT_FORMS.filter(f => f.isRequired).sort((a, b) => a.order - b.order);
}

/**
 * Get consent form by ID
 */
export function getConsentForm(id: ConsentFormType): ConsentForm | undefined {
  return CONSENT_FORMS.find(f => f.id === id);
}

/**
 * Get consent forms required for a specific service category
 */
export function getConsentFormsForService(serviceCategory: string): ConsentForm[] {
  const required = getRequiredConsentForms();
  const serviceSpecific = CONSENT_FORMS.filter(
    (f) =>
      f.requiredForServices?.includes(serviceCategory) ||
      f.requiredForServices?.includes(CONSENT_ALL_SERVICES)
  );
  
  // Combine and dedupe
  const allForms = [...required];
  serviceSpecific.forEach(form => {
    if (!allForms.find(f => f.id === form.id)) {
      allForms.push(form);
    }
  });
  
  return allForms.sort((a, b) => a.order - b.order);
}

/** Same-day pre-treatment confirmation (all services) */
export function getVisitPreConsentForm(): ConsentForm | undefined {
  return getConsentForm('same_day_pre_treatment_confirmation');
}

/** Post-visit discharge acknowledgment (all services) */
export function getVisitPostConsentForm(): ConsentForm | undefined {
  return getConsentForm('post_treatment_discharge_acknowledgment');
}

/** Pre + post visit forms for workflows (e.g. tablet or SMS links in order) */
export function getVisitPreAndPostForms(): { pre: ConsentForm; post: ConsentForm } | null {
  const pre = getVisitPreConsentForm();
  const post = getVisitPostConsentForm();
  if (!pre || !post) return null;
  return { pre, post };
}

/**
 * Check if a signed consent is still valid (not expired)
 */
export function isConsentValid(signedConsent: SignedConsent, formConfig: ConsentForm): boolean {
  if (signedConsent.status !== 'signed') return false;
  
  // Check version - if form was updated, consent may need renewal
  if (signedConsent.formVersion !== formConfig.version) return false;
  
  // Check expiration
  if (signedConsent.expiresAt) {
    return new Date(signedConsent.expiresAt) > new Date();
  }
  
  // If no explicit expiration but form has expiry period
  if (formConfig.expiresAfterDays) {
    const signedDate = new Date(signedConsent.signedAt);
    const expiryDate = new Date(signedDate);
    expiryDate.setDate(expiryDate.getDate() + formConfig.expiresAfterDays);
    return expiryDate > new Date();
  }
  
  return true;
}

/**
 * Get missing consent forms for a client
 */
export function getMissingConsents(
  clientSignedConsents: SignedConsent[],
  serviceCategory?: string
): ConsentForm[] {
  const requiredForms = serviceCategory 
    ? getConsentFormsForService(serviceCategory)
    : getRequiredConsentForms();
  
  return requiredForms.filter(form => {
    const signed = clientSignedConsents.find(s => s.formType === form.id);
    if (!signed) return true;
    return !isConsentValid(signed, form);
  });
}

/**
 * Calculate consent completion percentage for a client
 */
export function getConsentCompletionStatus(
  clientSignedConsents: SignedConsent[]
): { completed: number; total: number; percent: number } {
  const requiredForms = getRequiredConsentForms();
  const validConsents = requiredForms.filter(form => {
    const signed = clientSignedConsents.find(s => s.formType === form.id);
    return signed && isConsentValid(signed, form);
  });
  
  return {
    completed: validConsents.length,
    total: requiredForms.length,
    percent: Math.round((validConsents.length / requiredForms.length) * 100),
  };
}

/**
 * Get consent forms that are expiring soon for a client
 */
export function getExpiringConsents(
  clientSignedConsents: SignedConsent[],
  withinDays: number = 30
): Array<{ consent: SignedConsent; form: ConsentForm; expiresAt: Date }> {
  const expiring: Array<{ consent: SignedConsent; form: ConsentForm; expiresAt: Date }> = [];
  
  clientSignedConsents.forEach(consent => {
    const form = getConsentForm(consent.formType);
    if (!form || consent.status !== 'signed') return;
    
    let expiresAt: Date;
    if (consent.expiresAt) {
      expiresAt = new Date(consent.expiresAt);
    } else if (form.expiresAfterDays) {
      expiresAt = new Date(consent.signedAt);
      expiresAt.setDate(expiresAt.getDate() + form.expiresAfterDays);
    } else {
      return; // No expiration
    }
    
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry > 0 && daysUntilExpiry <= withinDays) {
      expiring.push({ consent, form, expiresAt });
    }
  });
  
  return expiring.sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());
}

/**
 * Format consent form for PDF generation
 */
export function formatConsentForPDF(form: ConsentForm, signedConsent?: SignedConsent): string {
  let html = `
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; }
      h2 { text-align: center; margin-bottom: 20px; }
      h3 { margin-top: 20px; margin-bottom: 10px; }
      .clinic-name { text-align: center; margin-bottom: 30px; }
      .important-notice { background: #fff3cd; padding: 15px; border: 1px solid #ffc107; margin: 20px 0; }
      .warning-box { background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; margin: 20px 0; }
      .signature-block { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; }
      ul { margin-left: 20px; }
      li { margin-bottom: 5px; }
    </style>
  `;
  
  html += form.content;
  
  if (signedConsent) {
    html += `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #000;">
        <p><strong>Signature:</strong></p>
        ${signedConsent.signatureType === 'drawn' 
          ? `<img src="${signedConsent.signatureData}" alt="Signature" style="max-height: 100px;" />`
          : `<p style="font-style: italic; font-size: 18pt;">${signedConsent.signatureData}</p>`
        }
        <p><strong>Date Signed:</strong> ${new Date(signedConsent.signedAt).toLocaleDateString()}</p>
        <p><strong>Form Version:</strong> ${signedConsent.formVersion}</p>
      </div>
    `;
  }
  
  return html;
}
