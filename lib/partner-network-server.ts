/**
 * Partner referral network — server DB ops.
 */

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  ARORA_NETWORK_SLUG,
  isQualifyingMedicationOrder,
  isValidPartnerCode,
  normalizePartnerCode,
  PARTNER_FEES,
  slugifyPartnerName,
  type PartnerAttribution,
  type PartnerDashboard,
  type PartnerLocation,
  type PartnerLocationStatus,
  type PartnerNetwork,
  type PartnerPayout,
  type PartnerPayoutKind,
  type PartnerPayoutStatus,
} from "@/lib/partner-network";

function adminClient(client?: SupabaseClient | null): SupabaseClient | null {
  return client ?? getSupabaseAdminClient();
}

function n(v: number | string | null | undefined): number {
  return Math.round((Number(v) || 0) * 100) / 100;
}

function normalizeEmail(email: string | null | undefined): string | null {
  const e = email?.trim().toLowerCase();
  return e && e.includes("@") ? e : null;
}

type NetworkRow = {
  id: string;
  slug: string;
  name: string;
  md_name: string | null;
  md_fee_usd: number | string;
  network_fee_usd: number | string;
  override_usd: number | string;
  spa_first_order_usd: number | string;
  kickoff_usd: number | string;
  status: string;
  notes: string | null;
};

type LocationRow = {
  id: string;
  network_id: string;
  slug: string;
  name: string;
  city: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  directed_by_md: boolean;
  payouts_enabled: boolean;
  status: string;
  referral_agreement_signed_at: string | null;
  kickoff_at: string | null;
  scan_count: number | string | null;
  notes: string | null;
};

type PayoutRow = {
  id: string;
  kind: string;
  network_id: string;
  location_id: string | null;
  attribution_id: string | null;
  order_reference: string | null;
  customer_email: string | null;
  payee: string;
  payee_name: string;
  amount_usd: number | string;
  status: string;
  period_month: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
};

function mapNetwork(row: NetworkRow): PartnerNetwork {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    mdName: row.md_name,
    mdFeeUsd: n(row.md_fee_usd),
    networkFeeUsd: n(row.network_fee_usd),
    overrideUsd: n(row.override_usd),
    spaFirstOrderUsd: n(row.spa_first_order_usd),
    kickoffUsd: n(row.kickoff_usd),
    status: row.status as PartnerNetwork["status"],
    notes: row.notes,
  };
}

function mapLocation(row: LocationRow): PartnerLocation {
  return {
    id: row.id,
    networkId: row.network_id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    directedByMd: Boolean(row.directed_by_md),
    payoutsEnabled: row.payouts_enabled !== false,
    status: row.status as PartnerLocationStatus,
    referralAgreementSignedAt: row.referral_agreement_signed_at,
    kickoffAt: row.kickoff_at,
    scanCount: Number(row.scan_count) || 0,
    notes: row.notes,
  };
}

function mapPayout(row: PayoutRow, locationName?: string | null): PartnerPayout {
  return {
    id: row.id,
    kind: row.kind as PartnerPayoutKind,
    networkId: row.network_id,
    locationId: row.location_id,
    attributionId: row.attribution_id,
    orderReference: row.order_reference,
    customerEmail: row.customer_email,
    payee: row.payee as PartnerPayout["payee"],
    payeeName: row.payee_name,
    amountUsd: n(row.amount_usd),
    status: row.status as PartnerPayoutStatus,
    periodMonth: row.period_month,
    notes: row.notes,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    locationName: locationName ?? null,
  };
}

export async function getAroraNetwork(
  client?: SupabaseClient | null,
): Promise<PartnerNetwork | null> {
  const admin = adminClient(client);
  if (!admin) return null;
  const { data, error } = await admin
    .from("partner_networks")
    .select(
      "id, slug, name, md_name, md_fee_usd, network_fee_usd, override_usd, spa_first_order_usd, kickoff_usd, status, notes",
    )
    .eq("slug", ARORA_NETWORK_SLUG)
    .maybeSingle();
  if (error || !data) return null;
  return mapNetwork(data as NetworkRow);
}

