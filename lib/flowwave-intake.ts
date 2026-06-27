import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  evaluateFlowWaveScreening,
  FLOWWAVE_ABSOLUTE_CONTRAINDICATIONS,
  FLOWWAVE_CAUTION_FLAGS,
  type FlowWaveIntakeData,
  type FlowWaveIntakeStatus,
  type FlowWavePolicyData,
  type FlowWaveScreeningResult,
  type FlowWaveSoapData,
} from "@/lib/flowwave-focus";

export type FlowWaveIntakeRow = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  appointment_id: string | null;
  created_by: string | null;
  status: FlowWaveIntakeStatus;
  screening_result: FlowWaveScreeningResult;
  treatment_area: string | null;
  primary_complaint: string | null;
  clinician: string | null;
  session_date: string | null;
  intake_data: FlowWaveIntakeData;
  soap_data: FlowWaveSoapData;
  policy_data: FlowWavePolicyData;
  chart_note_id: string | null;
};

export type FlowWaveSessionRow = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  intake_id: string | null;
  appointment_id: string | null;
  created_by: string | null;
  session_number: number | null;
  session_date: string;
  treatment_area: string | null;
  handle_type: string | null;
  intensity: number | null;
  frequency_hz: number | null;
  shots_delivered: number | null;
  actual_shots: number | null;
  total_energy_mj: string | null;
  duration_min: number | null;
  pain_before: number | null;
  pain_after: number | null;
  clinician: string | null;
  notes: string | null;
  tolerance: string | null;
  session_data: Record<string, unknown>;
};

export type FlowWaveIntakeWithClient = FlowWaveIntakeRow & {
  client_name: string | null;
  client_phone: string | null;
};

export type FlowWaveSessionWithClient = FlowWaveSessionRow & {
  client_name: string | null;
};

function mapIntake(raw: Record<string, unknown>): FlowWaveIntakeRow {
  return {
    id: String(raw.id),
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    client_id: String(raw.client_id),
    appointment_id: (raw.appointment_id as string | null) ?? null,
    created_by: (raw.created_by as string | null) ?? null,
    status: raw.status as FlowWaveIntakeStatus,
    screening_result: raw.screening_result as FlowWaveScreeningResult,
    treatment_area: (raw.treatment_area as string | null) ?? null,
    primary_complaint: (raw.primary_complaint as string | null) ?? null,
    clinician: (raw.clinician as string | null) ?? null,
    session_date: (raw.session_date as string | null) ?? null,
    intake_data: (raw.intake_data as FlowWaveIntakeData) ?? {},
    soap_data: (raw.soap_data as FlowWaveSoapData) ?? {},
    policy_data: (raw.policy_data as FlowWavePolicyData) ?? {},
    chart_note_id: (raw.chart_note_id as string | null) ?? null,
  };
}

function mapSession(raw: Record<string, unknown>): FlowWaveSessionRow {
  return {
    id: String(raw.id),
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    client_id: String(raw.client_id),
    intake_id: (raw.intake_id as string | null) ?? null,
    appointment_id: (raw.appointment_id as string | null) ?? null,
    created_by: (raw.created_by as string | null) ?? null,
    session_number: raw.session_number != null ? Number(raw.session_number) : null,
    session_date: String(raw.session_date),
    treatment_area: (raw.treatment_area as string | null) ?? null,
    handle_type: (raw.handle_type as string | null) ?? null,
    intensity: raw.intensity != null ? Number(raw.intensity) : null,
    frequency_hz: raw.frequency_hz != null ? Number(raw.frequency_hz) : null,
    shots_delivered: raw.shots_delivered != null ? Number(raw.shots_delivered) : null,
    actual_shots: raw.actual_shots != null ? Number(raw.actual_shots) : null,
    total_energy_mj: (raw.total_energy_mj as string | null) ?? null,
    duration_min: raw.duration_min != null ? Number(raw.duration_min) : null,
    pain_before: raw.pain_before != null ? Number(raw.pain_before) : null,
    pain_after: raw.pain_after != null ? Number(raw.pain_after) : null,
    clinician: (raw.clinician as string | null) ?? null,
    notes: (raw.notes as string | null) ?? null,
    tolerance: (raw.tolerance as string | null) ?? null,
    session_data: (raw.session_data as Record<string, unknown>) ?? {},
  };
}

export type SaveFlowWaveIntakeInput = {
  clientId: string;
  appointmentId?: string | null;
  createdBy?: string | null;
  intakeData?: FlowWaveIntakeData;
  soapData?: FlowWaveSoapData;
  policyData?: FlowWavePolicyData;
  status?: FlowWaveIntakeStatus;
};

