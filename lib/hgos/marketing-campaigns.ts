// ============================================================
// HELLO GORGEOUS OS - MARKETING CAMPAIGNS
// Email & SMS blast campaigns with drag-and-drop builder
// FREE - Fresha charges per email/SMS after 100 free!
// ============================================================

// ============================================================
// TYPES & INTERFACES
// ============================================================

export type CampaignChannel = 'email' | 'sms' | 'multichannel';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
export type BlockType = 'title' | 'paragraph' | 'image' | 'button' | 'divider' | 'social' | 'deal' | 'spacer';

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  subject?: string; // For email
  previewText?: string; // Email preview text
  content: EmailContent; // Email builder content
  smsContent?: string; // SMS text (160 char limit)
  
  // Audience targeting
  audience: AudienceFilter;
  estimatedReach: {
    email: number;
    sms: number;
    total: number;
  };
  
  // Scheduling
  scheduledAt?: string;
  sentAt?: string;
  
  // Stats
  stats?: CampaignStats;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface EmailContent {
  theme: EmailTheme;
  blocks: ContentBlock[];
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  styles?: Record<string, string>;
}

export interface EmailTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headerImage?: string;
  footerText: string;
}

export interface AudienceFilter {
  type: 'all' | 'segment' | 'custom';
  // Segment filters
  segments?: string[];
  // Custom filters
  filters?: {
    hasEmail?: boolean;
    hasPhone?: boolean;
    lastVisitDays?: number; // Visited within X days
    notVisitedDays?: number; // Haven't visited in X days
    minSpend?: number;
    maxSpend?: number;
    services?: string[]; // Received these services
    tags?: string[];
    membershipStatus?: 'active' | 'inactive' | 'never';
  };
  // Exclusions
  excludeUnsubscribed: boolean;
  excludeRecentlyCampaigned?: number; // Days since last campaign
}

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  // Calculated rates
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  // SMS specific
  smsSent?: number;
  smsDelivered?: number;
}

// ============================================================
// DEFAULT THEMES
// ============================================================

export const EMAIL_THEMES: EmailTheme[] = [
  {
    id: 'hello-gorgeous',
    name: 'Hello Gorgeous',
    primaryColor: '#EC4899', // Pink-500
    secondaryColor: '#F43F5E', // Rose-500
    backgroundColor: '#FFF1F2', // Rose-50
    textColor: '#1F2937', // Gray-800
    fontFamily: "'Playfair Display', serif",
    footerText: 'Hello Gorgeous Med Spa | 74 W. Washington St, Oswego, IL 60543 | (630) 636-6193',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    primaryColor: '#000000',
    secondaryColor: '#6B7280',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    fontFamily: "'Inter', sans-serif",
    footerText: 'Hello Gorgeous Med Spa | 74 W. Washington St, Oswego, IL 60543',
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    primaryColor: '#B8860B', // Dark golden rod
    secondaryColor: '#DAA520', // Golden rod
    backgroundColor: '#1A1A1A',
    textColor: '#FFFFFF',
    fontFamily: "'Cormorant Garamond', serif",
    footerText: 'Hello Gorgeous Med Spa | Luxury Aesthetic Treatments',
  },
  {
    id: 'fresh-spring',
    name: 'Fresh Spring',
    primaryColor: '#10B981', // Emerald-500
    secondaryColor: '#34D399', // Emerald-400
    backgroundColor: '#ECFDF5', // Emerald-50
    textColor: '#064E3B', // Emerald-900
    fontFamily: "'Poppins', sans-serif",
    footerText: 'Hello Gorgeous Med Spa | Your Beauty Destination',
  },
];

// ============================================================
// DEFAULT BLOCKS
// ============================================================

