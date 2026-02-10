// ============================================================
// Site content update — applies AI admin command to CMS
// Phase 1–3: hero, CTA, hours, banner, booking toggle/pause, tagline
// No code edits; all via Supabase CMS/settings
// ============================================================

import type { SupabaseClient } from '@supabase/supabase-js';

export interface ApplyResult {
  ok: boolean;
  error?: string;
  location: string;
  old?: unknown;
  new?: unknown;
}

/** Value can be string, boolean, or null (e.g. clear booking_resume_at) */
export type SiteContentValue = string | boolean | null;

/**
 * Apply a single location+value update.
 * location examples: homepage.hero.headline, site.hours.mon_fri, homepage.banner.enabled, site.booking_paused_reason
 */
export async function applySiteContentUpdate(
  supabase: SupabaseClient,
  location: string,
  value: SiteContentValue
): Promise<ApplyResult> {
  const normalizedValue = value === '' || value === 'null' ? null : value;
  const parts = location.split('.');
  if (parts.length < 2) {
    return { ok: false, error: 'Invalid location', location };
  }

  // homepage.hero.headline | homepage.hero.subheadline | homepage.hero.cta_text | homepage.hero.cta_url
  if (parts[0] === 'homepage' && parts[1] === 'hero') {
    const field = parts[2]; // headline, subheadline, cta_text, cta_url
    const allowed = ['headline', 'subheadline', 'cta_text', 'cta_url'];
    if (!field || !allowed.includes(field) || typeof value !== 'string') {
      return { ok: false, error: `Invalid hero field or value type: ${field}`, location };
    }
    const { data: sections, error: fetchErr } = await supabase
      .from('cms_sections')
      .select('id, content')
      .eq('type', 'hero')
      .eq('status', 'active')
      .limit(1);
    if (fetchErr || !sections?.length) {
      return { ok: false, error: fetchErr?.message || 'Hero section not found', location };
    }
    const section = sections[0];
    const content = (section.content as Record<string, unknown>) || {};
    const oldVal = content[field];
    const newContent = { ...content, [field]: value };
    const { error: updateErr } = await supabase
      .from('cms_sections')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (updateErr) return { ok: false, error: updateErr.message, location };
    return { ok: true, location, old: oldVal, new: value };
  }

  // site.business_hours | site.booking_enabled | site.tagline
  if (parts[0] === 'site') {
    const key = parts[1];
    const { data: row, error: fetchErr } = await supabase
      .from('cms_site_settings')
      .select('id, business_hours, features')
      .limit(1)
      .single();
    if (fetchErr || !row) {
      return { ok: false, error: fetchErr?.message || 'Site settings not found', location };
    }
    if (key === 'booking_enabled') {
      const features = (row.features as Record<string, unknown>) || {};
      const oldVal = features.booking_enabled;
      const newFeatures = { ...features, booking_enabled: !!value };
      const { error: updateErr } = await supabase
        .from('cms_site_settings')
        .update({
          features: newFeatures,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id);
      if (updateErr) return { ok: false, error: updateErr.message, location };
      return { ok: true, location, old: oldVal, new: !!value };
    }
    if (key === 'tagline' && typeof value === 'string') {
      const { error: updateErr } = await supabase
        .from('cms_site_settings')
        .update({
          tagline: value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id);
      if (updateErr) return { ok: false, error: updateErr.message, location };
      return { ok: true, location, new: value };
    }
    if (key === 'default_meta_title' && typeof value === 'string') {
      const { error: updateErr } = await supabase
        .from('cms_site_settings')
        .update({
          default_meta_title: value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id);
      if (updateErr) return { ok: false, error: updateErr.message, location };
      return { ok: true, location, new: value };
    }
    if (key === 'default_meta_description' && typeof value === 'string') {
      const { error: updateErr } = await supabase
        .from('cms_site_settings')
        .update({
          default_meta_description: value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id);
      if (updateErr) return { ok: false, error: updateErr.message, location };
      return { ok: true, location, new: value };
    }
    // site.hours.mon_fri | site.hours.sat | site.hours.sun (value = e.g. "9-5" or "closed")
    if (key === 'hours' && parts[2] && typeof value === 'string') {
      const dayKey = parts[2]; // mon_fri, sat, sun, add_closure
      const hours = (row.business_hours as Record<string, unknown>) || {};
      if (dayKey === 'add_closure') {
        const closures = Array.isArray(hours.special_closures) ? [...hours.special_closures] : [];
        if (!closures.includes(value)) closures.push(value);
        const newHours = { ...hours, special_closures: closures };
        const { error: updateErr } = await supabase
          .from('cms_site_settings')
          .update({ business_hours: newHours, updated_at: new Date().toISOString() })
          .eq('id', row.id);
        if (updateErr) return { ok: false, error: updateErr.message, location };
        return { ok: true, location, old: hours.special_closures, new: newHours.special_closures };
      }
      const allowedDays = ['mon_fri', 'sat', 'sun'];
      if (!allowedDays.includes(dayKey)) return { ok: false, error: `Unsupported hours key: ${dayKey}`, location };
      const oldVal = hours[dayKey];
      const newHours = { ...hours, [dayKey]: value };
      const { error: updateErr } = await supabase
        .from('cms_site_settings')
        .update({ business_hours: newHours, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      if (updateErr) return { ok: false, error: updateErr.message, location };
      return { ok: true, location, old: oldVal, new: value };
    }
    // site.booking_paused_reason (also disables booking)
    if (key === 'booking_paused_reason' && typeof value === 'string') {
      const features = (row.features as Record<string, unknown>) || {};
      const oldVal = features.booking_paused_reason;
      const newFeatures = { ...features, booking_paused_reason: value || null, booking_enabled: false };
      const { error: updateErr } = await supabase
        .from('cms_site_settings')
        .update({ features: newFeatures, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      if (updateErr) return { ok: false, error: updateErr.message, location };
      return { ok: true, location, old: oldVal, new: value || null };
    }
    if (key === 'booking_resume_at' && (typeof value === 'string' || value === null || value === false)) {
      const features = (row.features as Record<string, unknown>) || {};
      const oldVal = features.booking_resume_at;
      const newVal = normalizedValue === null || normalizedValue === '' ? null : (normalizedValue as string);
      const newFeatures = { ...features, booking_resume_at: newVal };
      const { error: updateErr } = await supabase
        .from('cms_site_settings')
        .update({ features: newFeatures, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      if (updateErr) return { ok: false, error: updateErr.message, location };
      return { ok: true, location, old: oldVal, new: newVal };
    }
    return { ok: false, error: `Unsupported site key: ${key}`, location };
  }

  // homepage.banner.enabled | homepage.banner.headline | homepage.banner.subheadline | homepage.banner.cta_text | homepage.banner.cta_url
  if (parts[0] === 'homepage' && parts[1] === 'banner') {
    const field = parts[2];
    const allowed = ['enabled', 'headline', 'subheadline', 'cta_text', 'cta_url', 'start_date', 'end_date'];
    if (!field || !allowed.includes(field)) {
      return { ok: false, error: `Invalid banner field: ${field}`, location };
    }
    const isBool = field === 'enabled';
    if (isBool && typeof value !== 'boolean') return { ok: false, error: 'Banner enabled must be boolean', location };
    if (!isBool && typeof value !== 'string') return { ok: false, error: `Banner ${field} must be string`, location };
    const { data: sections, error: fetchErr } = await supabase
      .from('cms_sections')
      .select('id, content')
      .in('type', ['banner', 'promo_banner'])
      .eq('status', 'active')
      .limit(1);
    if (fetchErr || !sections?.length) {
      return { ok: false, error: fetchErr?.message || 'Banner section not found', location };
    }
    const section = sections[0];
    const content = (section.content as Record<string, unknown>) || {};
    const oldVal = content[field];
    let newContent = { ...content, [field]: value };
    if (field !== 'enabled' && value) newContent = { ...newContent, enabled: true };
    const { error: updateErr } = await supabase
      .from('cms_sections')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (updateErr) return { ok: false, error: updateErr.message, location };
    return { ok: true, location, old: oldVal, new: value };
  }

  // section.about.content | section.first_time_visitor.content | section.what_to_expect.content (Phase 4 – text blocks by name)
  if (parts[0] === 'section' && parts[1] && parts[2] && typeof value === 'string') {
    const slug = parts[1];
    const field = parts[2];
    const namePatterns: Record<string, string> = {
      about: 'About',
      first_time_visitor: 'First-time visitor',
      what_to_expect: 'What to expect',
    };
    const pattern = namePatterns[slug];
    if (!pattern || !['content', 'title'].includes(field)) {
      return { ok: false, error: `Invalid section slug or field: ${slug}.${field}`, location };
    }
    const { data: sections, error: fetchErr } = await supabase
      .from('cms_sections')
      .select('id, content')
      .eq('type', 'text')
      .ilike('name', `%${pattern}%`)
      .eq('status', 'active')
      .limit(1);
    if (fetchErr || !sections?.length) {
      return { ok: false, error: fetchErr?.message || `No text section found matching "${pattern}". Add one in the CMS.`, location };
    }
    const section = sections[0];
    const content = (section.content as Record<string, unknown>) || {};
    const oldVal = content[field];
    const newContent = { ...content, [field]: value };
    const { error: updateErr } = await supabase
      .from('cms_sections')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq('id', section.id);
    if (updateErr) return { ok: false, error: updateErr.message, location };
    return { ok: true, location, old: oldVal, new: value };
  }

  return { ok: false, error: `Unknown location: ${location}`, location };
}

/**
 * Phase 1–3 allowed locations for AI admin commands
 */
export const ALLOWED_SITE_LOCATIONS = [
  'homepage.hero.headline',
  'homepage.hero.subheadline',
  'homepage.hero.cta_text',
  'homepage.hero.cta_url',
  'site.booking_enabled',
  'site.tagline',
  'site.hours.mon_fri',
  'site.hours.sat',
  'site.hours.sun',
  'site.hours.add_closure',
  'site.booking_paused_reason',
  'site.booking_resume_at',
  'homepage.banner.enabled',
  'homepage.banner.headline',
  'homepage.banner.subheadline',
  'homepage.banner.cta_text',
  'homepage.banner.cta_url',
  'homepage.banner.start_date',
  'homepage.banner.end_date',
  'site.default_meta_title',
  'site.default_meta_description',
  'section.about.content',
  'section.about.title',
  'section.first_time_visitor.content',
  'section.first_time_visitor.title',
  'section.what_to_expect.content',
  'section.what_to_expect.title',
] as const;

export function isAllowedLocation(location: string): boolean {
  return (ALLOWED_SITE_LOCATIONS as readonly string[]).includes(location);
}
