// ============================================================
// API: CREATE BOOKING
// Saves appointment to database from public booking form
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

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
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            user_id: userId,
            date_of_birth: dateOfBirth || null,
            accepts_sms_marketing: agreeToSMS,
          })
          .select('id')
          .single();
        
        if (clientError) {
          console.error('Error creating client record:', clientError);
          return NextResponse.json(
            { error: 'Failed to create client record' },
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
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }
      userId = newUser.id;

      // Create client record for new user
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: userId,
          date_of_birth: dateOfBirth || null,
          accepts_sms_marketing: agreeToSMS,
        })
        .select('id')
        .single();
      
      if (clientError) {
        console.error('Error creating client record:', clientError);
        return NextResponse.json(
          { error: 'Failed to create client record' },
          { status: 500 }
        );
      }
      clientId = newClient.id;
    }

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

    // 3. Parse date and time
    // Convert "10:00 AM" to 24h format
    const timeParts = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeParts) {
      return NextResponse.json(
        { error: 'Invalid time format' },
        { status: 400 }
      );
    }

    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const ampm = timeParts[3].toUpperCase();

    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + (service.duration_minutes || 30));

    // 4. CHECK FOR DOUBLE BOOKING - Critical safety check
    const { data: existingAppointments, error: conflictError } = await supabase
      .from('appointments')
      .select('id, starts_at, ends_at')
      .eq('provider_id', providerId)
      .neq('status', 'cancelled')
      .neq('status', 'no_show')
      .or(`and(starts_at.lt.${endDateTime.toISOString()},ends_at.gt.${startDateTime.toISOString()})`);

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError);
      // Continue with booking if conflict check fails - better to book than block
    } else if (existingAppointments && existingAppointments.length > 0) {
      return NextResponse.json(
        { 
          error: 'This time slot is no longer available. Please select a different time.',
          conflictType: 'double_booking',
          suggestRefresh: true
        },
        { status: 409 }
      );
    }

    // 5. Create appointment (using clientId, not userId!)
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        client_id: clientId,
        provider_id: providerId,
        service_id: service.id,
        starts_at: startDateTime.toISOString(),
        ends_at: endDateTime.toISOString(),
        status: 'confirmed',
        notes: notes || null,
        source: 'online_booking',
      })
      .select('id')
      .single();

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
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

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
      message: 'Appointment booked successfully',
      consentsSent: !existingUser, // Let frontend know consents were sent
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
