// ============================================================
// INTAKE FORMS SYSTEM
// Digital medical history and consent forms
// ============================================================

export interface IntakeFormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'signature' | 'section';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  conditionalOn?: { field: string; value: string | boolean };
}

export interface IntakeForm {
  id: string;
  name: string;
  description: string;
  category: 'medical_history' | 'consent' | 'intake' | 'hipaa';
  fields: IntakeFormField[];
  requiresSignature: boolean;
  expiresInDays?: number; // How long before form needs to be re-completed
  requiredForServices?: string[]; // Service IDs that require this form
}

// Standard Medical History Form
export const MEDICAL_HISTORY_FORM: IntakeForm = {
  id: 'medical-history',
  name: 'Medical History',
  description: 'Please complete this form so we can provide you with safe, effective treatments.',
  category: 'medical_history',
  requiresSignature: true,
  expiresInDays: 365,
  fields: [
    { id: 'section-personal', type: 'section', label: 'Personal Information', required: false },
    { id: 'dob', type: 'date', label: 'Date of Birth', required: true },
    { id: 'gender', type: 'select', label: 'Gender', required: true, options: ['Female', 'Male', 'Non-binary', 'Prefer not to say'] },
    { id: 'emergency_contact', type: 'text', label: 'Emergency Contact Name', required: true },
    { id: 'emergency_phone', type: 'text', label: 'Emergency Contact Phone', required: true },
    
    { id: 'section-medical', type: 'section', label: 'Medical History', required: false },
    { id: 'allergies', type: 'textarea', label: 'List any allergies (medications, latex, foods, etc.)', required: false, placeholder: 'None' },
    { id: 'medications', type: 'textarea', label: 'Current medications (including supplements)', required: false, placeholder: 'None' },
    { id: 'medical_conditions', type: 'checkbox', label: 'Do you have any of the following conditions?', required: false, options: [
      'Diabetes',
      'High blood pressure',
      'Heart disease',
      'Autoimmune disease',
      'Bleeding disorders',
      'Keloid scarring',
      'Skin conditions (eczema, psoriasis)',
      'Cancer (current or history)',
      'Hepatitis',
      'HIV/AIDS',
      'None of the above',
    ]},
    { id: 'surgeries', type: 'textarea', label: 'Previous surgeries or cosmetic procedures', required: false, placeholder: 'None' },
    
    { id: 'section-women', type: 'section', label: 'For Women', required: false },
    { id: 'pregnant', type: 'radio', label: 'Are you pregnant or breastfeeding?', required: true, options: ['Yes', 'No', 'N/A'] },
    
    { id: 'section-lifestyle', type: 'section', label: 'Lifestyle', required: false },
    { id: 'smoking', type: 'radio', label: 'Do you smoke?', required: true, options: ['Yes', 'No', 'Former smoker'] },
    { id: 'alcohol', type: 'radio', label: 'Do you consume alcohol regularly?', required: true, options: ['Yes', 'No', 'Occasionally'] },
    
    { id: 'section-treatment', type: 'section', label: 'Treatment Goals', required: false },
    { id: 'concerns', type: 'textarea', label: 'What are your primary concerns or goals for treatment?', required: true },
    { id: 'previous_treatments', type: 'textarea', label: 'Have you had Botox, fillers, or similar treatments before? If yes, when and what?', required: false },
    
    { id: 'section-acknowledgement', type: 'section', label: 'Acknowledgement', required: false },
    { id: 'accuracy', type: 'checkbox', label: 'I certify that the above information is accurate to the best of my knowledge', required: true, options: ['I agree'] },
    { id: 'signature', type: 'signature', label: 'Signature', required: true },
  ],
};

