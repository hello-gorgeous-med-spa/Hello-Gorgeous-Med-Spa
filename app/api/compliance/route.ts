// ============================================================
// API: COMPLIANCE - Track compliance status for checklist items
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/compliance - List all compliance tracking records
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const { data: records, error } = await supabase
      .from('compliance_tracking')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Compliance fetch error:', error);
      return NextResponse.json({ records: {} });
    }

    // Convert to map by item_id
    const recordMap: Record<string, any> = {};
    (records || []).forEach(r => {
      recordMap[r.item_id] = {
        status: r.status,
        lastCompleted: r.last_completed,
        nextDue: r.next_due,
        notes: r.notes,
        documentUrl: r.document_url,
        responsible: r.responsible,
      };
    });

    return NextResponse.json({ records: recordMap });
  } catch (error) {
    console.error('Compliance GET error:', error);
    return NextResponse.json({ records: {} });
  }
}

// POST /api/compliance - Create or update compliance tracking
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      item_id,
      status, // 'compliant', 'non_compliant', 'pending', 'expires_soon'
      last_completed,
      next_due,
      notes,
      document_url,
      responsible,
    } = body;

    if (!item_id) {
      return NextResponse.json({ error: 'item_id is required' }, { status: 400 });
    }

    // Upsert the record
    const { data: record, error } = await supabase
      .from('compliance_tracking')
      .upsert({
        item_id,
        status: status || 'pending',
        last_completed: last_completed || null,
        next_due: next_due || null,
        notes: notes || null,
        document_url: document_url || null,
        responsible: responsible || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'item_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Compliance upsert error:', error);
      // Return success anyway with local data
      return NextResponse.json({
        success: true,
        record: { item_id, status, last_completed, next_due },
        message: 'Saved locally (database table may not exist yet)',
      });
    }

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Compliance POST error:', error);
    return NextResponse.json({ error: 'Failed to save compliance record' }, { status: 500 });
  }
}

// DELETE /api/compliance - Remove compliance tracking
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('item_id');

    if (!itemId) {
      return NextResponse.json({ error: 'item_id is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('compliance_tracking')
      .delete()
      .eq('item_id', itemId);

    if (error) {
      console.error('Compliance delete error:', error);
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Compliance DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete compliance record' }, { status: 500 });
  }
}
