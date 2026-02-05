// ============================================================
// SQUARE HEALTH CHECK ENDPOINT
// Internal endpoint for debugging and monitoring
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getActiveConnection, getAccessToken } from '@/lib/square/oauth';
import { decryptToken, verifyEncryptionSetup, getCurrentKeyVersion } from '@/lib/square/encryption';
import { getLocationsApiAsync } from '@/lib/square/client';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    encryption: CheckResult;
    connection: CheckResult;
    squareApi: CheckResult;
    lastWebhook: CheckResult;
    database: CheckResult;
  };
  summary: string[];
}

interface CheckResult {
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

/**
 * GET /api/square/health
 * Internal health check for Square integration
 */
export async function GET(request: NextRequest) {
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      encryption: { status: 'fail', message: 'Not checked' },
      connection: { status: 'fail', message: 'Not checked' },
      squareApi: { status: 'fail', message: 'Not checked' },
      lastWebhook: { status: 'fail', message: 'Not checked' },
      database: { status: 'fail', message: 'Not checked' },
    },
    summary: [],
  };

  const supabase = createServerSupabaseClient();

  // ============================================================
  // 1. ENCRYPTION CHECK
  // ============================================================
  try {
    const encryptionOk = verifyEncryptionSetup();
    if (encryptionOk) {
      result.checks.encryption = {
        status: 'pass',
        message: 'Encryption configured correctly',
        details: { keyVersion: getCurrentKeyVersion() },
      };
    } else {
      result.checks.encryption = {
        status: 'fail',
        message: 'Encryption verification failed',
      };
      result.summary.push('Encryption setup is broken');
    }
  } catch (error: any) {
    result.checks.encryption = {
      status: 'fail',
      message: error.message || 'Encryption check failed',
    };
    result.summary.push('SQUARE_ENCRYPTION_KEY may be missing or invalid');
  }

  // ============================================================
  // 2. CONNECTION CHECK
  // ============================================================
  try {
    const connection = await getActiveConnection();
    if (connection) {
      result.checks.connection = {
        status: 'pass',
        message: 'Square connected',
        details: {
          merchantId: connection.merchant_id,
          businessName: connection.business_name,
          locationId: connection.location_id,
          environment: connection.environment,
          status: connection.status,
        },
      };
    } else {
      result.checks.connection = {
        status: 'warn',
        message: 'No active Square connection',
      };
      result.summary.push('Square not connected - OAuth required');
    }
  } catch (error: any) {
    result.checks.connection = {
      status: 'fail',
      message: error.message || 'Connection check failed',
    };
  }

  // ============================================================
  // 3. SQUARE API CHECK (can we call Square?)
  // ============================================================
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      // Try a lightweight API call
      const locationsApi = await getLocationsApiAsync();
      if (locationsApi) {
        const { result: locationsResult } = await locationsApi.listLocations();
        const locationCount = locationsResult.locations?.length || 0;
        
        result.checks.squareApi = {
          status: 'pass',
          message: 'Square API accessible',
          details: { locationCount },
        };
      } else {
        result.checks.squareApi = {
          status: 'warn',
          message: 'Locations API not initialized',
        };
      }
    } else {
      result.checks.squareApi = {
        status: 'warn',
        message: 'No access token available',
      };
      result.summary.push('Cannot call Square API - token missing or expired');
    }
  } catch (error: any) {
    result.checks.squareApi = {
      status: 'fail',
      message: error.message || 'Square API call failed',
    };
    result.summary.push('Square API is unreachable');
  }

  // ============================================================
  // 4. LAST WEBHOOK CHECK
  // ============================================================
  try {
    const { data: lastEvent } = await supabase
      .from('square_webhook_events')
      .select('event_id, event_type, received_at, status')
      .order('received_at', { ascending: false })
      .limit(1)
      .single();

    if (lastEvent) {
      const receivedAt = new Date(lastEvent.received_at);
      const ageMinutes = Math.round((Date.now() - receivedAt.getTime()) / 60000);
      
      result.checks.lastWebhook = {
        status: ageMinutes < 60 ? 'pass' : 'warn',
        message: `Last webhook ${ageMinutes} minutes ago`,
        details: {
          eventType: lastEvent.event_type,
          status: lastEvent.status,
          receivedAt: lastEvent.received_at,
        },
      };
      
      if (ageMinutes > 1440) {
        result.summary.push('No webhooks received in 24+ hours');
      }
    } else {
      result.checks.lastWebhook = {
        status: 'warn',
        message: 'No webhook events recorded',
      };
    }
  } catch (error: any) {
    result.checks.lastWebhook = {
      status: 'warn',
      message: 'Could not check webhook history',
    };
  }

  // ============================================================
  // 5. DATABASE CHECK
  // ============================================================
  try {
    // Check critical tables exist and are accessible
    const { count: connectionsCount } = await supabase
      .from('square_connections')
      .select('*', { count: 'exact', head: true });
    
    const { count: checkoutsCount } = await supabase
      .from('terminal_checkouts')
      .select('*', { count: 'exact', head: true });

    result.checks.database = {
      status: 'pass',
      message: 'Database accessible',
      details: {
        connectionsCount,
        checkoutsCount,
      },
    };
  } catch (error: any) {
    result.checks.database = {
      status: 'fail',
      message: error.message || 'Database check failed',
    };
    result.summary.push('Database connection issue');
  }

  // ============================================================
  // DETERMINE OVERALL STATUS
  // ============================================================
  const statuses = Object.values(result.checks).map(c => c.status);
  
  if (statuses.includes('fail')) {
    result.status = 'unhealthy';
  } else if (statuses.includes('warn')) {
    result.status = 'degraded';
  } else {
    result.status = 'healthy';
  }

  if (result.summary.length === 0) {
    result.summary.push('All checks passed');
  }

  return NextResponse.json(result);
}
