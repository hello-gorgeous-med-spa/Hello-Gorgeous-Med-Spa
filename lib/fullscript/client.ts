/**
 * Fullscript API Client
 * 
 * Handles authentication and API calls to Fullscript for lab ordering.
 * Docs: https://fullscript.dev
 */

const FULLSCRIPT_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.fullscript.io'
  : 'https://api-us-snd.fullscript.io'; // Sandbox for development

interface FullscriptConfig {
  publicKey: string;
  secretKey?: string;
  signatureKey?: string;
}

function getConfig(): FullscriptConfig {
  const publicKey = process.env.FULLSCRIPT_PUBLIC_KEY;
  // Support both naming conventions
  const secretKey = process.env.FULLSCRIPT_SECRET_KEY || process.env.FULLSCRIPT_SECRET_CHALLENGE_TOKEN;
  const signatureKey = process.env.FULLSCRIPT_SIGNATURE_KEY || process.env.FULLSCRIPT_SIGNATURE_SECRETKEY;
  
  if (!publicKey) {
    throw new Error('FULLSCRIPT_PUBLIC_KEY is not configured');
  }
  
  return { publicKey, secretKey, signatureKey };
}

/**
 * Check if Fullscript is configured
 */
export function isFullscriptConfigured(): boolean {
  return !!process.env.FULLSCRIPT_PUBLIC_KEY;
}

/**
 * Test the Fullscript API connection
 */
export async function testFullscriptConnection(): Promise<{ success: boolean; message: string; details?: unknown }> {
  try {
    const config = getConfig();
    
    // Try to hit the ping or a simple endpoint
    const res = await fullscriptFetch('/api/clinic/ping');
    
    if (res.ok) {
      return { success: true, message: 'Connected to Fullscript API' };
    }
    
    // If ping doesn't exist, try labs endpoint
    const labsRes = await fullscriptFetch('/api/clinic/labs/tests?limit=1');
    if (labsRes.ok) {
      return { success: true, message: 'Fullscript API connected (labs access confirmed)' };
    }
    
    const errorText = await labsRes.text();
    return { 
      success: false, 
      message: `API returned ${labsRes.status}`,
      details: errorText.substring(0, 200)
    };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Make authenticated request to Fullscript API
 */
async function fullscriptFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const config = getConfig();
  
  const url = `${FULLSCRIPT_API_BASE}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.publicKey}`,
    ...options.headers as Record<string, string>,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// ============================================================
// Lab Tests
// ============================================================

export interface LabTest {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  turnaround_time?: string;
  sample_type?: string;
}

/**
 * Search for available lab tests
 */
export async function searchLabTests(query: string): Promise<LabTest[]> {
  try {
    const res = await fullscriptFetch(`/api/clinic/labs/tests?search=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`Failed to search labs: ${res.status}`);
    const data = await res.json();
    return data.tests || [];
  } catch (error) {
    console.error('Error searching lab tests:', error);
    return [];
  }
}

/**
 * Get details for a specific lab test
 */
export async function getLabTest(testId: string): Promise<LabTest | null> {
  try {
    const res = await fullscriptFetch(`/api/clinic/labs/tests/${testId}`);
    if (!res.ok) throw new Error(`Failed to get lab test: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error getting lab test:', error);
    return null;
  }
}

// ============================================================
// Lab Orders
// ============================================================

export interface LabOrder {
  id: string;
  patient_id?: string;
  status: 'pending' | 'requisition_sent' | 'sample_collected' | 'processing' | 'results_available' | 'completed' | 'cancelled';
  tests: LabTest[];
  created_at: string;
  requisition_url?: string;
  results_url?: string;
}

export interface CreateLabOrderParams {
  patient: {
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth: string; // YYYY-MM-DD
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  test_ids: string[];
  practitioner_id?: string;
}

/**
 * Create a new lab order
 */
export async function createLabOrder(params: CreateLabOrderParams): Promise<LabOrder | null> {
  try {
    const res = await fullscriptFetch('/api/clinic/labs/orders', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    if (!res.ok) {
      const error = await res.json();
      console.error('Failed to create lab order:', error);
      throw new Error(error.message || 'Failed to create lab order');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating lab order:', error);
    return null;
  }
}

/**
 * Get a specific lab order
 */
export async function getLabOrder(orderId: string): Promise<LabOrder | null> {
  try {
    const res = await fullscriptFetch(`/api/clinic/labs/orders/${orderId}`);
    if (!res.ok) throw new Error(`Failed to get lab order: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error getting lab order:', error);
    return null;
  }
}

/**
 * List all lab orders, optionally filtered by patient
 */
export async function listLabOrders(patientId?: string): Promise<LabOrder[]> {
  try {
    const endpoint = patientId 
      ? `/api/clinic/labs/orders?patient_id=${patientId}`
      : '/api/clinic/labs/orders';
    
    const res = await fullscriptFetch(endpoint);
    if (!res.ok) throw new Error(`Failed to list lab orders: ${res.status}`);
    const data = await res.json();
    return data.orders || [];
  } catch (error) {
    console.error('Error listing lab orders:', error);
    return [];
  }
}

// ============================================================
// Patients
// ============================================================

export interface FullscriptPatient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
}

/**
 * Create or find a patient in Fullscript
 */
export async function findOrCreatePatient(params: {
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  phone?: string;
}): Promise<FullscriptPatient | null> {
  try {
    // First try to find existing patient
    const searchRes = await fullscriptFetch(`/api/clinic/patients?email=${encodeURIComponent(params.email)}`);
    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.patients?.length > 0) {
        return data.patients[0];
      }
    }
    
    // Create new patient
    const createRes = await fullscriptFetch('/api/clinic/patients', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    if (!createRes.ok) {
      throw new Error('Failed to create patient');
    }
    
    return await createRes.json();
  } catch (error) {
    console.error('Error finding/creating patient:', error);
    return null;
  }
}

// ============================================================
// Treatment Plans (for directing to labs)
// ============================================================

export interface CreateTreatmentPlanLinkParams {
  practitioner_id?: string;
  patient?: {
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string;
  };
  entrypoint?: 'catalog' | 'labs';
  redirect_url?: string;
}

/**
 * Create a dynamic link that takes patient directly to lab ordering
 */
export async function createLabOrderLink(params: CreateTreatmentPlanLinkParams): Promise<string | null> {
  try {
    const res = await fullscriptFetch('/api/clinic/dynamic_links/treatment_plans', {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        entrypoint: 'labs',
      }),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create lab order link');
    }
    
    const data = await res.json();
    return data.redirect_url || data.url;
  } catch (error) {
    console.error('Error creating lab order link:', error);
    return null;
  }
}

// ============================================================
// Webhook Signature Verification
// ============================================================

import crypto from 'crypto';

/**
 * Verify Fullscript webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signatureHeader: string
): boolean {
  const config = getConfig();
  if (!config.signatureKey) {
    console.warn('FULLSCRIPT_SIGNATURE_KEY not configured, skipping verification');
    return true;
  }
  
  try {
    // Parse header: t=timestamp,v1=signature
    const parts = signatureHeader.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
    const signature = parts.find(p => p.startsWith('v1='))?.split('=')[1];
    
    if (!timestamp || !signature) {
      return false;
    }
    
    // Check timestamp is within 5 minutes
    const timestampMs = parseInt(timestamp) * 1000;
    const now = Date.now();
    if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
      console.warn('Webhook timestamp too old');
      return false;
    }
    
    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.signatureKey)
      .update(signedPayload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}
