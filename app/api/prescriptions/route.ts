// ============================================================
// API: PRESCRIPTIONS (eRX)
// Prescription management for med spa
// Integrates with eFax for sending to pharmacies
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

// Common med spa medications with pre-filled SIGs
export const MEDICATION_TEMPLATES = [
  // Antivirals (for lip filler patients)
  {
    id: 'valacyclovir-500',
    name: 'Valacyclovir (Valtrex)',
    strength: '500mg',
    form: 'Tablet',
    category: 'Antiviral',
    defaultSig: 'Take 1 tablet by mouth twice daily for 5 days',
    defaultQuantity: 10,
    defaultRefills: 2,
    notes: 'Cold sore prophylaxis for filler patients',
  },
  {
    id: 'valacyclovir-1g',
    name: 'Valacyclovir (Valtrex)',
    strength: '1g',
    form: 'Tablet',
    category: 'Antiviral',
    defaultSig: 'Take 1 tablet by mouth twice daily for 1 day at first sign of outbreak',
    defaultQuantity: 2,
    defaultRefills: 3,
    notes: 'PRN cold sore treatment',
  },
  // Antibiotics
  {
    id: 'doxycycline-100',
    name: 'Doxycycline',
    strength: '100mg',
    form: 'Capsule',
    category: 'Antibiotic',
    defaultSig: 'Take 1 capsule by mouth twice daily for 7 days',
    defaultQuantity: 14,
    defaultRefills: 0,
    notes: 'Post-procedure prophylaxis',
  },
  {
    id: 'cephalexin-500',
    name: 'Cephalexin (Keflex)',
    strength: '500mg',
    form: 'Capsule',
    category: 'Antibiotic',
    defaultSig: 'Take 1 capsule by mouth four times daily for 7 days',
    defaultQuantity: 28,
    defaultRefills: 0,
    notes: 'Skin infection treatment',
  },
  {
    id: 'azithromycin-zpak',
    name: 'Azithromycin (Z-Pack)',
    strength: '250mg',
    form: 'Tablet',
    category: 'Antibiotic',
    defaultSig: 'Take 2 tablets day 1, then 1 tablet daily for 4 days',
    defaultQuantity: 6,
    defaultRefills: 0,
    notes: 'Bacterial infection',
  },
  // Topicals
  {
    id: 'mupirocin-2',
    name: 'Mupirocin (Bactroban)',
    strength: '2%',
    form: 'Ointment',
    category: 'Topical Antibiotic',
    defaultSig: 'Apply to affected area three times daily for 7 days',
    defaultQuantity: 22,
    defaultRefills: 1,
    notes: 'Topical skin infection',
  },
  {
    id: 'tretinoin-025',
    name: 'Tretinoin',
    strength: '0.025%',
    form: 'Cream',
    category: 'Retinoid',
    defaultSig: 'Apply a pea-sized amount to face at bedtime',
    defaultQuantity: 45,
    defaultRefills: 3,
    notes: 'Anti-aging, acne',
  },
  {
    id: 'tretinoin-05',
    name: 'Tretinoin',
    strength: '0.05%',
    form: 'Cream',
    category: 'Retinoid',
    defaultSig: 'Apply a pea-sized amount to face at bedtime',
    defaultQuantity: 45,
    defaultRefills: 3,
    notes: 'Anti-aging, acne - higher strength',
  },
  {
    id: 'hydroquinone-4',
    name: 'Hydroquinone',
    strength: '4%',
    form: 'Cream',
    category: 'Skin Lightening',
    defaultSig: 'Apply to affected areas twice daily',
    defaultQuantity: 30,
    defaultRefills: 2,
    notes: 'Hyperpigmentation treatment',
  },
  // Anti-inflammatory
  {
    id: 'prednisone-10',
    name: 'Prednisone',
    strength: '10mg',
    form: 'Tablet',
    category: 'Corticosteroid',
    defaultSig: 'Take as directed by provider',
    defaultQuantity: 21,
    defaultRefills: 0,
    notes: 'Short-term anti-inflammatory',
  },
  {
    id: 'medrol-dosepak',
    name: 'Methylprednisolone (Medrol Dosepak)',
    strength: '4mg',
    form: 'Tablet',
    category: 'Corticosteroid',
    defaultSig: 'Take as directed on package',
    defaultQuantity: 21,
    defaultRefills: 0,
    notes: 'Tapered steroid course',
  },
  // Pain/Bruising
  {
    id: 'arnica-montana',
    name: 'Arnica Montana',
    strength: '30C',
    form: 'Pellets',
    category: 'Homeopathic',
    defaultSig: 'Dissolve 5 pellets under tongue 3 times daily',
    defaultQuantity: 80,
    defaultRefills: 2,
    notes: 'Bruising prevention (OTC)',
  },
  // Nausea (for weight loss patients)
  {
    id: 'ondansetron-4',
    name: 'Ondansetron (Zofran)',
    strength: '4mg',
    form: 'Tablet',
    category: 'Antiemetic',
    defaultSig: 'Take 1 tablet by mouth every 8 hours as needed for nausea',
    defaultQuantity: 12,
    defaultRefills: 2,
    notes: 'Nausea with GLP-1 medications',
  },
  {
    id: 'ondansetron-odt',
    name: 'Ondansetron ODT (Zofran)',
    strength: '4mg',
    form: 'Orally Disintegrating Tablet',
    category: 'Antiemetic',
    defaultSig: 'Dissolve 1 tablet on tongue every 8 hours as needed for nausea',
    defaultQuantity: 12,
    defaultRefills: 2,
    notes: 'Fast-dissolve for nausea',
  },
  // Anxiety (pre-procedure)
  {
    id: 'hydroxyzine-25',
    name: 'Hydroxyzine',
    strength: '25mg',
    form: 'Tablet',
    category: 'Anxiolytic',
    defaultSig: 'Take 1 tablet by mouth 1 hour before procedure',
    defaultQuantity: 4,
    defaultRefills: 0,
    notes: 'Pre-procedure anxiety',
  },
  // Muscle Relaxant
  {
    id: 'cyclobenzaprine-10',
    name: 'Cyclobenzaprine (Flexeril)',
    strength: '10mg',
    form: 'Tablet',
    category: 'Muscle Relaxant',
    defaultSig: 'Take 1 tablet by mouth three times daily as needed',
    defaultQuantity: 21,
    defaultRefills: 0,
    notes: 'Muscle spasm',
  },
];

