import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/hgos/supabase";

/**
 * Lead Nurture Automation — 5-Step Sequence Per Device
 *
 * Triggered by CRON or manually. Checks for clients at each stage
 * of their journey and sends the appropriate SMS/email.
 *
 * Steps:
 * 1. Consultation booked → SMS confirmation + educational blog link
 * 2. 24hrs post-consult (not booked treatment) → Email recap + offer
 * 3. 5 days post-consult (not booked treatment) → SMS follow-up
 * 4. 24hrs post-treatment → SMS aftercare instructions
 * 5. 10 days post-treatment → SMS Google review request
 *
 * GLP-1 Pipeline (separate triggers):
 * - Week 6 of GLP-1 → Email: body contouring education
 * - Week 8 of GLP-1 → SMS: 20% off QuantumRF offer
 * - Week 10 of GLP-1 → Email: congratulations + Trifecta consultation CTA
 * - Week 14 of GLP-1 → Email: membership offer
 */

const TELNYX_API = "https://api.telnyx.com/v2/messages";
const RESEND_API = "https://api.resend.com/emails";
const REVIEW_LINK = "https://g.page/r/CYQOWmT_HcwQEBM/review";
const SITE_URL = "https://www.hellogorgeousmedspa.com";

interface NurtureMessage {
  step: string;
  channel: "sms" | "email";
  to: string;
  subject?: string;
  body: string;
}