export const DEFAULT_BLOCKS: Record<BlockType, Partial<ContentBlock>> = {
  title: {
    type: 'title',
    content: {
      text: 'Add a catchy title',
      level: 'h1',
      alignment: 'center',
    },
  },
  paragraph: {
    type: 'paragraph',
    content: {
      text: 'Tell your clients what you want them to know in this paragraph and encourage them to take action.',
      alignment: 'center',
    },
  },
  image: {
    type: 'image',
    content: {
      src: '',
      alt: 'Image',
      width: '100%',
      link: '',
    },
  },
  button: {
    type: 'button',
    content: {
      text: 'Book Now',
      link: 'https://hellogorgeousmedspa.com/book',
      alignment: 'center',
      style: 'primary', // primary, secondary, outline
    },
  },
  divider: {
    type: 'divider',
    content: {
      style: 'solid', // solid, dashed, dotted
      width: '80%',
    },
  },
  social: {
    type: 'social',
    content: {
      platforms: [
        { name: 'facebook', url: 'https://facebook.com/hellogorgeousmedspa' },
        { name: 'instagram', url: 'https://instagram.com/hellogorgeousmedspa' },
        { name: 'tiktok', url: 'https://tiktok.com/@hellogorgeousmedspa' },
      ],
      alignment: 'center',
    },
  },
  deal: {
    type: 'deal',
    content: {
      title: 'Special Offer',
      description: 'Limited time only!',
      originalPrice: 200,
      salePrice: 149,
      expiresAt: '',
      ctaText: 'Book Now',
      ctaLink: 'https://hellogorgeousmedspa.com/book',
    },
  },
  spacer: {
    type: 'spacer',
    content: {
      height: 20,
    },
  },
};

