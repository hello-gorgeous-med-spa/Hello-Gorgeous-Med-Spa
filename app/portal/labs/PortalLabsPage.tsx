"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useChatOpen } from "@/components/ChatOpenContext";

const DISCLAIMER =
  "This tool provides educational information only and does not diagnose, treat, or replace medical advice. Always consult your licensed healthcare provider.";

export function PortalLabsPage() {
  const { openChat } = useChatOpen();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"disclaimer" | "upload" | "processing" | "results" | "list">("disclaimer");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [currentLabId, setCurrentLabId] = useState<string | null>(null);
  const [labs, setLabs] = useState<{ id: string; fileName: string; uploadedAt: string; hasInsights: boolean }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewLabId, setViewLabId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("hg_portal_email") : null;
    if (stored) setEmail(stored);
  }, []);

  const loadLabs = useCallback(() => {
    if (!email.trim()) return;
    fetch(`/api/memberships/wellness/labs?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => setLabs(d.labs || []))
      .catch(() => setLabs([]));
  }, [email]);

  useEffect(() => {
    if (email) loadLabs();
  }, [email, loadLabs]);

  const handleAcceptDisclaimer = () => {
    if (!disclaimerAccepted) return;
    setStep("upload");
  };

  const handleFileSelect = (f: File) => {
    const ext = (f.name || "").toLowerCase().split(".").pop();
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext || "")) {
      setError("Only PDF, JPG, PNG allowed.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !disclaimerAccepted || !email.trim()) return;
    setLoading(true);
    setStep("processing");
    setError(null);
    const fd = new FormData();
    fd.append("labFile", file);
    fd.append("email", email);
    fd.append("disclaimerAccepted", "true");
    try {
      const res = await fetch("/api/memberships/wellness/labs/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setInsights(data.insights || "");
      setCurrentLabId(data.id);
      setStep("results");
      loadLabs();
      if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const handleViewLab = async (id: string) => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/memberships/wellness/labs/${id}?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found.");
      setInsights(data.insights || "");
      setCurrentLabId(id);
      setViewLabId(null);
      setStep("results");
      if (resultsRef.current) resultsRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load lab.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setStep("disclaimer");
    setDisclaimerAccepted(false);
    setFile(null);
    setInsights(null);
    setCurrentLabId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#000000]">Labs & AI Dashboard</h1>
        <p className="text-[#000000]/80 mt-1">
          Upload lab reports (PDF or screenshot) for AI-powered insights. Results organized by Strengths, Opportunities &amp; Actions.
        </p>
      </div>

      {!email && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm">
            Enter your email to access lab features. Use the same email you used when joining a wellness program.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="mt-3 w-full max-w-md px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-[#FF2D8E] outline-none"
          />
          <p className="mt-2 text-amber-700 text-xs">
            Not a member? <Link href="/memberships" className="font-semibold underline">Join a wellness program</Link>
          </p>
        </div>
      )}

      {email && (
        <>
          {/* Sample preview - first-time or no labs */}
          {labs.length === 0 && (
            <details className="bg-white rounded-2xl border border-[#000000]/10 overflow-hidden mb-6">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-[#000000] hover:bg-[#FFFFFF] transition-colors">
                See what you&apos;ll get — sample lab analysis
              </summary>
              <div className="px-6 pb-6 prose prose-sm max-w-none prose-headings:text-[#FF2D8E] prose-ul:list-disc">
                <p className="text-[#000000]/80 mb-4">
                  After you upload, we&apos;ll organize your results into clear sections:
                </p>
                <ul className="space-y-1 text-[#000000]/80 mb-4">
                  <li><strong>Strengths</strong> — markers in range or improving</li>
                  <li><strong>Opportunities</strong> — markers worth discussing with your provider</li>
                  <li><strong>Actions</strong> — next steps, lifestyle topics, questions to ask</li>
                </ul>
                <div className="rounded-xl bg-[#FFFFFF] border border-[#FF2D8E]/20 p-4 text-sm">
                  <p className="font-semibold text-[#000000] mb-2">Example:</p>
                  <p className="text-[#000000]/80 mb-2">Your Vitamin D has improved from 22 to 42 ng/mL, moving into a healthier range.</p>
                  <p className="text-[#000000]/80">HbA1c is 5.8% — worth discussing with your provider for personalized guidance.</p>
                </div>
              </div>
            </details>
          )}

          {/* Progress summary when 2+ labs */}
          {labs.length >= 2 && (
            <div className="bg-[#FF2D8E]/5 border border-[#FF2D8E]/20 rounded-2xl p-4 mb-6">
              <p className="text-sm font-medium text-[#000000]">
                You have {labs.length} labs on file. Compare results over time by viewing each report.
              </p>
            </div>
          )}

          {/* Ask Harmony - lab results expert */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => openChat("harmony", { source: "client_portal", topics: ["lab results", "hormones", "interpretation"] })}
              className="w-full rounded-2xl border-2 border-[#FF2D8E]/30 bg-gradient-to-r from-amber-500/10 to-rose-500/10 p-4 text-left hover:border-[#FF2D8E]/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <p className="font-semibold text-[#000000]">Questions about your results?</p>
                  <p className="text-sm text-[#000000]/70">Ask Harmony — hormone & lab expert</p>
                </div>
                <span className="ml-auto text-[#FF2D8E] font-medium text-sm">Chat →</span>
              </div>
            </button>
          </div>

          {/* Lab History */}
          {labs.length > 0 && step !== "results" && (
            <section className="bg-white rounded-2xl border border-[#000000]/10 p-6">
              <h2 className="text-lg font-semibold text-[#000000] mb-4">Lab History</h2>
              <div className="space-y-2">
                {labs.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#000000]/5 hover:bg-[#000000]/10"
                  >
                    <div>
                      <p className="font-medium text-[#000000]">{l.fileName || "Lab report"}</p>
                      <p className="text-sm text-[#000000]/70">
                        {new Date(l.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewLab(l.id)}
                      disabled={loading}
                      className="text-pink-600 font-medium text-sm hover:underline disabled:opacity-50"
                    >
                      View Results
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Upload Flow */}
          <section className="bg-white rounded-2xl border border-[#000000]/10 p-6">
            <h2 className="text-lg font-semibold text-[#000000] mb-4">
              {step === "disclaimer" || step === "upload" ? "Upload New Lab" : step === "processing" ? "Analyzing..." : "Results"}
            </h2>

            {step === "disclaimer" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-[#000000] text-sm">{DISCLAIMER}</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded text-pink-600"
                  />
                  <span className="text-sm text-[#000000]/80">I understand and accept.</span>
                </label>
                <button
                  onClick={handleAcceptDisclaimer}
                  disabled={!disclaimerAccepted}
                  className="px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {step === "upload" && (
              <div className="space-y-4">
                <div
                  onClick={() => !file && document.getElementById("lab-input")?.click()}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-[#000000]/20 rounded-xl p-8 text-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition"
                >
                  <input
                    id="lab-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                  />
                  {file ? (
                    <div>
                      <p className="font-medium text-[#000000]">{file.name}</p>
                      <p className="text-sm text-[#000000]/70 mt-1">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="text-pink-600 hover:underline"
                        >
                          Choose different file
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[#000000]/80">Drop file or click to select</p>
                      <p className="text-sm text-[#000000]/60 mt-1">PDF, JPG, or PNG (screenshots work)</p>
                    </div>
                  )}
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border border-[#000000]/20 text-[#000000]/80 font-medium rounded-full hover:bg-[#000000]/5"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#000000]/80">Analyzing your labs… 30–45 seconds</p>
              </div>
            )}

            {step === "results" && insights && (
              <div ref={resultsRef} className="space-y-4 print:block">
                <div className="prose prose-sm max-w-none prose-headings:text-pink-600 print:block">
                  <ReactMarkdown>{insights}</ReactMarkdown>
                </div>
                <p className="text-xs text-[#000000]/70 italic">{DISCLAIMER}</p>
                <div className="flex flex-wrap gap-3 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-full hover:opacity-90"
                  >
                    Download PDF (Print)
                  </button>
                  <Link
                    href="/services/biote-hormone-therapy"
                    className="px-6 py-3 border border-[#000000]/20 text-[#000000]/80 font-medium rounded-full hover:bg-[#000000]/5 inline-block"
                  >
                    Book Hormone Consultation
                  </Link>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 text-[#000000]/70 font-medium rounded-full hover:bg-[#000000]/10"
                  >
                    Upload Another
                  </button>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
