// ============================================================
// CMS PAGES API
// Full CRUD for website pages - NO DEV REQUIRED
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// ============================================================
// GET - List pages or get single page
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const includeVersions = searchParams.get('versions') === 'true';

    // Get single page by slug or ID
    if (slug || id) {
      let query = supabase.from('cms_pages').select('*');
      
      if (slug) {
        query = query.eq('slug', slug);
      } else if (id) {
        query = query.eq('id', id);
      }
      
      const { data: page, error } = await query.single();
      
      if (error || !page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }

      // Get versions if requested
      let versions = [];
      if (includeVersions) {
        const { data: versionData } = await supabase
          .from('cms_page_versions')
          .select('*')
          .eq('page_id', page.id)
          .order('version_number', { ascending: false })
          .limit(20);
        versions = versionData || [];
      }

      return NextResponse.json({ page, versions });
    }

    // List all pages
    let query = supabase
      .from('cms_pages')
      .select('id, slug, title, status, visibility, template, created_at, updated_at, published_at')
      .order('updated_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: pages, error } = await query;

    if (error) {
      console.error('Pages fetch error:', error);
      return NextResponse.json({ pages: [] });
    }

    return NextResponse.json({ pages: pages || [] });
  } catch (error) {
    console.error('CMS pages GET error:', error);
    return NextResponse.json({ pages: [] });
  }
}

// ============================================================
// POST - Create new page
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      slug,
      title,
      template = 'default',
      status = 'draft',
      visibility = 'public',
      meta_title,
      meta_description,
      sections = [],
      created_by,
    } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug and title required' }, { status: 400 });
    }

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('slug', slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 400 });
    }

    const { data: page, error } = await supabase
      .from('cms_pages')
      .insert({
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title,
        template,
        status,
        visibility,
        meta_title: meta_title || title,
        meta_description,
        sections,
        created_by,
        updated_by: created_by,
      })
      .select()
      .single();

    if (error) {
      console.error('Page create error:', error);
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('CMS pages POST error:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

// ============================================================
// PUT - Update page
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, action, updated_by, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    // Get current page
    const { data: currentPage, error: fetchError } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Handle special actions
    if (action === 'publish') {
      const { error } = await supabase
        .from('cms_pages')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          published_by: updated_by,
          updated_by,
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Page published' });
    }

    if (action === 'unpublish') {
      const { error } = await supabase
        .from('cms_pages')
        .update({
          status: 'draft',
          updated_by,
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Page unpublished' });
    }

    if (action === 'archive') {
      const { error } = await supabase
        .from('cms_pages')
        .update({
          status: 'archived',
          updated_by,
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Page archived' });
    }

    if (action === 'restore_version') {
      const { version_id } = body;
      
      const { data: version } = await supabase
        .from('cms_page_versions')
        .select('*')
        .eq('id', version_id)
        .single();

      if (!version) {
        return NextResponse.json({ error: 'Version not found' }, { status: 404 });
      }

      const { error } = await supabase
        .from('cms_pages')
        .update({
          title: version.title,
          meta_title: version.meta_title,
          meta_description: version.meta_description,
          sections: version.sections,
          updated_by,
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Version restored' });
    }

    // Regular update
    const allowedFields = [
      'slug', 'title', 'template', 'status', 'visibility',
      'meta_title', 'meta_description', 'og_image_url',
      'schema_enabled', 'no_index', 'sections',
      'publish_at', 'unpublish_at',
    ];

    const cleanUpdates: Record<string, any> = { updated_by };
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        cleanUpdates[field] = updates[field];
      }
    }

    // Sanitize slug if being updated
    if (cleanUpdates.slug) {
      cleanUpdates.slug = cleanUpdates.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      // Check for duplicate
      const { data: existing } = await supabase
        .from('cms_pages')
        .select('id')
        .eq('slug', cleanUpdates.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
      }
    }

    const { data: page, error } = await supabase
      .from('cms_pages')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error('CMS pages PUT error:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Delete page (soft delete to archive)
// ============================================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const permanent = searchParams.get('permanent') === 'true';

  if (!id) {
    return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    if (permanent) {
      // Permanent delete
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Page permanently deleted' });
    }

    // Soft delete (archive)
    const { error } = await supabase
      .from('cms_pages')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Page archived' });
  } catch (error) {
    console.error('CMS pages DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
