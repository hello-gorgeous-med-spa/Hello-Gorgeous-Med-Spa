// ============================================================
// DEBUG: Test Square API directly
// DELETE THIS FILE IN PRODUCTION
// ============================================================

import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';

const SQUARE_API_BASE = 'https://connect.squareup.com';

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
  };

  try {
    // Get access token
    const accessToken = await getAccessToken();
    results.hasAccessToken = !!accessToken;
    results.tokenLength = accessToken?.length || 0;

    if (!accessToken) {
      results.error = 'No access token available';
      return NextResponse.json(results);
    }

    // Test fetching customers directly - get 100 to see phone distribution
    const url = `${SQUARE_API_BASE}/v2/customers?limit=100`;
    console.log('[debug/square-test] Fetching:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json',
      },
    });

    results.statusCode = response.status;
    results.statusText = response.statusText;

    const data = await response.json();
    
    if (!response.ok) {
      results.error = data.errors || data;
      return NextResponse.json(results);
    }

    const customers = data.customers || [];
    const withPhone = customers.filter((c: any) => c.phone_number);
    const withEmail = customers.filter((c: any) => c.email_address);
    
    results.customerCount = customers.length;
    results.withPhoneCount = withPhone.length;
    results.withEmailCount = withEmail.length;
    results.hasCursor = !!data.cursor;
    results.sampleWithPhone = withPhone.slice(0, 3).map((c: any) => ({
      id: c.id?.slice(0, 10) + '...',
      name: `${c.given_name || ''} ${c.family_name || ''}`.trim() || 'No name',
      phone: c.phone_number?.slice(0, 6) + '...',
    }));
    results.sampleCustomers = customers.slice(0, 3).map((c: any) => ({
      id: c.id?.slice(0, 10) + '...',
      name: `${c.given_name || ''} ${c.family_name || ''}`.trim() || 'No name',
      hasEmail: !!c.email_address,
      hasPhone: !!c.phone_number,
    }));

  } catch (e) {
    results.error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
