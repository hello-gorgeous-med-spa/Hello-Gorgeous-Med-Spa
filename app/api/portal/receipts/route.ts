import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getClientFromSession(request: NextRequest) {
  const sessionToken = request.cookies.get('portal_session')?.value;
  if (!sessionToken) return null;

  const { data: session } = await supabase
    .from('client_sessions')
    .select('client_id')
    .eq('session_token', sessionToken)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  return session?.client_id || null;
}

// GET - List receipts
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('payment_receipts')
      .select('*')
      .eq('client_id', clientId)
      .order('receipt_date', { ascending: false })
      .limit(limit);

    if (year) {
      query = query
        .gte('receipt_date', `${year}-01-01`)
        .lte('receipt_date', `${year}-12-31`);
    }

    const { data: receipts, error } = await query;

    if (error) {
      console.error('Receipts fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 });
    }

    // Log access
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await supabase.from('portal_access_log').insert({
      client_id: clientId,
      action: 'view_receipts',
      resource_type: 'receipt_list',
      ip_address: ip
    });

    return NextResponse.json({
      receipts: (receipts || []).map(r => ({
        id: r.id,
        receiptNumber: r.receipt_number,
        date: r.receipt_date,
        subtotal: r.subtotal_cents / 100,
        discount: r.discount_cents / 100,
        tax: r.tax_cents / 100,
        tip: r.tip_cents / 100,
        total: r.total_cents / 100,
        paymentMethod: r.payment_method,
        cardBrand: r.card_brand,
        lastFour: r.last_four,
        lineItems: r.line_items || [],
        providerName: r.provider_name,
        status: r.status,
        pdfUrl: r.pdf_url
      }))
    });
  } catch (error) {
    console.error('Receipts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
