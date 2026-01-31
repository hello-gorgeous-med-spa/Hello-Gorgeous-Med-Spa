// ============================================================
// HELLO GORGEOUS OS - CLINICAL EHR TYPES
// TypeScript definitions for charting, consents, and intake
// ============================================================

// ============================================================
// CONSENT SYSTEM
// ============================================================

export interface ConsentTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content: string; // HTML/Markdown content
  version: number;
  isActive: boolean;
  requiresWitness: boolean;
  requiredForServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientConsent {
  id: string;
  clientId: string;
  consentTemplateId: string;
  templateVersion: number;
  
  // Signature
  signatureData: string; // Base64 encoded
  signatureIp?: string;
  signatureUserAgent?: string;
  signedAt: Date;
  
  // Witness
  witnessName?: string;
  witnessSignatureData?: string;
  witnessSignedAt?: Date;
  
  // Status
  expiresAt?: Date;
  isValid: boolean;
  revokedAt?: Date;
  revokedReason?: string;
  
  createdAt: Date;
  
  // Joined data
  template?: ConsentTemplate;
}

// ============================================================
// INTAKE SYSTEM
// ============================================================

export interface IntakeFormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'checkbox_group' | 'date' | 'phone' | 'email' | 'number';
  required?: boolean;
  options?: string[];
  conditional?: {
    field: string;
    value: string;
  };
  placeholder?: string;
  helpText?: string;
}

export interface IntakeFormSection {
  title: string;
  description?: string;
  fields: IntakeFormField[];
}

export interface IntakeFormSchema {
  sections: IntakeFormSection[];
}

export interface IntakeTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  formSchema: IntakeFormSchema;
  isActive: boolean;
  isRequiredForNewClients: boolean;
  requiredForServices: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientIntake {
  id: string;
  clientId: string;
  intakeTemplateId: string;
  templateVersion: number;
  
  // Form data
  formData: Record<string, any>;
  
  // Signature
  signatureData?: string;
  signedAt?: Date;
  
  // Review
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  flags: string[];
  
  status: 'pending' | 'reviewed' | 'flagged' | 'archived';
  
  createdAt: Date;
  updatedAt: Date;
  
  // Joined
  template?: IntakeTemplate;
}

// ============================================================
// CLINICAL CHARTING
// ============================================================

export type ChartNoteType = 
  | 'soap'
  | 'procedure'
  | 'consultation'
  | 'follow_up'
  | 'telehealth'
  | 'phone_call'
  | 'message'
  | 'addendum';

export type ChartNoteStatus = 'draft' | 'signed' | 'amended' | 'locked';

export interface Vitals {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  height?: number;
  heightUnit?: 'in' | 'cm';
  oxygenSaturation?: number;
  respiratoryRate?: number;
  painLevel?: number; // 0-10
}

export interface InjectionSite {
  area: string;
  product: string;
  units?: number;
  syringes?: number;
  technique?: string;
  notes?: string;
  coordinates?: { x: number; y: number }; // For visual mapping
}

export interface TreatmentDetails {
  productName: string;
  productLot?: string;
  productExpiry?: string;
  totalUnits?: number;
  totalSyringes?: number;
  injectionSites: InjectionSite[];
  anesthetic?: string;
  complications?: string;
}

export interface ClinicalNote {
  id: string;
  clientId: string;
  providerId: string;
  appointmentId?: string;
  
  // Note info
  noteType: ChartNoteType;
  status: ChartNoteStatus;
  
  // SOAP components
  chiefComplaint?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  
  // Clinical data
  vitals?: Vitals;
  allergiesReviewed: boolean;
  medicationsReviewed: boolean;
  
  // Treatment specifics
  treatmentDetails?: TreatmentDetails;
  injectionMap?: Record<string, any>; // Visual diagram data
  
  // Signatures
  signedAt?: Date;
  signedBy?: string;
  
  // Amendments
  parentNoteId?: string;
  amendmentReason?: string;
  
  // Billing
  cptCodes: string[];
  icd10Codes: string[];
  
  // Timestamps
  encounterDate: Date;
  createdAt: Date;
  updatedAt: Date;
  lockedAt?: Date;
  
  // Joined data
  provider?: {
    id: string;
    firstName: string;
    lastName: string;
    credentials: string;
  };
  client?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// ============================================================
// TREATMENT PHOTOS
// ============================================================

export type PhotoType = 'before' | 'after' | 'during' | 'reference';

export interface TreatmentPhoto {
  id: string;
  clientId: string;
  clinicalNoteId?: string;
  
  photoType: PhotoType;
  bodyArea?: string;
  angle?: string;
  
  storagePath: string;
  thumbnailPath?: string;
  fileSize?: number;
  mimeType?: string;
  
  takenAt: Date;
  takenBy?: string;
  notes?: string;
  
  isIdentifiable: boolean;
  consentDocumented: boolean;
  
  createdAt: Date;
}

// ============================================================
// CHART TEMPLATES
// ============================================================

export interface ChartTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  
  templateData: {
    chief_complaint?: string;
    subjective_template?: string;
    objective_template?: string;
    assessment_template?: string;
    plan_template?: string;
    common_areas?: string[];
    default_units?: Record<string, number>;
    common_products?: string[];
    common_cocktails?: Array<{ name: string; ingredients: string }>;
  };
  
  injectionMapTemplate?: Record<string, any>;
  defaultCptCodes: string[];
  defaultIcd10Codes: string[];
  
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// AUDIT LOG
// ============================================================

export type AuditAction = 
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'sign'
  | 'print'
  | 'export'
  | 'share'
  | 'login'
  | 'logout'
  | 'failed_login';

export type AuditResource = 
  | 'client'
  | 'clinical_note'
  | 'consent'
  | 'intake'
  | 'photo'
  | 'appointment'
  | 'prescription'
  | 'document'
  | 'message';

export interface AuditLog {
  id: string;
  
  userId?: string;
  userRole?: string;
  userEmail?: string;
  
  action: AuditAction;
  resourceType: AuditResource;
  resourceId?: string;
  
  description?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  
  createdAt: Date;
}

// ============================================================
// COMPONENT PROPS
// ============================================================

export interface ConsentFormProps {
  template: ConsentTemplate;
  clientId: string;
  onComplete: (consent: ClientConsent) => void;
  onCancel: () => void;
}

export interface IntakeFormProps {
  template: IntakeTemplate;
  clientId: string;
  existingData?: Record<string, any>;
  onComplete: (intake: ClientIntake) => void;
  onCancel: () => void;
}

export interface ChartEditorProps {
  clientId: string;
  appointmentId?: string;
  providerId: string;
  template?: ChartTemplate;
  existingNote?: ClinicalNote;
  onSave: (note: ClinicalNote) => void;
  onSign: (note: ClinicalNote) => void;
  onCancel: () => void;
}

export interface SignaturePadProps {
  onComplete: (signatureData: string) => void;
  onClear: () => void;
  width?: number;
  height?: number;
}

// ============================================================
// API RESPONSES
// ============================================================

export interface ConsentCheckResult {
  hasValidConsent: boolean;
  missingConsents: ConsentTemplate[];
  expiringSoon: ClientConsent[];
}

export interface IntakeCheckResult {
  isComplete: boolean;
  pendingIntakes: IntakeTemplate[];
  flaggedItems: string[];
}

export interface ChartSummary {
  totalNotes: number;
  lastVisit?: Date;
  recentTreatments: string[];
  activeConditions: string[];
  allergies: string[];
  currentMedications: string[];
}
