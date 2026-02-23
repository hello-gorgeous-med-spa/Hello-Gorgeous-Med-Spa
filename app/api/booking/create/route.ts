// ============================================================
// API: CREATE BOOKING
// Saves appointment to database from public booking form.
// This system is the canonical source for new appointments. External systems (e.g. Fresha) are not live-integrated. No Fresha lookups.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { businessDateTimeToUTC, formatInBusinessTZ } from '@/lib/business-timezone';
import { sendAppointmentConfirmationSms, sendSmsOptInConfirmation } from '@/lib/notifications/telnyx';
import { markLeadsConverted } from '@/lib/leads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      serviceSlug,
      providerId,
      date, // ISO date string
      time, // e.g., "10:00 AM"
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      isNewClient,
      notes,
      agreeToTerms,
      agreeToSMS,
    } = body;

    // Validate required fields
    if (!serviceSlug || !providerId || !date || !time || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // 1. Get or create user AND client
    let userId: string;
    let clientId: string;
    
    // Check if user exists by email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      userId = existingUser.id;
      
      // Get or create client record for existing user
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (existingClient) {
        clientId = existingClient.id;
      } else {
        // Create client record for existing user who doesn't have one
        // Include name/contact directly on clients table for easier querying
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(),
            phone: phone,
            date_of_birth: dateOfBirth || null,
            accepts_sms_marketing: agreeToSMS,
            source: 'booking',
          })
          .select('id')
          .single();
        
        if (clientError) {
          console.error('Error creating client record:', clientError);
          return NextResponse.json(
            { error: `Failed to create client record: ${clientError.message || clientError.code}` },
            { status: 500 }
          );
        }
        clientId = newClient.id;
      }
    } else {
      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          phone: phone,
          role: 'client',
        })
        .select('id')
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        return NextResponse.json(
          { error: `Failed to create user account: ${userError.message || userError.code}` },
          { status: 500 }
        );
      }
      userId = newUser.id;

      // Create client record for new user
      // Include name/contact directly on clients table for easier querying
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          phone: phone,
          date_of_birth: dateOfBirth || null,
          accepts_sms_marketing: agreeToSMS,
          source: 'booking',
        })
        .select('id')
        .single();
      
      if (clientError) {
        console.error('Error creating client record:', clientError);
        return NextResponse.json(
          { error: `Failed to create client record: ${clientError.message || clientError.code}` },
          { status: 500 }
        );
      }
      clientId = newClient.id;
    }

    // Client Intelligence Engine: mark any leads with this email as converted
    await markLeadsConverted(supabase, email, clientId);

    // 2. Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, name, duration_minutes')
      .eq('slug', serviceSlug)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // 2.5. Resolve provider ID - may be fallback string or real UUID
    let resolvedProviderId = providerId;
    
    // Check if providerId is a fallback string (not a UUID)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(providerId);
    
    if (!isUUID) {
      // Map fallback IDs to real provider names for lookup
      const providerNameMap: Record<string, string> = {
        'ryan-kent': 'Ryan',
        'danielle-alcala': 'Danielle',
      };
      
      const searchName = providerNameMap[providerId] || providerId;
      
      // Look up provider by name
      const { data: providerLookup } = await supabase
        .from('providers')
        .select('id, users!inner(first_name)')
        .ilike('users.first_name', `%${searchName}%`)
        .limit(1)
        .single();
      
      if (providerLookup) {
        resolvedProviderId = providerLookup.id;
      } else {
        // Try to get ANY active provider as fallback
        const { data: anyProvider } = await supabase
          .from('providers')
          .select('id')
          .eq('is_active', true)
          .limit(1)
          .single();
        
        if (anyProvider) {
          resolvedProviderId = anyProvider.id;
        } else {
          return NextResponse.json(
            { error: 'No providers available' },
            { status: 404 }
          );
        }
      }
    }

    // 3. Parse date and time — BUSINESS TIMEZONE (America/Chicago). Single source of truth.
    const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) {
      return NextResponse.json(
        { error: 'Invalid time format. Use e.g. 10:00 AM' },
        { status: 400 }
      );
    }

    let hours24 = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3].toUpperCase();
    if (ampm === 'PM' && hours24 !== 12) hours24 += 12;
    if (ampm === 'AM' && hours24 === 12) hours24 = 0;

    const dateOnly = typeof date === 'string' && date.includes('T')
      ? date.slice(0, 10)
      : String(date).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    let startDateTime: Date;
    try {
      startDateTime = businessDateTimeToUTC(dateOnly, hours24, minutes);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Invalid date.' },
        { status: 400 }
      );
    }

    const durationMin = service.duration_minutes || 30;
    const endDateTime = new Date(startDateTime.getTime() + durationMin * 60 * 1000);

    // 3.5. Reject past start time (server-side guard)
    const now = new Date();
    if (startDateTime.getTime() < now.getTime() - 60 * 1000) {
      console.warn('[booking/create] Rejected past start time', { date: dateOnly, time });
      return NextResponse.json(
        { error: 'This time slot has passed. Please select a current or future time.' },
        { status: 400 }
      );
    }

    // 4. CHECK FOR DOUBLE BOOKING - Critical safety check
    const { data: existingAppointments, error: conflictError } = await supabase
      .from('appointments')
      .select('id, starts_at, ends_at')
      .eq('provider_id', resolvedProviderId)
      .neq('status', 'cancelled')
      .neq('status', 'no_show')
      .or(`and(starts_at.lt.${endDateTime.toISOString()},ends_at.gt.${startDateTime.toISOString()})`);

    if (conflictError) {
      console.error('[booking/create] Conflict check error:', conflictError);
      return NextResponse.json(
        { error: 'Unable to verify availability. Please refresh and try again, or call us.' },
        { status: 503 }
      );
    }
    if (existingAppointments && existingAppointments.length > 0) {
      console.warn('[booking/create] Double-book blocked', { providerId: resolvedProviderId, starts_at: startDateTime.toISOString() });
      return NextResponse.json(
        { 
          error: 'This time slot is no longer available. Please select a different time.',
          conflictType: 'double_booking',
          suggestRefresh: true
        },
        { status: 409 }
      );
    }

    // 4.5. Re-check immediately before insert to reduce race window
    const { data: recheckAppointments, error: recheckError } = await supabase
      .from('appointments')
      .select('id')
      .eq('provider_id', resolvedProviderId)
      .neq('status', 'cancelled')
      .neq('status', 'no_show')
      .or(`and(starts_at.lt.${endDateTime.toISOString()},ends_at.gt.${startDateTime.toISOString()})`);
    if (!recheckError && recheckAppointments && recheckAppointments.length > 0) {
      console.warn('[booking/create] Double-book blocked on re-check (race)', { providerId: resolvedProviderId, starts_at: startDateTime.toISOString() });
      return NextResponse.json(
        { error: 'This time slot was just taken. Please pick another time.', conflictType: 'double_booking', suggestRefresh: true },
        { status: 409 }
      );
    }

    // 5. Create appointment (using clientId, not userId!)
    // Populate BOTH column name variants for compatibility
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        client_id: clientId,
        provider_id: resolvedProviderId,
        service_id: service.id,
        starts_at: startDateTime.toISOString(),
        ends_at: endDateTime.toISOString(),
        status: 'confirmed',
        // Support both column names for notes
        notes: notes || null,
        client_notes: notes || null,
        // Support both column names for source
        source: 'online_booking',
        booking_source: 'online_booking',
      })
      .select('id')
      .single();

    if (appointmentError) {
      console.error('[booking/create] Insert error:', appointmentError);
      return NextResponse.json(
        { error: `Failed to create appointment: ${appointmentError.message || appointmentError.code || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const startsAtISO = startDateTime.toISOString();
    const endsAtISO = endDateTime.toISOString();
    console.log('[booking/create] Success', { appointmentId: appointment.id, providerId: resolvedProviderId, starts_at: startsAtISO, source: 'online_booking' });

    // 5.5. Client confirmation (MANDATORY) — same date/time as calendar (business timezone)
    const confirmationDateStr = formatInBusinessTZ(startsAtISO);
    const clientName = `${firstName} ${lastName}`.trim() || 'there';
    const serviceName = service.name || 'your appointment';
    let providerName = 'your provider';
    try {
      const { data: prov } = await supabase.from('providers').select('users(first_name, last_name)').eq('id', resolvedProviderId).single();
      if (prov?.users) {
        const u = (prov as any).users;
        providerName = [u.first_name, u.last_name].filter(Boolean).join(' ').trim() || providerName;
      }
    } catch (_) {}
    const locationStr = process.env.NEXT_PUBLIC_BUSINESS_LOCATION || 'Oswego, IL';
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hellogorgeousmedspa.com';
      const getAppUrl = `${baseUrl}/get-app`;
      const smsResult = await sendAppointmentConfirmationSms(
        phone,
        clientName,
        `${confirmationDateStr} with ${providerName}`,
        serviceName,
        undefined,
        getAppUrl
      );
      if (smsResult.success) {
        console.log('[booking/create] Client confirmation SMS sent successfully to', phone);
      } else {
        console.warn('[booking/create] Client confirmation SMS failed', smsResult.error);
      }
    } catch (smsErr) {
      console.error('[booking/create] Client confirmation SMS error', smsErr);
    }

    // 5.5b. Opt-in confirmation SMS (10DLC compliance - when user consented to marketing)
    if (agreeToSMS) {
      try {
        const optInResult = await sendSmsOptInConfirmation(phone);
        if (optInResult.success) {
          console.log('[booking/create] SMS opt-in confirmation sent to', phone);
        } else {
          console.warn('[booking/create] SMS opt-in confirmation failed', optInResult.error);
        }
      } catch (optInErr) {
        console.error('[booking/create] SMS opt-in confirmation error', optInErr);
      }
    }

    // 5.6. Owner/provider notification (MANDATORY)
    const ownerEmails = process.env.BOOKING_NOTIFY_EMAIL || process.env.OWNER_EMAIL || 'hello.gorgeous@hellogorgeousmedspa.com';
    if (ownerEmails) {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        try {
          const ownerRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL || 'Hello Gorgeous <onboarding@resend.dev>',
              to: ownerEmails.split(',').map((e: string) => e.trim()).filter(Boolean),
              subject: `New booking: ${serviceName} – ${confirmationDateStr}`,
              text: `New online booking.\n\nClient: ${firstName} ${lastName}\nService: ${serviceName}\nProvider: ${providerName}\nDate & time: ${confirmationDateStr}\nLocation: ${locationStr}\n\nView in admin calendar.`,
            }),
          });
          if (ownerRes.ok) {
            console.log('[booking/create] Owner notification email sent to', ownerEmails);
          } else {
            const errBody = await ownerRes.json().catch(() => ({}));
            console.warn('[booking/create] Owner notification email failed', ownerRes.status, errBody);
          }
        } catch (emailErr) {
          console.error('[booking/create] Owner notification email error', emailErr);
        }
      } else {
        console.warn('[booking/create] RESEND_API_KEY not set - owner notification not sent');
      }
    }

    // 6. Trigger consent auto-send via Telnyx SMS (for ALL clients, not just new)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Call the consent auto-send API
      const consentResponse = await fetch(`${baseUrl}/api/consents/auto-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment_id: appointment.id,
          client_id: clientId,
          service_id: service.id,
        }),
      });

      const consentResult = await consentResponse.json();
      
      if (consentResult.success) {
        console.log(`📋 Consent packets created: ${consentResult.packets_created}`);
        if (consentResult.sms_sent) {
          console.log(`📱 Consent SMS sent via Telnyx`);
        } else if (!consentResult.client_has_phone) {
          console.log(`⚠️ No phone on file - consent SMS not sent`);
        }
      } else {
        console.warn('Consent auto-send warning:', consentResult.message || consentResult.error);
      }
    } catch (consentErr) {
      console.error('Consent auto-send error:', consentErr);
      // Don't fail the booking if consent send fails
    }

    // 7. Send portal magic link so client can access their space (HIPAA: no PHI in email)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hellogorgeousmedspa.com';
      const inviteRes = await fetch(`${baseUrl}/api/auth/send-portal-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });
      const inviteData = await inviteRes.json().catch(() => ({}));
      if (inviteRes.ok && inviteData.success) {
        console.log('[booking/create] Portal magic link invite sent to', email);
      } else {
        console.warn('[booking/create] Portal invite failed or not sent', inviteRes.status, inviteData);
      }
    } catch (inviteErr) {
      console.error('[booking/create] Portal invite send error:', inviteErr);
    }

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
      starts_at: startsAtISO,
      ends_at: endsAtISO,
      message: 'Appointment booked successfully',
      consentsSent: !existingUser,
    });

  } catch (error) {
    console.error('[booking/create] Unhandled error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
