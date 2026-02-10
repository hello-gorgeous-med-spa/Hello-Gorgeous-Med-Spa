// ============================================================
// CMS readers — server-side only. Query Supabase CMS.
// Return null if empty or error. Never throw.
// Used so the live site can read hero, banner, site settings, SEO.
// ============================================================

import { createServerSupabaseClient } from '@/lib/hgos/supabase/client';

// --------------------------------------------
// Types (aligned with site-content-update / CMS)
// --------------------------------------------

export type HeroContent = {
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_url: string;
};

export type BannerContent = {
  enabled: boolean;
  headline?: string;
  subheadline?: string;
  cta_text?: string;
  cta_url?: string;
  start_date?: string;
  end_date?: string;
};

export type BusinessHours = {
  mon_fri?: string;
  sat?: string;
  sun?: string;
  special_closures?: string[];
};

export type SiteSettings = {
  tagline?: string | null;
  business_hours?: BusinessHours | null;
  features?: {
    booking_enabled?: boolean;
    booking_paused_reason?: string | null;
    booking_resume_at?: string | null;
  } | null;
};

export type DefaultSEO = {
  title: string;
  description: string;
};

// --------------------------------------------
// Helpers — never throw, return null on error/empty
// --------------------------------------------

function getSupabase() {
  try {
    return createServerSupabaseClient();
  } catch {
    return null;
  }
}

/** Returns hero section content (type=hero, status=active). Null if missing or error. */
export async function getHeroContent(): Promise<HeroContent | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('cms_sections')
      .select('content')
      .eq('type', 'hero')
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    const content = data.content as Record<string, unknown> | null;
    if (!content || typeof content !== 'object') return null;
    const headline = typeof content.headline === 'string' ? content.headline : undefined;
    const subheadline = typeof content.subheadline === 'string' ? content.subheadline : undefined;
    const cta_text = typeof content.cta_text === 'string' ? content.cta_text : undefined;
    const cta_url = typeof content.cta_url === 'string' ? content.cta_url : undefined;
    if (!headline && !subheadline && !cta_text && !cta_url) return null;
    return {
      headline: headline ?? '',
      subheadline: subheadline ?? '',
      cta_text: cta_text ?? '',
      cta_url: cta_url ?? '',
    };
  } catch {
    return null;
  }
}

/** Returns banner section content (type in banner,promo_banner, status=active). Null if missing or error. */
export async function getBannerContent(): Promise<BannerContent | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('cms_sections')
      .select('content')
      .in('type', ['banner', 'promo_banner'])
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    const content = data.content as Record<string, unknown> | null;
    if (!content || typeof content !== 'object') return null;
    const enabled = content.enabled === true;
    return {
      enabled,
      headline: typeof content.headline === 'string' ? content.headline : undefined,
      subheadline: typeof content.subheadline === 'string' ? content.subheadline : undefined,
      cta_text: typeof content.cta_text === 'string' ? content.cta_text : undefined,
      cta_url: typeof content.cta_url === 'string' ? content.cta_url : undefined,
      start_date: typeof content.start_date === 'string' ? content.start_date : undefined,
      end_date: typeof content.end_date === 'string' ? content.end_date : undefined,
    };
  } catch {
    return null;
  }
}

/** Returns site settings row (tagline, business_hours, features). Null if error. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('cms_site_settings')
      .select('tagline, business_hours, features')
      .limit(1)
      .maybeSingle();
    if (error) return null;
    if (!data) return null;
    const business_hours = data.business_hours as BusinessHours | null | undefined;
    const features = data.features as SiteSettings['features'] | null | undefined;
    return {
      tagline: data.tagline ?? null,
      business_hours: business_hours ?? null,
      features: features ?? null,
    };
  } catch {
    return null;
  }
}

/** Returns default SEO (default_meta_title, default_meta_description). Null if missing or error. */
export async function getDefaultSEO(): Promise<DefaultSEO | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('cms_site_settings')
      .select('default_meta_title, default_meta_description')
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    const title = typeof data.default_meta_title === 'string' && data.default_meta_title.trim()
      ? data.default_meta_title.trim()
      : null;
    const description = typeof data.default_meta_description === 'string' && data.default_meta_description.trim()
      ? data.default_meta_description.trim()
      : null;
    if (!title && !description) return null;
    return {
      title: title ?? '',
      description: description ?? '',
    };
  } catch {
    return null;
  }
}
