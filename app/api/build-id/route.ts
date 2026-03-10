// So you can confirm which deploy is live (Vercel sets VERCEL_GIT_COMMIT_SHA)
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || null;
  return NextResponse.json({ commit });
}
