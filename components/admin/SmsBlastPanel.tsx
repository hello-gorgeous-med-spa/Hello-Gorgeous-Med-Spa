"use client";

import { useState, useCallback, type ReactNode, type DragEvent } from "react";
import {
  BLAST,
  BLAST_AUDIENCES,
  BLAST_TEMPLATES,
  BLAST_FOOTER,
  BLAST_COMPLIANCE,
  BLAST_HISTORY_SAMPLE,
  calculateBlastCost,
  formatMergeField,
  detectPhiWarnings,
  generateTwilioPayload,
  type BlastAudience,
  type BlastTemplate,
} from "@/lib/sms-blast";

/* -------------------------------------------------------------------------- */
/*                                   Icons                                    */
/* -------------------------------------------------------------------------- */

function IconSend({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconImage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconCopy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function IconWarning({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Shared Components                             */
/* -------------------------------------------------------------------------- */

function Pill({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[12px] px-3 py-1.5 rounded-full border transition ${
        active
          ? "bg-[#0F0F0F] text-white border-[#0F0F0F]"
          : "bg-white border-[#E8DCC6] hover:border-[#0F0F0F]"
      }`}
    >
      {children}
    </button>
  );
}

function GoldBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] px-2 py-1 rounded-full bg-[#0F0F0F] text-[#D4AF37] font-bold">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Sidebar                                   */
/* -------------------------------------------------------------------------- */

function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: IconHome },
    { id: "blast", label: "New Blast", icon: IconSend },
    { id: "audiences", label: "Audiences", icon: IconUsers },
    { id: "history", label: "History", icon: IconClock },
    { id: "compliance", label: "Compliance", icon: IconShield },
  ];

  return (
    <div
      className="hidden md:flex w-[260px] shrink-0 flex-col justify-between border-r"
      style={{ backgroundColor: BLAST.dark, borderColor: BLAST.borderDark }}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="h-9 w-9 rounded-full grid place-items-center font-serif text-[18px] font-bold"
            style={{ backgroundColor: BLAST.gold, color: BLAST.dark }}
          >
            H
          </div>
          <div>
            <p className="text-white font-semibold text-[14px]">Hello Gorgeous</p>
            <p className="text-white/60 text-[11px]">SMS Blast Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] transition ${
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "blast" && (
                <span className="ml-auto text-[10px] bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-bold">
                  NEW
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-5 border-t" style={{ borderColor: BLAST.borderDark }}>
        <p className="text-[11px] text-white/40 leading-5">
          Direct Twilio = $0.0075 SMS vs Fresha $0.15. You own the list. Not Fresha.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              iPhone Preview                                */
/* -------------------------------------------------------------------------- */

function IPhonePreview({
  message,
  imageUrl,
}: {
  message: string;
  imageUrl?: string;
}) {
  const previewMessage = formatMergeField(message, { FirstName: "Amanda", Injector: "Danielle" });

  return (
    <div
      className="rounded-[34px] overflow-hidden relative w-[300px]"
      style={{ backgroundColor: "#F2F1ED" }}
    >
      {/* Notch */}
      <div className="h-7 flex items-center justify-center">
        <div className="h-[16px] w-[80px] bg-black rounded-full" />
      </div>

      {/* Header */}
      <div className="px-3 py-2 flex items-center gap-2 bg-[#F9F8F6] border-b" style={{ borderColor: BLAST.border }}>
        <div
          className="h-8 w-8 rounded-full grid place-items-center"
          style={{ backgroundColor: BLAST.gold }}
        >
          <span className="text-black font-bold text-[14px]">HG</span>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold">Hello Gorgeous</p>
          <p className="text-[10px] opacity-50">iPhone 15 • Oswego, IL</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="p-3 space-y-2 min-h-[420px]"
        style={{
          backgroundImage: "radial-gradient(#E8DCC6 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundColor: BLAST.cream,
        }}
      >
        {imageUrl && (
          <div className="max-w-[78%] rounded-[18px] overflow-hidden border" style={{ borderColor: BLAST.border }}>
            <img src={imageUrl} alt="MMS" className="w-full h-auto" />
          </div>
        )}

        <div
          className="max-w-[78%] rounded-[18px] p-3 text-[14px] leading-5"
          style={{ backgroundColor: "#e5e5ea" }}
        >
          {previewMessage}
        </div>

        <div
          className="max-w-[78%] rounded-[18px] p-3 text-[11px] leading-4 opacity-60"
          style={{ backgroundColor: "#e5e5ea" }}
        >
          {BLAST_FOOTER}
        </div>
      </div>

      {/* Home indicator */}
      <div className="h-8 flex items-center justify-center" style={{ backgroundColor: BLAST.cream }}>
        <div className="h-1.5 w-[120px] bg-black/20 rounded-full" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Blast Composer                               */
/* -------------------------------------------------------------------------- */

function BlastComposer() {
  const [selectedAudience, setSelectedAudience] = useState<BlastAudience>(BLAST_AUDIENCES[1]);
  const [message, setMessage] = useState(BLAST_TEMPLATES[0].message);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [sending, setSending] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const isMms = !!imageUrl;
  const cost = calculateBlastCost(selectedAudience.count, isMms);
  const phiWarnings = detectPhiWarnings(message);
  // Can send if: consent checked, message exists, no PHI, and if image dropped, it's uploaded
  const imageReady = !imagePreview || (imagePreview && imageUrl && !uploading);
  const canSend = consentChecked && message.trim().length > 0 && phiWarnings.length === 0 && imageReady;

  const sendBlast = async (isTest = false) => {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/sms-blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audienceId: selectedAudience.id,
          message,
          mediaUrl: imageUrl,
          testPhone: isTest ? testPhone : undefined,
          consentConfirmed: consentChecked,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (isTest) {
          const mmsNote = data.debug?.hasMms ? " (MMS)" : " (SMS)";
          const sidNote = data.messageId ? ` • SID: ${data.messageId}` : "";
          setResult({ success: true, message: `Test sent to ${testPhone}${mmsNote}${sidNote}` });
        } else {
          setResult({ success: true, message: `Blast sent! ${data.sent}/${data.total} delivered` });
        }
      } else {
        setResult({ success: false, message: data.error || "Failed to send" });
      }
    } catch (err) {
      setResult({ success: false, message: "Network error" });
    }
    setSending(false);
  };

  const handleDrop = useCallback(async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload to get public URL for Twilio
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/sms-blast/upload-media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setImageUrl(data.url);
        } else {
          setResult({ success: false, message: data.error || "Failed to upload image" });
          setImagePreview(undefined);
        }
      } catch {
        setResult({ success: false, message: "Failed to upload image" });
        setImagePreview(undefined);
      }
      setUploading(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const payload = generateTwilioPayload(
    ["[phone numbers]"],
    message,
    imageUrl
  );

  return (
    <div className="grid lg:grid-cols-[1.2fr_380px] gap-0">
      {/* Left: Composer */}
      <div className="p-6 space-y-6">
        {/* Audience selector */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-3">
            Select Audience
          </p>
          <div className="flex flex-wrap gap-2">
            {BLAST_AUDIENCES.map((aud) => (
              <Pill
                key={aud.id}
                active={selectedAudience.id === aud.id}
                onClick={() => setSelectedAudience(aud)}
              >
                {aud.label}
                <span className="ml-1 opacity-60">({aud.count})</span>
              </Pill>
            ))}
          </div>
          <p className="mt-2 text-[12px] opacity-50">
            {selectedAudience.description} • {selectedAudience.count} contacts
          </p>
        </div>

        {/* Templates */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-3">
            Quick Templates
          </p>
          <div className="flex flex-wrap gap-2">
            {BLAST_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setMessage(tpl.message)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-dashed transition hover:border-[#D4AF37]"
                style={{ borderColor: `${BLAST.gold}99`, backgroundColor: BLAST.cream }}
              >
                {tpl.title} {tpl.hasMms && "📷"}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-3">
            Message
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Type your message... Use {FirstName} for merge"
            className="w-full rounded-[12px] border p-4 text-[14px] leading-6 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]"
            style={{ borderColor: BLAST.border, backgroundColor: BLAST.cream }}
          />
          <p className="mt-2 text-[11px] opacity-50">
            {message.length} chars • Use {"{"}<span>FirstName</span>{"}"} for personalization
          </p>
        </div>

        {/* PHI Warnings */}
        {phiWarnings.length > 0 && (
          <div className="rounded-[12px] bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <IconWarning className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-amber-700">PHI Warning</p>
                {phiWarnings.map((w) => (
                  <p key={w} className="text-[12px] text-amber-700 opacity-80">{w}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image upload */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-3">
            MMS Flyer (Optional)
          </p>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`rounded-[14px] border-2 border-dashed p-6 text-center transition ${
              isDragging ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-[#E8DCC6]"
            }`}
            style={{ backgroundColor: BLAST.cream }}
          >
            {imagePreview ? (
              <div className="space-y-3">
                <img src={imagePreview} alt="Flyer" className="max-h-[200px] mx-auto rounded-[12px]" />
                {uploading && (
                  <p className="text-[12px] text-amber-600">Uploading...</p>
                )}
                {imageUrl && !uploading && (
                  <p className="text-[11px] text-emerald-600">✓ Uploaded & ready for Twilio MMS</p>
                )}
                <button
                  type="button"
                  onClick={() => { setImageUrl(undefined); setImagePreview(undefined); }}
                  className="text-[12px] text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <IconImage className="h-8 w-8 mx-auto opacity-40" />
                <p className="text-[13px] opacity-60">Drag & drop flyer image here</p>
                <p className="text-[11px] opacity-40">Max 5MB for Twilio MMS</p>
              </div>
            )}
          </div>
        </div>

        {/* Compliance checkbox */}
        <div
          className="rounded-[14px] p-4"
          style={{ backgroundColor: BLAST.dark }}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded accent-[#D4AF37]"
            />
            <div>
              <p className="text-white text-[13px] font-medium">
                {BLAST_COMPLIANCE.consentCheckbox}
              </p>
              <p className="text-[11px] text-white/50 mt-1">
                Auto-append: "{BLAST_FOOTER}"
              </p>
            </div>
          </label>
          {!consentChecked && (
            <p className="mt-3 text-[11px] text-[#D4AF37]">
              ⚠ {BLAST_COMPLIANCE.legalProtection}
            </p>
          )}
        </div>

        {/* Cost calculator */}
        <div
          className="rounded-[14px] border p-4"
          style={{ borderColor: BLAST.border, backgroundColor: "white" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] opacity-50 uppercase tracking-wide">Your cost</p>
              <p className="text-[22px] font-semibold" style={{ color: BLAST.gold }}>
                ${cost.twilioCost.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] opacity-50">Fresha would charge</p>
              <p className="text-[14px] line-through opacity-40">${cost.freshaCost.toFixed(2)}</p>
            </div>
          </div>
          <div
            className="mt-3 rounded-[10px] p-3 text-[12px]"
            style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0" }}
          >
            <span className="text-emerald-700 font-semibold">
              You save ${cost.savings.toFixed(2)}
            </span>
            <span className="text-emerald-700/70"> vs Fresha this blast</span>
          </div>
        </div>

        {/* Result message */}
        {result && (
          <div
            className={`rounded-[12px] p-4 text-[13px] ${
              result.success
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {result.success ? "✓ " : "✗ "}{result.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canSend || sending}
            onClick={() => sendBlast(false)}
            className="h-11 px-6 rounded-[12px] text-[14px] font-semibold flex items-center gap-2 transition disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: BLAST.gold, color: BLAST.dark }}
          >
            {sending ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <IconSend className="h-4 w-4" />
            )}
            Yes, blast now • ${cost.twilioCost.toFixed(2)}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="tel"
              placeholder="(630) 555-1234"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="h-11 px-4 w-36 rounded-[12px] border text-[13px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
              style={{ borderColor: BLAST.border }}
            />
            <button
              type="button"
              disabled={!testPhone || sending}
              onClick={() => sendBlast(true)}
              className="h-11 px-5 rounded-[12px] text-[13px] font-medium border transition hover:bg-[#FFFBF2] disabled:opacity-30"
              style={{ borderColor: BLAST.border }}
            >
              Test
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowPayload(!showPayload)}
            className="h-11 px-5 rounded-[12px] text-[13px] font-medium flex items-center gap-2 transition hover:bg-white/10"
            style={{ backgroundColor: BLAST.dark, color: "white" }}
          >
            <IconCopy className="h-4 w-4" />
            Copy payload
          </button>
        </div>

        {/* JSON payload */}
        {showPayload && (
          <div
            className="rounded-[12px] p-4 overflow-auto max-h-[220px]"
            style={{ backgroundColor: BLAST.dark }}
          >
            <pre className="text-[10.5px] leading-[14px] text-[#D4AF37] whitespace-pre-wrap">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Right: Preview */}
      <div
        className="border-t lg:border-t-0 lg:border-l p-6 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:overflow-auto"
        style={{ borderColor: BLAST.border, backgroundColor: BLAST.cream }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-4">
          Live Preview
        </p>
        <IPhonePreview message={message} imageUrl={imagePreview} />

        <div
          className="mt-6 rounded-[12px] border p-4"
          style={{ borderColor: BLAST.border, backgroundColor: "white" }}
        >
          <p className="text-[11px] font-semibold opacity-50 mb-2">Auto-append footer:</p>
          <p className="text-[12px] opacity-70">{BLAST_FOOTER}</p>
          <p className="text-[10px] opacity-40 mt-2">
            Added to every blast. You cannot remove it.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Dashboard                                    */
/* -------------------------------------------------------------------------- */

function Dashboard() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ imported?: number; skipped?: number; total?: number; error?: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ imported?: number; skipped?: number; error?: string } | null>(null);

  const handleSquareSync = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch("/api/admin/sms-blast/sync-square", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult({ imported: data.imported, skipped: data.skipped, total: data.total });
      } else {
        setSyncResult({ error: data.error || "Sync failed" });
      }
    } catch {
      setSyncResult({ error: "Network error" });
    }
    setSyncing(false);
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/sms-blast/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadResult({ imported: data.imported, skipped: data.skipped });
      } else {
        setUploadResult({ error: data.error || "Upload failed" });
      }
    } catch {
      setUploadResult({ error: "Network error" });
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold">SMS Blast Dashboard</h1>
        <p className="text-[14px] opacity-60 mt-1">
          342 due for injectables • Send in 60 sec
        </p>
      </div>

      {/* Sync from Square */}
      <div
        className="rounded-[14px] border p-4"
        style={{ borderColor: BLAST.border, backgroundColor: "white" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-3">
          Sync Contacts from Square
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSquareSync}
            disabled={syncing}
            className="h-10 px-5 rounded-[12px] text-[13px] font-semibold flex items-center gap-2 transition disabled:opacity-50"
            style={{ backgroundColor: BLAST.gold, color: BLAST.dark }}
          >
            {syncing ? (
              <>
                <span className="animate-spin">⟳</span>
                Syncing...
              </>
            ) : (
              <>
                <IconUsers className="h-4 w-4" />
                Pull from Square API
              </>
            )}
          </button>
          {syncResult && (
            <p className={`text-[12px] ${syncResult.error ? "text-red-600" : "text-emerald-600"}`}>
              {syncResult.error || `✓ ${syncResult.imported} imported, ${syncResult.skipped} skipped (${syncResult.total} total in Square)`}
            </p>
          )}
        </div>
        <p className="text-[11px] opacity-40 mt-2">
          Pulls all customers from your Square account. Only numbers with marketing consent imported.
        </p>
      </div>

      {/* Upload CSV fallback */}
      <div
        className="rounded-[14px] border p-4"
        style={{ borderColor: BLAST.border, backgroundColor: "white" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-3">
          Or Upload CSV (Manual)
        </p>
        <div className="flex items-center gap-4">
          <label
            className="h-10 px-5 rounded-[12px] text-[13px] font-medium flex items-center gap-2 cursor-pointer transition hover:bg-[#FFFBF2] border"
            style={{ borderColor: BLAST.border }}
          >
            <IconUpload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Square CSV"}
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploadResult && (
            <p className={`text-[12px] ${uploadResult.error ? "text-red-600" : "text-emerald-600"}`}>
              {uploadResult.error || `✓ ${uploadResult.imported} imported, ${uploadResult.skipped} skipped`}
            </p>
          )}
        </div>
        <p className="text-[11px] opacity-40 mt-2">
          Fallback if API sync fails. Export from Square Dashboard → Customers → Export CSV.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Contacts", value: "1,931", sub: "Verified SMS consent" },
          { label: "Avg Deliverability", value: "98.5%", sub: "Industry 97%" },
          { label: "Avg CTR (MMS)", value: "3.2%", sub: "Industry 1.2%" },
          { label: "Saved vs Fresha", value: "$847", sub: "Avg last 4 blasts" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[14px] border p-4"
            style={{ borderColor: BLAST.border, backgroundColor: "white" }}
          >
            <p className="text-[11px] opacity-50 uppercase tracking-wide">{stat.label}</p>
            <p className="text-[20px] font-semibold mt-1">{stat.value}</p>
            <p className="text-[11px] opacity-50">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent blasts */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60 mb-3">
          Recent Blasts
        </p>
        <div className="space-y-3">
          {BLAST_HISTORY_SAMPLE.map((item) => (
            <div
              key={item.id}
              className="rounded-[14px] border p-4 flex items-center justify-between"
              style={{ borderColor: BLAST.border, backgroundColor: "white" }}
            >
              <div>
                <p className="text-[14px] font-medium">{item.audience}</p>
                <p className="text-[12px] opacity-50">
                  {item.date} • {item.audienceCount} sent • {item.delivered} delivered
                </p>
              </div>
              <div className="text-right">
                <GoldBadge>${item.cost.toFixed(2)}</GoldBadge>
                {item.replied && (
                  <p className="text-[11px] opacity-50 mt-1">{item.replied} replies</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Compliance                                  */
/* -------------------------------------------------------------------------- */

function ComplianceTab() {
  return (
    <div className="p-6 space-y-6 max-w-[760px]">
      <div>
        <h2 className="text-[22px] font-semibold">SMS Compliance</h2>
        <p className="text-[14px] opacity-60 mt-1">
          You own the list. Not Fresha.
        </p>
      </div>

      <div className="space-y-4">
        {[
          { title: "Express Written Consent", desc: BLAST_COMPLIANCE.consentRequired },
          { title: "STOP Footer Required", desc: BLAST_COMPLIANCE.footerRequired },
          { title: "Honor Opt-outs", desc: BLAST_COMPLIANCE.stopHonor },
        ].map((rule) => (
          <div
            key={rule.title}
            className="rounded-[14px] border p-4"
            style={{ borderColor: BLAST.border, backgroundColor: "white" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="h-7 w-7 rounded-full grid place-items-center shrink-0"
                style={{ backgroundColor: BLAST.gold }}
              >
                <IconCheck className="h-4 w-4 text-black" />
              </div>
              <div>
                <p className="text-[14px] font-semibold">{rule.title}</p>
                <p className="text-[13px] opacity-60 mt-1">{rule.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-[14px] p-5"
        style={{ backgroundColor: BLAST.dark }}
      >
        <p className="text-white text-[14px] font-medium">Dev Integration</p>
        <p className="text-white/60 text-[12px] mt-2 leading-5">
          "I have Square customer export + consent dates. I need you to connect the dashboard I have to our Twilio account using Twilio Content Templates for MMS. Use Square Webhooks: when appointment status = completed, update last_service in DB. I want to upload a flyer myself and hit send without you. Store STOPs and sync opt-out back to Square customer notes."
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Main                                     */
/* -------------------------------------------------------------------------- */

export function SmsBlastPanel() {
  const [activeTab, setActiveTab] = useState("blast");

  return (
    <div className="min-h-screen w-full flex selection:bg-[#D4AF37]/30" style={{ backgroundColor: BLAST.cream, color: BLAST.dark }}>
      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-[56px]"
        style={{ backgroundColor: BLAST.dark }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-full grid place-items-center"
            style={{ backgroundColor: BLAST.gold }}
          >
            <span className="text-black font-bold text-[12px]">HG</span>
          </div>
          <span className="text-white font-semibold text-[14px]">SMS Blast</span>
        </div>
        <GoldBadge>NEW</GoldBadge>
      </div>

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content */}
      <div className="flex-1 md:pt-0 pt-[56px]">
        {/* Header */}
        <div
          className="sticky top-0 z-10 backdrop-blur-xl border-b h-[64px] px-4 md:px-8 flex items-center justify-between"
          style={{ backgroundColor: `${BLAST.cream}cc`, borderColor: BLAST.border }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-[14px] md:text-[16px] font-semibold">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "blast" && "New Blast"}
              {activeTab === "audiences" && "Audiences"}
              {activeTab === "history" && "Blast History"}
              {activeTab === "compliance" && "Compliance"}
            </h1>
            {activeTab === "blast" && (
              <span className="hidden md:inline-flex text-[11px] px-2.5 py-1 rounded-full border bg-white" style={{ borderColor: "#E8DCC6" }}>
                {BLAST_AUDIENCES[1].count} due for injectables
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-[12px] px-3 py-1.5 rounded-full border bg-white"
              style={{ borderColor: "#E8DCC6" }}
            >
              Upload Square CSV
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "blast" && <BlastComposer />}
        {activeTab === "compliance" && <ComplianceTab />}
        {activeTab === "audiences" && (
          <div className="p-6">
            <h2 className="text-[22px] font-semibold mb-4">Audiences</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {BLAST_AUDIENCES.map((aud) => (
                <div
                  key={aud.id}
                  className="rounded-[14px] border p-4"
                  style={{ borderColor: BLAST.border, backgroundColor: "white" }}
                >
                  <p className="text-[14px] font-semibold">{aud.label}</p>
                  <p className="text-[22px] font-bold mt-1" style={{ color: BLAST.gold }}>
                    {aud.count}
                  </p>
                  <p className="text-[12px] opacity-50">{aud.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "history" && (
          <div className="p-6">
            <h2 className="text-[22px] font-semibold mb-4">Blast History</h2>
            <div className="space-y-3">
              {BLAST_HISTORY_SAMPLE.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[14px] border p-4"
                  style={{ borderColor: BLAST.border, backgroundColor: "white" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[14px] font-semibold">{item.audience}</p>
                    <GoldBadge>${item.cost.toFixed(2)}</GoldBadge>
                  </div>
                  <p className="text-[13px] opacity-70 truncate">{item.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-[12px] opacity-50">
                    <span>{item.date}</span>
                    <span>{item.audienceCount} sent</span>
                    <span>{item.delivered} delivered</span>
                    {item.replied && <span>{item.replied} replies</span>}
                    <span className="ml-auto">{item.sentBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmsBlastPanel;
