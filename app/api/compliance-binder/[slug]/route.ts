// ============================================================
// Serve compliance binder markdown for view or download
// GET /api/compliance-binder/01-botox-complication-protocol
// GET /api/compliance-binder/01-botox-complication-protocol?download=1 → attachment
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

import { BINDER_MD_SLUGS } from '@/lib/compliance-binder-catalog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug || !BINDER_MD_SLUGS.includes(slug)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const download = request.nextUrl.searchParams.get('download') === '1';
  const baseDir = path.join(process.cwd(), 'docs', 'compliance-binder');
  const filePath = path.join(baseDir, `${slug}.md`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    if (download) {
      const filename = `${slug}.md`;
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  } catch (err) {
    console.error('[compliance-binder] read error:', err);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