function extractIndexedFields(intakeData: FlowWaveIntakeData) {
  return {
    treatment_area: String(intakeData.treatment_area || "").trim() || null,
    primary_complaint: String(intakeData.complaint || "").trim() || null,
    clinician: String(intakeData.clinician || "").trim() || null,
    session_date: String(intakeData.session_date || "").trim() || null,
  };
}

export async function getFlowWaveIntake(
  id: string,
  client?: SupabaseClient | null,
): Promise<FlowWaveIntakeRow | null> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const { data, error } = await admin.from("hg_flowwave_intakes").select("*").eq("id", id).single();
  if (error || !data) return null;
  return mapIntake(data as Record<string, unknown>);
}

export async function listFlowWaveIntakesWithClient(opts: {
  clientId?: string;
  status?: FlowWaveIntakeStatus | "all";
  screening?: FlowWaveScreeningResult | "all";
  limit?: number;
  client?: SupabaseClient | null;
}): Promise<{ rows: FlowWaveIntakeWithClient[]; tableReady: boolean }> {
  const admin = opts.client ?? getSupabaseAdminClient();
  if (!admin) return { rows: [], tableReady: false };

  let q = admin
    .from("hg_flowwave_intakes")
    .select("*, clients(first_name, last_name, phone)")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 30);

  if (opts.clientId) q = q.eq("client_id", opts.clientId);
  if (opts.status && opts.status !== "all") q = q.eq("status", opts.status);
  if (opts.screening && opts.screening !== "all") q = q.eq("screening_result", opts.screening);

  const { data, error } = await q;
  if (error) {
    if (error.code === "42P01") return { rows: [], tableReady: false };
    console.error("[flowwave-intake] list", error.message);
    return { rows: [], tableReady: true };
  }

  const rows: FlowWaveIntakeWithClient[] = (data || []).map((raw) => {
    const row = mapIntake(raw as Record<string, unknown>);
    const c = (raw as { clients?: { first_name?: string; last_name?: string; phone?: string } }).clients;
    const clientName = c ? [c.first_name, c.last_name].filter(Boolean).join(" ").trim() : null;
    return {
      ...row,
      client_name: clientName || null,
      client_phone: c?.phone ?? null,
    };
  });

  return { rows, tableReady: true };
}

export async function insertFlowWaveIntake(
  input: SaveFlowWaveIntakeInput,
  client?: SupabaseClient | null,
): Promise<{ row: FlowWaveIntakeRow } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };
  if (!input.clientId) return { error: "Client is required" };

  const intakeData = input.intakeData ?? {};
  const screening = evaluateFlowWaveScreening(intakeData);
  const indexed = extractIndexedFields(intakeData);

  const row = {
    client_id: input.clientId,
    appointment_id: input.appointmentId ?? null,
    created_by: input.createdBy?.trim() || null,
    status: input.status ?? screening.status,
    screening_result: screening.screeningResult,
    ...indexed,
    intake_data: intakeData,
    soap_data: input.soapData ?? {},
    policy_data: input.policyData ?? {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin.from("hg_flowwave_intakes").insert(row).select("*").single();
  if (error) {
    if (error.code === "42P01") return { error: "FlowWave tables not migrated yet" };
    return { error: error.message };
  }

  const mapped = mapIntake(data as Record<string, unknown>);
  await createFlowWaveChartNote(mapped, input.createdBy, admin);
  const refreshed = (await getFlowWaveIntake(mapped.id, admin)) ?? mapped;
  return { row: refreshed };
}

export async function updateFlowWaveIntake(
  id: string,
  patch: Partial<SaveFlowWaveIntakeInput> & { chartNoteId?: string | null },
  client?: SupabaseClient | null,
): Promise<{ row: FlowWaveIntakeRow } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const existing = await getFlowWaveIntake(id, admin);
  if (!existing) return { error: "Intake not found" };

  const intakeData = patch.intakeData ?? existing.intake_data;
  const screening = evaluateFlowWaveScreening(intakeData);
  const indexed = extractIndexedFields(intakeData);

  const updateRow: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    intake_data: intakeData,
    treatment_area: indexed.treatment_area,
    primary_complaint: indexed.primary_complaint,
    clinician: indexed.clinician,
    session_date: indexed.session_date,
    screening_result: screening.screeningResult,
  };

  if (patch.soapData !== undefined) updateRow.soap_data = patch.soapData;
  if (patch.policyData !== undefined) updateRow.policy_data = patch.policyData;
  if (patch.appointmentId !== undefined) updateRow.appointment_id = patch.appointmentId;
  if (patch.status !== undefined) updateRow.status = patch.status;
  else if (screening.status !== "draft") updateRow.status = screening.status;
  if (patch.chartNoteId !== undefined) updateRow.chart_note_id = patch.chartNoteId;

  const { data, error } = await admin
    .from("hg_flowwave_intakes")
    .update(updateRow)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { error: error.message };

  const mapped = mapIntake(data as Record<string, unknown>);
  if (!mapped.chart_note_id) {
    await createFlowWaveChartNote(mapped, patch.createdBy, admin);
    const refreshed = await getFlowWaveIntake(id, admin);
    if (refreshed) return { row: refreshed };
  }
  return { row: mapped };
}

