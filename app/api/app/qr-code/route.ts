import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

import { getAppInstallUrl } from '@/lib/app-install-url';

export async function GET(req: NextRequest) {
  const client_id = req.nextUrl.searchParams.get('client_id');
  const target = req.nextUrl.searchParams.get('target');
  const utmMedium = req.nextUrl.searchParams.get('utm_medium') ?? undefined;
  const utmCampaign = req.nextUrl.searchParams.get('utm_campaign') ?? undefined;

  let content: string;

  if (client_id) {
    content = `HGCLIENT:${client_id}`;
  } else if (target === 'app' || target === 'install') {
    content = getAppInstallUrl({
      utmSource: 'qr',
      utmMedium: utmMedium ?? 'scan',
      utmCampaign: utmCampaign ?? 'app_install',
    });
  } else {
    return NextResponse.json(
      { error: 'Provide client_id (check-in) or target=app (install QR)' },
      { status: 400 },
    );
  }

  try {
    const buffer = await QRCode.toBuffer(content, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const cacheControl = client_id ? 'private, max-age=3600' : 'public, max-age=86400';

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': cacheControl,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
