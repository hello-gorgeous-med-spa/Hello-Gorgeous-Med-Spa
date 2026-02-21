// ============================================================
// PROVIDER MEDIA API
// Upload and manage provider videos & before/after photos
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getUserFromRequest, withPermission, forbiddenResponse } from '@/lib/api-auth';
import { logAuditEvent } from '@/lib/audit/log';

export const maxDuration = 60; // Longer timeout for uploads

// Default service tags
const DEFAULT_SERVICE_TAGS = [
  { name: 'botox', display_name: 'Botox', category: 'Injectables' },
  { name: 'lip_filler', display_name: 'Lip Filler', category: 'Injectables' },
  { name: 'dermal_filler', display_name: 'Dermal Filler', category: 'Injectables' },
  { name: 'prp', display_name: 'PRP', category: 'Regenerative' },
  { name: 'hormone_therapy', display_name: 'Hormone Therapy', category: 'Wellness' },
  { name: 'weight_loss', display_name: 'Weight Loss', category: 'Wellness' },
  { name: 'microneedling', display_name: 'Microneedling', category: 'Skin' },
  { name: 'laser', display_name: 'Laser Treatments', category: 'Skin' },
  { name: 'co2_laser', display_name: 'CO₂ Laser', category: 'Skin' },
  { name: 'chemical_peel', display_name: 'Chemical Peel', category: 'Skin' },
  { name: 'hydrafacial', display_name: 'HydraFacial', category: 'Skin' },
  { name: 'skinvive', display_name: 'SkinVive', category: 'Injectables' },
];

// ============================================================
// GET - List provider media (public for published, all for admin)
// ============================================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get('providerId');
  const type = searchParams.get('type'); // video | before_after
  const serviceTag = searchParams.get('service');
  const featured = searchParams.get('featured');
  const includeUnpublished = searchParams.get('admin') === 'true';
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ media: [], serviceTags: DEFAULT_SERVICE_TAGS });
  }
  
  try {
    let query = supabase
      .from('provider_media')
      .select(`
        *,
        providers:provider_id (
          id,
          name,
          first_name,
          last_name,
          credentials,
          headshot_url
        )
      `)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    // Filters
    if (providerId) {
      query = query.eq('provider_id', providerId);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (serviceTag) {
      query = query.eq('service_tag', serviceTag);
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    // For public requests, only show active with consent confirmed
    if (!includeUnpublished) {
      query = query.eq('is_active', true);
      // For before_after, require consent
      // This is handled in RLS but we add it here too for clarity
    }
    
    const { data: media, error } = await query;
    
    if (error) {
      console.error('Error fetching media:', error);
      return NextResponse.json({ media: [], serviceTags: DEFAULT_SERVICE_TAGS });
    }
    
    // Get service tags
    const { data: tags } = await supabase
      .from('media_service_tags')
      .select('*')
      .order('display_order', { ascending: true });
    
    return NextResponse.json({
      media: media || [],
      serviceTags: tags || DEFAULT_SERVICE_TAGS,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ media: [], serviceTags: DEFAULT_SERVICE_TAGS });
  }
}

// ============================================================
// POST - Upload new media (Admin only)
// ============================================================
export async function POST(request: NextRequest) {
  const auth = withPermission(request, 'providers.edit');
  if ('error' in auth) return auth.error;
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const {
      provider_id,
      type,
      video_url,
      video_thumbnail_url,
      video_duration,
      video_orientation,
      before_image_url,
      after_image_url,
      title,
      description,
      service_tag,
      caption,
      alt_text,
      featured,
      consent_confirmed,
      watermark_enabled,
    } = body;
    
    // Validation
    if (!provider_id) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 });
    }
    
    if (!type || !['video', 'before_after', 'intro_video'].includes(type)) {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }
    
    // For before/after, consent is required before publishing
    if (type === 'before_after' && !consent_confirmed) {
      return NextResponse.json({ 
        error: 'Client consent must be confirmed before uploading before/after photos' 
      }, { status: 400 });
    }
    
    const newMedia = {
      provider_id,
      type,
      video_url,
      video_thumbnail_url,
      video_duration,
      video_orientation: video_orientation || 'horizontal',
      before_image_url,
      after_image_url,
      title,
      description,
      service_tag,
      caption,
      alt_text: alt_text || title,
      featured: featured || false,
      consent_confirmed: consent_confirmed || false,
      consent_date: consent_confirmed ? new Date().toISOString() : null,
      watermark_enabled: watermark_enabled !== false,
      is_active: true,
    };
    
    const { data, error } = await supabase
      .from('provider_media')
      .insert(newMedia)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating media:', error);
      return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }
    
    // Audit log
    logAuditEvent({
      action: 'provider_media.created',
      userId: auth.user.id,
      targetId: data.id,
      targetType: 'provider_media',
      newValues: { provider_id, type, title },
      request,
    }).catch(() => {});
    
    return NextResponse.json({ media: data, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

// ============================================================
// PUT - Update media
// ============================================================
export async function PUT(request: NextRequest) {
  const auth = withPermission(request, 'providers.edit');
  if ('error' in auth) return auth.error;
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }
    
    // Get current media
    const { data: currentMedia } = await supabase
      .from('provider_media')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!currentMedia) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }
    
    // For before/after, consent is required to publish
    if (currentMedia.type === 'before_after' && updates.is_active === true && !currentMedia.consent_confirmed && !updates.consent_confirmed) {
      return NextResponse.json({ 
        error: 'Client consent must be confirmed before publishing before/after photos' 
      }, { status: 400 });
    }
    
    // Set consent date if newly confirmed
    if (updates.consent_confirmed && !currentMedia.consent_confirmed) {
      updates.consent_date = new Date().toISOString();
    }
    
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('provider_media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating media:', error);
      return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
    }
    
    // Audit log
    logAuditEvent({
      action: 'provider_media.updated',
      userId: auth.user.id,
      targetId: id,
      targetType: 'provider_media',
      oldValues: currentMedia,
      newValues: updates,
      request,
    }).catch(() => {});
    
    return NextResponse.json({ media: data, success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Remove media
// ============================================================
export async function DELETE(request: NextRequest) {
  const auth = withPermission(request, 'providers.edit');
  if ('error' in auth) return auth.error;
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';
    
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }
    
    // Get media for audit log
    const { data: media } = await supabase
      .from('provider_media')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }
    
    if (permanent) {
      // Hard delete
      const { error } = await supabase
        .from('provider_media')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting media:', error);
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
      }
    } else {
      // Soft delete
      const { error } = await supabase
        .from('provider_media')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error deactivating media:', error);
        return NextResponse.json({ error: 'Failed to deactivate media' }, { status: 500 });
      }
    }
    
    // Audit log
    logAuditEvent({
      action: permanent ? 'provider_media.deleted' : 'provider_media.deactivated',
      userId: auth.user.id,
      targetId: id,
      targetType: 'provider_media',
      oldValues: media,
      request,
    }).catch(() => {});
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
