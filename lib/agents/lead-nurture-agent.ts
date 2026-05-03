// ============================================================
// LEAD NURTURE AGENT
// Autonomous agent that nurtures new leads through a 3-step sequence
// Runs daily via cron, sends SMS/email based on lead age
// Tracks progress to prevent duplicates
// ============================================================

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { sendSms } from "@/lib/notifications/sms-outbound";
import { validatePhoneNumber, renderTemplate } from "@/lib/hgos/sms-marketing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hellogorgeousmedspa.com";
const RESEND_API = "https://api.resend.com/emails";

// Nurture sequence timing (hours after lead capture)
const NURTURE_STEPS = {
  1: { minHours: 0, maxHours: 1, channel: "sms", name: "Welcome SMS" },
  2: { minHours: 48, maxHours: 72, channel: "email", name: "Day 2 Educational Email" },
  3: { minHours: 120, maxHours: 144, channel: "sms", name: "Day 5 Follow-up SMS" },
} as const;

// Message templates
const SMS_TEMPLATES = {
  welcome: (firstName: string, source: string) => {
    const sourceMsg = source === 'contact_form' 
      ? "Thanks for reaching out" 
      : source === 'face' || source === 'roadmap'
        ? "Thanks for trying our AI consultation"
        : "Thanks for your interest";
    return `Hi ${firstName}! ${sourceMsg} to Hello Gorgeous Med Spa. 💕 We're here to help with your aesthetic goals. Ready to book? ${SITE_URL}/book or call us: 630-636-6193`;
  },
  followup: (firstName: string) =>
    `Hi ${firstName}! Just checking in from Hello Gorgeous. 💫 We'd love to help you start your transformation. Book a free consultation: ${SITE_URL}/book — Questions? Reply to this text!`,
};

