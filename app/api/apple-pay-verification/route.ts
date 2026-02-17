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
    const filePath = join(process.cwd(), 'public', '.well-known', 'apple-developer-merchantid-domain-association');
    const content = readFileSync(filePath, 'utf-8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'inline',
        'Content-Length': Buffer.byteLength(content, 'utf-8').toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[Apple Pay verification] Error:', error);
    return new NextResponse('Not Found', { status: 404 });
  }
}