export async function createFlowWaveChartNote(
  intake: FlowWaveIntakeRow,
  createdByEmail?: string | null,
  client?: SupabaseClient | null,
): Promise<string | null> {
  if (intake.chart_note_id) return intake.chart_note_id;

  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return null;

  const d = intake.intake_data;
  const absLabels = FLOWWAVE_ABSOLUTE_CONTRAINDICATIONS.filter((c) => d[c.id] === true).map(
    (c) => c.label,
  );
  const cautLabels = FLOWWAVE_CAUTION_FLAGS.filter((c) => d[c.id] === true).map((c) => c.label);

  const subjective = [
    intake.primary_complaint ? `Chief complaint: ${intake.primary_complaint}` : null,
    d.duration ? `Duration: ${d.duration}` : null,
    d.prev_treatment ? `Previous treatments: ${d.prev_treatment}` : null,
    d.medications ? `Medications: ${d.medications}` : null,
    d.allergies ? `Allergies: ${d.allergies}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const objective = [
    intake.treatment_area ? `Treatment area: ${intake.treatment_area}` : null,
    d.intensity ? `Intensity: ${d.intensity}` : null,
    d.frequency ? `Frequency: ${d.frequency} Hz` : null,
    d.shots ? `Preset shots: ${d.shots}` : null,
    d.bp ? `BP: ${d.bp}` : null,
    d.ht_wt ? `Ht/Wt: ${d.ht_wt}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const assessment = [
    `Screening: ${intake.screening_result}`,
    absLabels.length ? `Absolute contraindications flagged: ${absLabels.join("; ")}` : null,
    cautLabels.length ? `Caution flags: ${cautLabels.join("; ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const plan = [
    intake.screening_result === "contraindicated"
      ? "Do not treat — absolute contraindication present."
      : intake.screening_result === "caution"
        ? "Clinician review required before treatment."
        : "Cleared for FlowWave FOCUS session per screening.",
    d.session_notes ? `Session notes: ${d.session_notes}` : null,
    intake.clinician ? `Clinician: ${intake.clinician}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const soap = intake.soap_data;
  const soapSubjective = soap.soap_s_complaint ? String(soap.soap_s_complaint) : null;
  const soapPlan = soap.soap_homecare ? String(soap.soap_homecare) : null;

  const { data, error } = await admin
    .from("chart_notes")
    .insert({
      client_id: intake.client_id,
      note_type: "procedure",
      title: `FlowWave FOCUS — ${intake.treatment_area || "intake"}`,
      status: "final",
      subjective: [subjective, soapSubjective].filter(Boolean).join("\n\n") || null,
      objective: objective || null,
      assessment: assessment || null,
      plan: [plan, soapPlan].filter(Boolean).join("\n\n") || null,
      procedure_details: {
        source: "flowwave_intake",
        flowwaveIntakeId: intake.id,
        screeningResult: intake.screening_result,
        intakeData: intake.intake_data,
        soapData: intake.soap_data,
        createdByEmail: createdByEmail ?? null,
      },
    })
    .select("id")
    .single();

  if (error) {
    console.error("[flowwave-intake] chart note", error.message);
    return null;
  }

  const chartNoteId = String(data.id);
  await updateFlowWaveIntake(intake.id, { chartNoteId }, admin);
  return chartNoteId;
}

export async function listFlowWaveSessions(opts: {
  clientId?: string;
  intakeId?: string;
  limit?: number;
  client?: SupabaseClient | null;
}): Promise<{ rows: FlowWaveSessionWithClient[]; tableReady: boolean }> {
  const admin = opts.client ?? getSupabaseAdminClient();
  if (!admin) return { rows: [], tableReady: false };

  let q = admin
    .from("hg_flowwave_sessions")
    .select("*, clients(first_name, last_name)")
    .order("session_date", { ascending: false })
    .limit(opts.limit ?? 50);

  if (opts.clientId) q = q.eq("client_id", opts.clientId);
  if (opts.intakeId) q = q.eq("intake_id", opts.intakeId);

  const { data, error } = await q;
  if (error) {
    if (error.code === "42P01") return { rows: [], tableReady: false };
    return { rows: [], tableReady: true };
  }

  return {
    tableReady: true,
    rows: (data || []).map((raw) => {
      const row = mapSession(raw as Record<string, unknown>);
      const c = (raw as { clients?: { first_name?: string; last_name?: string } }).clients;
      return {
        ...row,
        client_name: c ? [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || null : null,
      };
    }),
  };
}

export type SaveFlowWaveSessionInput = {
  clientId: string;
  intakeId?: string | null;
  appointmentId?: string | null;
  createdBy?: string | null;
  sessionNumber?: number | null;
  sessionDate?: string;
  treatmentArea?: string | null;
  handleType?: string | null;
  intensity?: number | null;
  frequencyHz?: number | null;
  shotsDelivered?: number | null;
  actualShots?: number | null;
  totalEnergyMj?: string | null;
  durationMin?: number | null;
  painBefore?: number | null;
  painAfter?: number | null;
  clinician?: string | null;
  notes?: string | null;
  tolerance?: string | null;
  sessionData?: Record<string, unknown>;
};

export async function insertFlowWaveSession(
  input: SaveFlowWaveSessionInput,
  client?: SupabaseClient | null,
): Promise<{ row: FlowWaveSessionRow } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };
  if (!input.clientId) return { error: "Client is required" };

  const row = {
    client_id: input.clientId,
    intake_id: input.intakeId ?? null,
    appointment_id: input.appointmentId ?? null,
    created_by: input.createdBy?.trim() || null,
    session_number: input.sessionNumber ?? null,
    session_date: input.sessionDate || new Date().toISOString().slice(0, 10),
    treatment_area: input.treatmentArea?.trim() || null,
    handle_type: input.handleType?.trim() || null,
    intensity: input.intensity ?? null,
    frequency_hz: input.frequencyHz ?? null,
    shots_delivered: input.shotsDelivered ?? null,
    actual_shots: input.actualShots ?? null,
    total_energy_mj: input.totalEnergyMj?.trim() || null,
    duration_min: input.durationMin ?? null,
    pain_before: input.painBefore ?? null,
    pain_after: input.painAfter ?? null,
    clinician: input.clinician?.trim() || null,
    notes: input.notes?.trim() || null,
    tolerance: input.tolerance?.trim() || null,
    session_data: input.sessionData ?? {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin.from("hg_flowwave_sessions").insert(row).select("*").single();
  if (error) {
    if (error.code === "42P01") return { error: "FlowWave sessions table not migrated yet" };
    return { error: error.message };
  }

  if (input.intakeId) {
    await admin
      .from("hg_flowwave_intakes")
      .update({ status: "in_treatment", updated_at: new Date().toISOString() })
      .eq("id", input.intakeId);
  }

  return { row: mapSession(data as Record<string, unknown>) };
}

export async function deleteFlowWaveSession(
  id: string,
  client?: SupabaseClient | null,
): Promise<{ ok: true } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const { error } = await admin.from("hg_flowwave_sessions").delete().eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function getFlowWaveCommandCenter(opts?: {
  limit?: number;
  client?: SupabaseClient | null;
}): Promise<{
  intakes: FlowWaveIntakeWithClient[];
  sessions: FlowWaveSessionWithClient[];
  counts: { contraindicated: number; caution: number; cleared: number };
  tableReady: boolean;
}> {
  const [intakesRes, sessionsRes] = await Promise.all([
    listFlowWaveIntakesWithClient({ limit: opts?.limit ?? 40, client: opts?.client }),
    listFlowWaveSessions({ limit: opts?.limit ?? 40, client: opts?.client }),
  ]);

  const counts = {
    contraindicated: intakesRes.rows.filter((r) => r.screening_result === "contraindicated").length,
    caution: intakesRes.rows.filter((r) => r.screening_result === "caution").length,
    cleared: intakesRes.rows.filter(
      (r) => r.screening_result === "cleared" || r.status === "in_treatment",
    ).length,
  };

  return {
    intakes: intakesRes.rows,
    sessions: sessionsRes.rows,
    counts,
    tableReady: intakesRes.tableReady && sessionsRes.tableReady,
  };
}