export async function getPartnerLocationByCode(
  code: string,
  client?: SupabaseClient | null,
): Promise<{ network: PartnerNetwork; location: PartnerLocation } | null> {
  if (!isValidPartnerCode(code)) return null;
  const admin = adminClient(client);
  if (!admin) return null;
  const slug = normalizePartnerCode(code);
  const { data, error } = await admin
    .from("partner_locations")
    .select(
      "id, network_id, slug, name, city, contact_name, contact_email, contact_phone, directed_by_md, payouts_enabled, status, referral_agreement_signed_at, kickoff_at, scan_count, notes",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  const location = mapLocation(data as LocationRow);
  if (location.status === "paused") return null;
  const { data: net } = await admin
    .from("partner_networks")
    .select(
      "id, slug, name, md_name, md_fee_usd, network_fee_usd, override_usd, spa_first_order_usd, kickoff_usd, status, notes",
    )
    .eq("id", location.networkId)
    .maybeSingle();
  if (!net) return null;
  return { network: mapNetwork(net as NetworkRow), location };
}

export async function bumpPartnerScan(locationId: string, client?: SupabaseClient | null): Promise<void> {
  const admin = adminClient(client);
  if (!admin) return;
  const { data } = await admin
    .from("partner_locations")
    .select("scan_count")
    .eq("id", locationId)
    .maybeSingle();
  const next = (Number(data?.scan_count) || 0) + 1;
  await admin
    .from("partner_locations")
    .update({ scan_count: next, updated_at: new Date().toISOString() })
    .eq("id", locationId);
}

export async function listPartnerLocations(
  networkId: string,
  client?: SupabaseClient | null,
): Promise<PartnerLocation[]> {
  const admin = adminClient(client);
  if (!admin) return [];
  const { data, error } = await admin
    .from("partner_locations")
    .select(
      "id, network_id, slug, name, city, contact_name, contact_email, contact_phone, directed_by_md, payouts_enabled, status, referral_agreement_signed_at, kickoff_at, scan_count, notes",
    )
    .eq("network_id", networkId)
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => mapLocation(row as LocationRow));
}

