'use client';

// ============================================================
// CONSENT STATUS BADGE
// Shows consent status on appointment cards/details
// ============================================================

import { useState, useEffect } from 'react';

interface ConsentPacket {
  id: string;
  template_name: string;
  status: string;
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
}

interface ConsentSummary {
  total: number;
  signed: number;
  pending: number;
  draft: number;
  failed: number;
  overall_status: 'complete' | 'pending' | 'missing' | 'none';
}

interface ConsentStatusBadgeProps {
  appointmentId: string;
  showDetails?: boolean;
  onResend?: () => void;
  onKiosk?: () => void;
}

export default function ConsentStatusBadge({
  appointmentId,
  showDetails = false,
  onResend,
  onKiosk,
}: ConsentStatusBadgeProps) {
  const [loading, setLoading] = useState(true);
  const [packets, setPackets] = useState<ConsentPacket[]>([]);
  const [summary, setSummary] = useState<ConsentSummary | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [resending, setResending] = useState(false);
  const [generatingKiosk, setGeneratingKiosk] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/consents/status?appointment_id=${appointmentId}`);
        const data = await res.json();
        setPackets(data.packets || []);
        setSummary(data.summary || null);
      } catch (err) {
        console.error('Failed to fetch consent status:', err);
      } finally {
        setLoading(false);
      }
    }

    if (appointmentId) {
      fetchStatus();
    }
  }, [appointmentId]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch('/api/consents/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert('Consent SMS resent successfully!');
        onResend?.();
      } else {
        alert(data.error || 'Failed to resend');
      }
    } catch (err) {
      alert('Failed to resend consent SMS');
    } finally {
      setResending(false);
    }
  };

  const handleKiosk = async () => {
    setGeneratingKiosk(true);
    try {
      const res = await fetch('/api/consents/kiosk-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const data = await res.json();
      
      if (data.success) {
        // Open kiosk URL in new window/tab
        window.open(data.url, '_blank');
        onKiosk?.();
      } else {
        alert(data.message || data.error || 'Failed to generate kiosk session');
      }
    } catch (err) {
      alert('Failed to start kiosk session');
    } finally {
      setGeneratingKiosk(false);
    }
  };

  if (loading) {
    return (
      <span className="inline-flex items-center px-2 py-1 bg-white text-black text-xs rounded-full">
        <span className="animate-pulse">Loading...</span>
      </span>
    );
  }

  if (!summary || summary.total === 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 bg-white text-black text-xs rounded-full">
        No consents
      </span>
    );
  }

  // Status badge colors and icons
  const statusConfig = {
    complete: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: '✅',
      label: 'All Signed',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: '🟡',
      label: 'Pending',
    },
    missing: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: '🔴',
      label: 'Missing',
    },
    none: {
      bg: 'bg-white',
      text: 'text-black',
      icon: '⚪',
      label: 'None',
    },
  };

  const config = statusConfig[summary.overall_status];

  // Simple badge (for list views)
  if (!showDetails) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 ${config.bg} ${config.text} text-xs font-medium rounded-full`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
        {summary.overall_status !== 'complete' && (
          <span className="ml-1">({summary.signed}/{summary.total})</span>
        )}
      </span>
    );
  }

  // Detailed view with dropdown (for appointment detail)
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`inline-flex items-center gap-2 px-3 py-2 ${config.bg} ${config.text} text-sm font-medium rounded-lg hover:opacity-90 transition-opacity`}
      >
        <span>{config.icon}</span>
        <span>Consents: {summary.signed}/{summary.total}</span>
        <span className="text-xs">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-black rounded-xl shadow-lg z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-black">
            <p className="font-medium text-black">Consent Forms</p>
            <p className="text-sm text-black">
              {summary.signed} of {summary.total} signed
            </p>
          </div>

          {/* Packets list */}
          <div className="max-h-60 overflow-y-auto">
            {packets.map((packet) => (
              <div
                key={packet.id}
                className="px-4 py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-black text-sm">
                    {packet.template_name}
                  </p>
                  <StatusPill status={packet.status} />
                </div>
                <div className="mt-1 text-xs text-black space-x-3">
                  {packet.sent_at && (
                    <span>Sent: {formatTime(packet.sent_at)}</span>
                  )}
                  {packet.viewed_at && (
                    <span>Viewed: {formatTime(packet.viewed_at)}</span>
                  )}
                  {packet.signed_at && (
                    <span>Signed: {formatTime(packet.signed_at)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          {summary.overall_status !== 'complete' && (
            <div className="px-4 py-3 border-t border-black flex gap-2">
              <button
                onClick={handleResend}
                disabled={resending}
                className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {resending ? 'Sending...' : '📱 Resend SMS'}
              </button>
              <button
                onClick={handleKiosk}
                disabled={generatingKiosk}
                className="flex-1 px-3 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                {generatingKiosk ? 'Loading...' : '📱 Sign on iPad'}
              </button>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => setShowDropdown(false)}
            className="absolute top-2 right-2 text-black hover:text-black"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// Status pill helper
function StatusPill({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string }> = {
    signed: { bg: 'bg-green-100', text: 'text-green-700' },
    viewed: { bg: 'bg-blue-100', text: 'text-blue-700' },
    sent: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    draft: { bg: 'bg-white', text: 'text-black' },
  };

  const config = configs[status] || configs.draft;

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${config.bg} ${config.text}`}>
      {status.toUpperCase()}
    </span>
  );
}

// Time formatter helper
function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString();
}
