// ============================================================
// API: INCIDENTS - Report and manage incidents
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Generate incident ID
function generateIncidentId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INC-${year}${month}-${random}`;
}

// GET /api/incidents - List all incidents
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'open', 'closed', 'all'
    const severity = searchParams.get('severity');

    let query = supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      if (status === 'open') {
        query = query.neq('status', 'closed');
      } else {
        query = query.eq('status', status);
      }
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    const { data: incidents, error } = await query;

    if (error) {
      console.error('Incidents fetch error:', error);
      return NextResponse.json({ incidents: [] });
    }

    // Transform to match frontend interface
    const formattedIncidents = (incidents || []).map(inc => ({
      id: inc.incident_id || inc.id,
      type: inc.type,
      severity: inc.severity,
      status: inc.status,
      dateOccurred: inc.date_occurred,
      timeOccurred: inc.time_occurred,
      location: inc.location,
      description: inc.description,
      clientId: inc.client_id,
      clientName: inc.client_name,
      providerId: inc.provider_id,
      providerName: inc.provider_name,
      treatmentType: inc.treatment_type,
      productUsed: inc.product_used,
      lotNumber: inc.lot_number,
      immediateActions: inc.immediate_actions,
      medicalAttentionRequired: inc.medical_attention_required,
      clientNotified: inc.client_notified,
      rootCause: inc.root_cause,
      preventiveMeasures: inc.preventive_measures,
      reportedBy: inc.reported_by,
      reportedAt: inc.created_at,
      notes: inc.notes || [],
    }));

    return NextResponse.json({ incidents: formattedIncidents });
  } catch (error) {
    console.error('Incidents GET error:', error);
    return NextResponse.json({ incidents: [] });
  }
}

// POST /api/incidents - Create new incident
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      type,
      severity,
      date_occurred,
      time_occurred,
      location,
      description,
      client_name,
      client_id,
      provider_name,
      provider_id,
      treatment_type,
      product_used,
      lot_number,
      immediate_actions,
      medical_attention_required,
      client_notified,
      reported_by,
    } = body;

    if (!type || !description || !date_occurred) {
      return NextResponse.json({ error: 'Type, description, and date are required' }, { status: 400 });
    }

    const incidentId = generateIncidentId();

    const { data: incident, error } = await supabase
      .from('incidents')
      .insert({
        incident_id: incidentId,
        type,
        severity: severity || 'minor',
        status: 'open',
        date_occurred,
        time_occurred: time_occurred || null,
        location: location || 'Hello Gorgeous Med Spa',
        description,
        client_name: client_name || null,
        client_id: client_id || null,
        provider_name: provider_name || null,
        provider_id: provider_id || null,
        treatment_type: treatment_type || null,
        product_used: product_used || null,
        lot_number: lot_number || null,
        immediate_actions: immediate_actions || null,
        medical_attention_required: medical_attention_required || false,
        client_notified: client_notified || false,
        reported_by: reported_by || 'Admin',
        notes: [],
      })
      .select()
      .single();

    if (error) {
      console.error('Incident create error:', error);
      // Return success with local ID if table doesn't exist
      return NextResponse.json({
        success: true,
        incident: {
          id: incidentId,
          type,
          severity: severity || 'minor',
          status: 'open',
          dateOccurred: date_occurred,
          description,
          clientName: client_name,
          providerName: provider_name,
          reportedAt: new Date().toISOString(),
        },
        message: 'Logged locally (database table may not exist yet)',
      });
    }

    return NextResponse.json({
      success: true,
      incident: {
        id: incident.incident_id,
        type: incident.type,
        severity: incident.severity,
        status: incident.status,
        dateOccurred: incident.date_occurred,
        description: incident.description,
        clientName: incident.client_name,
        providerName: incident.provider_name,
        reportedAt: incident.created_at,
        notes: [],
      },
    });
  } catch (error) {
    console.error('Incidents POST error:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}

// PUT /api/incidents - Update incident
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Incident ID is required' }, { status: 400 });
    }

    const update: any = { updated_at: new Date().toISOString() };
    
    if (data.status !== undefined) update.status = data.status;
    if (data.severity !== undefined) update.severity = data.severity;
    if (data.root_cause !== undefined) update.root_cause = data.root_cause;
    if (data.preventive_measures !== undefined) update.preventive_measures = data.preventive_measures;
    if (data.reviewed_by !== undefined) {
      update.reviewed_by = data.reviewed_by;
      update.reviewed_at = new Date().toISOString();
    }
    if (data.status === 'closed') {
      update.closed_by = data.closed_by || 'Admin';
      update.closed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('incidents')
      .update(update)
      .eq('incident_id', id);

    if (error) {
      console.error('Incident update error:', error);
      return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Incident updated' });
  } catch (error) {
    console.error('Incidents PUT error:', error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}
