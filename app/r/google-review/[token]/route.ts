import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { GOOGLE_REVIEW_URL } from '@/lib/local-seo';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const dest = GOOGLE_REVIEW_URL;

  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
    return NextResponse.redirect(dest);
  }

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    const { data: sent } = await supabase
      .from('review_requests_sent')
      .select('id, click_count')
      .eq('tracking_token', token)
      .maybeSingle();

    if (sent?.id) {
      const now = new Date().toISOString();
      await supabase.from('review_request_clicks').insert({
        sent_id: sent.id,
        tracking_token: token,
        user_agent: request.headers.get('user-agent')?.slice(0, 240) ?? null,
      });
      const patch: Record<string, unknown> = {
        click_count: (Number(sent.click_count) || 0) + 1,
      };
      if (!sent.click_count) patch.first_clicked_at = now;
      await supabase.from('review_requests_sent').update(patch).eq('id', sent.id);
    }
  }

  return NextResponse.redirect(dest);
}
