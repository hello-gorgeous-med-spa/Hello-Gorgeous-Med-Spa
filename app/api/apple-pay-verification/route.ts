// ============================================================
// APPLE PAY DOMAIN VERIFICATION
// Serves the Square/Apple verification file with full control
// to avoid truncation, redirect, or download issues.
// ============================================================

import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Prefer Square_Apple_Pay (new download from Square) if it exists
    const squarePath = join(process.cwd(), 'public', 'SQUARE_APPLE_PAY');
    const wellKnownPath = join(process.cwd(), 'public', '.well-known', 'apple-developer-merchantid-domain-association');
    let raw = '';
    try {
      raw = readFileSync(squarePath, 'utf-8');
    } catch {
      raw = readFileSync(wellKnownPath, 'utf-8');
    }
    // Serve raw content as-is — Square may expect hex format (their download format)
    const content = raw.trim();

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="apple-developer-merchantid-domain-association"',
        'Content-Length': Buffer.byteLength(content, 'utf-8').toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[Apple Pay verification] Error:', error);
    return new NextResponse('Not Found', { status: 404 });
  }
}
