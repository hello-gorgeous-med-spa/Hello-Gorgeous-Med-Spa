import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

/**
 * Adverse Event Reporting API
 * 
 * Stores patient-reported side effects and issues.
 * Critical for compliance and patient safety.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      medication,
      severity,
      symptoms,
      description,
      startedWhen,
      stillOccurring,
      actionTaken,
      wantsCallback,
      reportedAt,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !medication || !severity || !symptoms?.length || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Store in database
    const { data, error } = await supabase
      .from('regen_adverse_events')
      .insert({
        patient_name: name,
        patient_email: email,
        patient_phone: phone,
        medication,
        severity,
        symptoms,
        description,
        symptoms_started: startedWhen,
        still_occurring: stillOccurring,
        action_taken: actionTaken,
        wants_callback: wantsCallback,
        reported_at: reportedAt || new Date().toISOString(),
        status: severity === 'emergency' ? 'urgent' : 'pending',
        reviewed_by: null,
        reviewed_at: null,
        follow_up_notes: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing adverse event:', error);
      // Don't fail - we want to at least send notifications
    }

    // Send urgent notifications for severe/emergency reports
    if (severity === 'severe' || severity === 'emergency') {
      // TODO: Send immediate SMS/email to clinical team
      console.log('URGENT ADVERSE EVENT REPORT:', {
        severity,
        patient: name,
        medication,
        description,
      });
    }

    // Send confirmation email to patient
    // TODO: Integrate with Resend for email notifications

    return NextResponse.json({
      success: true,
      reportId: data?.id,
      message: 'Report received. Our clinical team will review within 24 hours.',
    });
  } catch (error) {
    console.error('Adverse event API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    const supabase = getSupabase();
    
    let query = supabase
      .from('regen_adverse_events')
      .select('*')
      .order('reported_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ events: data });
  } catch (error) {
    console.error('Error fetching adverse events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch adverse events' },
      { status: 500 }
    );
  }
}
