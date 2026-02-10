// ============================================================
// AI ADMIN COMMANDS — Owner-only
// Classify input as query (answer) or command (proposal only, no execution)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getOwnerSession } from '@/lib/get-owner-session';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import { isAllowedLocation } from '@/lib/site-content-update';

export const dynamic = 'force-dynamic';

const COMMAND_PATTERNS = [
  /change\s+(?:the\s+)?(?:homepage\s+)?(?:hero\s+)?headline\s+to\s+["']?([^"']+)["']?/i,
  /update\s+(?:the\s+)?(?:homepage\s+)?(?:hero\s+)?headline\s+to\s+["']?([^"']+)["']?/i,
  /(?:homepage|hero)\s+headline\s+["']?([^"']+)["']?/i,
  /change\s+(?:the\s+)?(?:homepage\s+)?(?:hero\s+)?subheadline\s+to\s+["']?([^"']+)["']?/i,
  /update\s+(?:the\s+)?(?:homepage\s+)?(?:hero\s+)?subheadline\s+to\s+["']?([^"']+)["']?/i,
  /change\s+(?:the\s+)?(?:CTA|button)\s+(?:label|text)\s+to\s+["']?([^"']+)["']?/i,
  /update\s+(?:the\s+)?(?:CTA|button)\s+(?:label|text)\s+to\s+["']?([^"']+)["']?/i,
  /(?:CTA|button)\s+(?:label|text)\s+["']?([^"']+)["']?/i,
  /change\s+(?:the\s+)?tagline\s+to\s+["']?([^"']+)["']?/i,
  /update\s+(?:the\s+)?tagline\s+to\s+["']?([^"']+)["']?/i,
  /(?:turn\s+)?(?:booking\s+)?(?:on|off|enable|disable)\s+booking/i,
  /\b(?:update|change|set)\s+(?:friday|fri|monday|mon|tuesday|tue|wednesday|wed|thursday|thu|saturday|sat|sunday|sun)\s+hours?\s+to\s+["']?([^"']+)["']?/i,
  /\b(?:friday|fri|saturday|sat|sunday|sun)\s+hours?\s+["']?([^"']+)["']?/i,
  /\b(?:add\s+)?(?:a\s+)?closure\s+for\s+([^."']+)/i,
  /\b(?:add|turn on|enable)\s+(?:a\s+)?banner\b/i,
  /\b(?:turn off|disable)\s+(?:the\s+)?(?:promo\s+)?banner\b/i,
  /\bpause\s+booking\b/i,
  /\bresume\s+booking\b/i,
  /\b(?:update|change|set)\s+(?:default\s+)?(?:meta\s+)?title\s+to\s+["']?([^"']+)["']?/i,
  /\b(?:update|change|set)\s+(?:default\s+)?meta\s+description\s+to\s+["']?([^"']+)["']?/i,
  /\b(?:update|change|edit)\s+(?:the\s+)?about\s+(?:section\s+)?(?:content\s+)?to\s+["']?([^"']+)/i,
  /\b(?:update|change|edit)\s+(?:the\s+)?(?:first[- ]?time\s+visitor|first[- ]?time)\s+(?:info\s+)?(?:content\s+)?to\s+["']?([^"']+)/i,
  /\b(?:update|change|edit)\s+(?:the\s+)?(?:what\s+to\s+expect)\s+(?:section\s+)?(?:content\s+)?to\s+["']?([^"']+)/i,
  /\bdraft\s+(?:an?\s+)?(?:sms|text)\s+/i,
  /\bdraft\s+(?:an?\s+)?email\s+/i,
  /\bsuggest\s+(?:sms|email)\s+copy\b/i,
];

const QUERY_PATTERNS = [
  /^(what|how many|show me|who|when|compare|which|give me)/i,
  /^(what'?s?|how much|how'?s?)\s/i,
  /\?$/,
];

function classifyInput(message: string): 'query' | 'command' {
  const trimmed = message.trim();
  for (const p of QUERY_PATTERNS) {
    if (p.test(trimmed)) return 'query';
  }
  for (const p of COMMAND_PATTERNS) {
    if (p.test(trimmed)) return 'command';
  }
  const commandWords = /\b(change|update|set|add|remove|make the|replace|hours|close|open|banner|promo|pause booking|resume booking|meta|seo|about|draft|suggest)\b/i;
  if (commandWords.test(trimmed)) return 'command';
  return 'query';
}

function buildProposal(message: string): {
  action: string;
  location: string;
  old: string;
  new: string;
  summary: string;
  confidence: 'high' | 'medium' | 'low';
} | null {
  const m = message.trim();

  // Headline
  const headlineMatch = m.match(/(?:change|update|set)\s+(?:the\s+)?(?:homepage\s+)?(?:hero\s+)?headline\s+to\s+["']?([^"']+)["']?/i)
    || m.match(/(?:homepage|hero)\s+headline\s+["']?([^"']+)["']?/i);
  if (headlineMatch) {
    const newVal = headlineMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'homepage.hero.headline',
      old: '(current headline)',
      new: newVal,
      summary: `Update the homepage hero headline to: "${newVal}"`,
      confidence: 'high',
    };
  }

  // Subheadline
  const subMatch = m.match(/(?:change|update|set)\s+(?:the\s+)?(?:homepage\s+)?(?:hero\s+)?subheadline\s+to\s+["']?([^"']+)["']?/i)
    || m.match(/(?:homepage|hero)\s+subheadline\s+["']?([^"']+)["']?/i);
  if (subMatch) {
    const newVal = subMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'homepage.hero.subheadline',
      old: '(current subheadline)',
      new: newVal,
      summary: `Update the homepage hero subheadline to: "${newVal}"`,
      confidence: 'high',
    };
  }

  // CTA text
  const ctaMatch = m.match(/(?:change|update|set)\s+(?:the\s+)?(?:CTA|button)\s+(?:label|text)\s+to\s+["']?([^"']+)["']?/i)
    || m.match(/(?:CTA|button)\s+(?:label|text)\s+["']?([^"']+)["']?/i);
  if (ctaMatch) {
    const newVal = ctaMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'homepage.hero.cta_text',
      old: '(current CTA text)',
      new: newVal,
      summary: `Update the homepage CTA button label to: "${newVal}"`,
      confidence: 'high',
    };
  }

  // Tagline
  const tagMatch = m.match(/(?:change|update|set)\s+(?:the\s+)?tagline\s+to\s+["']?([^"']+)["']?/i);
  if (tagMatch) {
    const newVal = tagMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'site.tagline',
      old: '(current tagline)',
      new: newVal,
      summary: `Update the site tagline to: "${newVal}"`,
      confidence: 'high',
    };
  }

  // Booking on/off
  if (/\b(enable|turn on)\s+booking\b/i.test(m)) {
    return {
      action: 'update_site_content',
      location: 'site.booking_enabled',
      old: '(current setting)',
      new: 'true',
      summary: 'Turn on online booking availability.',
      confidence: 'high',
    };
  }
  if (/\b(disable|turn off)\s+booking\b/i.test(m)) {
    return {
      action: 'update_site_content',
      location: 'site.booking_enabled',
      old: '(current setting)',
      new: 'false',
      summary: 'Turn off online booking availability.',
      confidence: 'high',
    };
  }

  // Friday / weekday hours -> mon_fri
  const friHoursMatch = m.match(/(?:update|change|set)\s+(?:friday|fri)(?:\s+hours?)?\s+to\s+["']?([^"']+)["']?/i)
    || m.match(/friday\s+hours?\s+["']?([^"']+)["']?/i);
  if (friHoursMatch) {
    const newVal = friHoursMatch[1].trim().replace(/\s*[–-]\s*/, '–');
    return {
      action: 'update_site_content',
      location: 'site.hours.mon_fri',
      old: '(current weekday hours)',
      new: newVal,
      summary: `Update weekday (Mon–Fri) hours to: ${newVal}`,
      confidence: 'high',
    };
  }
  const satHoursMatch = m.match(/(?:update|change|set)\s+(?:saturday|sat)(?:\s+hours?)?\s+to\s+["']?([^"']+)["']?/i)
    || m.match(/saturday\s+hours?\s+["']?([^"']+)["']?/i);
  if (satHoursMatch) {
    const newVal = satHoursMatch[1].trim().replace(/\s*[–-]\s*/, '–');
    return {
      action: 'update_site_content',
      location: 'site.hours.sat',
      old: '(current Saturday hours)',
      new: newVal,
      summary: `Update Saturday hours to: ${newVal}`,
      confidence: 'high',
    };
  }
  const sunHoursMatch = m.match(/(?:update|change|set)\s+(?:sunday|sun)(?:\s+hours?)?\s+to\s+["']?([^"']+)["']?/i)
    || m.match(/sunday\s+hours?\s+["']?([^"']+)["']?/i);
  if (sunHoursMatch) {
    const newVal = sunHoursMatch[1].trim().replace(/\s*[–-]\s*/, '–');
    return {
      action: 'update_site_content',
      location: 'site.hours.sun',
      old: '(current Sunday hours)',
      new: newVal,
      summary: `Update Sunday hours to: ${newVal}`,
      confidence: 'high',
    };
  }

  // Add closure (e.g. "Add a closure for July 4th")
  const closureMatch = m.match(/(?:add\s+)?(?:a\s+)?closure\s+for\s+([^."']+)/i);
  if (closureMatch) {
    const raw = closureMatch[1].trim();
    const dateMatch = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/) || raw.match(/(\d{4})-(\d{2})-(\d{2})/) || raw.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i);
    let dateStr = raw;
    if (dateMatch) {
      if (dateMatch[0].includes('/')) dateStr = `${dateMatch[3]}-${dateMatch[1].padStart(2, '0')}-${dateMatch[2].padStart(2, '0')}`;
      else if (dateMatch[0].match(/\d{4}/)) dateStr = dateMatch[0];
      else {
        const months: Record<string, string> = { january: '01', february: '02', march: '03', april: '04', may: '05', june: '06', july: '07', august: '08', september: '09', october: '10', november: '11', december: '12' };
        const mo = months[dateMatch[1].toLowerCase()];
        const day = dateMatch[2].padStart(2, '0');
        const year = new Date().getFullYear();
        dateStr = `${year}-${mo}-${day}`;
      }
    }
    return {
      action: 'update_site_content',
      location: 'site.hours.add_closure',
      old: '(current closures)',
      new: dateStr,
      summary: `Add a closure date: ${dateStr}`,
      confidence: dateMatch ? 'high' : 'medium',
    };
  }

  // Banner: turn off
  if (/\b(?:turn off|disable)\s+(?:the\s+)?(?:promo\s+)?banner\b/i.test(m)) {
    return {
      action: 'update_site_content',
      location: 'homepage.banner.enabled',
      old: '(current)',
      new: 'false',
      summary: 'Turn off the homepage promo banner.',
      confidence: 'high',
    };
  }
  // Banner: add / turn on (with optional headline)
  const bannerMatch = m.match(/\b(?:add|turn on|enable)\s+(?:a\s+)?banner\s+(?:for\s+)?["']?([^"']*)["']?/i) || m.match(/\b(?:add|turn on|enable)\s+(?:a\s+)?banner\b/i);
  if (bannerMatch) {
    const headline = (bannerMatch[1] || '').trim() || 'Special offer';
    return {
      action: 'update_site_content',
      location: 'homepage.banner.headline',
      old: '(current)',
      new: headline,
      summary: `Add/update banner with headline: "${headline}". (Banner will be enabled.)`,
      confidence: 'high',
    };
  }

  // Pause booking (with reason)
  const pauseMatch = m.match(/\bpause\s+booking\s+(?:today\s+)?(?:due to\s+)?["']?([^"']*)["']?/i) || m.match(/\bpause\s+booking\b/i);
  if (pauseMatch) {
    const reason = (pauseMatch[1] || '').trim() || 'Temporarily unavailable';
    return {
      action: 'update_site_content',
      location: 'site.booking_paused_reason',
      old: '(current)',
      new: reason,
      summary: `Pause booking. Reason: "${reason}". (Booking will be disabled.)`,
      confidence: 'high',
    };
  }
  if (/\bresume\s+booking\b/i.test(m)) {
    return {
      action: 'update_site_content',
      location: 'site.booking_enabled',
      old: '(current setting)',
      new: 'true',
      summary: 'Resume online booking.',
      confidence: 'high',
    };
  }

  // Phase 4: SEO default meta
  const metaTitleMatch = m.match(/(?:update|change|set)\s+(?:default\s+)?(?:meta\s+)?title\s+to\s+["']?([^"']+)["']?/i);
  if (metaTitleMatch) {
    const newVal = metaTitleMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'site.default_meta_title',
      old: '(current default meta title)',
      new: newVal,
      summary: `Update default meta title (SEO) to: "${newVal}"`,
      confidence: 'high',
    };
  }
  const metaDescMatch = m.match(/(?:update|change|set)\s+(?:default\s+)?meta\s+description\s+to\s+["']?([^"']+)["']?/i);
  if (metaDescMatch) {
    const newVal = metaDescMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'site.default_meta_description',
      old: '(current default meta description)',
      new: newVal,
      summary: `Update default meta description (SEO) to: "${newVal.slice(0, 60)}${newVal.length > 60 ? '…' : ''}"`,
      confidence: 'high',
    };
  }

  // Phase 4: Informational content sections
  const aboutMatch = m.match(/(?:update|change|edit)\s+(?:the\s+)?about\s+(?:section\s+)?(?:content\s+)?to\s+["']?([^"']+)/i);
  if (aboutMatch) {
    const newVal = aboutMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'section.about.content',
      old: '(current about content)',
      new: newVal,
      summary: `Update the About section content.`,
      confidence: 'high',
    };
  }
  const firstTimeMatch = m.match(/(?:update|change|edit)\s+(?:the\s+)?(?:first[- ]?time\s+visitor|first[- ]?time)\s+(?:info\s+)?(?:content\s+)?to\s+["']?([^"']+)/i);
  if (firstTimeMatch) {
    const newVal = firstTimeMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'section.first_time_visitor.content',
      old: '(current content)',
      new: newVal,
      summary: `Update the First-time visitor info content.`,
      confidence: 'high',
    };
  }
  const whatToExpectMatch = m.match(/(?:update|change|edit)\s+(?:the\s+)?(?:what\s+to\s+expect)\s+(?:section\s+)?(?:content\s+)?to\s+["']?([^"']+)/i);
  if (whatToExpectMatch) {
    const newVal = whatToExpectMatch[1].trim();
    return {
      action: 'update_site_content',
      location: 'section.what_to_expect.content',
      old: '(current content)',
      new: newVal,
      summary: `Update the What to expect section content.`,
      confidence: 'high',
    };
  }

  return null;
}

function buildDraftResponse(message: string): { kind: 'draft'; draftType: string; message: string; draftText: string; note: string } | null {
  const m = message.trim().toLowerCase();
  if (/\bdraft\s+(?:an?\s+)?(?:sms|text)\s+/.test(m) || /\bsuggest\s+sms\s+copy\b/.test(m)) {
    const draftText = "Hi! This is Hello Gorgeous Med Spa. We're sending a quick reminder — copy and edit this in your SMS campaign, then send when ready.";
    return {
      kind: 'draft',
      draftType: 'sms',
      message: "Here's draft SMS copy. No changes are applied; use it in **Admin → Marketing → SMS** when you're ready.",
      draftText,
      note: 'Copy and use in your campaign. No execution from this chat.',
    };
  }
  if (/\bdraft\s+(?:an?\s+)?email\s+/.test(m) || /\bsuggest\s+email\s+copy\b/.test(m)) {
    const draftText = "Subject: A note from Hello Gorgeous\n\nHi there,\n\nWe wanted to reach out — copy and edit this in your email tool, then send when ready.\n\nBest,\nHello Gorgeous Med Spa";
    return {
      kind: 'draft',
      draftType: 'email',
      message: "Here's draft email copy. No changes are applied; use it in your email campaign when you're ready.",
      draftText,
      note: 'Copy and use in your campaign. No execution from this chat.',
    };
  }
  return null;
}

export async function POST(request: NextRequest) {
  const owner = await getOwnerSession();
  if (!owner) {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const kind = classifyInput(message);

    if (kind === 'query') {
      return NextResponse.json({
        kind: 'query',
        response: 'For business questions and charts, use the **Insights** tab. Here you can run commands (e.g. update hero, hours, banner, booking, SEO meta, about section) or ask for draft SMS/email copy.',
      });
    }

    const draft = buildDraftResponse(message);
    if (draft) {
      return NextResponse.json({
        kind: 'draft',
        message: draft.message,
        draftType: draft.draftType,
        draftText: draft.draftText,
        note: draft.note,
      });
    }

    const proposal = buildProposal(message);
    if (!proposal) {
      return NextResponse.json({
        kind: 'query',
        response: "I couldn't turn that into a specific change. Try: \"Change homepage headline to …\", \"Update default meta title to …\", \"Update the about section content to …\", \"Update Friday hours to 9–3\", \"Draft an SMS for …\", or \"Turn off the promo banner\".",
      });
    }

    if (!isAllowedLocation(proposal.location)) {
      return NextResponse.json({
        kind: 'query',
        response: `That change isn't allowed. Allowed: hero, banner, tagline, hours, closures, booking, SEO meta (default title/description), about / first-time visitor / what-to-expect sections.`,
      });
    }

    const responseMessage =
      `I'm about to make this change:\n\n**${proposal.summary}**\n\n• **Where:** ${proposal.location}\n• **New value:** ${proposal.new}\n\nReview below and choose **Approve**, **Edit**, or **Cancel**.`;

    if (isAdminConfigured()) {
      const admin = createAdminSupabaseClient();
      if (admin) {
        await admin.from('ai_watchdog_logs').insert({
          source: 'ai_admin_commands',
          channel: 'admin',
          request_summary: message.slice(0, 200),
          response_summary: proposal.summary.slice(0, 150),
          full_response_preview: responseMessage.slice(0, 500),
          flagged: false,
          metadata: {
            action: proposal.action,
            confidence: proposal.confidence,
            approved_by_owner: false,
            proposal: {
              location: proposal.location,
              old: proposal.old,
              new: proposal.new,
            },
          },
        }).then(() => {}).catch((err) => console.error('Admin commands watchdog log:', err));
      }
    }

    return NextResponse.json({
      kind: 'command_proposal',
      message: responseMessage,
      proposal: {
        action: proposal.action,
        location: proposal.location,
        old: proposal.old,
        new: proposal.new,
        summary: proposal.summary,
        confidence: proposal.confidence,
      },
    });
  } catch (e) {
    console.error('Admin commands error:', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
