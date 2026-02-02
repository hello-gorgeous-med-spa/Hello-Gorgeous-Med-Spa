// ============================================================
// API: CONSENT TEMPLATES - Full CRUD with service role
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const { data: templates, error } = await supabase
      .from('consent_templates')
      .select('*')
      .order('name');

    if (error) {
      // Table might not exist - return empty
      console.error('Error fetching consent templates:', error);
      return NextResponse.json({ templates: [], error: error.message });
    }

    // Get signed counts for each template
    const templatesWithCounts = await Promise.all(
      (templates || []).map(async (template) => {
        const { count } = await supabase
          .from('client_consents')
          .select('*', { count: 'exact', head: true })
          .eq('consent_template_id', template.id);
        
        return { ...template, signed_count: count || 0 };
      })
    );

    // Get expiring soon count
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { count: expiringCount } = await supabase
      .from('client_consents')
      .select('*', { count: 'exact', head: true })
      .lt('expires_at', thirtyDaysFromNow.toISOString())
      .gt('expires_at', new Date().toISOString())
      .eq('is_valid', true);

    return NextResponse.json({
      templates: templatesWithCounts,
      stats: {
        total: templatesWithCounts.length,
        totalSigned: templatesWithCounts.reduce((sum, t) => sum + (t.signed_count || 0), 0),
        expiringSoon: expiringCount || 0,
      },
    });
  } catch (error) {
    console.error('Consents API error:', error);
    return NextResponse.json({ templates: [], stats: { total: 0, totalSigned: 0, expiringSoon: 0 } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('consent_templates')
      .insert({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: body.description || null,
        content: body.content,
        is_active: body.is_active ?? true,
        requires_witness: body.requires_witness ?? false,
        required_for_services: body.required_for_services || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Get current version to increment
    const { data: current } = await supabase
      .from('consent_templates')
      .select('version')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('consent_templates')
      .update({
        ...updateData,
        version: (current?.version || 1) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('consent_templates')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
