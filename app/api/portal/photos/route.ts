import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getClientFromSession(request: NextRequest) {
  const sessionToken = request.cookies.get('portal_session')?.value;
  if (!sessionToken) return null;

  const { data: session } = await supabase
    .from('client_sessions')
    .select('client_id')
    .eq('session_token', sessionToken)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  return session?.client_id || null;
}

// GET - List treatment photos
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const treatmentType = searchParams.get('treatment');

    let query = supabase
      .from('treatment_photos')
      .select('*')
      .eq('client_id', clientId)
      .eq('client_visible', true)
      .eq('is_active', true)
      .order('taken_at', { ascending: false });

    if (treatmentType) {
      query = query.eq('treatment_type', treatmentType);
    }

    const { data: photos, error } = await query;

    if (error) {
      console.error('Photos fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
    }

    // Group by appointment for timeline view
    const groupedPhotos: Record<string, any[]> = {};
    (photos || []).forEach(photo => {
      const key = photo.appointment_id || 'general';
      if (!groupedPhotos[key]) groupedPhotos[key] = [];
      groupedPhotos[key].push({
        id: photo.id,
        type: photo.photo_type,
        url: photo.photo_url,
        thumbnail: photo.thumbnail_url,
        treatmentArea: photo.treatment_area,
        treatmentType: photo.treatment_type,
        notes: photo.notes,
        takenAt: photo.taken_at,
        daysPostTreatment: photo.days_post_treatment
      });
    });

    return NextResponse.json({ 
      photos: photos?.map(p => ({
        id: p.id,
        type: p.photo_type,
        url: p.photo_url,
        thumbnail: p.thumbnail_url,
        treatmentArea: p.treatment_area,
        treatmentType: p.treatment_type,
        notes: p.notes,
        takenAt: p.taken_at,
        daysPostTreatment: p.days_post_treatment
      })) || [],
      grouped: groupedPhotos 
    });
  } catch (error) {
    console.error('Photos error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
