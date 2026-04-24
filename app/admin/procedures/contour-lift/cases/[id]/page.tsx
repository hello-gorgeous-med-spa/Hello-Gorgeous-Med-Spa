"use client";

import { useCallback, useEffect, useState } from "react";
import { CL_INTAKE_CONTRA_ITEMS } from "@/lib/contour-clinical/intake-contraindications";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CL_STATUS_LABEL, CL_QUANTUM_STATUSES, type ClQuantumStatus } from "@/lib/contour-clinical/case-status";

const PINK = "#E6007E";

type CaseDetail = Record<string, unknown> & { id: string; status: string; email: string };

export default function ContourLiftCaseDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<{
    case: CaseDetail;
    lead: Record<string, unknown> | null;
    intake: unknown[];
    consents: unknown[];
    treatments: unknown[];
    photos: unknown[];
    postcare: unknown[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ClQuantumStatus | "">("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/admin/contour-lift/cases/${id}`, { credentials: "include" });
      const j = (await r.json()) as { error?: string; case?: CaseDetail } & typeof data;
      if (!r.ok) throw new Error(j.error || "Not found");
      if (!j.case) throw new Error("No case");
      setData({
        case: j.case,
        lead: (j as { lead?: unknown }).lead as Record<string, unknown> | null,
        intake: (j as { intake?: unknown[] }).intake ?? [],
        consents: (j as { consents?: unknown[] }).consents ?? [],
        treatments: (j as { treatments?: unknown[] }).treatments ?? [],
        photos: (j as { photos?: unknown[] }).photos ?? [],
        postcare: (j as { postcare?: unknown[] }).postcare ?? [],
      });
      setStatus((j.case.status as ClQuantumStatus) || "new_inquiry");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveStatus = async () => {
    if (!id || !status) return;
    setSaving(true);
    setErr(null);
    try {
      const r = await fetch(`/api/admin/contour-lift/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(j.error || "Save failed");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-sm text-black/50">Loading…</p>;
  }
  if (!data) {
    return (
      <div className="p-6">
        <p className="text-red-700">{err || "Not found"}</p>
        <Link href="/admin/procedures/contour-lift/cases" className="text-sm font-bold underline">
          Back
        </Link>
      </div>
    );
  }

  const c = data.case;
  const lead = data.lead;
  const latestIntake = (data.intake[0] || null) as
    | {
        id: string;
        form_version: string;
        answers: Record<string, unknown> | null;
        contraindication_yes_list: string[] | null;
        requires_provider_review: boolean;
        submitted_at: string | null;
        submitted_by_client: boolean;
      }
    | null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 text-black md:px-6">
      <div>
        <Link
          href="/admin/procedures/contour-lift/cases"
          className="text-xs font-bold uppercase tracking-widest hover:underline"
          style={{ color: PINK }}
        >
          ← All cases
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-bold">{(c.full_name as string) || c.email}</h1>
        <p className="text-sm text-black/60">{c.email}</p>
      </div>

      <section className="rounded-lg border-2 border-black p-4">
        <h2 className="font-bold">Status</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            className="border-2 border-black px-2 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as ClQuantumStatus)}
          >
            {CL_QUANTUM_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CL_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveStatus()}
            className="min-h-[40px] border-2 border-black bg-white px-4 text-sm font-bold"
            style={{ backgroundColor: PINK, color: "white", borderColor: PINK }}
          >
            {saving ? "Saving…" : "Update status"}
          </button>
        </div>
        {err ? <p className="mt-2 text-sm text-red-700">{err}</p> : null}
      </section>

      <IntakeLinkSection caseId={id} onPatched={() => void load()} />

      <section className="rounded-lg border border-black/15 bg-white p-4">
        <h2 className="font-bold">Inquiry (lead)</h2>
        {lead ? (
          <pre className="mt-2 max-h-48 overflow-auto rounded bg-black/[0.04] p-2 text-xs">
            {JSON.stringify(lead, null, 2)}
          </pre>
        ) : (
          <p className="mt-1 text-sm text-black/50">No linked lead — manual case.</p>
        )}
      </section>

      <IntakeDetailSection
        hasSubmission={Boolean(latestIntake?.submitted_at)}
        intake={latestIntake}
      />
      <Checklist label="Consents" has={data.consents.length > 0} sub={String(data.consents.length)} />
      <Checklist label="Treatment records" has={data.treatments.length > 0} sub={String(data.treatments.length)} />
      <Checklist label="Photos" has={data.photos.length > 0} sub={String(data.photos.length)} />
      <Checklist
        label="Post-care sent"
        has={data.postcare.some((p) => (p as { sent_at?: string }).sent_at)}
        sub={`${data.postcare.length} row(s)`}
      />

      <p className="text-xs text-black/45">
        Intake, consent, treatment, photo, and post-care UIs will attach here after migration is applied. No
        PHI in analytics.
      </p>
    </div>
  );
}

function IntakeLinkSection({ caseId, onPatched }: { caseId: string; onPatched?: () => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const copyIntakeLink = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/contour-lift/cases/${caseId}/intake-link`, { credentials: "include" });
      const j = (await r.json()) as { url?: string; error?: string };
      if (!r.ok) throw new Error(j.error || "Could not build link");
      if (!j.url) throw new Error("No URL");
      await navigator.clipboard.writeText(j.url);
      setMsg("Intake link copied. Send it to the client from your work email or SMS (not marketing/ads systems).");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const markIntakeSent = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/contour-lift/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "intake_sent" }),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(j.error || "Update failed");
      setMsg("Status set to “Intake sent.”");
      onPatched?.();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border-2 border-black/20 bg-amber-50/40 p-4">
      <h2 className="font-bold">Client intake (secure link)</h2>
      <p className="mt-1 text-sm text-black/70">
        Generates a HMAC link to <code className="text-xs">/contour-lift/intake</code>. Set{" "}
        <code>CLINIC_INTAKE_HMAC_SECRET</code> on the server in production.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => void copyIntakeLink()}
          className="min-h-10 border-2 border-black bg-white px-3 text-sm font-bold"
        >
          {loading ? "…" : "Copy intake link"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void markIntakeSent()}
          className="min-h-10 border-2 border-black/30 bg-white px-3 text-sm"
        >
          Mark status: Intake sent
        </button>
      </div>
      {msg ? <p className="mt-2 text-sm text-green-800">{msg}</p> : null}
    </section>
  );
}

