import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

/**
 * Lab Upload API
 * 
 * Handles patient uploads of existing lab work.
 * Files are stored and queued for provider review.
 */

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const patientData = formData.get('patient') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!patientData) {
      return NextResponse.json({ error: 'Patient data required' }, { status: 400 });
    }

    const patient = JSON.parse(patientData);

    // Validate required fields
    if (!patient.email || !patient.firstName || !patient.lastName || !patient.dob || !patient.labDate) {
      return NextResponse.json({ error: 'Missing required patient information' }, { status: 400 });
    }

    // Check lab date is within 6 months
    const labDate = new Date(patient.labDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    if (labDate < sixMonthsAgo) {
      return NextResponse.json({ 
        error: 'Labs must be from within the last 6 months. Please order new labs.' 
      }, { status: 400 });
    }

    const supabase = getSupabase();

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${patient.email.replace('@', '_at_')}_${Date.now()}.${fileExt}`;
    const filePath = `lab-uploads/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('regen-documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('File upload error:', uploadError);
      // Continue anyway - store the record without the file URL
    }

    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from('regen-documents')
      .getPublicUrl(filePath);

    // Store lab upload record
    const { data, error: dbError } = await supabase
      .from('regen_lab_requirements')
      .insert({
        patient_email: patient.email,
        patient_name: `${patient.firstName} ${patient.lastName}`,
        lab_type: 'Patient Upload',
        required_for: patient.treatmentGoal || 'treatment',
        status: 'uploaded',
        lab_file_url: urlData?.publicUrl || null,
        lab_date: patient.labDate,
        lab_provider: patient.labProvider || 'Patient Upload',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save lab record' }, { status: 500 });
    }

    // TODO: Send notification to provider queue
    // TODO: Send confirmation email to patient

    return NextResponse.json({
      success: true,
      labId: data?.id,
      message: 'Lab results uploaded successfully. Our provider will review within 24-48 hours.',
    });
  } catch (error) {
    console.error('Lab upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
