import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  status: string;
  visibility: string;
  template: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  no_index: boolean;
  sections: Array<{
    id: string;
    type: string;
    content: Record<string, unknown>;
    visible: boolean;
  }>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch a CMS page by slug
 */
export async function getCMSPage(slug: string): Promise<CMSPage | null> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .single();

  if (error || !data) {
    return null;
  }

  return data as CMSPage;
}

/**
 * Fetch the homepage from CMS
 */
export async function getHomepage(): Promise<CMSPage | null> {
  return getCMSPage('home');
}

/**
 * Fetch navigation from CMS
 */
export async function getCMSNavigation(location: 'header' | 'footer' = 'header') {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('cms_navigation')
    .select('*')
    .eq('location', location)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Fetch all published pages (for sitemap, etc.)
 */
export async function getAllCMSPages(): Promise<CMSPage[]> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as CMSPage[];
}

/**
 * Check if CMS is enabled and has content
 */
export async function isCMSEnabled(): Promise<boolean> {
  const homepage = await getHomepage();
  return homepage !== null && homepage.sections && homepage.sections.length > 0;
}