function IntakeDetailSection({
  hasSubmission,
  intake,
}: {
  hasSubmission: boolean;
  intake: {
    id: string;
    form_version: string;
    answers: Record<string, unknown> | null;
    contraindication_yes_list: string[] | null;
    requires_provider_review: boolean;
    submitted_at: string | null;
  } | null;
}) {
  if (!hasSubmission || !intake) {
    return <Checklist label="Intake" has={false} sub="Not submitted" missing />;
  }
  const yesLabels = (intake.contraindication_yes_list || [])
    .map((id) => CL_INTAKE_CONTRA_ITEMS.find((x) => x.id === id)?.label || id)
    .filter(Boolean);
  const a = intake.answers || {};
  return (
    <div className="space-y-2">
      <div
        className="flex items-center justify-between rounded border border-black/10 px-3 py-2"
        style={{
          backgroundColor: intake.requires_provider_review ? "rgba(230,0,126,0.1)" : "rgba(0,128,0,0.08)",
        }}
      >
        <span className="font-semibold">Intake</span>
        <span className="text-sm text-black/70">
          {intake.submitted_at ? new Date(intake.submitted_at).toLocaleString() : "—"}{" "}
          {intake.requires_provider_review ? "· Contra review" : "· No contra flags"}
        </span>
      </div>
      <div className="rounded border border-black/15 p-3 text-sm">
        <p className="font-bold">Contraindication “yes” items</p>
        {yesLabels.length ? (
          <ul className="mt-1 list-disc pl-4">
            {yesLabels.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-black/60">None reported</p>
        )}
        <p className="mt-3 font-bold">Responses (v{intake.form_version})</p>
        <dl className="mt-1 grid gap-1 sm:grid-cols-2">
          {Object.entries(a)
            .filter(([k]) => !k.startsWith("contra_"))
            .map(([k, v]) => (
              <div key={k} className="sm:col-span-1">
                <dt className="text-xs text-black/50">{k.replace(/_/g, " ")}</dt>
                <dd className="break-words">
                  {typeof v === "boolean" ? (v ? "Yes" : "No") : v === null || v === undefined ? "—" : String(v)}
                </dd>
              </div>
            ))}
        </dl>
      </div>
    </div>
  );
}

function Checklist({
  label,
  has,
  sub,
  missing,
}: {
  label: string;
  has: boolean;
  sub: string;
  missing?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between rounded border border-black/10 px-3 py-2"
      style={{ backgroundColor: has ? "rgba(0,128,0,0.06)" : missing ? "rgba(255,200,0,0.1)" : "white" }}
    >
      <span className="font-semibold">
        {label}
        {missing && !has ? " — needed" : ""}
      </span>
      <span className="text-sm text-black/60">{sub}</span>
    </div>
  );
}
