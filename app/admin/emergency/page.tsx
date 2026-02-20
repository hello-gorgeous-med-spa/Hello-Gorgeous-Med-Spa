'use client';

// ============================================================
// EMERGENCY MODE - System Status & Manual Operations
// Use this when the main system is down
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SystemCheck {
  name: string;
  status: 'checking' | 'ok' | 'error' | 'timeout';
  message: string;
  responseTime?: number;
}

export default function EmergencyPage() {
  const [checks, setChecks] = useState<SystemCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');

  // Run system checks
  const runChecks = async () => {
    setIsRunning(true);
    const results: SystemCheck[] = [];

    // Check 1: Main site
    try {
      const start = Date.now();
      const res = await fetch('/', { method: 'HEAD' });
      results.push({
        name: 'Main Website',
        status: res.ok ? 'ok' : 'error',
        message: res.ok ? 'Site is responding' : `HTTP ${res.status}`,
        responseTime: Date.now() - start,
      });
    } catch (e) {
      results.push({ name: 'Main Website', status: 'error', message: 'Cannot reach site' });
    }

    // Check 2: Appointments API
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`/api/appointments?date=${new Date().toISOString().split('T')[0]}`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      
      const data = await res.json().catch(() => ({}));
      const responseTime = Date.now() - start;
      
      if (data.code === 'DB_TIMEOUT') {
        results.push({ name: 'Appointments API', status: 'timeout', message: 'Database timeout', responseTime });
      } else if (data.source === 'local') {
        results.push({ name: 'Appointments API', status: 'error', message: 'DB not configured', responseTime });
      } else if (res.ok) {
        const count = data.appointments?.length || 0;
        results.push({ name: 'Appointments API', status: 'ok', message: `${count} appointments today`, responseTime });
      } else {
        results.push({ name: 'Appointments API', status: 'error', message: data.error || `HTTP ${res.status}`, responseTime });
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        results.push({ name: 'Appointments API', status: 'timeout', message: 'Request timed out (10s)' });
      } else {
        results.push({ name: 'Appointments API', status: 'error', message: e.message || 'Failed' });
      }
    }

    // Check 3: Dashboard API
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch('/api/dashboard', { signal: controller.signal });
      clearTimeout(timeout);
      
      const data = await res.json().catch(() => ({}));
      const responseTime = Date.now() - start;
      
      if (data.code === 'DB_TIMEOUT') {
        results.push({ name: 'Dashboard API', status: 'timeout', message: 'Database timeout', responseTime });
      } else if (data.source === 'local') {
        results.push({ name: 'Dashboard API', status: 'error', message: 'DB not configured', responseTime });
      } else if (res.ok) {
        results.push({ name: 'Dashboard API', status: 'ok', message: `${data.stats?.todayAppointments || 0} appointments today`, responseTime });
      } else {
        results.push({ name: 'Dashboard API', status: 'error', message: data.error || `HTTP ${res.status}`, responseTime });
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        results.push({ name: 'Dashboard API', status: 'timeout', message: 'Request timed out (10s)' });
      } else {
        results.push({ name: 'Dashboard API', status: 'error', message: e.message || 'Failed' });
      }
    }

    // Check 4: Providers API
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch('/api/providers', { signal: controller.signal });
      clearTimeout(timeout);
      
      const data = await res.json().catch(() => ({}));
      const responseTime = Date.now() - start;
      
      if (data.source === 'fallback') {
        results.push({ name: 'Providers API', status: 'timeout', message: 'Using fallback data', responseTime });
      } else if (res.ok) {
        results.push({ name: 'Providers API', status: 'ok', message: `${data.providers?.length || 0} providers`, responseTime });
      } else {
        results.push({ name: 'Providers API', status: 'error', message: data.error || `HTTP ${res.status}`, responseTime });
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        results.push({ name: 'Providers API', status: 'timeout', message: 'Request timed out (10s)' });
      } else {
        results.push({ name: 'Providers API', status: 'error', message: e.message || 'Failed' });
      }
    }

    // Check 5: Login API
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      
      const responseTime = Date.now() - start;
      // 401 is expected for wrong credentials - that means API is working
      if (res.status === 401) {
        results.push({ name: 'Login API', status: 'ok', message: 'Authentication working', responseTime });
      } else if (res.ok) {
        results.push({ name: 'Login API', status: 'ok', message: 'Login responding', responseTime });
      } else {
        results.push({ name: 'Login API', status: 'error', message: `HTTP ${res.status}`, responseTime });
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        results.push({ name: 'Login API', status: 'timeout', message: 'Request timed out (10s)' });
      } else {
        results.push({ name: 'Login API', status: 'error', message: e.message || 'Failed' });
      }
    }

    setChecks(results);
    setLastRun(new Date());
    setIsRunning(false);
  };

  // Auto-run on mount
  useEffect(() => {
    runChecks();
    // Also get Supabase URL from meta tag or env
    const url = (window as any).__NEXT_DATA__?.props?.pageProps?.supabaseUrl || 'Not available in client';
    setSupabaseUrl(url);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-800 border-green-300';
      case 'error': return 'bg-red-100 text-red-800 border-red-300';
      case 'timeout': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return '✅';
      case 'error': return '❌';
      case 'timeout': return '⏱️';
      default: return '⏳';
    }
  };

  const allOk = checks.length > 0 && checks.every(c => c.status === 'ok');
  const hasTimeout = checks.some(c => c.status === 'timeout');
  const hasError = checks.some(c => c.status === 'error');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border-2 border-black p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-3">
              🚨 Emergency System Status
            </h1>
            <p className="text-gray-600 mt-1">
              Use this page when the main admin system isn't responding
            </p>
          </div>
          <button
            onClick={runChecks}
            disabled={isRunning}
            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {isRunning ? 'Checking...' : '🔄 Run Checks'}
          </button>
        </div>
        {lastRun && (
          <p className="text-sm text-gray-500 mt-2">
            Last checked: {lastRun.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Overall Status */}
      {checks.length > 0 && (
        <div className={`rounded-xl border-2 p-6 ${
          allOk ? 'bg-green-50 border-green-300' : 
          hasTimeout ? 'bg-amber-50 border-amber-300' : 
          'bg-red-50 border-red-300'
        }`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {allOk ? '✅ System Healthy' : hasTimeout ? '⏱️ Database Connection Issues' : '❌ System Problems Detected'}
          </h2>
          <p className="mt-2">
            {allOk 
              ? 'All systems are operating normally. You can use the main admin dashboard.'
              : hasTimeout
              ? 'The database (Supabase) is not responding in time. This could be a temporary network issue or Supabase may be down.'
              : 'Some services are not working. Check the details below.'}
          </p>
          {hasTimeout && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800">What to do:</h3>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-amber-900">
                <li>Check <a href="https://status.supabase.com" target="_blank" rel="noopener" className="underline">Supabase Status</a> for outages</li>
                <li>Check <a href="https://vercel.com/status" target="_blank" rel="noopener" className="underline">Vercel Status</a> for deployment issues</li>
                <li>Verify environment variables in Vercel dashboard</li>
                <li>Wait 5 minutes and try again - it may be a cold start</li>
                <li>If persistent, contact support</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Individual Checks */}
      <div className="bg-white rounded-xl border-2 border-black overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-black">System Checks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {checks.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Running checks...
            </div>
          ) : (
            checks.map((check, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getStatusIcon(check.status)}</span>
                  <div>
                    <p className="font-medium text-black">{check.name}</p>
                    <p className="text-sm text-gray-600">{check.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {check.responseTime && (
                    <span className="text-sm text-gray-500">{check.responseTime}ms</span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(check.status)}`}>
                    {check.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border-2 border-black p-6">
        <h2 className="font-semibold text-black mb-4">Emergency Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span className="text-2xl">🗄️</span>
            <div>
              <p className="font-medium">Supabase Dashboard</p>
              <p className="text-sm text-gray-600">Check database directly</p>
            </div>
          </a>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span className="text-2xl">▲</span>
            <div>
              <p className="font-medium">Vercel Dashboard</p>
              <p className="text-sm text-gray-600">Check deployments & logs</p>
            </div>
          </a>
          <Link
            href="/admin"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-medium">Try Main Dashboard</p>
              <p className="text-sm text-gray-600">Attempt normal access</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Environment Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-black mb-4">Environment Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Current Time</p>
            <p className="font-mono">{new Date().toISOString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Timezone</p>
            <p className="font-mono">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-pink-50 rounded-xl border-2 border-pink-200 p-6">
        <h2 className="font-semibold text-pink-900 mb-2">Need Help?</h2>
        <p className="text-pink-800">
          If the system is down and you have urgent appointments, you can:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-pink-800">
          <li>Access appointments directly in <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="underline font-medium">Supabase</a> (Table: appointments)</li>
          <li>Use your phone's calendar as backup</li>
          <li>Call clients directly if needed</li>
        </ul>
      </div>
    </div>
  );
}
