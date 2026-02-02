// ============================================================
// CMS MEDIA LIBRARY API
// Centralized media management - NO DEV REQUIRED
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// ============================================================
// GET - List media or get single item
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get('id');
    const folder = searchParams.get('folder');
    const fileType = searchParams.get('type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get single media item
    if (id) {
      const { data: media, error } = await supabase
        .from('cms_media')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !media) {
        return NextResponse.json({ error: 'Media not found' }, { status: 404 });
      }

      return NextResponse.json({ media });
    }

    // List media
    let query = supabase
      .from('cms_media')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (folder && folder !== 'all') {
      query = query.eq('folder', folder);
    }

    if (fileType && fileType !== 'all') {
      query = query.eq('file_type', fileType);
    }

    if (search) {
      query = query.or(`filename.ilike.%${search}%,alt_text.ilike.%${search}%`);
    }

    const { data: media, count, error } = await query;

    if (error) {
      console.error('Media fetch error:', error);
      return NextResponse.json({ media: [], total: 0 });
    }

    // Get folders list
    const { data: folders } = await supabase
      .from('cms_media')
      .select('folder')
      .not('folder', 'is', null);

    const uniqueFolders = [...new Set((folders || []).map(f => f.folder))];

    return NextResponse.json({ 
      media: media || [], 
      total: count || 0,
      folders: uniqueFolders,
    });
  } catch (error) {
    console.error('CMS media GET error:', error);
    return NextResponse.json({ media: [], total: 0 });
  }
}

// ============================================================
// POST - Upload/register media
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      filename,
      original_filename,
      url,
      thumbnail_url,
      file_type,
      mime_type,
      file_size,
      alt_text,
      caption,
      tags = [],
      width,
      height,
      duration,
      folder = 'general',
      uploaded_by,
    } = body;

    if (!filename || !url) {
      return NextResponse.json({ error: 'Filename and URL required' }, { status: 400 });
    }

    const { data: media, error } = await supabase
      .from('cms_media')
      .insert({
        filename,
        original_filename,
        url,
        thumbnail_url,
        file_type: file_type || detectFileType(mime_type || ''),
        mime_type,
        file_size,
        alt_text,
        caption,
        tags,
        width,
        height,
        duration,
        folder,
        uploaded_by,
      })
      .select()
      .single();

    if (error) {
      console.error('Media create error:', error);
      return NextResponse.json({ error: 'Failed to save media' }, { status: 500 });
    }

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('CMS media POST error:', error);
    return NextResponse.json({ error: 'Failed to save media' }, { status: 500 });
  }
}

// ============================================================
// PUT - Update media metadata
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    const allowedFields = ['alt_text', 'caption', 'tags', 'folder'];
    const cleanUpdates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        cleanUpdates[field] = updates[field];
      }
    }

    const { data: media, error } = await supabase
      .from('cms_media')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('CMS media PUT error:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Delete media
// ============================================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    // Get media info for storage cleanup
    const { data: media } = await supabase
      .from('cms_media')
      .select('url')
      .eq('id', id)
      .single();

    // Delete from database
    const { error } = await supabase
      .from('cms_media')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // TODO: Also delete from storage if using Supabase storage
    // This would require extracting the path from the URL and calling storage.remove()

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CMS media DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

// Helper function
function detectFileType(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'document';
  return 'other';
}