const EMAIL_TEMPLATES = {
  educational: (firstName: string, leadType: string) => {
    const subjectMap: Record<string, string> = {
      face: "Your personalized skincare journey",
      roadmap: "Your custom treatment roadmap",
      hormone: "Hormone wellness insights for you",
      contact_form: "Welcome to Hello Gorgeous Med Spa",
      default: "Your path to looking & feeling gorgeous",
    };
    const subject = subjectMap[leadType] || subjectMap.default;

    const bodyMap: Record<string, string> = {
      face: `<p>Your AI Face Blueprint showed some amazing insights about your skin! Our team is ready to create a personalized plan just for you.</p>
             <p>Popular next steps for clients like you:</p>
             <ul>
               <li><strong>Morpheus8</strong> — RF microneedling for texture & tightening</li>
               <li><strong>Medical-grade skincare</strong> — prescription-strength results</li>
               <li><strong>Botox & fillers</strong> — subtle, natural enhancement</li>
             </ul>`,
      hormone: `<p>Hormone health is foundational to how you look and feel. Our wellness team can help you understand your options.</p>
                <p>Services that might interest you:</p>
                <ul>
                  <li><strong>Hormone testing</strong> — comprehensive panels</li>
                  <li><strong>Bioidentical hormones</strong> — personalized protocols</li>
                  <li><strong>Weight management</strong> — GLP-1 and metabolic support</li>
                </ul>`,
      default: `<p>At Hello Gorgeous, we combine advanced aesthetics with wellness to help you look and feel your best.</p>
                <p>Our most popular services:</p>
                <ul>
                  <li><strong>Botox & Fillers</strong> — natural, refreshed results</li>
                  <li><strong>Morpheus8</strong> — skin tightening without surgery</li>
                  <li><strong>Weight Loss</strong> — medical weight management programs</li>
                </ul>`,
    };
    const bodyContent = bodyMap[leadType] || bodyMap.default;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="text-align:center;margin-bottom:24px">
          <img src="https://www.hellogorgeousmedspa.com/images/hg-logo.png" alt="Hello Gorgeous Med Spa" style="max-width:200px" />
        </div>
        <h2 style="color:#E91E8C">Hi ${firstName},</h2>
        ${bodyContent}
        <p style="margin-top:24px">
          <a href="${SITE_URL}/book" style="display:inline-block;background:#E91E8C;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">
            Book Your Free Consultation
          </a>
        </p>
        <p style="margin-top:24px;color:#666;font-size:14px">
          Questions? Just reply to this email or call us at (630) 636-6193.<br>
          We're open 7 days a week for our clients.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="color:#999;font-size:12px">
          Hello Gorgeous Med Spa<br>
          74 W. Washington St, Oswego, IL 60543<br>
          <a href="${SITE_URL}" style="color:#E91E8C">hellogorgeousmedspa.com</a>
        </p>
      </div>
    `;
    return { subject, html };
  },
};

async function sendNurtureEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[LeadNurture] RESEND_API_KEY not set, skipping email");
    return false;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "Hello Gorgeous <hello@hellogorgeousmedspa.com>";
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromEmail, to: [to], subject, html }),
    });
    return res.ok;
  } catch (e) {
    console.error("[LeadNurture] Email error:", e);
    return false;
  }
}

type Lead = {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  lead_type: string;
  source: string;
  created_at: string;
  nurture_step: number;
  nurture_last_sent_at: string | null;
  sms_opt_in: boolean;
  converted_to_client: boolean;
};

export type LeadNurtureResult = {
  ok: boolean;
  leadsProcessed: number;
  step1Sent: number;
  step2Sent: number;
  step3Sent: number;
  completed: number;
  smsSent: number;
  emailSent: number;
  skippedNoContact: number;
  skippedConverted: number;
  errors: string[];
  runAt: string;
};

export async function runLeadNurtureAgent(options?: {
  dryRun?: boolean;
  maxBatch?: number;
}): Promise<LeadNurtureResult> {
  const dryRun = options?.dryRun ?? false;
  const maxBatch = options?.maxBatch ?? 100;

  const result: LeadNurtureResult = {
    ok: false,
    leadsProcessed: 0,
    step1Sent: 0,
    step2Sent: 0,
    step3Sent: 0,
    completed: 0,
    smsSent: 0,
    emailSent: 0,
    skippedNoContact: 0,
    skippedConverted: 0,
    errors: [],
    runAt: new Date().toISOString(),
  };

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    result.errors.push("Supabase not configured");
    return result;
  }

  const now = Date.now();

  // Get all leads that need nurturing (not converted, not completed)
  const { data: leads, error: fetchError } = await supabase
    .from("leads")
    .select("*")
    .eq("converted_to_client", false)
    .is("nurture_completed_at", null)
    .order("created_at", { ascending: true })
    .limit(maxBatch);

  if (fetchError) {
    result.errors.push(`Fetch error: ${fetchError.message}`);
    return result;
  }

  if (!leads || leads.length === 0) {
    result.ok = true;
    return result;
  }

  for (const lead of leads as Lead[]) {
    result.leadsProcessed++;
    const leadAgeHours = (now - new Date(lead.created_at).getTime()) / (1000 * 60 * 60);
    const currentStep = lead.nurture_step;
    const firstName = lead.full_name?.split(" ")[0] || "there";

    // Check if already converted
    if (lead.converted_to_client) {
      result.skippedConverted++;
      continue;
    }

    // Determine next step
    let nextStep: 1 | 2 | 3 | null = null;

    if (currentStep === 0) {
      // New lead — send welcome (step 1)
      const step1 = NURTURE_STEPS[1];
      if (leadAgeHours >= step1.minHours && leadAgeHours <= step1.maxHours + 24) {
        nextStep = 1;
      }
    } else if (currentStep === 1) {
      // Step 1 done — check if ready for step 2
      const step2 = NURTURE_STEPS[2];
      if (leadAgeHours >= step2.minHours && leadAgeHours <= step2.maxHours + 48) {
        nextStep = 2;
      }
    } else if (currentStep === 2) {
      // Step 2 done — check if ready for step 3
      const step3 = NURTURE_STEPS[3];
      if (leadAgeHours >= step3.minHours && leadAgeHours <= step3.maxHours + 48) {
        nextStep = 3;
      }
    } else if (currentStep >= 3) {
      // Nurture complete
      await supabase
        .from("leads")
        .update({ nurture_completed_at: new Date().toISOString() })
        .eq("id", lead.id);
      result.completed++;
      continue;
    }

    if (!nextStep) continue;

    const stepConfig = NURTURE_STEPS[nextStep];
    let success = false;
    let channel = stepConfig.channel;
    let messagePreview = "";

    if (channel === "sms") {
      if (!lead.phone) {
        result.skippedNoContact++;
        continue;
      }
      const validation = validatePhoneNumber(lead.phone);
      if (!validation.valid) {
        result.skippedNoContact++;
        continue;
      }

      const message = nextStep === 1
        ? SMS_TEMPLATES.welcome(firstName, lead.lead_type)
        : SMS_TEMPLATES.followup(firstName);

      messagePreview = message.slice(0, 100);

      if (dryRun) {
        console.log(`[DRY RUN] Step ${nextStep} SMS to ${lead.phone}: ${message}`);
        success = true;
      } else {
        const smsResult = await sendSms(validation.formatted, message);
        success = smsResult.success;
        if (!success) {
          result.errors.push(`SMS to ${lead.phone}: ${smsResult.error}`);
        }
      }

      if (success) result.smsSent++;
    } else if (channel === "email") {
      if (!lead.email) {
        result.skippedNoContact++;
        continue;
      }

      const { subject, html } = EMAIL_TEMPLATES.educational(firstName, lead.lead_type);
      messagePreview = subject;

      if (dryRun) {
        console.log(`[DRY RUN] Step ${nextStep} email to ${lead.email}: ${subject}`);
        success = true;
      } else {
        success = await sendNurtureEmail(lead.email, subject, html);
        if (!success) {
          result.errors.push(`Email to ${lead.email}: failed to send`);
        }
      }

      if (success) result.emailSent++;
    }

    if (success) {
      if (nextStep === 1) result.step1Sent++;
      if (nextStep === 2) result.step2Sent++;
      if (nextStep === 3) result.step3Sent++;

      if (!dryRun) {
        // Update lead nurture status
        await supabase
          .from("leads")
          .update({
            nurture_step: nextStep,
            nurture_last_sent_at: new Date().toISOString(),
          })
          .eq("id", lead.id);

        // Log the outreach
        await supabase.from("lead_nurture_log").insert({
          lead_id: lead.id,
          step: nextStep,
          channel,
          message_preview: messagePreview,
          delivered: true,
        });
      }
    }

    // Small delay between sends
    await new Promise((r) => setTimeout(r, 100));
  }

  result.ok = result.errors.length === 0 || result.smsSent > 0 || result.emailSent > 0;
  return result;
}
