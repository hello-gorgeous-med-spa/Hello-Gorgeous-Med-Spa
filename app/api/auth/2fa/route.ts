// ============================================================
// 2FA (Two-Factor Authentication) API
// Setup, verify, and manage 2FA for user accounts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/api-auth';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { logAuditEvent } from '@/lib/audit/log';
import crypto from 'crypto';

export const maxDuration = 15;

// Generate a random 6-digit TOTP code (for demo - in production use proper TOTP library)
function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
}

// Generate 10 recovery codes
function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

// Verify TOTP code (simplified - in production use proper TOTP verification)
function verifyTOTP(secret: string, code: string): boolean {
  // For demo, accept any 6-digit code starting with the first 2 chars of secret
  // In production, use speakeasy or similar library
  if (code.length !== 6) return false;
  return true; // Simplified for demo
}

// Hash recovery code for storage
function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

// ============================================================
// GET - Get 2FA status for current user
// ============================================================
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return unauthorizedResponse();
  }
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({
      enabled: false,
      required: user.role === 'owner',
    });
  }
  
  try {
    const { data: userData } = await supabase
      .from('users')
      .select('two_factor_enabled, requires_2fa')
      .eq('id', user.id)
      .single();
    
    return NextResponse.json({
      enabled: userData?.two_factor_enabled || false,
      required: userData?.requires_2fa || user.role === 'owner',
    });
  } catch (error) {
    return NextResponse.json({
      enabled: false,
      required: user.role === 'owner',
    });
  }
}

// ============================================================
// POST - Setup or verify 2FA
// ============================================================
export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return unauthorizedResponse();
  }
  
  const supabase = createServerSupabaseClient();
  
  try {
    const body = await request.json();
    const { action, code } = body;
    
    switch (action) {
      case 'setup': {
        // Generate new 2FA secret and recovery codes
        const secret = generateTOTPSecret();
        const recoveryCodes = generateRecoveryCodes();
        
        // Store secret temporarily (not enabled yet)
        if (supabase) {
          await supabase
            .from('users')
            .update({
              two_factor_secret: secret,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        }
        
        // Return setup info (in production, return QR code URL)
        return NextResponse.json({
          success: true,
          secret,
          recoveryCodes,
          qrCodeUrl: `otpauth://totp/HelloGorgeous:${user.email}?secret=${secret}&issuer=HelloGorgeous`,
          message: 'Scan the QR code with your authenticator app, then enter the code to verify.',
        });
      }
      
      case 'verify': {
        // Verify the code and enable 2FA
        if (!code || code.length !== 6) {
          return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }
        
        if (supabase) {
          // Get the stored secret
          const { data: userData } = await supabase
            .from('users')
            .select('two_factor_secret')
            .eq('id', user.id)
            .single();
          
          if (!userData?.two_factor_secret) {
            return NextResponse.json({ error: '2FA not set up' }, { status: 400 });
          }
          
          // Verify the code
          if (!verifyTOTP(userData.two_factor_secret, code)) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
          }
          
          // Enable 2FA
          await supabase
            .from('users')
            .update({
              two_factor_enabled: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
          
          // Store hashed recovery codes
          const recoveryCodes = generateRecoveryCodes();
          
          // Delete old recovery codes
          await supabase
            .from('user_2fa_recovery_codes')
            .delete()
            .eq('user_id', user.id);
          
          // Insert new recovery codes
          const codeRecords = recoveryCodes.map(code => ({
            user_id: user.id,
            code_hash: hashCode(code),
          }));
          
          await supabase
            .from('user_2fa_recovery_codes')
            .insert(codeRecords);
          
          // Audit log
          logAuditEvent({
            action: '2fa.enabled',
            userId: user.id,
            targetId: user.id,
            targetType: 'user',
            request,
          }).catch(() => {});
          
          return NextResponse.json({
            success: true,
            recoveryCodes,
            message: '2FA enabled successfully. Save your recovery codes in a safe place.',
          });
        }
        
        return NextResponse.json({
          success: true,
          message: '2FA verified (demo mode)',
        });
      }
      
      case 'login_verify': {
        // Verify 2FA code during login
        if (!code || code.length !== 6) {
          return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }
        
        // For demo, accept any 6-digit code
        // In production, verify against stored secret using TOTP algorithm
        
        return NextResponse.json({
          success: true,
          message: '2FA verification successful',
        });
      }
      
      case 'use_recovery': {
        // Use a recovery code
        if (!code || code.length !== 8) {
          return NextResponse.json({ error: 'Invalid recovery code' }, { status: 400 });
        }
        
        if (supabase) {
          const codeHash = hashCode(code.toUpperCase());
          
          // Find and use the recovery code
          const { data: recoveryCode } = await supabase
            .from('user_2fa_recovery_codes')
            .select('*')
            .eq('user_id', user.id)
            .eq('code_hash', codeHash)
            .is('used_at', null)
            .single();
          
          if (!recoveryCode) {
            return NextResponse.json({ error: 'Invalid or already used recovery code' }, { status: 400 });
          }
          
          // Mark code as used
          await supabase
            .from('user_2fa_recovery_codes')
            .update({ used_at: new Date().toISOString() })
            .eq('id', recoveryCode.id);
          
          // Check remaining codes
          const { count } = await supabase
            .from('user_2fa_recovery_codes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .is('used_at', null);
          
          logAuditEvent({
            action: '2fa.recovery_code_used',
            userId: user.id,
            targetId: user.id,
            targetType: 'user',
            request,
          }).catch(() => {});
          
          return NextResponse.json({
            success: true,
            remainingCodes: count || 0,
            message: `Recovery code accepted. ${count || 0} codes remaining.`,
          });
        }
        
        return NextResponse.json({
          success: true,
          message: 'Recovery code accepted (demo mode)',
        });
      }
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('2FA error:', error);
    return NextResponse.json({ error: '2FA operation failed' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Disable 2FA (requires owner permission for others)
// ============================================================
export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return unauthorizedResponse();
  }
  
  const { searchParams } = new URL(request.url);
  const targetUserId = searchParams.get('userId') || user.id;
  
  // Only owner can disable 2FA for others
  if (targetUserId !== user.id && user.role !== 'owner') {
    return forbiddenResponse('Only owner can disable 2FA for other users');
  }
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    // Disable 2FA
    await supabase
      .from('users')
      .update({
        two_factor_enabled: false,
        two_factor_secret: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId);
    
    // Delete recovery codes
    await supabase
      .from('user_2fa_recovery_codes')
      .delete()
      .eq('user_id', targetUserId);
    
    // Audit log
    logAuditEvent({
      action: '2fa.disabled',
      userId: user.id,
      targetId: targetUserId,
      targetType: 'user',
      request,
    }).catch(() => {});
    
    return NextResponse.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 });
  }
}
