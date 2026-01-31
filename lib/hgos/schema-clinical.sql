-- ============================================================
-- HELLO GORGEOUS OS - CLINICAL EHR SCHEMA
-- HIPAA-Compliant Charting, Consents, and Intake Forms
-- ============================================================

-- ============================================================
-- CONSENT FORM SYSTEM
-- ============================================================

-- Consent form templates (what clients sign)
CREATE TABLE IF NOT EXISTS public.consent_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- HTML/Markdown content of the consent
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    requires_witness BOOLEAN DEFAULT false,
    required_for_services TEXT[], -- Array of service category slugs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Signed consents (client signatures)
CREATE TABLE IF NOT EXISTS public.client_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    consent_template_id UUID NOT NULL REFERENCES public.consent_templates(id),
    template_version INTEGER NOT NULL, -- Version at time of signing
    
    -- Signature data
    signature_data TEXT NOT NULL, -- Base64 encoded signature image
    signature_ip VARCHAR(45), -- IP address for audit
    signature_user_agent TEXT, -- Browser info for audit
    signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Witness (if required)
    witness_name VARCHAR(255),
    witness_signature_data TEXT,
    witness_signed_at TIMESTAMPTZ,
    
    -- Expiration
    expires_at TIMESTAMPTZ, -- Some consents need renewal
    is_valid BOOLEAN DEFAULT true,
    revoked_at TIMESTAMPTZ,
    revoked_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEDICAL INTAKE SYSTEM
-- ============================================================

-- Intake form templates
CREATE TABLE IF NOT EXISTS public.intake_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    form_schema JSONB NOT NULL, -- JSON schema defining form fields
    is_active BOOLEAN DEFAULT true,
    is_required_for_new_clients BOOLEAN DEFAULT false,
    required_for_services TEXT[], -- Array of service category slugs
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completed intakes
CREATE TABLE IF NOT EXISTS public.client_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    intake_template_id UUID NOT NULL REFERENCES public.intake_templates(id),
    template_version INTEGER NOT NULL,
    
    -- Form data (encrypted in production)
    form_data JSONB NOT NULL, -- Client's answers
    
    -- Signature
    signature_data TEXT, -- Base64 signature confirming accuracy
    signed_at TIMESTAMPTZ,
    
    -- Review
    reviewed_by UUID REFERENCES public.providers(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    flags TEXT[], -- Array of flagged items for provider attention
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'flagged', 'archived')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLINICAL CHARTING (SOAP NOTES)
-- ============================================================

-- Chart note types
CREATE TYPE IF NOT EXISTS chart_note_type AS ENUM (
    'soap',           -- Standard SOAP note
    'procedure',      -- Procedure documentation
    'consultation',   -- Initial consult
    'follow_up',      -- Follow-up visit
    'telehealth',     -- Virtual visit
    'phone_call',     -- Phone consultation
    'message',        -- Secure message documentation
    'addendum'        -- Addition to existing note
);

-- Clinical notes
CREATE TABLE IF NOT EXISTS public.clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.providers(id),
    appointment_id UUID REFERENCES public.appointments(id),
    
    -- Note type and status
    note_type chart_note_type NOT NULL DEFAULT 'soap',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'signed', 'amended', 'locked')),
    
    -- SOAP Components
    chief_complaint TEXT,
    subjective TEXT, -- Patient's description of symptoms/concerns
    objective TEXT,  -- Provider's observations, vitals, exam findings
    assessment TEXT, -- Diagnosis/clinical impression
    plan TEXT,       -- Treatment plan, recommendations
    
    -- Additional clinical data
    vitals JSONB, -- BP, pulse, weight, etc.
    allergies_reviewed BOOLEAN DEFAULT false,
    medications_reviewed BOOLEAN DEFAULT false,
    
    -- Treatment specifics (for procedures)
    treatment_details JSONB, -- Product used, units, areas, etc.
    injection_map JSONB, -- Visual mapping of injection sites
    
    -- Signatures
    signed_at TIMESTAMPTZ,
    signed_by UUID REFERENCES public.providers(id),
    
    -- Amendments
    parent_note_id UUID REFERENCES public.clinical_notes(id),
    amendment_reason TEXT,
    
    -- Billing
    cpt_codes TEXT[],
    icd10_codes TEXT[],
    
    -- Timestamps
    encounter_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    locked_at TIMESTAMPTZ
);

