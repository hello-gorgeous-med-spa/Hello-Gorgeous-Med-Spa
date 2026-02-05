// ============================================================
// LOGIN API ROUTE
// Server-side authentication that can access env variables
// Sets HTTP-only session cookie for middleware authentication
// INCLUDES: HIPAA audit logging for all login attempts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ROLE_PERMISSIONS } from '@/lib/hgos/auth';
import { auditAuthLogin } from '@/lib/audit/middleware';

// Helper to create authenticated response with session cookie
function createAuthResponse(user: any, session: any) {
  const response = NextResponse.json({
    success: true,
    user,
    session,
  });

  // Set the session cookie server-side (this is the KEY fix)
  // This cookie is what middleware.ts checks for authentication
  const cookieValue = JSON.stringify({ 
    userId: user.id, 
    role: user.role,
    email: user.email,
  });
  
  const expiresAt = new Date(session.expires_at * 1000);
  const isProduction = process.env.NODE_ENV === 'production';
  
  response.cookies.set('hgos_session', encodeURIComponent(cookieValue), {
    path: '/',
    expires: expiresAt,
    httpOnly: false, // Needs to be readable by client for logout
    secure: isProduction, // Only require HTTPS in production
    sameSite: 'lax',
  });

  return response;
}

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
          
          const user = {
            id: 'owner-001',
            email: envEmail,
            role: 'owner',
            firstName: 'Danielle',
            lastName: 'Glazier-Alcala',
            permissions: ROLE_PERMISSIONS.owner,
            createdAt: '2024-01-01',
          };
          
          const session = {
            access_token: `owner_token_${Date.now()}`,
            expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
          };
          
          // AUDIT LOG: Successful login
          await auditAuthLogin(user.id, user.email, true, request);
          
          return createAuthResponse(user, session);
        }
      }
    }

    // Try ADMIN_ACCESS_KEY
    if (adminKey && email.toLowerCase() === ownerEmail.toLowerCase() && password === adminKey) {
      console.log('✓ Owner login via admin key');
      
      const user = {
        id: 'owner-001',
        email: ownerEmail,
        role: 'owner',
        firstName: 'Danielle',
        lastName: 'Glazier-Alcala',
        permissions: ROLE_PERMISSIONS.owner,
        createdAt: '2024-01-01',
      };
      
      const session = {
        access_token: `owner_token_${Date.now()}`,
        expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      };
      
      // AUDIT LOG: Successful login
      await auditAuthLogin(user.id, user.email, true, request);
      
      return createAuthResponse(user, session);
    }

    // If we get here, credentials didn't match
    // AUDIT LOG: Failed login attempt
    await auditAuthLogin('unknown', email, false, request);
    
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
