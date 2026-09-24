import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

import { getAppInstallUrl } from '@/lib/app-install-url';
import { SITE } from '@/lib/seo';

export async function GET(req: NextRequest) {
  const client_id = req.nextUrl.searchParams.get('client_id');
  const target = req.nextUrl.searchParams.get('target');
  const utmMedium = req.nextUrl.searchParams.get('utm_medium') ?? undefined;
  const utmCampaign = req.nextUrl.searchParams.get('utm_campaign') ?? undefined;
  const widthParam = req.nextUrl.searchParams.get('width');
  const download = req.nextUrl.searchParams.get('download') === '1';
  const width = widthParam ? Math.min(2000, Math.max(128, parseInt(widthParam, 10) || 400)) : 400;

  let content: string;
  let filename = 'hello-gorgeous-qr.png';

  if (client_id) {
    content = `HGCLIENT:${client_id}`;
    filename = 'hello-gorgeous-checkin-qr.png';
  } else if (target === 'app' || target === 'install') {
    content = getAppInstallUrl({
      utmSource: 'qr',
      utmMedium: utmMedium ?? 'scan',
      utmCampaign: utmCampaign ?? 'app_install',
    });
    filename = 'hello-gorgeous-app-qr.png';
  } else if (target === 'website' || target === 'home' || target === 'site') {
    content = SITE.url;
    filename = 'hello-gorgeous-website-qr.png';
  } else {
    return NextResponse.json(
      { error: 'Provide client_id (check-in), target=app (install QR), or target=website' },
      { status: 400 },
    );
  }

  try {
    const buffer = await QRCode.toBuffer(content, {
      type: 'png',
      width,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const cacheControl = client_id ? 'private, max-age=3600' : 'public, max-age=86400';
    const headers: Record<string, string> = {
      'Content-Type': 'image/png',
      'Cache-Control': cacheControl,
    };
    if (download) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
