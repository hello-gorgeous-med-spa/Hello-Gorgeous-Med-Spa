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

// GET - List client documents
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    let query = supabase
      .from('client_documents')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      // Map portal "medical" to DB "clinical"; "instructions" to "aftercare"
      const catMap: Record<string, string | string[]> = {
        medical: ['medical', 'clinical'],
        instructions: ['instructions', 'aftercare'],
      };
      const dbCat = catMap[category] ?? category;
      if (Array.isArray(dbCat)) {
        query = query.in('category', dbCat);
      } else {
        query = query.eq('category', dbCat);
      }
    }
    if (type) query = query.eq('document_type', type);

    const { data: documents, error } = await query;

    if (error) {
      console.error('Documents fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }

    // Log access
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    await supabase.from('portal_access_log').insert({
      client_id: clientId,
      action: 'view_documents',
      resource_type: 'document_list',
      ip_address: ip,
      metadata: { category, type }
    });

    return NextResponse.json({ documents: documents || [] });
  } catch (error) {
    console.error('Documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
