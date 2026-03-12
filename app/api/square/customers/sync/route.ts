// ============================================================
// API: SQUARE CUSTOMER SYNC
// One-time and manual import of customers from Square
// ============================================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getAccessToken } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';

const SQUARE_API_BASE = 'https://connect.squareup.com';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Get Square access token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Square not connected. Please connect Square in Settings > Payments.' 
      }, { status: 400 });
    }

    // Fetch all customers from Square
    let cursor: string | undefined;
    let allCustomers: any[] = [];
    
    do {
      const url = new URL(`${SQUARE_API_BASE}/v2/customers`);
      if (cursor) url.searchParams.set('cursor', cursor);
      url.searchParams.set('limit', '100');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-18',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Square customers API error:', errorData);
        return NextResponse.json({ 
          error: 'Failed to fetch customers from Square',
          details: errorData.errors?.[0]?.detail || 'Unknown error'
        }, { status: 500 });
      }

      const data = await response.json();
      allCustomers = allCustomers.concat(data.customers || []);
      cursor = data.cursor;
    } while (cursor);

    console.log(`Fetched ${allCustomers.length} customers from Square`);

    let syncedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Sync each customer
    for (const customer of allCustomers) {
      // Skip customers without any contact info
      if (!customer.email_address && !customer.phone_number && !customer.given_name) {
        skippedCount++;
        continue;
      }

      // Check if already exists by square_customer_id OR email
      let existingClient = null;
      
      const { data: bySquareId } = await supabase
        .from('clients')
        .select('id')
        .eq('square_customer_id', customer.id)
        .single();

      if (bySquareId) {
        existingClient = bySquareId;
      } else if (customer.email_address) {
        // Try to match by email
        const { data: byEmail } = await supabase
          .from('clients')
          .select('id')
          .eq('email', customer.email_address.toLowerCase())
          .single();
        
        if (byEmail) {
          existingClient = byEmail;
        }
      }

      const clientData = {
        square_customer_id: customer.id,
        first_name: customer.given_name || '',
        last_name: customer.family_name || '',
        email: customer.email_address?.toLowerCase() || null,
        phone: customer.phone_number?.replace(/\D/g, '') || null,
        source: existingClient ? undefined : 'square',
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(clientData).forEach(key => {
        if (clientData[key as keyof typeof clientData] === undefined) {
          delete clientData[key as keyof typeof clientData];
        }
      });

      if (existingClient) {
        // Update existing - link Square ID if not already linked
        await supabase
          .from('clients')
          .update(clientData)
          .eq('id', existingClient.id);
        updatedCount++;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('clients')
          .insert({
            ...clientData,
            created_at: customer.created_at || new Date().toISOString(),
          });
        
        if (!insertError) syncedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      updated: updatedCount,
      skipped: skippedCount,
      total: allCustomers.length,
      message: `Imported ${syncedCount} new clients, updated ${updatedCount} existing, skipped ${skippedCount} without contact info`,
    });

  } catch (error) {
    console.error('Customer sync error:', error);
    return NextResponse.json({ 
      error: 'Failed to sync customers' 
    }, { status: 500 });
  }
}

// GET - Check sync status or get customer count
export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ 
        connected: false,
        error: 'Square not connected'
      });
    }

    // Get customer count from Square
    const response = await fetch(`${SQUARE_API_BASE}/v2/customers?limit=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-18',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ 
        connected: true,
        error: 'Failed to fetch customer count'
      });
    }

    // Square doesn't return total count easily, so just indicate connected
    return NextResponse.json({
      connected: true,
      message: 'Square connected - ready to sync customers',
    });

  } catch (error) {
    return NextResponse.json({ 
      connected: false,
      error: 'Failed to check Square connection'
    });
  }
}