export async function listPartnerPayouts(
  networkId: string,
  client?: SupabaseClient | null,
): Promise<PartnerPayout[]> {
  const admin = adminClient(client);
  if (!admin) return [];
  const { data, error } = await admin
    .from("partner_payouts")
    .select(
      "id, kind, network_id, location_id, attribution_id, order_reference, customer_email, payee, payee_name, amount_usd, status, period_month, notes, created_at, paid_at",
    )
    .eq("network_id", networkId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  const locations = await listPartnerLocations(networkId, admin);
  const byId = new Map(locations.map((l) => [l.id, l.name]));
  return data.map((row) => mapPayout(row as PayoutRow, byId.get(String(row.location_id ?? "")) ?? null));
}

export async function listPartnerAttributions(
  networkId: string,
  client?: SupabaseClient | null,
): Promise<PartnerAttribution[]> {
  const admin = adminClient(client);
  if (!admin) return [];
  const { data, error } = await admin
    .from("partner_attributions")
    .select(
      "id, network_id, location_id, code, customer_email, customer_phone, customer_name, first_touch_at, order_reference, first_paid_med_at",
    )
    .eq("network_id", networkId)
    .order("first_touch_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  const locations = await listPartnerLocations(networkId, admin);
  const byId = new Map(locations.map((l) => [l.id, l.name]));
  return data.map((row) => ({
    id: String(row.id),
    networkId: String(row.network_id),
    locationId: String(row.location_id),
    code: String(row.code),
    customerEmail: (row.customer_email as string | null) ?? null,
    customerName: (row.customer_name as string | null) ?? null,
    firstTouchAt: String(row.first_touch_at),
    orderReference: (row.order_reference as string | null) ?? null,
    firstPaidMedAt: (row.first_paid_med_at as string | null) ?? null,
    locationName: byId.get(String(row.location_id)) ?? null,
  }));
}

export type CreatePartnerLocationInput = {
  name: string;
  slug?: string;
  city?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  directedByMd?: boolean;
  notes?: string | null;
};

export async function createPartnerLocation(
  input: CreatePartnerLocationInput,
  client?: SupabaseClient | null,
): Promise<{ ok: true; location: PartnerLocation } | { ok: false; error: string }> {
  const admin = adminClient(client);
  if (!admin) return { ok: false, error: "Database unavailable" };
  const network = await getAroraNetwork(admin);
  if (!network) return { ok: false, error: "Arora network not seeded" };
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "Name required" };
  const slug = input.slug?.trim() ? normalizePartnerCode(input.slug) : slugifyPartnerName(name);
  if (!isValidPartnerCode(slug)) return { ok: false, error: "Invalid slug (letters, numbers, hyphens)" };

  const { data, error } = await admin
    .from("partner_locations")
    .insert({
      network_id: network.id,
      slug,
      name,
      city: input.city?.trim() || null,
      contact_name: input.contactName?.trim() || null,
      contact_email: normalizeEmail(input.contactEmail),
      contact_phone: input.contactPhone?.trim() || null,
      directed_by_md: input.directedByMd !== false,
      payouts_enabled: true,
      status: "draft",
      notes: input.notes?.trim() || null,
    })
    .select(
      "id, network_id, slug, name, city, contact_name, contact_email, contact_phone, directed_by_md, payouts_enabled, status, referral_agreement_signed_at, kickoff_at, scan_count, notes",
    )
    .single();
  if (error || !data) {
    if (error?.code === "23505") return { ok: false, error: "That QR code is already in use" };
    return { ok: false, error: error?.message || "Could not create location" };
  }
  return { ok: true, location: mapLocation(data as LocationRow) };
}

export async function updatePartnerLocation(
  id: string,
  patch: Partial<{
    name: string;
    city: string | null;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    directedByMd: boolean;
    payoutsEnabled: boolean;
    status: PartnerLocationStatus;
    notes: string | null;
  }>,
  client?: SupabaseClient | null,
): Promise<{ ok: true; location: PartnerLocation } | { ok: false; error: string }> {
  const admin = adminClient(client);
  if (!admin) return { ok: false, error: "Database unavailable" };
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name != null) updates.name = patch.name.trim();
  if (patch.city !== undefined) updates.city = patch.city?.trim() || null;
  if (patch.contactName !== undefined) updates.contact_name = patch.contactName?.trim() || null;
  if (patch.contactEmail !== undefined) updates.contact_email = normalizeEmail(patch.contactEmail);
  if (patch.contactPhone !== undefined) updates.contact_phone = patch.contactPhone?.trim() || null;
  if (patch.directedByMd !== undefined) updates.directed_by_md = patch.directedByMd;
  if (patch.payoutsEnabled !== undefined) updates.payouts_enabled = patch.payoutsEnabled;
  if (patch.notes !== undefined) updates.notes = patch.notes?.trim() || null;
  if (patch.status) {
    updates.status = patch.status;
    if (patch.status === "live") {
      updates.referral_agreement_signed_at = new Date().toISOString();
    }
  }

  const { data, error } = await admin
    .from("partner_locations")
    .update(updates)
    .eq("id", id)
    .select(
      "id, network_id, slug, name, city, contact_name, contact_email, contact_phone, directed_by_md, payouts_enabled, status, referral_agreement_signed_at, kickoff_at, scan_count, notes",
    )
    .maybeSingle();
  if (error || !data) return { ok: false, error: error?.message || "Location not found" };
  return { ok: true, location: mapLocation(data as LocationRow) };
}

export async function recordPartnerKickoff(
  locationId: string,
  client?: SupabaseClient | null,
): Promise<{ ok: true; payout: PartnerPayout } | { ok: false; error: string }> {
  const admin = adminClient(client);
  if (!admin) return { ok: false, error: "Database unavailable" };
  const { data: loc } = await admin
    .from("partner_locations")
    .select(
      "id, network_id, slug, name, city, contact_name, contact_email, contact_phone, directed_by_md, payouts_enabled, status, referral_agreement_signed_at, kickoff_at, scan_count, notes",
    )
    .eq("id", locationId)
    .maybeSingle();
  if (!loc) return { ok: false, error: "Location not found" };
  const location = mapLocation(loc as LocationRow);
  const network = await getAroraNetwork(admin);
  if (!network || network.id !== location.networkId) return { ok: false, error: "Network mismatch" };

  const now = new Date().toISOString();
  await admin
    .from("partner_locations")
    .update({ kickoff_at: now, updated_at: now })
    .eq("id", locationId);

  const { data: payout, error } = await admin
    .from("partner_payouts")
    .insert({
      kind: "kickoff",
      network_id: network.id,
      location_id: location.id,
      payee: "md",
      payee_name: network.mdName || "Medical Director",
      amount_usd: network.kickoffUsd || PARTNER_FEES.kickoffUsd,
      status: "pending",
      notes: `Kickoff at ${location.name}`,
    })
    .select(
      "id, kind, network_id, location_id, attribution_id, order_reference, customer_email, payee, payee_name, amount_usd, status, period_month, notes, created_at, paid_at",
    )
    .single();

  if (error || !payout) {
    if (error?.code === "23505") return { ok: false, error: "Kickoff already recorded for this spa" };
    return { ok: false, error: error?.message || "Could not record kickoff" };
  }
  return { ok: true, payout: mapPayout(payout as PayoutRow, location.name) };
}

