import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

export async function fetchCMSPage(slug: string): Promise<CMSPage | null> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
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

export async function fetchAllCMSPages(): Promise<CMSPage[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
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

export async function fetchCMSNavigation() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data, error } = await supabase
    .from('cms_navigation')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}