// GET - Fetch prescriptions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const client_id = searchParams.get('client_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    // If requesting templates only
    if (searchParams.get('templates') === 'true') {
      return NextResponse.json({ templates: MEDICATION_TEMPLATES });
    }

    let query = supabase
      .from('prescriptions')
      .select(`
        *,
        clients:client_id (
          id,
          first_name,
          last_name,
          email,
          phone,
          date_of_birth
        ),
        providers:provider_id (
          id,
          users (
            first_name,
            last_name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (client_id) {
      query = query.eq('client_id', client_id);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Prescriptions fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data
    const prescriptions = (data || []).map((rx: any) => ({
      ...rx,
      client_name: rx.clients 
        ? `${rx.clients.first_name || ''} ${rx.clients.last_name || ''}`.trim() 
        : 'Unknown',
      client_dob: rx.clients?.date_of_birth,
      client_phone: rx.clients?.phone,
      provider_name: rx.providers?.users
        ? `${rx.providers.users.first_name || ''} ${rx.providers.users.last_name || ''}`.trim()
        : 'Unknown',
    }));

    return NextResponse.json({ prescriptions, templates: MEDICATION_TEMPLATES });
  } catch (error) {
    console.error('Prescriptions error:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

// POST - Create new prescription
export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      provider_id,
      medication_name,
      strength,
      form,
      sig,
      quantity,
      refills,
      pharmacy_name,
      pharmacy_phone,
      pharmacy_fax,
      notes,
      diagnosis,
      daw, // Dispense as written
    } = body;

    if (!client_id || !medication_name || !sig) {
      return NextResponse.json(
        { error: 'client_id, medication_name, and sig are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        client_id,
        provider_id: provider_id || null,
        medication_name,
        strength: strength || null,
        form: form || null,
        sig,
        quantity: quantity || null,
        refills: refills || 0,
        pharmacy_name: pharmacy_name || null,
        pharmacy_phone: pharmacy_phone || null,
        pharmacy_fax: pharmacy_fax || null,
        notes: notes || null,
        diagnosis: diagnosis || null,
        daw: daw || false,
        status: 'pending', // pending, sent, filled, cancelled
      })
      .select()
      .single();

    if (error) {
      console.error('Prescription insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, prescription: data });
  } catch (error) {
    console.error('Prescription POST error:', error);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}

// PUT - Update prescription
export async function PUT(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Add sent_at timestamp when marking as sent
    if (updates.status === 'sent' && !updates.sent_at) {
      updates.sent_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Prescription update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, prescription: data });
  } catch (error) {
    console.error('Prescription PUT error:', error);
    return NextResponse.json({ error: 'Failed to update prescription' }, { status: 500 });
  }
}

// DELETE - Delete prescription
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Prescription delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Prescription DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete prescription' }, { status: 500 });
  }
}
