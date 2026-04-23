"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/Toast";

type Props = { appointmentId: string };

export function KioskAppointmentLink({ appointmentId }: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [outstanding, setOutstanding] = useState<string[]>([]);
  const [info, setInfo] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setInfo(null);
    setUrl(null);
    setExpiresAt(null);
    setOutstanding([]);
    try {
      const res = await fetch("/api/consents/kiosk-token", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not create kiosk link");
        return;
      }
      if (data.success === false) {
        setInfo(data.message || "No consent forms pending for this visit.");
        return;
      }
      setUrl(data.url);
      setExpiresAt(data.expires_at || null);
      setOutstanding(Array.isArray(data.outstanding_consents) ? data.outstanding_consents : []);
      toast.success("Kiosk link ready — open on the iPad");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, [appointmentId, toast]);

  const copy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }, [url, toast]);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="w-full px-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Get kiosk consent link"}
      </button>
      {info && <p className="text-xs text-gray-600">{info}</p>}
      {url && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 break-all rounded border border-gray-200 bg-white p-2">{url}</p>
          {outstanding.length > 0 && (
            <p className="text-xs text-gray-600">
              Pending: {outstanding.join(", ")}
            </p>
          )}
          {expiresAt && (
            <p className="text-xs text-amber-700">Expires {new Date(expiresAt).toLocaleTimeString()}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copy}
              className="flex-1 px-2 py-1.5 text-xs font-medium border border-black rounded-lg hover:bg-gray-50"
            >
              Copy URL
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-2 py-1.5 text-xs font-medium bg-[#FF2D8E] text-white rounded-lg hover:opacity-90"
            >
              Open
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
