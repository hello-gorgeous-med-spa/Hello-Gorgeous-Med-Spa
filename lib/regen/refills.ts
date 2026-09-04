/**
 * REGEN RX Refill Reminder System
 * 
 * Tracks when patients need refills based on:
 * - Order date + supply duration
 * - Subscription billing cycles
 * - Custom reminder preferences
 */

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sendRegenNotification } from './notifications';

// Default supply durations by program (in days)
const SUPPLY_DURATION: Record<string, number> = {
  'Weight Loss': 30,
  'Hormones': 30,
  'Peptides': 30,
  'Sexual Health': 30,
  'Hair': 90,
  'Skincare': 60,
  'Vitamins': 30,
};

// Reminder lead time (days before supply runs out)
const REMINDER_LEAD_DAYS = 7;

interface RefillCandidate {
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  lastOrderDate: string;
  program: string;
  daysUntilEmpty: number;
  lastOrderId: string;
}

/**
 * Find patients who need refill reminders
 */
export async function getRefillCandidates(): Promise<RefillCandidate[]> {
  const supabase = createServerSupabaseClient();
  const candidates: RefillCandidate[] = [];

  // Get all delivered orders from the past 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: orders } = await supabase
    .from('regen_orders')
    .select(`
      id,
      patient_id,
      created_at,
      status,
      items,
      patient:regen_patients(id, name, email, phone)
    `)
    .eq('status', 'delivered')
    .gte('created_at', ninetyDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  if (!orders) return [];

  // Group by patient, find most recent order
  const patientOrders: Record<string, typeof orders[0]> = {};
  for (const order of orders) {
    if (!patientOrders[order.patient_id]) {
      patientOrders[order.patient_id] = order;
    }
  }

  const today = new Date();

  for (const order of Object.values(patientOrders)) {
    // Determine program from order items
    const program = determineProgram(order.items);
    const supplyDays = SUPPLY_DURATION[program] || 30;

    const orderDate = new Date(order.created_at);
    const emptyDate = new Date(orderDate);
    emptyDate.setDate(emptyDate.getDate() + supplyDays);

    const daysUntilEmpty = Math.ceil((emptyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Include if within reminder window
    if (daysUntilEmpty <= REMINDER_LEAD_DAYS && daysUntilEmpty >= -7) {
      const patient = order.patient as { id: string; name: string; email: string; phone?: string };
      candidates.push({
        patientId: patient.id,
        patientName: patient.name,
        patientEmail: patient.email,
        patientPhone: patient.phone,
        lastOrderDate: order.created_at,
        program,
        daysUntilEmpty,
        lastOrderId: order.id,
      });
    }
  }

  return candidates;
}

/**
 * Send refill reminder to a patient
 */
export async function sendRefillReminder(candidate: RefillCandidate): Promise<void> {
  const supabase = createServerSupabaseClient();

  // Check if we already sent a reminder for this order
  const { data: existingReminder } = await supabase
    .from('regen_refill_reminders')
    .select('id')
    .eq('order_id', candidate.lastOrderId)
    .single();

  if (existingReminder) {
    console.log(`Reminder already sent for order ${candidate.lastOrderId}`);
    return;
  }

  // Send email notification
  await sendRegenNotification({
    type: 'refill_reminder' as any, // Will add this type
    patient: {
      name: candidate.patientName,
      email: candidate.patientEmail,
      phone: candidate.patientPhone,
    },
    intake: {
      id: candidate.lastOrderId,
      goal: candidate.program,
    },
  });

  // Record the reminder
  await supabase.from('regen_refill_reminders').insert({
    patient_id: candidate.patientId,
    order_id: candidate.lastOrderId,
    program: candidate.program,
    sent_at: new Date().toISOString(),
  });
}

/**
 * Process all pending refill reminders (called by cron)
 */
export async function processRefillReminders(): Promise<{ sent: number; errors: number }> {
  const candidates = await getRefillCandidates();
  let sent = 0;
  let errors = 0;

  for (const candidate of candidates) {
    try {
      await sendRefillReminder(candidate);
      sent++;
    } catch (error) {
      console.error(`Failed to send refill reminder to ${candidate.patientEmail}:`, error);
      errors++;
    }
  }

  return { sent, errors };
}

/**
 * Determine program from order items
 */
function determineProgram(items: unknown): string {
  if (!items || !Array.isArray(items)) return 'Weight Loss';

  const itemStr = JSON.stringify(items).toLowerCase();

  if (itemStr.includes('semaglutide') || itemStr.includes('tirzepatide') || itemStr.includes('weight')) {
    return 'Weight Loss';
  }
  if (itemStr.includes('testosterone') || itemStr.includes('estrogen') || itemStr.includes('hormone')) {
    return 'Hormones';
  }
  if (itemStr.includes('peptide') || itemStr.includes('sermorelin') || itemStr.includes('bpc')) {
    return 'Peptides';
  }
  if (itemStr.includes('pt-141') || itemStr.includes('sildenafil') || itemStr.includes('tadalafil')) {
    return 'Sexual Health';
  }
  if (itemStr.includes('finasteride') || itemStr.includes('minoxidil') || itemStr.includes('hair')) {
    return 'Hair';
  }
  if (itemStr.includes('tretinoin') || itemStr.includes('skincare')) {
    return 'Skincare';
  }
  if (itemStr.includes('b12') || itemStr.includes('biotin') || itemStr.includes('vitamin')) {
    return 'Vitamins';
  }

  return 'Weight Loss'; // Default
}