-- ============================================================
-- TREATMENT PHOTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.treatment_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    clinical_note_id UUID REFERENCES public.clinical_notes(id),
    
    -- Photo metadata
    photo_type VARCHAR(20) NOT NULL CHECK (photo_type IN ('before', 'after', 'during', 'reference')),
    body_area VARCHAR(100), -- face, lips, body area
    angle VARCHAR(50), -- front, left, right, etc.
    
    -- Storage (encrypted)
    storage_path TEXT NOT NULL, -- Path in secure storage
    thumbnail_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(50),
    
    -- Metadata
    taken_at TIMESTAMPTZ DEFAULT NOW(),
    taken_by UUID REFERENCES public.providers(id),
    notes TEXT,
    
    -- PHI protection
    is_identifiable BOOLEAN DEFAULT true, -- Contains face/identifying marks
    consent_documented BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHART TEMPLATES (Smart Templates)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chart_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100), -- botox, filler, facial, etc.
    
    -- Template content
    template_data JSONB NOT NULL, -- Pre-filled SOAP sections
    injection_map_template JSONB, -- Default injection diagram
    
    -- Common values
    default_cpt_codes TEXT[],
    default_icd10_codes TEXT[],
    
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.providers(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HIPAA AUDIT LOG (Enhanced)
-- ============================================================

CREATE TYPE IF NOT EXISTS audit_action AS ENUM (
    'view',
    'create',
    'update',
    'delete',
    'sign',
    'print',
    'export',
    'share',
    'login',
    'logout',
    'failed_login'
);

CREATE TYPE IF NOT EXISTS audit_resource AS ENUM (
    'client',
    'clinical_note',
    'consent',
    'intake',
    'photo',
    'appointment',
    'prescription',
    'document',
    'message'
);

-- Drop existing audit_logs if needed and recreate with clinical focus
DROP TABLE IF EXISTS public.audit_logs CASCADE;

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who
    user_id UUID REFERENCES public.users(id),
    user_role VARCHAR(50),
    user_email VARCHAR(255),
    
    -- What
    action audit_action NOT NULL,
    resource_type audit_resource NOT NULL,
    resource_id UUID,
    
    -- Details
    description TEXT,
    old_values JSONB, -- Previous state (for updates)
    new_values JSONB, -- New state (for updates)
    
    -- Where/How (for HIPAA compliance)
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    
    -- When
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_client_consents_client ON public.client_consents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_consents_template ON public.client_consents(consent_template_id);
CREATE INDEX IF NOT EXISTS idx_client_consents_valid ON public.client_consents(client_id, is_valid);

CREATE INDEX IF NOT EXISTS idx_client_intakes_client ON public.client_intakes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_intakes_status ON public.client_intakes(status);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_client ON public.clinical_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_provider ON public.clinical_notes(provider_id);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_date ON public.clinical_notes(encounter_date);
CREATE INDEX IF NOT EXISTS idx_clinical_notes_status ON public.clinical_notes(status);

CREATE INDEX IF NOT EXISTS idx_treatment_photos_client ON public.treatment_photos(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_photos_note ON public.treatment_photos(clinical_note_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.consent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED DATA: CONSENT TEMPLATES
-- ============================================================

INSERT INTO public.consent_templates (name, slug, description, content, required_for_services) VALUES
(
    'General Treatment Consent',
    'general-treatment',
    'General consent for all aesthetic treatments',
    E'# INFORMED CONSENT FOR AESTHETIC TREATMENTS\n\n## Patient Information\nI, the undersigned, hereby consent to receive aesthetic treatments at Hello Gorgeous Med Spa.\n\n## Understanding of Treatment\nI understand that:\n- Results vary from person to person\n- Multiple treatments may be necessary\n- There are risks including but not limited to bruising, swelling, infection, and allergic reactions\n- I should disclose all medical conditions and medications\n\n## Patient Responsibilities\nI agree to:\n- Follow all pre and post-treatment instructions\n- Notify the provider of any adverse reactions\n- Attend follow-up appointments as recommended\n\n## Photography Consent\nI consent to before/after photographs for my medical record.\n\n## Financial Agreement\nI understand payment is due at time of service and cancellation policies apply.\n\nBy signing below, I acknowledge that I have read and understand this consent form.',
    ARRAY['botox', 'fillers', 'facials', 'laser-hair', 'prp']
),
(
    'Neurotoxin (Botox/Dysport) Consent',
    'neurotoxin-consent',
    'Specific consent for Botox, Dysport, and Jeuveau treatments',
    E'# INFORMED CONSENT FOR NEUROTOXIN TREATMENT\n## (Botox®, Dysport®, Jeuveau®)\n\n## Treatment Description\nNeurotoxin injections temporarily reduce muscle activity to smooth wrinkles and fine lines.\n\n## Expected Results\n- Results typically appear within 3-7 days\n- Full effect visible at 2 weeks\n- Results last approximately 3-4 months\n- Touch-ups may be needed for optimal results\n\n## Risks and Complications\n- Bruising at injection sites\n- Temporary headache\n- Eyelid or brow drooping (rare, temporary)\n- Asymmetry\n- Allergic reaction (rare)\n- Flu-like symptoms\n\n## Contraindications\nDo NOT proceed if you:\n- Are pregnant or breastfeeding\n- Have a neuromuscular disease\n- Are allergic to botulinum toxin\n- Have infection at treatment site\n\n## Post-Treatment Instructions\n- No lying down for 4 hours\n- No strenuous exercise for 24 hours\n- No massaging treated areas\n- No alcohol for 24 hours\n\nI have read and understand the above information.',
    ARRAY['botox']
),
(
    'Dermal Filler Consent',
    'filler-consent',
    'Consent for hyaluronic acid and other dermal fillers',
    E'# INFORMED CONSENT FOR DERMAL FILLERS\n\n## Treatment Description\nDermal fillers are injectable gels used to restore volume, smooth wrinkles, and enhance facial contours.\n\n## Products Used\nHyaluronic Acid Fillers: Juvederm®, Restylane®, Versa®, RHA®\n\n## Expected Results\n- Immediate visible improvement\n- Some initial swelling is normal\n- Results last 6-18 months depending on area and product\n\n## Risks and Complications\n- Swelling and bruising (common)\n- Redness at injection sites\n- Tenderness or firmness\n- Lumps or irregularities\n- Infection (rare)\n- Vascular occlusion (rare but serious)\n- Tissue necrosis (rare)\n- Blindness (extremely rare)\n\n## Emergency Protocol\nI understand that vascular compromise is a medical emergency and I will contact the office immediately if I experience:\n- Severe pain\n- Blanching or white skin\n- Blue/purple discoloration\n- Vision changes\n\n## Reversal Option\nHyaluronic acid fillers can be dissolved with hyaluronidase if needed.\n\nI acknowledge the risks and consent to treatment.',
    ARRAY['fillers']
),
(
    'Weight Loss Program Consent',
    'weight-loss-consent',
    'Consent for Semaglutide, Tirzepatide, and weight loss treatments',
    E'# INFORMED CONSENT FOR MEDICAL WEIGHT LOSS\n## (Semaglutide/Tirzepatide)\n\n## Program Overview\nThis medical weight loss program uses GLP-1 receptor agonist medications to support weight management.\n\n## Medications\n- Semaglutide (similar to Wegovy®/Ozempic®)\n- Tirzepatide (similar to Zepbound®/Mounjaro®)\n\n## Expected Results\n- Gradual weight loss over weeks/months\n- Reduced appetite and cravings\n- Individual results vary\n\n## Common Side Effects\n- Nausea (especially initially)\n- Vomiting\n- Diarrhea or constipation\n- Stomach pain\n- Headache\n- Fatigue\n\n## Serious Risks\n- Pancreatitis\n- Gallbladder problems\n- Kidney problems\n- Hypoglycemia (if diabetic)\n- Thyroid tumors (reported in animal studies)\n\n## Contraindications\n- Personal/family history of medullary thyroid cancer\n- Multiple Endocrine Neoplasia syndrome type 2\n- Pregnancy or planning pregnancy\n- History of pancreatitis\n\n## Requirements\n- Regular check-ins required\n- Lab work as directed\n- Must report side effects promptly\n\nI understand this is an off-label use and consent to treatment.',
    ARRAY['weight-loss']
),
(
    'HIPAA Privacy Notice',
    'hipaa-privacy',
    'HIPAA privacy practices acknowledgment',
    E'# NOTICE OF PRIVACY PRACTICES\n## Hello Gorgeous Med Spa\n\n## Your Information. Your Rights. Our Responsibilities.\n\nThis notice describes how medical information about you may be used and disclosed and how you can get access to this information.\n\n## Your Rights\nYou have the right to:\n- Get a copy of your health records\n- Correct your health records\n- Request confidential communication\n- Ask us to limit what we share\n- Get a list of those with whom we''ve shared information\n- Get a copy of this privacy notice\n- File a complaint if you feel your rights are violated\n\n## Our Uses and Disclosures\nWe may use and share your information to:\n- Treat you\n- Run our organization\n- Bill for your services\n- Comply with law\n\n## Your Choices\nYou have choices about how we share information:\n- Marketing purposes\n- Sale of your information\n- Fundraising\n\nBy signing, I acknowledge receipt of this Notice of Privacy Practices.',
    ARRAY[]::TEXT[]
);

-- ============================================================
-- SEED DATA: INTAKE TEMPLATES
-- ============================================================

INSERT INTO public.intake_templates (name, slug, description, form_schema, is_required_for_new_clients, required_for_services) VALUES
(
    'New Client Medical History',
    'new-client-intake',
    'Comprehensive medical history for new clients',
    '{
        "sections": [
            {
                "title": "Personal Information",
                "fields": [
                    {"name": "preferred_name", "label": "Preferred Name", "type": "text"},
                    {"name": "pronouns", "label": "Pronouns", "type": "select", "options": ["She/Her", "He/Him", "They/Them", "Other"]},
                    {"name": "emergency_contact_name", "label": "Emergency Contact Name", "type": "text", "required": true},
                    {"name": "emergency_contact_phone", "label": "Emergency Contact Phone", "type": "phone", "required": true},
                    {"name": "emergency_contact_relationship", "label": "Relationship", "type": "text", "required": true}
                ]
            },
            {
                "title": "Medical History",
                "fields": [
                    {"name": "current_medications", "label": "Current Medications (include supplements)", "type": "textarea"},
                    {"name": "allergies", "label": "Allergies (medications, latex, etc.)", "type": "textarea"},
                    {"name": "medical_conditions", "label": "Do you have any of the following?", "type": "checkbox_group", "options": [
                        "Diabetes", "High Blood Pressure", "Heart Disease", "Thyroid Disorder",
                        "Autoimmune Disease", "Bleeding Disorder", "Skin Conditions", "Keloid Scarring",
                        "Seizures", "Cancer", "HIV/AIDS", "Hepatitis"
                    ]},
                    {"name": "medical_conditions_other", "label": "Other Medical Conditions", "type": "textarea"},
                    {"name": "previous_surgeries", "label": "Previous Surgeries", "type": "textarea"},
                    {"name": "pregnant_nursing", "label": "Are you pregnant or nursing?", "type": "radio", "options": ["Yes", "No", "Not Applicable"]}
                ]
            },
            {
                "title": "Aesthetic History",
                "fields": [
                    {"name": "previous_botox", "label": "Have you had Botox/Dysport before?", "type": "radio", "options": ["Yes", "No"]},
                    {"name": "previous_botox_details", "label": "If yes, when and where?", "type": "textarea", "conditional": {"field": "previous_botox", "value": "Yes"}},
                    {"name": "previous_fillers", "label": "Have you had dermal fillers before?", "type": "radio", "options": ["Yes", "No"]},
                    {"name": "previous_fillers_details", "label": "If yes, what products and where?", "type": "textarea", "conditional": {"field": "previous_fillers", "value": "Yes"}},
                    {"name": "previous_complications", "label": "Have you had any complications from aesthetic treatments?", "type": "radio", "options": ["Yes", "No"]},
                    {"name": "previous_complications_details", "label": "Please describe", "type": "textarea", "conditional": {"field": "previous_complications", "value": "Yes"}}
                ]
            },
            {
                "title": "Lifestyle",
                "fields": [
                    {"name": "smoker", "label": "Do you smoke or use tobacco?", "type": "radio", "options": ["Yes", "No", "Former"]},
                    {"name": "alcohol", "label": "Alcohol consumption", "type": "select", "options": ["None", "Occasional", "Moderate", "Heavy"]},
                    {"name": "exercise", "label": "Exercise frequency", "type": "select", "options": ["Sedentary", "1-2x/week", "3-4x/week", "5+x/week"]},
                    {"name": "sun_exposure", "label": "Sun exposure", "type": "select", "options": ["Minimal", "Moderate", "Frequent"]}
                ]
            },
            {
                "title": "Goals",
                "fields": [
                    {"name": "primary_concerns", "label": "What are your primary aesthetic concerns?", "type": "checkbox_group", "options": [
                        "Fine Lines/Wrinkles", "Volume Loss", "Skin Texture", "Skin Tone/Pigmentation",
                        "Acne/Scarring", "Lip Enhancement", "Facial Contouring", "Weight Management",
                        "Hair Loss", "Body Contouring", "Unwanted Hair"
                    ]},
                    {"name": "goals", "label": "What are your aesthetic goals?", "type": "textarea"},
                    {"name": "budget", "label": "Monthly aesthetic budget", "type": "select", "options": ["Under $200", "$200-500", "$500-1000", "$1000+"]}
                ]
            }
        ]
    }',
    true,
    ARRAY[]::TEXT[]
),
(
    'Pre-Treatment Questionnaire',
    'pre-treatment',
    'Quick questionnaire before each treatment',
    '{
        "sections": [
            {
                "title": "Day of Treatment",
                "fields": [
                    {"name": "feeling_well", "label": "Are you feeling well today?", "type": "radio", "options": ["Yes", "No"], "required": true},
                    {"name": "illness_details", "label": "If no, please explain", "type": "textarea", "conditional": {"field": "feeling_well", "value": "No"}},
                    {"name": "medication_changes", "label": "Any changes to medications since last visit?", "type": "radio", "options": ["Yes", "No"], "required": true},
                    {"name": "medication_changes_details", "label": "Please list changes", "type": "textarea", "conditional": {"field": "medication_changes", "value": "Yes"}},
                    {"name": "new_allergies", "label": "Any new allergies?", "type": "radio", "options": ["Yes", "No"], "required": true},
                    {"name": "pregnant_nursing", "label": "Are you pregnant, nursing, or trying to conceive?", "type": "radio", "options": ["Yes", "No", "N/A"], "required": true},
                    {"name": "blood_thinners", "label": "Have you taken blood thinners, aspirin, or NSAIDs in the past week?", "type": "radio", "options": ["Yes", "No"], "required": true},
                    {"name": "alcohol_24h", "label": "Have you consumed alcohol in the past 24 hours?", "type": "radio", "options": ["Yes", "No"]},
                    {"name": "special_event", "label": "Do you have a special event in the next 2 weeks?", "type": "radio", "options": ["Yes", "No"]},
                    {"name": "special_event_date", "label": "Event date", "type": "date", "conditional": {"field": "special_event", "value": "Yes"}}
                ]
            }
        ]
    }',
    false,
    ARRAY['botox', 'fillers']
);

-- ============================================================
-- SEED DATA: CHART TEMPLATES
-- ============================================================

INSERT INTO public.chart_templates (name, slug, description, category, template_data, default_cpt_codes, default_icd10_codes) VALUES
(
    'Botox - Full Face',
    'botox-full-face',
    'Template for full face neurotoxin treatment',
    'botox',
    '{
        "chief_complaint": "Patient presents for neurotoxin treatment to address facial wrinkles.",
        "subjective_template": "Patient reports concerns with [AREAS]. Desires natural-looking reduction in movement and wrinkles. [ADDITIONAL CONCERNS]",
        "objective_template": "Physical exam reveals dynamic rhytides in the [AREAS]. Skin type [FITZPATRICK]. No contraindications noted.",
        "assessment_template": "Facial rhytides, suitable candidate for neurotoxin treatment.",
        "plan_template": "Administered [PRODUCT] [TOTAL UNITS] units to [AREAS].\n\nPost-procedure instructions reviewed:\n- No lying flat for 4 hours\n- No strenuous exercise for 24 hours\n- No rubbing/massaging treated areas\n- Results expected in 3-7 days, full effect at 2 weeks\n\nFollow-up: PRN or in 2 weeks for touch-up evaluation",
        "common_areas": ["Glabella", "Forehead", "Crows Feet", "Brow Lift", "Bunny Lines", "Lip Flip", "Chin", "Masseter", "Neck Bands"],
        "default_units": {"Glabella": 20, "Forehead": 20, "Crows Feet": 24, "Brow Lift": 4, "Bunny Lines": 4, "Lip Flip": 4, "Chin": 6, "Masseter": 50, "Neck Bands": 30}
    }',
    ARRAY['64615'],
    ARRAY['R23.4']
),
(
    'Dermal Filler - Lips',
    'filler-lips',
    'Template for lip filler treatment',
    'fillers',
    '{
        "chief_complaint": "Patient presents for lip augmentation with dermal filler.",
        "subjective_template": "Patient desires [GOAL: volume/definition/hydration]. Previous filler: [YES/NO]. Goals discussed and realistic expectations set.",
        "objective_template": "Lip assessment: [UPPER:LOWER RATIO]. Vermillion border definition: [GOOD/FAIR/POOR]. No active cold sores or infection.",
        "assessment_template": "Candidate for lip augmentation with hyaluronic acid filler.",
        "plan_template": "Administered [PRODUCT] [AMOUNT] to lips.\n\nTechnique: [CANNULA/NEEDLE]\nAreas: [VERMILLION BORDER/BODY/CUPIDS BOW]\n\nPost-procedure:\n- Ice as needed for swelling\n- Avoid exercise 24 hours\n- No kissing/straws for 24 hours\n- Expect swelling 2-3 days\n- Final result at 2 weeks\n\nFollow-up: 2 weeks for assessment",
        "common_products": ["Juvederm Ultra", "Juvederm Volbella", "Restylane Kysse", "Restylane Silk", "RHA 2"]
    }',
    ARRAY['11950'],
    ARRAY['M79.4']
),
(
    'IV Therapy',
    'iv-therapy',
    'Template for IV infusion treatments',
    'iv-therapy',
    '{
        "chief_complaint": "Patient presents for IV nutrient therapy.",
        "subjective_template": "Patient reports: [FATIGUE/DEHYDRATION/IMMUNE SUPPORT/HANGOVER/ATHLETIC RECOVERY]. Seeking [COCKTAIL NAME].",
        "objective_template": "Vitals: BP [X/X], HR [X], O2 Sat [X]%\nHydration status: [GOOD/FAIR/POOR]\nVenous access: [LOCATION]\nNo contraindications.",
        "assessment_template": "Appropriate candidate for IV nutrient therapy.",
        "plan_template": "IV Therapy administered:\n\n[COCKTAIL]: [INGREDIENTS]\nVolume: [X]mL\nInfusion time: [X] minutes\nSite: [LOCATION]\nComplications: None\n\nPatient tolerated well. Post-procedure vitals stable.\n\nRecommendations: [FREQUENCY]",
        "common_cocktails": [
            {"name": "Myers Cocktail", "ingredients": "Vitamin C, B-Complex, B12, Magnesium, Calcium"},
            {"name": "Beauty IV", "ingredients": "Vitamin C, Biotin, Glutathione, B-Complex"},
            {"name": "Reboot", "ingredients": "NS, B-Complex, Zofran, Toradol"}
        ]
    }',
    ARRAY['96374'],
    ARRAY['E56.9']
);

SELECT 'Clinical EHR schema created successfully!' AS status;
