"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PROGRAMS: Record<string, { name: string; price: number; priceLabel?: string }> = {
  "precision-hormone": { name: "Precision Hormone Program", price: 199 },
  "metabolic-reset": { name: "Metabolic Reset Program", price: 450, priceLabel: "From $450/mo (5mg) or $499/mo (7.5mg)" },
};

export function MembershipsSignupContent({ programSlug }: { programSlug?: string }) {
  const router = useRouter();
  const program = programSlug ? PROGRAMS[programSlug] : null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string; memberCode?: string } | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    medicalHistoryNote: "",
    hipaaConsent: false,
    termsConsent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/memberships/wellness/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          programSlug: programSlug || "precision-hormone",
          hipaaConsent: form.hipaaConsent,
          termsConsent: form.termsConsent,
          medicalHistoryNote: form.medicalHistoryNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSuccess({
        message: data.message || "Request received.",
        memberCode: data.memberCode,
      });
      if (form.email) {
        try {
          localStorage.setItem("hg_portal_email", form.email.trim());
        } catch {
          /* ignore */
        }
      }
      if (data.redirectUrl) {
        setTimeout(() => router.push(data.redirectUrl), 3000);
      }
    } catch {
      setError("Could not submit. Please try again or call (630) 636-6193.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 py-12 md:py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-[#000000]/10 p-8 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-[#000000] mb-4">Request Received</h1>
            <p className="text-[#5E5E66] mb-4">{success.message}</p>
            {success.memberCode && (
              <p className="text-sm text-[#000000]/70 mb-6">
                Reference: <strong>{success.memberCode}</strong>
              </p>
            )}
            <p className="text-sm text-[#5E5E66] mb-6">
              We'll contact you shortly. Call us anytime at{" "}
              <a href="tel:630-636-6193" className="text-[#FF2D8E] font-semibold">
                630-636-6193
              </a>
            </p>
            <Link
              href="/portal"
              className="inline-block px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-full hover:opacity-90 transition"
            >
              Go to Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedProgram = programSlug && programSlug in PROGRAMS ? PROGRAMS[programSlug] : null;
  if (!programSlug || !selectedProgram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 py-12 md:py-20 px-4">
        <div className="max-w-xl mx-auto">
          <Link href="/memberships" className="text-[#FF2D8E] text-sm font-medium hover:underline mb-8 inline-block">
            ← Back to Memberships
          </Link>
          <div className="bg-white rounded-2xl shadow-xl border border-[#000000]/10 p-8">
            <h1 className="text-2xl font-bold text-[#000000] mb-4">Choose Your Program</h1>
            <p className="text-[#5E5E66] mb-6">Select a program to continue.</p>
            <div className="space-y-4">
              {Object.entries(PROGRAMS).map(([slug, p]) => (
                <Link
                  key={slug}
                  href={`/memberships/signup?program=${slug}`}
                  className="block p-4 rounded-xl border border-[#000000]/15 hover:border-[#FF2D8E]/50 hover:bg-pink-50/50 transition"
                >
                  <span className="font-semibold text-[#000000]">{p.name}</span>
                  <span className="text-[#5E5E66] ml-2">— {p.priceLabel || `$${p.price}/mo`}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const p = selectedProgram;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 py-12 md:py-20 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/memberships" className="text-[#FF2D8E] text-sm font-medium hover:underline mb-8 inline-block">
          ← Back to Memberships
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-[#000000]/10 p-8">
          <h1 className="text-2xl font-bold text-[#000000] mb-2">
            Join {p?.name}
          </h1>
          <p className="text-[#5E5E66] mb-6">{p?.priceLabel || `$${p?.price}/month`} • Full member portal access</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#000000] mb-1">
                  First name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#000000]/15 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E] outline-none"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#000000] mb-1">
                  Last name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#000000]/15 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E] outline-none"
                  placeholder="Smith"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#000000] mb-1">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#000000]/15 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E] outline-none"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#000000] mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#000000]/15 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E] outline-none"
                placeholder="(630) 555-1234"
              />
            </div>
            <div>
              <label htmlFor="medicalHistory" className="block text-sm font-medium text-[#000000] mb-1">
                Medical history note (optional)
              </label>
              <textarea
                id="medicalHistory"
                rows={3}
                value={form.medicalHistoryNote}
                onChange={(e) => setForm((f) => ({ ...f, medicalHistoryNote: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[#000000]/15 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E] outline-none resize-none"
                placeholder="Any conditions or medications we should know about?"
              />
            </div>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.hipaaConsent}
                  onChange={(e) => setForm((f) => ({ ...f, hipaaConsent: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-[#000000]/20 text-[#FF2D8E]"
                />
                <span className="text-sm text-[#000000]">
                  I consent to the use and disclosure of my health information as described in the HIPAA Notice of Privacy Practices. *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.termsConsent}
                  onChange={(e) => setForm((f) => ({ ...f, termsConsent: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-[#000000]/20 text-[#FF2D8E]"
                />
                <span className="text-sm text-[#000000]">
                  I agree to the membership terms and authorize Hello Gorgeous to contact me regarding my membership. *
                </span>
              </label>
            </div>
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FF2D8E] text-white font-bold rounded-full hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Submitting…" : "Submit Request"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#5E5E66]">
          HIPAA compliant • Your information is secure
        </p>
      </div>
    </div>
  );
}
