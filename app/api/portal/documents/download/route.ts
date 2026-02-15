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

// GET - Download document
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Verify document belongs to client
    const { data: document, error } = await supabase
      .from('client_documents')
      .select('*')
      .eq('id', documentId)
      .eq('client_id', clientId)
      .eq('is_downloadable', true)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Log download
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await supabase.from('portal_access_log').insert({
      client_id: clientId,
      action: 'download_document',
      resource_type: 'document',
      resource_id: documentId,
      ip_address: ip,
      metadata: { file_name: document.file_name, document_type: document.document_type }
    });

    // Return signed URL for download
    const { data: signedUrl } = await supabase.storage
      .from('client-documents')
      .createSignedUrl(document.file_url, 300); // 5 min expiry

    if (!signedUrl) {
      return NextResponse.json({ download_url: document.file_url });
    }

    return NextResponse.json({ download_url: signedUrl.signedUrl, file_name: document.file_name });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