// Injectable Consent Form
export const INJECTABLE_CONSENT_FORM: IntakeForm = {
  id: 'injectable-consent',
  name: 'Injectable Treatment Consent',
  description: 'Consent for Botox, Dysport, dermal fillers, and similar treatments.',
  category: 'consent',
  requiresSignature: true,
  expiresInDays: 365,
  requiredForServices: ['botox', 'dysport', 'filler', 'juvederm', 'restylane'],
  fields: [
    { id: 'section-info', type: 'section', label: 'Treatment Information', required: false },
    { 
      id: 'understand_treatment', 
      type: 'checkbox', 
      label: 'I understand and acknowledge:', 
      required: true, 
      options: [
        'The nature of injectable treatments has been explained to me',
        'Results vary and are not guaranteed',
        'Multiple treatments may be needed for optimal results',
        'I have had the opportunity to ask questions',
      ]
    },
    
    { id: 'section-risks', type: 'section', label: 'Risks & Side Effects', required: false },
    {
      id: 'understand_risks',
      type: 'checkbox',
      label: 'I understand the potential risks and side effects include:',
      required: true,
      options: [
        'Bruising, swelling, and redness at injection sites',
        'Asymmetry or uneven results',
        'Allergic reactions (rare)',
        'Infection (rare)',
        'Vascular occlusion (rare but serious)',
        'Temporary numbness or tingling',
      ]
    },
    
    { id: 'section-instructions', type: 'section', label: 'Pre & Post Treatment', required: false },
    {
      id: 'pre_treatment',
      type: 'checkbox',
      label: 'Pre-treatment instructions:',
      required: true,
      options: [
        'I have avoided blood thinners (aspirin, ibuprofen, fish oil) for 7 days',
        'I have avoided alcohol for 24 hours',
        'I am not pregnant or breastfeeding',
      ]
    },
    {
      id: 'post_treatment',
      type: 'checkbox',
      label: 'I agree to follow post-treatment instructions:',
      required: true,
      options: [
        'Avoid touching or rubbing treated areas for 24 hours',
        'Avoid strenuous exercise for 24 hours',
        'Avoid excessive heat or sun exposure for 48 hours',
        'Contact the office if I experience unusual symptoms',
      ]
    },
    
    { id: 'section-consent', type: 'section', label: 'Consent', required: false },
    {
      id: 'photo_consent',
      type: 'radio',
      label: 'Do you consent to before/after photos for your medical record?',
      required: true,
      options: ['Yes', 'No']
    },
    {
      id: 'marketing_consent',
      type: 'radio',
      label: 'Do you consent to anonymous use of photos for marketing purposes?',
      required: true,
      options: ['Yes', 'No']
    },
    {
      id: 'final_consent',
      type: 'checkbox',
      label: 'Final Consent',
      required: true,
      options: [
        'I have read and understood this consent form',
        'I consent to the proposed treatment',
        'I understand I can withdraw consent at any time',
      ]
    },
    { id: 'signature', type: 'signature', label: 'Patient Signature', required: true },
  ],
};

// HIPAA Consent Form
export const HIPAA_CONSENT_FORM: IntakeForm = {
  id: 'hipaa-consent',
  name: 'HIPAA Privacy Notice Acknowledgement',
  description: 'Acknowledgement of our privacy practices.',
  category: 'hipaa',
  requiresSignature: true,
  expiresInDays: null as any, // Never expires
  fields: [
    { id: 'section-notice', type: 'section', label: 'Notice of Privacy Practices', required: false },
    {
      id: 'acknowledge_hipaa',
      type: 'checkbox',
      label: 'I acknowledge that:',
      required: true,
      options: [
        'I have received a copy of the Notice of Privacy Practices',
        'I understand how my health information may be used and disclosed',
        'I understand my rights regarding my health information',
      ]
    },
    {
      id: 'communication_preferences',
      type: 'checkbox',
      label: 'I authorize Hello Gorgeous Med Spa to contact me via:',
      required: true,
      options: [
        'Phone calls',
        'Text messages (SMS)',
        'Email',
        'Voicemail messages',
      ]
    },
    { id: 'signature', type: 'signature', label: 'Signature', required: true },
  ],
};

// All standard forms
export const STANDARD_INTAKE_FORMS: IntakeForm[] = [
  MEDICAL_HISTORY_FORM,
  INJECTABLE_CONSENT_FORM,
  HIPAA_CONSENT_FORM,
];

// Check if client needs to complete forms
export function getRequiredForms(
  serviceId: string,
  completedForms: { formId: string; completedAt: Date }[]
): IntakeForm[] {
  const required: IntakeForm[] = [];
  
  for (const form of STANDARD_INTAKE_FORMS) {
    // Check if form is required for this service
    const isRequired = !form.requiredForServices || form.requiredForServices.includes(serviceId);
    
    if (isRequired) {
      // Check if form was completed and is still valid
      const completed = completedForms.find(cf => cf.formId === form.id);
      
      if (!completed) {
        required.push(form);
      } else if (form.expiresInDays) {
        const expiresAt = new Date(completed.completedAt);
        expiresAt.setDate(expiresAt.getDate() + form.expiresInDays);
        
        if (new Date() > expiresAt) {
          required.push(form);
        }
      }
    }
  }
  
  return required;
}
