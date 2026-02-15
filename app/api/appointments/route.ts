// ============================================================
import { createClient } from '@supabase/supabase-js';
// API: APPOINTMENTS - Full CRUD with service role (bypasses RLS)
// INCLUDES: Consent enforcement, audit logging
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { businessDayToISOBounds } from '@/lib/business-timezone';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

// Helper to safely create supabase client
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  try {
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// ============================================================
// CONSENT ENFORCEMENT HELPER
// Checks if client has required consents before treatment completion
// ============================================================
async function checkConsentRequirements(
  supabase: any, 
  clientId: string, 
  serviceId?: string
): Promise<{ valid: boolean; missing: string[]; details: any[] }> {
  // Required consent types for any treatment
  const REQUIRED_CONSENTS = [
    'hipaa_authorization',
    'general_treatment',
  ];
  
  // Service-specific consents (would be configurable per service)
  const SERVICE_CONSENTS: Record<string, string[]> = {
    // Injectable services require additional consent
    injectable: ['injectable_consent'],
    botox: ['injectable_consent'],
    filler: ['injectable_consent', 'filler_consent'],
    // Add more service types as needed
  };
  
  try {
    // Get all signed (active) consents for this client
    const { data: signedConsents, error } = await supabase
      .from('signed_consents')
      .select('form_type, signed_at, expires_at, status')
      .eq('client_id', clientId)
      .eq('status', 'signed');
    
    if (error) {
      console.error('Error checking consents:', error);
      // Don't block on error - but log it
      return { valid: true, missing: [], details: [] };
    }
    
    const signedTypes = new Set((signedConsents || []).map((c: any) => c.form_type));
    const missing: string[] = [];
    
    // Check required consents
    for (const required of REQUIRED_CONSENTS) {
      if (!signedTypes.has(required)) {
        missing.push(required);
      }
    }
    
    // Check service-specific consents if service provided
    if (serviceId) {
      // Get service name to determine type
      const { data: service } = await supabase
        .from('services')
        .select('name, category')
        .eq('id', serviceId)
        .single();
      
      if (service) {
        const serviceName = service.name?.toLowerCase() || '';
        const category = service.category?.toLowerCase() || '';
        
        // Check if service requires specific consents
        for (const [keyword, consents] of Object.entries(SERVICE_CONSENTS)) {
          if (serviceName.includes(keyword) || category.includes(keyword)) {
            for (const consent of consents) {
              if (!signedTypes.has(consent)) {
                missing.push(consent);
              }
            }
          }
        }
      }
    }
    
    return {
      valid: missing.length === 0,
      missing,
      details: signedConsents || [],
    };
  } catch (err) {
    console.error('Consent check error:', err);
    return { valid: true, missing: [], details: [] };
  }
}

// ============================================================
// AUDIT LOGGING HELPER
// ============================================================
async function logAppointmentAction(
  supabase: any,
  action: string,
  appointmentId: string,
  userId?: string,
  details?: any,
  request?: NextRequest
) {
  try {
    const ipAddress = request?.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request?.headers.get('x-real-ip') || 'unknown';
    const userAgent = request?.headers.get('user-agent') || 'unknown';
    
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: 'appointment',
        resource_id: appointmentId,
        description: `Appointment ${action}`,
        new_values: details,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

// In-memory store for when DB is unavailable
const appointmentStore: Map<string, any> = new Map();

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  // If no DB, return empty or in-memory appointments
  if (!supabase) {
    const appointments = Array.from(appointmentStore.values());
    return NextResponse.json({ appointments, source: 'local' });
  }

  try {
    const { searchParams } = new URL(request.url);
    let date = searchParams.get('date');
    const providerId = searchParams.get('provider_id');
    let clientId = searchParams.get('client_id');
    const clientEmail = searchParams.get('email');

    if (!clientId && clientEmail?.trim()) {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('email', clientEmail.toLowerCase().trim())
        .single();
      if (client) clientId = client.id;
    }

    // Portal/client: enforce own data only (HIPAA minimum necessary)
    const sessionCookie = request.cookies.get('hgos_session');
    if (sessionCookie?.value) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie.value));
        if (session.role === 'client' && session.clientId) {
          clientId = session.clientId;
        }
      } catch {
        // ignore
      }
    }

    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:clients(
          id,
          user_id,
          first_name,
          last_name,
          email,
          phone,
          users(first_name, last_name, email, phone)
        ),
        provider:providers(
          id,
          first_name,
          last_name,
          credentials,
          color_hex,
          user_id,
          users(first_name, last_name)
        ),
        service:services(id, name, slug, price_cents, price, duration_minutes)
      `)
      .order('starts_at', { ascending: false });

    if (date) {
      const { startISO, endISO } = businessDayToISOBounds(date);
      query = query
        .gte('starts_at', startISO)
        .lt('starts_at', endISO)
        .neq('status', 'cancelled')
        .order('starts_at', { ascending: true });
    }

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // For appointments without client names via join, collect client IDs for bulk lookup
    const clientIdsNeedingLookup: string[] = [];
    
    // First pass - identify which clients need secondary lookup
    (data || []).forEach((apt: any) => {
      if (apt.client_id && (!apt.client || (!apt.client.first_name && !apt.client.users?.first_name))) {
        clientIdsNeedingLookup.push(apt.client_id);
      }
    });
    
    // Bulk lookup client details if needed
    let clientDetailsMap: Record<string, any> = {};
    if (clientIdsNeedingLookup.length > 0) {
      // Get client records
      const { data: clientDetails } = await supabase
        .from('clients')
        .select('id, user_id, first_name, last_name, email, phone')
        .in('id', clientIdsNeedingLookup);
      
      if (clientDetails) {
        // Get linked user IDs
        const userIds = clientDetails.map((c: any) => c.user_id).filter(Boolean);
        let usersMap: Record<string, any> = {};
        
        if (userIds.length > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, first_name, last_name, email, phone')
            .in('id', userIds);
          
          if (usersData) {
            usersData.forEach((u: any) => { usersMap[u.id] = u; });
          }
        }
        
        // Build the map
        clientDetails.forEach((c: any) => {
          const user = usersMap[c.user_id] || {};
          clientDetailsMap[c.id] = {
            first_name: user.first_name || c.first_name,
            last_name: user.last_name || c.last_name,
            email: user.email || c.email,
            phone: user.phone || c.phone,
          };
        });
      }
    }

    // Flatten nested data for easier use
    // Handle both direct columns (first_name on clients) and nested (users.first_name)
    const appointments = (data || []).map((apt: any) => {
      // Client name - try multiple sources
      let clientName = 'Unknown Client';
      let clientEmail = '';
      let clientPhone = '';
      
      // Check if we have supplemental lookup data
      const supplementalClient = clientDetailsMap[apt.client_id];
      
      if (apt.client) {
        // Try direct columns on clients table first
        if (apt.client.first_name || apt.client.last_name) {
          const firstName = apt.client.first_name || '';
          const lastName = apt.client.last_name || '';
          clientName = `${firstName} ${lastName}`.trim() || 'Client';
        } 
        // Try nested users table
        else if (apt.client.users?.first_name || apt.client.users?.last_name) {
          const firstName = apt.client.users.first_name || '';
          const lastName = apt.client.users.last_name || '';
          clientName = `${firstName} ${lastName}`.trim();
        }
        // Try supplemental lookup
        else if (supplementalClient && (supplementalClient.first_name || supplementalClient.last_name)) {
          const firstName = supplementalClient.first_name || '';
          const lastName = supplementalClient.last_name || '';
          clientName = `${firstName} ${lastName}`.trim();
        }
        // If still unknown, try to use email as display name
        else if (apt.client.email || apt.client.users?.email || supplementalClient?.email) {
          const email = apt.client.email || apt.client.users?.email || supplementalClient?.email;
          // Use part before @ as a display name
          clientName = email.split('@')[0].replace(/[._]/g, ' ');
          // Capitalize first letter of each word
          clientName = clientName.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        
        // Get email and phone from either location
        clientEmail = apt.client.email || apt.client.users?.email || supplementalClient?.email || '';
        clientPhone = apt.client.phone || apt.client.users?.phone || supplementalClient?.phone || '';
      } else if (supplementalClient) {
        // No client join but we have supplemental data
        if (supplementalClient.first_name || supplementalClient.last_name) {
          const firstName = supplementalClient.first_name || '';
          const lastName = supplementalClient.last_name || '';
          clientName = `${firstName} ${lastName}`.trim();
        } else if (supplementalClient.email) {
          // Use email as display name
          clientName = supplementalClient.email.split('@')[0].replace(/[._]/g, ' ');
          clientName = clientName.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        clientEmail = supplementalClient.email || '';
        clientPhone = supplementalClient.phone || '';
      }
      
      // Provider name - try direct columns first, then nested users table
      let providerName = 'Provider';
      let providerFirstName = '';
      
      // Known provider IDs from our database - always check this
      const KNOWN_PROVIDERS: Record<string, string> = {
        '47ab9361-4a68-4ab8-a860-c9c9fd64d26c': 'Ryan Kent',
        'b7e6f872-3628-418a-aefb-aca2101f7cb2': 'Danielle Alcala',
      };
      
      if (apt.provider) {
        // Try direct columns first
        if (apt.provider.first_name && apt.provider.first_name !== 'Provider') {
          providerFirstName = apt.provider.first_name;
          providerName = `${apt.provider.first_name || ''} ${apt.provider.last_name || ''}`.trim();
        } 
        // Try nested users table
        else if (apt.provider.users?.first_name) {
          providerFirstName = apt.provider.users.first_name;
          providerName = `${apt.provider.users.first_name || ''} ${apt.provider.users.last_name || ''}`.trim();
        }
        // Try KNOWN_PROVIDERS lookup using provider.id
        else if (apt.provider.id && KNOWN_PROVIDERS[apt.provider.id]) {
          providerName = KNOWN_PROVIDERS[apt.provider.id];
          providerFirstName = providerName.split(' ')[0];
        }
      }
      
      // Fallback: Always check provider_id against known providers
      if (providerName === 'Provider' && apt.provider_id && KNOWN_PROVIDERS[apt.provider_id]) {
        providerName = KNOWN_PROVIDERS[apt.provider_id];
        providerFirstName = providerName.split(' ')[0];
      }
      
      return {
        ...apt,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        provider_name: providerName,
        provider_first_name: providerFirstName,
        provider_color: apt.provider?.color_hex || '#EC4899',
        service_name: apt.service?.name || 'Service',
        service_price: apt.service?.price_cents ? apt.service.price_cents / 100 : (apt.service?.price || 0),
        duration: apt.service?.duration_minutes || 30,
      };
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Appointments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();

  // If no DB, store locally and return success
  if (!supabase) {
    const appointment = {
      id: `apt-${Date.now()}`,
      ...body,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };
    appointmentStore.set(appointment.id, appointment);
    return NextResponse.json({ appointment, source: 'local' });
  }

  try {
    // ============================================================
    // RESOLVE PROVIDER ID - Handle both UUID and string IDs
    // ============================================================
    let providerId = body.provider_id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(providerId);
    
    if (!isUUID && providerId) {
      // Try to find provider by name
      const firstName = providerId.split('-')[0]?.toLowerCase();
      
      if (firstName) {
        // First try joining with users table
        const { data: providerLookup } = await supabase
          .from('providers')
          .select('id, first_name, user_id, users(first_name)')
          .eq('is_active', true);
        
        if (providerLookup && providerLookup.length > 0) {
          // Find matching provider
          const match = providerLookup.find((p: any) => {
            const pFirstName = (p.first_name || p.users?.first_name || '').toLowerCase();
            return pFirstName === firstName || pFirstName.includes(firstName);
          });
          
          if (match) {
            providerId = match.id;
          } else {
            // Use first active provider as fallback
            providerId = providerLookup[0].id;
          }
        }
      }
    }

    // Calculate ends_at from starts_at and duration
    const startsAt = new Date(body.starts_at);
    const duration = body.duration_minutes || 30;
    const endsAt = new Date(startsAt.getTime() + duration * 60000);

    // CHECK FOR DOUBLE BOOKING - Critical safety check
    if (providerId) {
      const { data: existingAppointments, error: conflictError } = await supabase
        .from('appointments')
        .select('id, starts_at, ends_at')
        .eq('provider_id', providerId)
        .neq('status', 'cancelled')
        .neq('status', 'no_show')
        .or(`and(starts_at.lt.${endsAt.toISOString()},ends_at.gt.${startsAt.toISOString()})`);

      if (!conflictError && existingAppointments && existingAppointments.length > 0) {
        return NextResponse.json(
          { 
            error: 'This provider already has an appointment at this time. Please select a different time slot.',
            conflictType: 'double_booking',
            conflictingAppointment: existingAppointments[0].id
          },
          { status: 409 }
        );
      }
    }

    // Build insert object - populate BOTH column name variants for compatibility
    // Valid status values: pending, confirmed, checked_in, in_progress, completed, cancelled, no_show
    const insertData: any = {
      client_id: body.client_id || null,
      provider_id: providerId,
      service_id: body.service_id,
      starts_at: body.starts_at,
      ends_at: endsAt.toISOString(),
      status: 'confirmed',
      // Support both column names
      notes: body.notes || null,
      client_notes: body.notes || null,
      booking_source: 'admin_calendar',
      source: 'admin_calendar',
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Appointment insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TRIGGER PRE-TREATMENT INSTRUCTIONS
    if (data && body.client_id) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        fetch(`${baseUrl}/api/pretreatment/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointment_id: data.id,
            client_id: body.client_id,
            service_id: body.service_id,
            scheduled_at: body.starts_at,
          }),
        }).catch(err => {
          console.error('Pre-treatment send error (non-blocking):', err);
        });
      } catch (pretreatmentError) {
        console.error('Pre-treatment trigger error:', pretreatmentError);
      }
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
  }

  // If no DB, update local store
  if (!supabase) {
    const existing = appointmentStore.get(id);
    if (existing) {
      const updated = { ...existing, ...updateData };
      appointmentStore.set(id, updated);
      return NextResponse.json({ appointment: updated, source: 'local' });
    }
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  try {
    // ============================================================
    // CONSENT ENFORCEMENT - Cannot complete without valid consents
    // ============================================================
    if (updateData.status === 'completed') {
      // First get the appointment to find client and service
      const { data: existingApt, error: fetchError } = await supabase
        .from('appointments')
        .select('client_id, service_id, provider_id')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      
      if (existingApt?.client_id) {
        const consentCheck = await checkConsentRequirements(
          supabase, 
          existingApt.client_id, 
          existingApt.service_id
        );
        
        if (!consentCheck.valid) {
          // Log the blocked attempt
          await logAppointmentAction(
            supabase,
            'completion_blocked_missing_consent',
            id,
            undefined,
            { missing_consents: consentCheck.missing },
            request
          );
          
          return NextResponse.json({
            error: 'Cannot complete appointment - missing required consents',
            code: 'CONSENT_REQUIRED',
            missingConsents: consentCheck.missing,
            message: `Please ensure the following consents are signed: ${consentCheck.missing.join(', ').replace(/_/g, ' ')}`,
          }, { status: 403 });
        }
      }
      
      // Add completion timestamp
      updateData.completed_at = new Date().toISOString();
    }

    // Perform the update
    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Audit log the status change
    if (updateData.status) {
      await logAppointmentAction(
        supabase,
        `status_changed_to_${updateData.status}`,
        id,
        body.updated_by,
        { new_status: updateData.status },
        request
      );
    }

    return NextResponse.json({ appointment: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
