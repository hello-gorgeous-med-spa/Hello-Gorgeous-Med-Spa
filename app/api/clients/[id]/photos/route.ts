// ============================================================
// CLIENT PHOTOS API
// Before/after photo storage
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// In-memory store (would be Supabase Storage in production)
const photoStore: Map<string, any[]> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;
  const photos = photoStore.get(clientId) || [];
  return NextResponse.json({ photos });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;
  const body = await request.json();
  
  const { type, image_data, area, notes, visit_id, service_name } = body;
  
  if (!type || !image_data) {
    return NextResponse.json(
      { error: 'type and image_data are required' },
      { status: 400 }
    );
  }

  // In production, upload to Supabase Storage and get URL
  // For now, store the base64 data directly
  const photo = {
    id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    url: image_data, // In production, this would be a storage URL
    thumbnail_url: image_data,
    area: area || 'Full Face',
    notes: notes || null,
    visit_id: visit_id || null,
    service_name: service_name || null,
    captured_at: new Date().toISOString(),
    captured_by: 'Provider', // Would be actual user in production
  };

  const existing = photoStore.get(clientId) || [];
  existing.unshift(photo);
  photoStore.set(clientId, existing);

  return NextResponse.json({ success: true, photo });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;
  const { searchParams } = new URL(request.url);
  const photoId = searchParams.get('id');

  if (!photoId) {
    return NextResponse.json(
      { error: 'Photo id is required' },
      { status: 400 }
    );
  }

  const existing = photoStore.get(clientId) || [];
  const filtered = existing.filter(p => p.id !== photoId);
  photoStore.set(clientId, filtered);

  return NextResponse.json({ success: true });
}
