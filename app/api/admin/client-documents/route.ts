// Admin API: Upload client documents (portal-visible)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DOC_TYPES = ['intake', 'consent', 'receipt', 'aftercare', 'prescription', 'lab', 'other'];
const CATEGORIES = ['clinical', 'financial', 'consent', 'intake', 'other'];

export async function GET(request: NextRequest) {
  const clientId = new URL(request.url).searchParams.get('client_id');
  if (!clientId) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('client_id', clientId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('client_id') as string;
    const title = (formData.get('title') as string) || 'Document';
    const documentType = (formData.get('document_type') as string) || 'other';
    const category = (formData.get('category') as string) || 'other';
    const description = (formData.get('description') as string) || '';

    if (!file || !clientId) return NextResponse.json({ error: 'file and client_id required' }, { status: 400 });

    const type = DOC_TYPES.includes(documentType) ? documentType : 'other';
    const cat = CATEGORIES.includes(category) ? category : 'other';
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const filename = `clients/${clientId}/docs/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from('media').upload(filename, buffer, {
      contentType: file.type || 'application/octet-stream', cacheControl: '3600', upsert: false,
    });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from('media').getPublicUrl(filename);
    const { data: doc, error: insertError } = await supabase.from('client_documents').insert({
      client_id: clientId, document_type: type, title, description: description || null,
      file_url: urlData.publicUrl, file_name: file.name, file_size_bytes: file.size, mime_type: file.type || null,
      category: cat, is_downloadable: true, status: 'active',
    }).select().single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    return NextResponse.json({ success: true, document: doc });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 });
  }
}
