import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  const client_id = req.nextUrl.searchParams.get('client_id');
  if (!client_id) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  const content = `HGCLIENT:${client_id}`;

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

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
