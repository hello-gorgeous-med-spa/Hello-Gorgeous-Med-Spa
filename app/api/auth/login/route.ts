// ============================================================
// LOGIN API ROUTE
// Server-side authentication that can access env variables
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ROLE_PERMISSIONS } from '@/lib/hgos/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Check AUTH_CREDENTIALS (server-side env variable)
    const authCredentials = process.env.AUTH_CREDENTIALS;
    const adminKey = process.env.ADMIN_ACCESS_KEY || process.env.OWNER_LOGIN_SECRET;
    const ownerEmail = process.env.OWNER_EMAIL || 'danielle@hellogorgeousmedspa.com';

    // Try AUTH_CREDENTIALS format (email:password)
    if (authCredentials) {
      let creds = authCredentials.trim();
      // Remove leading = if present
      if (creds.startsWith('=')) creds = creds.slice(1);
      
      const colonIndex = creds.indexOf(':');
      if (colonIndex > 0) {
        const envEmail = creds.slice(0, colonIndex).trim();
        const envPassword = creds.slice(colonIndex + 1).trim();
        
        if (email.toLowerCase() === envEmail.toLowerCase() && password === envPassword) {
          console.log('✓ Admin login via AUTH_CREDENTIALS');
          return NextResponse.json({
            success: true,
            user: {
              id: 'owner-001',
              email: envEmail,
              role: 'owner',
              firstName: 'Danielle',
              lastName: 'Glazier-Alcala',
              permissions: ROLE_PERMISSIONS.owner,
              createdAt: '2024-01-01',
            },
            session: {
              access_token: `owner_token_${Date.now()}`,
              expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
            },
          });
        }
      }
    }

    // Try ADMIN_ACCESS_KEY
    if (adminKey && email.toLowerCase() === ownerEmail.toLowerCase() && password === adminKey) {
      console.log('✓ Owner login via admin key');
      return NextResponse.json({
        success: true,
        user: {
          id: 'owner-001',
          email: ownerEmail,
          role: 'owner',
          firstName: 'Danielle',
          lastName: 'Glazier-Alcala',
          permissions: ROLE_PERMISSIONS.owner,
          createdAt: '2024-01-01',
        },
        session: {
          access_token: `owner_token_${Date.now()}`,
          expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        },
      });
    }

    // If we get here, credentials didn't match
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
