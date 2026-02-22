import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { withPermission } from '@/lib/api-auth';
import { logAuditEvent } from '@/lib/audit/log';

// Fallback providers when database is unavailable
const FALLBACK_PROVIDERS = [
  {
    id: 'a8f2e9d1-4b7c-4e5a-9f3d-2c1b8a7e6f5d',
    first_name: 'Danielle',
    last_name: 'Glazier-Alcala',
    slug: 'danielle',
    title: 'Owner & Nurse Practitioner',
    credentials: 'FNP-BC',
    bio: 'Danielle is the founder and lead aesthetic injector at Hello Gorgeous Med Spa. With years of experience in medical aesthetics, she specializes in creating natural, beautiful results.',
    headshot_url: '/images/team/danielle-glazier-alcala.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/1',
    is_active: true,
    display_order: 1,
    name: 'Danielle Glazier-Alcala',
    color: '#FF2D8E',
  },
  {
    id: 'b7e6f872-3628-418a-aefb-aca2101f7cb2',
    first_name: 'Ryan',
    last_name: 'Kent',
    slug: 'ryan',
    title: 'Medical Director & Nurse Practitioner',
    credentials: 'FNP-C',
    bio: 'Ryan brings extensive medical experience to Hello Gorgeous Med Spa, specializing in weight loss management and hormone optimization.',
    headshot_url: '/images/team/ryan-kent.jpg',
    booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/2',
    is_active: true,
    display_order: 2,
    name: 'Ryan Kent',
    color: '#2D63A4',
  },
];

// GET - List all active providers
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';
    
    if (!supabase) {
      return NextResponse.json({ providers: FALLBACK_PROVIDERS });
    }
    
    let query = supabase
      .from('providers')
      .select('*')
      .order('display_order');
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data: providers, error } = await query;
    
    if (error) {
      console.error('Error fetching providers:', error);
      return NextResponse.json({ providers: FALLBACK_PROVIDERS });
    }
    
    // Add computed name field
    const providersWithName = (providers || []).map(p => ({
      ...p,
      name: `${p.first_name} ${p.last_name || ''}`.trim(),
    }));
    
    return NextResponse.json({
      providers: providersWithName.length > 0 ? providersWithName : FALLBACK_PROVIDERS,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ providers: FALLBACK_PROVIDERS });
  }
}

// POST - Create a new provider (Admin only)
export async function POST(request: NextRequest) {
  const auth = withPermission(request, 'providers.edit');
  if ('error' in auth) return auth.error;
  
  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      slug,
      title,
      credentials,
      bio,
      philosophy,
      headshot_url,
      booking_url,
      display_order,
    } = body;
    
    if (!first_name) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }
    
    // Generate slug if not provided
    const generatedSlug = slug || `${first_name}${last_name ? '-' + last_name : ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    const newProvider = {
      first_name,
      last_name,
      slug: generatedSlug,
      title,
      credentials,
      bio,
      philosophy,
      headshot_url,
      booking_url,
      display_order: display_order || 0,
      is_active: true,
    };
    
    const { data, error } = await supabase
      .from('providers')
      .insert(newProvider)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating provider:', error);
      return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
    }
    
    logAuditEvent({
      action: 'provider.created',
      userId: auth.user.id,
      targetId: data.id,
      targetType: 'provider',
      newValues: { first_name, last_name, slug: generatedSlug },
      request,
    }).catch(() => {});
    
    return NextResponse.json({ provider: data, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
  }
}