// ============================================================
// PRE-BUILT CAMPAIGN TEMPLATES
// ============================================================

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  channel: CampaignChannel;
  subject?: string;
  previewText?: string;
  content?: EmailContent;
  smsContent?: string;
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    description: 'Limited time discount promotion',
    category: 'Promotions',
    channel: 'multichannel',
    subject: '⚡ FLASH SALE: {discount}% OFF - Today Only!',
    previewText: 'Don\'t miss out on this exclusive offer...',
    content: {
      theme: EMAIL_THEMES[0],
      blocks: [
        { id: '1', type: 'title', content: { text: '⚡ FLASH SALE ⚡', level: 'h1', alignment: 'center' } },
        { id: '2', type: 'paragraph', content: { text: 'For the next 24 hours only, enjoy exclusive savings on your favorite treatments!', alignment: 'center' } },
        { id: '3', type: 'deal', content: { title: '{service}', description: 'Limited spots available!', originalPrice: 200, salePrice: 149, ctaText: 'Claim Offer', ctaLink: 'https://hellogorgeousmedspa.com/book' } },
        { id: '4', type: 'button', content: { text: 'Book Now - Limited Spots!', link: 'https://hellogorgeousmedspa.com/book', alignment: 'center', style: 'primary' } },
        { id: '5', type: 'divider', content: { style: 'solid', width: '80%' } },
        { id: '6', type: 'social', content: { platforms: [{ name: 'instagram', url: 'https://instagram.com/hellogorgeousmedspa' }], alignment: 'center' } },
      ],
    },
    smsContent: '⚡ FLASH SALE at Hello Gorgeous! {discount}% OFF {service} - TODAY ONLY! Book now: hellogorgeousmedspa.com/book Reply STOP to opt out',
  },
  {
    id: 'new-service',
    name: 'New Service Announcement',
    description: 'Introduce a new treatment or service',
    category: 'Announcements',
    channel: 'email',
    subject: '✨ Introducing: {service} - Now Available!',
    previewText: 'Be among the first to try our newest treatment...',
    content: {
      theme: EMAIL_THEMES[0],
      blocks: [
        { id: '1', type: 'title', content: { text: '✨ Now Available ✨', level: 'h1', alignment: 'center' } },
        { id: '2', type: 'image', content: { src: '', alt: 'New Service', width: '100%' } },
        { id: '3', type: 'title', content: { text: '{service}', level: 'h2', alignment: 'center' } },
        { id: '4', type: 'paragraph', content: { text: 'We\'re excited to announce the newest addition to our treatment menu! {description}', alignment: 'center' } },
        { id: '5', type: 'button', content: { text: 'Learn More & Book', link: 'https://hellogorgeousmedspa.com/book', alignment: 'center', style: 'primary' } },
      ],
    },
  },
  {
    id: 'win-back',
    name: 'We Miss You',
    description: 'Re-engage clients who haven\'t visited recently',
    category: 'Retention',
    channel: 'multichannel',
    subject: 'We miss you, {firstName}! 💕 Here\'s a special welcome back offer',
    previewText: 'It\'s been a while since your last visit...',
    content: {
      theme: EMAIL_THEMES[0],
      blocks: [
        { id: '1', type: 'title', content: { text: 'We Miss You! 💕', level: 'h1', alignment: 'center' } },
        { id: '2', type: 'paragraph', content: { text: 'Hi {firstName}, it\'s been a while since we\'ve seen you at Hello Gorgeous. We\'d love to have you back!', alignment: 'center' } },
        { id: '3', type: 'paragraph', content: { text: 'As a special welcome back, enjoy:', alignment: 'center' } },
        { id: '4', type: 'deal', content: { title: '15% OFF Your Next Visit', description: 'Use code: WELCOMEBACK', originalPrice: 0, salePrice: 0, ctaText: 'Book Now', ctaLink: 'https://hellogorgeousmedspa.com/book' } },
        { id: '5', type: 'button', content: { text: 'Book Your Appointment', link: 'https://hellogorgeousmedspa.com/book', alignment: 'center', style: 'primary' } },
      ],
    },
    smsContent: 'Hi {firstName}! We miss you at Hello Gorgeous 💕 Here\'s 15% OFF your next visit - use code WELCOMEBACK. Book: hellogorgeousmedspa.com/book Reply STOP to opt out',
  },
  {
    id: 'birthday',
    name: 'Birthday Wishes',
    description: 'Celebrate client birthdays with a special offer',
    category: 'Automated',
    channel: 'multichannel',
    subject: '🎂 Happy Birthday, {firstName}! A gift from Hello Gorgeous',
    previewText: 'We have a special birthday surprise for you...',
    content: {
      theme: EMAIL_THEMES[0],
      blocks: [
        { id: '1', type: 'title', content: { text: '🎂 Happy Birthday! 🎂', level: 'h1', alignment: 'center' } },
        { id: '2', type: 'paragraph', content: { text: 'Dear {firstName}, wishing you the most gorgeous birthday! To celebrate YOU, we have a special gift:', alignment: 'center' } },
        { id: '3', type: 'deal', content: { title: 'FREE Add-On Treatment', description: 'On us! With any service booking this month.', originalPrice: 50, salePrice: 0, ctaText: 'Claim Gift', ctaLink: 'https://hellogorgeousmedspa.com/book' } },
        { id: '4', type: 'button', content: { text: 'Book & Redeem Gift', link: 'https://hellogorgeousmedspa.com/book', alignment: 'center', style: 'primary' } },
      ],
    },
    smsContent: '🎂 Happy Birthday {firstName}! Celebrate with a FREE add-on treatment at Hello Gorgeous! Book this month to redeem: hellogorgeousmedspa.com/book Reply STOP to opt out',
  },
  {
    id: 'appointment-reminder',
    name: 'Appointment Reminder',
    description: 'Remind clients of upcoming appointments',
    category: 'Automated',
    channel: 'sms',
    smsContent: 'Hi {firstName}! Reminder: Your {service} appointment at Hello Gorgeous is tomorrow at {time}. See you soon! Reply STOP to opt out',
  },
  {
    id: 'review-request',
    name: 'Review Request',
    description: 'Ask for reviews after appointments',
    category: 'Automated',
    channel: 'sms',
    smsContent: 'Hi {firstName}! Thanks for visiting Hello Gorgeous today! We\'d love your feedback: {feedbackLink} Reply STOP to opt out',
  },
  {
    id: 'membership-promo',
    name: 'Membership Promotion',
    description: 'Promote VIP membership benefits',
    category: 'Promotions',
    channel: 'email',
    subject: '👑 Become a VIP Member - Exclusive Benefits Await!',
    previewText: 'Unlock savings, priority booking, and more...',
    content: {
      theme: EMAIL_THEMES[2], // Luxury gold theme
      blocks: [
        { id: '1', type: 'title', content: { text: '👑 VIP Membership', level: 'h1', alignment: 'center' } },
        { id: '2', type: 'paragraph', content: { text: 'Join our exclusive VIP membership and enjoy premium benefits every month:', alignment: 'center' } },
        { id: '3', type: 'paragraph', content: { text: '✓ 10% OFF all services\n✓ Monthly complimentary treatment\n✓ Priority booking\n✓ Exclusive member events\n✓ Birthday rewards', alignment: 'left' } },
        { id: '4', type: 'deal', content: { title: 'VIP Membership', description: 'Starting at just', originalPrice: 0, salePrice: 49, ctaText: 'Join Now', ctaLink: 'https://hellogorgeousmedspa.com/membership' } },
        { id: '5', type: 'button', content: { text: 'Become a VIP', link: 'https://hellogorgeousmedspa.com/membership', alignment: 'center', style: 'primary' } },
      ],
    },
  },
];