function monthStart(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export async function recordMonthlyRetainers(
  client?: SupabaseClient | null,
): Promise<{ ok: true; created: PartnerPayout[] } | { ok: false; error: string }> {
  const admin = adminClient(client);
  if (!admin) return { ok: false, error: "Database unavailable" };
  const network = await getAroraNetwork(admin);
  if (!network) return { ok: false, error: "Arora network not seeded" };
  const locations = await listPartnerLocations(network.id, admin);
  const periodMonth = monthStart();
  const created: PartnerPayout[] = [];

  const insertRetainer = async (kind: "md_retainer" | "network_retainer", amount: number, notes: string) => {
    const { data, error } = await admin
      .from("partner_payouts")
      .insert({
        kind,
        network_id: network.id,
        payee: "md",
        payee_name: network.mdName || "Medical Director",
        amount_usd: amount,
        status: "pending",
        period_month: periodMonth,
        notes,
      })
      .select(
        "id, kind, network_id, location_id, attribution_id, order_reference, customer_email, payee, payee_name, amount_usd, status, period_month, notes, created_at, paid_at",
      )
      .single();
    if (error?.code === "23505") return;
    if (error || !data) throw new Error(error?.message || "Retainer insert failed");
    created.push(mapPayout(data as PayoutRow));
  };

  try {
    await insertRetainer(
      "md_retainer",
      network.mdFeeUsd || PARTNER_FEES.mdRetainerUsd,
      `Hello Gorgeous Medical Director — ${periodMonth.slice(0, 7)}`,
    );
    const anyLiveDirected = locations.some((l) => l.status === "live" && l.directedByMd);
    if (anyLiveDirected) {
      await insertRetainer(
        "network_retainer",
        network.networkFeeUsd || PARTNER_FEES.networkRetainerUsd,
        `Network liaison (his spas as referral doors) — ${periodMonth.slice(0, 7)}`,
      );
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not record retainers" };
  }
  return { ok: true, created };
}

export async function updatePartnerPayoutStatus(
  id: string,
  status: PartnerPayoutStatus,
  paidBy?: string,
  client?: SupabaseClient | null,
): Promise<{ ok: true; payout: PartnerPayout } | { ok: false; error: string }> {
  const admin = adminClient(client);
  if (!admin) return { ok: false, error: "Database unavailable" };
  const now = new Date().toISOString();
  const { data, error } = await admin
    .from("partner_payouts")
    .update({
      status,
      paid_at: status === "paid" ? now : null,
      paid_by: status === "paid" ? paidBy || null : null,
      updated_at: now,
    })
    .eq("id", id)
    .select(
      "id, kind, network_id, location_id, attribution_id, order_reference, customer_email, payee, payee_name, amount_usd, status, period_month, notes, created_at, paid_at",
    )
    .maybeSingle();
  if (error || !data) return { ok: false, error: error?.message || "Payout not found" };
  return { ok: true, payout: mapPayout(data as PayoutRow) };
}

export async function resolvePartnerFromCode(
  code: string | null | undefined,
  client?: SupabaseClient | null,
): Promise<{ code: string; locationId: string } | null> {
  if (!code || !isValidPartnerCode(code)) return null;
  const found = await getPartnerLocationByCode(code, client);
  if (!found) return null;
  return { code: found.location.slug, locationId: found.location.id };
}

export type PartnerCreditInput = {
  orderReference: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerName: string | null;
  subtotalUsd: number;
  partnerCode: string | null;
  partnerLocationId: string | null;
  skipPartner?: boolean;
};

export async function maybeCreditPartnerReferral(
  input: PartnerCreditInput,
  client?: SupabaseClient | null,
): Promise<{ credited: boolean; reason: string }> {
  if (input.skipPartner) return { credited: false, reason: "staff_sale" };
  if (!isQualifyingMedicationOrder(input.subtotalUsd)) {
    return { credited: false, reason: "not_medication" };
  }
  const admin = adminClient(client);
  if (!admin) return { credited: false, reason: "no_db" };

  const resolved = input.partnerLocationId
    ? await (async () => {
        const { data } = await admin
          .from("partner_locations")
          .select(
            "id, network_id, slug, name, city, contact_name, contact_email, contact_phone, directed_by_md, payouts_enabled, status, referral_agreement_signed_at, kickoff_at, scan_count, notes",
          )
          .eq("id", input.partnerLocationId)
          .maybeSingle();
        if (!data) return null;
        const location = mapLocation(data as LocationRow);
        const { data: net } = await admin
          .from("partner_networks")
          .select(
            "id, slug, name, md_name, md_fee_usd, network_fee_usd, override_usd, spa_first_order_usd, kickoff_usd, status, notes",
          )
          .eq("id", location.networkId)
          .maybeSingle();
        if (!net) return null;
        return { network: mapNetwork(net as NetworkRow), location };
      })()
    : input.partnerCode
      ? await getPartnerLocationByCode(input.partnerCode, admin)
      : null;

  if (!resolved) return { credited: false, reason: "no_partner" };
  const { network, location } = resolved;
  if (!location.payoutsEnabled) return { credited: false, reason: "payouts_disabled" };

  const email = normalizeEmail(input.customerEmail);
  const now = new Date().toISOString();

  const { data: attr, error: attrErr } = await admin
    .from("partner_attributions")
    .insert({
      network_id: network.id,
      location_id: location.id,
      code: location.slug,
      customer_email: email,
      customer_phone: input.customerPhone,
      customer_name: input.customerName,
      order_reference: input.orderReference,
      first_paid_med_at: now,
    })
    .select("id")
    .single();
  if (attrErr) {
    console.error("[partner-network] attribution insert:", attrErr);
  }

  const spaAmount = network.spaFirstOrderUsd || PARTNER_FEES.spaFirstOrderUsd;
  const { data: spaPayout, error: spaErr } = await admin
    .from("partner_payouts")
    .insert({
      kind: "spa_first_order",
      network_id: network.id,
      location_id: location.id,
      attribution_id: attr?.id ?? null,
      order_reference: input.orderReference,
      customer_email: email,
      payee: "spa",
      payee_name: location.name,
      amount_usd: spaAmount,
      status: "pending",
      notes: `First paid medication order ${input.orderReference}`,
    })
    .select("id")
    .maybeSingle();

  if (spaErr) {
    if (spaErr.code === "23505") return { credited: false, reason: "already_paid_first_order" };
    console.error("[partner-network] spa payout:", spaErr);
    return { credited: false, reason: spaErr.message };
  }
  if (!spaPayout) return { credited: false, reason: "spa_payout_failed" };

  if (location.directedByMd) {
    const overrideAmount = network.overrideUsd || PARTNER_FEES.mdOverrideUsd;
    const { error: mdErr } = await admin.from("partner_payouts").insert({
      kind: "md_override",
      network_id: network.id,
      location_id: location.id,
      attribution_id: attr?.id ?? null,
      order_reference: input.orderReference,
      customer_email: email,
      payee: "md",
      payee_name: network.mdName || "Medical Director",
      amount_usd: overrideAmount,
      status: "pending",
      notes: `$25 override — ${location.name} · ${input.orderReference}`,
    });
    if (mdErr && mdErr.code !== "23505") {
      console.error("[partner-network] md override:", mdErr);
    }
  }

  return { credited: true, reason: "ok" };
}

export async function getPartnerDashboard(
  client?: SupabaseClient | null,
): Promise<PartnerDashboard | null> {
  const admin = adminClient(client);
  if (!admin) return null;
  const network = await getAroraNetwork(admin);
  if (!network) return null;
  const [locations, payouts, attributions] = await Promise.all([
    listPartnerLocations(network.id, admin),
    listPartnerPayouts(network.id, admin),
    listPartnerAttributions(network.id, admin),
  ]);
  const pending = payouts.filter((p) => p.status === "pending");
  const liveDoorCount = locations.filter((l) => l.status === "live").length;
  return {
    network,
    locations,
    payouts,
    attributions,
    pendingSpaUsd: pending.filter((p) => p.payee === "spa").reduce((s, p) => s + p.amountUsd, 0),
    pendingMdUsd: pending.filter((p) => p.payee === "md").reduce((s, p) => s + p.amountUsd, 0),
    liveDoorCount,
    networkRetainerDue: locations.some((l) => l.status === "live" && l.directedByMd),
  };
}
