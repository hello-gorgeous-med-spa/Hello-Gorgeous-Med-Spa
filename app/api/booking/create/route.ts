// ============================================================
// API: CREATE BOOKING
// Saves appointment to database from public booking form
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

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

    const supabase = createServerSupabaseClient();

    // 1. Get or create user
    let userId: string;
    
    // Check if user exists by email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      userId = existingUser.id;
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

      // Create client record
      await supabase
        .from('clients')
        .insert({
          user_id: userId,
          date_of_birth: dateOfBirth || null,
          accepts_sms_marketing: agreeToSMS,
        });
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

    // 4. Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        client_id: userId,
        provider_id: providerId,
        service_id: service.id,
        starts_at: startDateTime.toISOString(),
        ends_at: endDateTime.toISOString(),
        status: 'scheduled',
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

    return NextResponse.json({
      success: true,
      appointmentId: appointment.id,
      message: 'Appointment booked successfully',
    });

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