// ============================================================
// AUDIENCE SEGMENTS
// ============================================================

export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  icon: string;
  filter: AudienceFilter['filters'];
}

export const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: 'all-clients',
    name: 'All Clients',
    description: 'Every client in your database',
    icon: '👥',
    filter: {},
  },
  {
    id: 'vip-members',
    name: 'VIP Members',
    description: 'Active membership holders',
    icon: '👑',
    filter: { membershipStatus: 'active' },
  },
  {
    id: 'high-value',
    name: 'High Value Clients',
    description: 'Clients who\'ve spent $500+',
    icon: '💎',
    filter: { minSpend: 500 },
  },
  {
    id: 'lapsed',
    name: 'Lapsed Clients',
    description: 'Haven\'t visited in 90+ days',
    icon: '😢',
    filter: { notVisitedDays: 90 },
  },
  {
    id: 'recent-visitors',
    name: 'Recent Visitors',
    description: 'Visited in the last 30 days',
    icon: '🔥',
    filter: { lastVisitDays: 30 },
  },
  {
    id: 'injectable-clients',
    name: 'Injectable Clients',
    description: 'Had Botox or fillers',
    icon: '💉',
    filter: { services: ['botox', 'fillers', 'injectables'] },
  },
  {
    id: 'weight-loss-clients',
    name: 'Weight Loss Clients',
    description: 'On weight loss programs',
    icon: '💊',
    filter: { services: ['semaglutide', 'tirzepatide', 'weight-loss'] },
  },
  {
    id: 'facial-clients',
    name: 'Facial Clients',
    description: 'Had facial treatments',
    icon: '✨',
    filter: { services: ['hydrafacial', 'facial', 'peel', 'microneedling'] },
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate email HTML from content blocks
 */
export function generateEmailHTML(content: EmailContent): string {
  const { theme, blocks } = content;
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello Gorgeous Med Spa</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${theme.backgroundColor}; font-family: ${theme.fontFamily}; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .content { padding: 40px 30px; }
    h1, h2, h3 { color: ${theme.primaryColor}; margin: 0 0 20px; }
    p { color: ${theme.textColor}; line-height: 1.6; margin: 0 0 20px; }
    .btn-primary { 
      display: inline-block; 
      padding: 14px 32px; 
      background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor}); 
      color: white !important; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600;
    }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 30px 0; }
    .footer { padding: 20px 30px; text-align: center; font-size: 12px; color: #6b7280; background: #f9fafb; }
    .social-links a { margin: 0 10px; }
    .deal-box { background: ${theme.backgroundColor}; border: 2px solid ${theme.primaryColor}; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }
    .deal-price { font-size: 32px; font-weight: bold; color: ${theme.primaryColor}; }
    .deal-original { text-decoration: line-through; color: #9ca3af; margin-right: 10px; }
  </style>
</head>
<body>
  <div class="container">
    ${theme.headerImage ? `<img src="${theme.headerImage}" alt="Header" style="width: 100%; display: block;">` : ''}
    <div class="content">
`;

  // Render blocks
  blocks.forEach(block => {
    html += renderBlock(block, theme);
  });

  html += `
    </div>
    <div class="footer">
      ${theme.footerText}
      <br><br>
      <a href="{unsubscribeLink}" style="color: #9ca3af;">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`;

  return html;
}

function renderBlock(block: ContentBlock, theme: EmailTheme): string {
  const { type, content } = block;
  
  switch (type) {
    case 'title':
      const Tag = content.level || 'h1';
      return `<${Tag} style="text-align: ${content.alignment || 'center'};">${content.text}</${Tag}>`;
    
    case 'paragraph':
      return `<p style="text-align: ${content.alignment || 'left'};">${content.text}</p>`;
    
    case 'image':
      const img = content.link 
        ? `<a href="${content.link}"><img src="${content.src}" alt="${content.alt}" style="max-width: ${content.width}; display: block; margin: 0 auto;"></a>`
        : `<img src="${content.src}" alt="${content.alt}" style="max-width: ${content.width}; display: block; margin: 0 auto;">`;
      return img;
    
    case 'button':
      return `<div style="text-align: ${content.alignment || 'center'}; margin: 30px 0;">
        <a href="${content.link}" class="btn-primary">${content.text}</a>
      </div>`;
    
    case 'divider':
      return `<hr class="divider" style="border-style: ${content.style}; width: ${content.width}; margin: 30px auto;">`;
    
    case 'social':
      const icons: Record<string, string> = {
        facebook: '📘',
        instagram: '📸',
        tiktok: '🎵',
        twitter: '🐦',
        youtube: '📺',
      };
      const links = content.platforms.map((p: any) => 
        `<a href="${p.url}" style="text-decoration: none; font-size: 24px;">${icons[p.name] || '🔗'}</a>`
      ).join(' ');
      return `<div style="text-align: ${content.alignment || 'center'}; margin: 20px 0;" class="social-links">${links}</div>`;
    
    case 'deal':
      return `<div class="deal-box">
        <h3 style="margin-bottom: 10px;">${content.title}</h3>
        <p style="margin-bottom: 15px;">${content.description}</p>
        ${content.originalPrice > 0 ? `<span class="deal-original">$${content.originalPrice}</span>` : ''}
        <span class="deal-price">$${content.salePrice}</span>
        <div style="margin-top: 20px;">
          <a href="${content.ctaLink}" class="btn-primary">${content.ctaText}</a>
        </div>
      </div>`;
    
    case 'spacer':
      return `<div style="height: ${content.height}px;"></div>`;
    
    default:
      return '';
  }
}

/**
 * Personalize content with merge tags
 */
export function personalizeContent(content: string, data: Record<string, any>): string {
  let result = content;
  
  // Replace merge tags like {firstName}, {service}, etc.
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value || ''));
  });
  
  return result;
}

/**
 * Validate SMS length (160 chars for single message)
 */
export function validateSMS(text: string): { valid: boolean; length: number; segments: number; message?: string } {
  const length = text.length;
  const segments = Math.ceil(length / 160);
  
  if (length > 480) {
    return { valid: false, length, segments, message: 'SMS too long (max 480 characters / 3 segments)' };
  }
  
  return { valid: true, length, segments };
}

/**
 * Calculate estimated audience size
 */
export async function calculateAudienceSize(
  filter: AudienceFilter,
  supabase: any
): Promise<{ email: number; sms: number; total: number }> {
  // This would query the database with the filters
  // For now, return placeholder logic
  
  let query = supabase
    .from('clients')
    .select('id, users!inner(email, phone)', { count: 'exact' });
  
  // Apply filters based on filter configuration
  if (filter.filters?.hasEmail) {
    query = query.not('users.email', 'is', null);
  }
  if (filter.filters?.hasPhone) {
    query = query.not('users.phone', 'is', null);
  }
  // Add more filter logic...
  
  const { count, data } = await query;
  
  const withEmail = data?.filter((c: any) => c.users?.email).length || 0;
  const withPhone = data?.filter((c: any) => c.users?.phone).length || 0;
  
  return {
    email: withEmail,
    sms: withPhone,
    total: count || 0,
  };
}

// ============================================================
// SEND PROVIDERS (can swap out easily)
// ============================================================

export interface EmailProvider {
  name: string;
  send: (to: string, subject: string, html: string, from?: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface SMSProvider {
  name: string;
  send: (to: string, message: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Example: Resend integration (free tier: 3000 emails/month)
export const resendProvider: EmailProvider = {
  name: 'Resend',
  send: async (to, subject, html, from = 'Hello Gorgeous <hello@hellogorgeousmedspa.com>') => {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }
    
    const data = await response.json();
    return { success: true, messageId: data.id };
  },
};

// Costs compared to Fresha:
// - Resend: $0 for first 3,000/month, then $0.001/email
// - Your 2,334 email clients = FREE for first campaign, then ~$2.33/campaign
// - Fresha: Charges per email after 100 free = potentially $50-100+/campaign
