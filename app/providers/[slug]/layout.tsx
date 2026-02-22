import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Fallback provider metadata
const FALLBACK_PROVIDERS: Record<string, { name: string; title: string; credentials: string }> = {
  'danielle': {
    name: 'Danielle',
    title: 'Owner & Nurse Practitioner',
    credentials: 'MSN, APRN, FNP-BC',
  },
  'ryan': {
    name: 'Ryan Kent',
    title: 'Medical Director & Nurse Practitioner',
    credentials: 'MSN, APRN, FNP-BC',
  },
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  let providerName = 'Provider';
  let providerTitle = '';
  let providerCredentials = '';

  try {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from('providers')
        .select('first_name, last_name, title, credentials')
        .eq('slug', slug)
        .single();
      
      if (data) {
        providerName = `${data.first_name} ${data.last_name || ''}`.trim();
        providerTitle = data.title || '';
        providerCredentials = data.credentials || '';
      }
    }
  } catch {
    // Use fallback
  }

  // Fallback if not found in DB
  if (providerName === 'Provider' && FALLBACK_PROVIDERS[slug]) {
    const fallback = FALLBACK_PROVIDERS[slug];
    providerName = fallback.name;
    providerTitle = fallback.title;
    providerCredentials = fallback.credentials;
  }

  const title = `${providerName}${providerCredentials ? `, ${providerCredentials}` : ''} | Hello Gorgeous Med Spa`;
  const description = `Meet ${providerName}${providerTitle ? `, ${providerTitle}` : ''} at Hello Gorgeous Med Spa in Oswego, IL. View credentials, before/after results, and book your appointment. Serving Naperville, Aurora, Plainfield.`;

  return {
    title,
    description,
    keywords: [
      `${providerName} injector`,
      `${providerName} med spa`,
      'Botox provider Oswego IL',
      'filler specialist near me',
      'nurse practitioner aesthetics',
      'Hello Gorgeous Med Spa',
      'medical aesthetics Oswego',
      'before after results',
    ],
    alternates: {
      canonical: `https://www.hellogorgeousmedspa.com/providers/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.hellogorgeousmedspa.com/providers/${slug}`,
      siteName: 'Hello Gorgeous Med Spa',
      images: [{
        url: `https://www.hellogorgeousmedspa.com/images/providers/${slug}.jpg`,
        width: 1200,
        height: 630,
        alt: `${providerName} at Hello Gorgeous Med Spa`,
      }],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://www.hellogorgeousmedspa.com/images/providers/${slug}.jpg`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProviderLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
