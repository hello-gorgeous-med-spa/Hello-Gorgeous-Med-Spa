"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

const DISCLAIMER =
  "This tool provides educational information only and does not diagnose, treat, or replace medical advice. Always consult your licensed healthcare provider.";

export function PortalLabsPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Labs & AI Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Upload lab reports for AI-powered educational insights. Results are saved to your profile.
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
            className="mt-3 w-full max-w-md px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
          <p className="mt-2 text-amber-700 text-xs">
            Not a member? <Link href="/memberships" className="font-semibold underline">Join a wellness program</Link>
          </p>
        </div>
      )}

      {email && (
        <>
          {/* Lab History */}
          {labs.length > 0 && step !== "results" && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lab History</h2>
              <div className="space-y-2">
                {labs.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{l.fileName || "Lab report"}</p>
                      <p className="text-sm text-gray-500">
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
          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {step === "disclaimer" || step === "upload" ? "Upload New Lab" : step === "processing" ? "Analyzing..." : "Results"}
            </h2>

            {step === "disclaimer" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-gray-800 text-sm">{DISCLAIMER}</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded text-pink-600"
                  />
                  <span className="text-sm text-gray-700">I understand and accept.</span>
                </label>
                <button
                  onClick={handleAcceptDisclaimer}
                  disabled={!disclaimerAccepted}
                  className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition"
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
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
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
                      <p className="text-gray-600">Drop file or click to select</p>
                      <p className="text-sm text-gray-400 mt-1">PDF, JPG, PNG</p>
                    </div>
                  )}
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Analyzing your labs… 30–45 seconds</p>
              </div>
            )}

            {step === "results" && insights && (
              <div ref={resultsRef} className="space-y-4 print:block">
                <div className="prose prose-sm max-w-none prose-headings:text-pink-600 print:block">
                  <ReactMarkdown>{insights}</ReactMarkdown>
                </div>
                <p className="text-xs text-gray-500 italic">{DISCLAIMER}</p>
                <div className="flex flex-wrap gap-3 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full hover:opacity-90"
                  >
                    Download PDF (Print)
                  </button>
                  <Link
                    href="/services/biote-hormone-therapy"
                    className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 inline-block"
                  >
                    Book Hormone Consultation
                  </Link>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 text-gray-500 font-medium rounded-full hover:bg-gray-100"
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