async function sendSMS(to: string, body: string): Promise<boolean> {
  const apiKey = process.env.TELNYX_API_KEY;
  const from = process.env.TELNYX_PHONE_NUMBER;
  if (!apiKey || !from) return false;

  try {
    const res = await fetch(TELNYX_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        text: body,
        messaging_profile_id: process.env.TELNYX_MESSAGING_PROFILE_ID || undefined,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const fromEmail = process.env.RESEND_FROM_EMAIL || "Hello Gorgeous <onboarding@resend.dev>";
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromEmail, to: [to], subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// POST: Trigger a specific nurture step for a client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, clientPhone, clientEmail, device, step, treatmentDate, consultDate } = body;

    const messages: NurtureMessage[] = [];
    const deviceName = device || "your treatment";
    const blogLinks: Record<string, string> = {
      "morpheus8-burst": `${SITE_URL}/blog/morpheus8-burst-rf-microneedling-oswego-il`,
      "solaria-co2": `${SITE_URL}/blog/co2-laser-recovery-day-by-day-guide`,
      "quantum-rf": `${SITE_URL}/blog/quantumrf-skin-tightening-oswego-il`,
    };
    const careLinks: Record<string, string> = {
      "morpheus8-burst": `${SITE_URL}/pre-post-care/morpheus8-burst`,
      "solaria-co2": `${SITE_URL}/pre-post-care/solaria-co2`,
      "quantum-rf": `${SITE_URL}/pre-post-care/quantum-rf`,
    };

    const blogLink = blogLinks[device] || `${SITE_URL}/blog`;
    const careLink = careLinks[device] || `${SITE_URL}/pre-post-care`;
    const firstName = clientName?.split(" ")[0] || "there";

    switch (step) {
      case "consultation-booked":
        if (clientPhone) {
          messages.push({
            step,
            channel: "sms",
            to: clientPhone,
            body: `Hi ${firstName}! You're booked for your ${deviceName} consultation at Hello Gorgeous. Here's a quick guide on what to expect: ${blogLink}\n\nSee you soon! — Danielle & Ryan`,
          });
        }
        break;

      case "post-consult-24h":
        if (clientEmail) {
          messages.push({
            step,
            channel: "email",
            to: clientEmail,
            subject: `Your ${deviceName} Treatment Plan — Hello Gorgeous`,
            body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <h2 style="color:#E91E8C">Hi ${firstName},</h2>
              <p>It was great meeting you! Based on our conversation, we think ${deviceName} is a great fit for your goals.</p>
              <p>Our launch special is available for a limited time — and we'd love to help you get started.</p>
              <p><a href="${SITE_URL}/book" style="display:inline-block;background:#E91E8C;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">Book Your Treatment</a></p>
              <p>Questions? Reply to this email or chat with us anytime.</p>
              <p>— Danielle & Ryan<br>Hello Gorgeous Med Spa<br>630-636-6193</p>
            </div>`,
          });
        }
        break;

      case "post-consult-5d":
        if (clientPhone) {
          messages.push({
            step,
            channel: "sms",
            to: clientPhone,
            body: `Hi ${firstName}! Just checking in — still thinking about ${deviceName}? We have a few launch spots left this month. Happy to answer any questions!\n\nBook here: ${SITE_URL}/book — Hello Gorgeous`,
          });
        }
        break;

      case "post-treatment-24h":
        if (clientPhone) {
          messages.push({
            step,
            channel: "sms",
            to: clientPhone,
            body: `Hi ${firstName}! How are you feeling after your ${deviceName} session? Here are your aftercare instructions: ${careLink}\n\nAny concerns? Text us anytime! — Hello Gorgeous 630-636-6193`,
          });
        }
        break;

      case "review-request-10d":
        if (clientPhone) {
          messages.push({
            step,
            channel: "sms",
            to: clientPhone,
            body: `Hi ${firstName}! We hope you're loving your results so far! If you had a great experience, a quick Google review means the world to us: ${REVIEW_LINK}\n\n— Danielle & Ryan`,
          });
        }
        break;

      // GLP-1 Pipeline
      case "glp1-week6":
        if (clientEmail) {
          messages.push({
            step,
            channel: "email",
            to: clientEmail,
            subject: "What comes after the weight loss? Let's talk about shaping.",
            body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <h2 style="color:#E91E8C">Hi ${firstName},</h2>
              <p>You're making incredible progress on your weight loss journey! As your body changes, you might notice areas where the fat is gone but the skin hasn't quite caught up. That's completely normal.</p>
              <p>We've invested in advanced body contouring technology — QuantumRF and Morpheus8 Burst — specifically designed to sculpt and tighten these areas without surgery.</p>
              <p><a href="${SITE_URL}/blog/loose-skin-after-weight-loss-treatment" style="display:inline-block;background:#E91E8C;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">Learn About Body Contouring</a></p>
              <p>As one of our wellness patients, you'll get priority pricing when you're ready.</p>
              <p>— Danielle & Ryan<br>Hello Gorgeous Med Spa</p>
            </div>`,
          });
        }
        break;

      case "glp1-week8":
        if (clientPhone) {
          messages.push({
            step,
            channel: "sms",
            to: clientPhone,
            body: `Hi ${firstName}! Your weight loss progress is amazing. Ready to tighten and tone? As a GLP-1 patient, you get 20% off your first QuantumRF body contouring session.\n\nBook your free assessment: ${SITE_URL}/book — Hello Gorgeous`,
          });
        }
        break;

      case "glp1-week10":
        if (clientEmail) {
          messages.push({
            step,
            channel: "email",
            to: clientEmail,
            subject: "Congratulations on your transformation — what's next?",
            body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <h2 style="color:#E91E8C">Congratulations, ${firstName}!</h2>
              <p>Your dedication to your weight loss journey has been incredible. Now let's talk about the next chapter — addressing any loose skin and sculpting your new body.</p>
              <p>Our InMode Trifecta (Morpheus8 Burst + QuantumRF + Solaria CO₂) is specifically designed for post-weight loss body transformation. No surgery. No extended downtime.</p>
              <p><a href="${SITE_URL}/book" style="display:inline-block;background:#E91E8C;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">Book Your Trifecta Consultation</a></p>
              <p>— Danielle & Ryan<br>Hello Gorgeous Med Spa<br>630-636-6193</p>
            </div>`,
          });
        }
        break;

      case "glp1-week14":
        if (clientEmail) {
          messages.push({
            step,
            channel: "email",
            to: clientEmail,
            subject: "Stay in the Hello Gorgeous family — membership for you",
            body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <h2 style="color:#E91E8C">Hi ${firstName},</h2>
              <p>You've been an amazing part of the Hello Gorgeous family. We'd love to keep supporting your wellness journey with our VIP membership program.</p>
              <p>Members get priority booking, exclusive pricing on treatments, and ongoing wellness support from our NP — 7 days a week.</p>
              <p><a href="${SITE_URL}/memberships" style="display:inline-block;background:#E91E8C;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">Explore Membership Options</a></p>
              <p>— Danielle & Ryan<br>Hello Gorgeous Med Spa</p>
            </div>`,
          });
        }
        break;

      default:
        return NextResponse.json({ error: `Unknown step: ${step}` }, { status: 400 });
    }

    // Send all messages
    const results = [];
    for (const msg of messages) {
      let success = false;
      if (msg.channel === "sms") {
        success = await sendSMS(msg.to, msg.body);
      } else {
        success = await sendEmail(msg.to, msg.subject!, msg.body);
      }
      results.push({ step: msg.step, channel: msg.channel, success });
    }

    // Log to Supabase
    const supabase = createServerSupabaseClient();
    if (supabase) {
      for (const result of results) {
        await supabase.from("automation_logs").insert({
          automation_type: "lead_nurture",
          step: result.step,
          channel: result.channel,
          client_name: clientName,
          success: result.success,
          metadata: { device, consultDate, treatmentDate },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, results, messagesSent: results.length });
  } catch (error) {
    console.error("[Lead Nurture] Error:", error);
    return NextResponse.json({ error: "Automation failed" }, { status: 500 });
  }
}
