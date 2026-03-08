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
  | 'sms_consent';

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
  requiredForServices?: string[]; // Service category slugs that require this
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
    f => f.requiredForServices?.includes(serviceCategory)
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
