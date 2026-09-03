/**
 * FormuConnect API Client — Formulation Rx Integration for REGEN RX
 * 
 * Handles order submission, status tracking, and product catalog sync
 * with Formulation Rx's compounding pharmacy platform.
 */

const FORMUCONNECT_API_KEY = process.env.FORMUCONNECT_API_KEY;
const FORMUCONNECT_BASE_URL = process.env.FORMUCONNECT_API_URL || 'https://api.formuconnect.com';

export interface FormuConnectPatient {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  email?: string;
  phone?: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface FormuConnectPrescription {
  productId: string;       // FormuConnect catalog product ID
  productName?: string;    // Human-readable name
  quantity: number;
  sig?: string;            // Prescribing instructions
  refills?: number;
  daysSupply?: number;
}

export interface FormuConnectOrder {
  patient: FormuConnectPatient;
  prescriptions: FormuConnectPrescription[];
  prescriberId?: string;   // NPI or FormuConnect provider ID
  notes?: string;
  metadata?: Record<string, string>;
}

export interface FormuConnectOrderResponse {
  success: boolean;
  orderId?: string;
  status?: string;
  message?: string;
  trackingNumber?: string;
  estimatedShipDate?: string;
}

export interface FormuConnectOrderStatus {
  orderId: string;
  status: 'pending' | 'processing' | 'compounding' | 'quality_check' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  shipDate?: string;
  estimatedDelivery?: string;
  updatedAt: string;
}

/**
 * Check if FormuConnect API is configured
 */
export function isFormuConnectConfigured(): boolean {
  return !!FORMUCONNECT_API_KEY;
}

/**
 * Make authenticated request to FormuConnect API
 */
async function formuConnectRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!FORMUCONNECT_API_KEY) {
    throw new Error('FormuConnect API key not configured');
  }

  const url = `${FORMUCONNECT_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${FORMUCONNECT_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client': 'regen-rx',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[formuconnect] API error ${response.status}:`, errorText);
    throw new Error(`FormuConnect API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Test API connection
 */
export async function testFormuConnectConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Try to hit a basic endpoint to verify credentials
    const result = await formuConnectRequest<{ status?: string }>('/v1/ping');
    return { success: true, message: result.status || 'Connected' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

/**
 * Submit a new prescription order
 */
export async function submitFormuConnectOrder(
  order: FormuConnectOrder
): Promise<FormuConnectOrderResponse> {
  return formuConnectRequest<FormuConnectOrderResponse>('/v1/orders', {
    method: 'POST',
    body: JSON.stringify({
      patient: order.patient,
      prescriptions: order.prescriptions,
      prescriber_id: order.prescriberId,
      notes: order.notes,
      metadata: {
        source: 'regen-rx',
        ...order.metadata,
      },
    }),
  });
}

/**
 * Get order status by ID
 */
export async function getFormuConnectOrderStatus(
  orderId: string
): Promise<FormuConnectOrderStatus> {
  return formuConnectRequest<FormuConnectOrderStatus>(`/v1/orders/${orderId}`);
}

/**
 * Get product catalog (formulary)
 */
export async function getFormuConnectCatalog(
  category?: string
): Promise<{ products: Array<{ id: string; name: string; category: string; price?: number }> }> {
  const endpoint = category 
    ? `/v1/products?category=${encodeURIComponent(category)}`
    : '/v1/products';
  return formuConnectRequest(endpoint);
}

/**
 * Cancel an order (if still possible)
 */
export async function cancelFormuConnectOrder(
  orderId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  return formuConnectRequest(`/v1/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
