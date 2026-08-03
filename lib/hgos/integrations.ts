// ============================================================
// HELLO GORGEOUS OS - THIRD PARTY INTEGRATIONS
// Google Reserve, Facebook/Instagram, Meta Pixel, Analytics
// ============================================================

import { isNoTrackPath } from "@/lib/no-track-paths";

export type IntegrationStatus = 'active' | 'inactive' | 'pending' | 'error';

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'booking' | 'analytics' | 'marketing' | 'payment' | 'communication';
  status: IntegrationStatus;
  isConfigured: boolean;
  configFields: IntegrationConfigField[];
  webhookUrl?: string;
  documentation?: string;
}

export interface IntegrationConfigField {
  id: string;
  name: string;
  type: 'text' | 'password' | 'select' | 'boolean' | 'textarea';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
}

export interface IntegrationConfig {
  integrationId: string;
  values: Record<string, string | boolean>;
  connectedAt?: string;
  lastSyncAt?: string;
}

// ============================================================
// AVAILABLE INTEGRATIONS
// ============================================================

export const INTEGRATIONS: Integration[] = [
  // =====================================
  // BOOKING INTEGRATIONS
  // =====================================
  {
    id: 'google-reserve',
    name: 'Google Reserve',
    description: 'Capture online bookings directly from Google Search, Google Maps and more with our Google integration.',
    icon: '🔍',
    category: 'booking',
    status: 'inactive',
    isConfigured: false,
    documentation: 'https://support.google.com/business/answer/7475773',
    configFields: [
      {
        id: 'place_id',
        name: 'Google Place ID',
        type: 'text',
        required: true,
        placeholder: 'ChIJ...',
        helpText: 'Find your Place ID at developers.google.com/maps/documentation/places/web-service/place-id',
      },
      {
        id: 'business_name',
        name: 'Business Name',
        type: 'text',
        required: true,
        placeholder: 'Hello Gorgeous Med Spa',
      },
      {
        id: 'enabled',
        name: 'Accept Bookings from Google',
        type: 'boolean',
        required: false,
      },
    ],
  },
  {
    id: 'facebook-instagram',
    name: 'Facebook and Instagram Bookings',
    description: 'Add online booking to your social media pages. Let clients book directly from Facebook and Instagram.',
    icon: '📱',
    category: 'booking',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'facebook_page_id',
        name: 'Facebook Page ID',
        type: 'text',
        required: true,
        placeholder: 'Your Facebook Page ID',
        helpText: 'Found in your Facebook Page settings',
      },
      {
        id: 'instagram_business_id',
        name: 'Instagram Business ID',
        type: 'text',
        required: false,
        placeholder: 'Your Instagram Business ID',
      },
      {
        id: 'booking_button_text',
        name: 'Booking Button Text',
        type: 'select',
        required: true,
        options: [
          { value: 'book_now', label: 'Book Now' },
          { value: 'book_appointment', label: 'Book Appointment' },
          { value: 'schedule', label: 'Schedule' },
          { value: 'reserve', label: 'Reserve' },
        ],
      },
    ],
  },

  // =====================================
  // ANALYTICS INTEGRATIONS
  // =====================================
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Send events about certain actions to Google Analytics, and create goals based on events to track conversions.',
    icon: '📊',
    category: 'analytics',
    status: 'inactive',
    isConfigured: false,
    documentation: 'https://analytics.google.com',
    configFields: [
      {
        id: 'measurement_id',
        name: 'Measurement ID (GA4)',
        type: 'text',
        required: true,
        placeholder: 'G-XXXXXXXXXX',
        helpText: 'Found in Google Analytics > Admin > Data Streams',
      },
      {
        id: 'track_bookings',
        name: 'Track Bookings',
        type: 'boolean',
        required: false,
      },
      {
        id: 'track_purchases',
        name: 'Track Purchases',
        type: 'boolean',
        required: false,
      },
      {
        id: 'track_page_views',
        name: 'Track Page Views',
        type: 'boolean',
        required: false,
      },
    ],
  },
  {
    id: 'meta-pixel',
    name: 'Meta Pixel Ads',
    description: 'Use your Facebook Ads Pixel to track events, and create audiences based on their activities.',
    icon: '🎯',
    category: 'marketing',
    status: 'inactive',
    isConfigured: false,
    documentation: 'https://business.facebook.com/events_manager',
    configFields: [
      {
        id: 'pixel_id',
        name: 'Meta Pixel ID',
        type: 'text',
        required: true,
        placeholder: '1234567890123456',
        helpText: 'Found in Meta Events Manager',
      },
      {
        id: 'access_token',
        name: 'Conversions API Access Token',
        type: 'password',
        required: false,
        helpText: 'Optional: For server-side tracking (more accurate)',
      },
      {
        id: 'track_view_content',
        name: 'Track Service Views',
        type: 'boolean',
        required: false,
      },
      {
        id: 'track_initiate_checkout',
        name: 'Track Booking Started',
        type: 'boolean',
        required: false,
      },
      {
        id: 'track_purchase',
        name: 'Track Completed Bookings',
        type: 'boolean',
        required: false,
      },
      {
        id: 'track_lead',
        name: 'Track Form Submissions',
        type: 'boolean',
        required: false,
      },
    ],
  },
  {
    id: 'google-tag-manager',
    name: 'Google Tag Manager',
    description: 'Manage all your marketing tags in one place. Easier setup for multiple tracking pixels.',
    icon: '🏷️',
    category: 'analytics',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'container_id',
        name: 'Container ID',
        type: 'text',
        required: true,
        placeholder: 'GTM-XXXXXXX',
      },
    ],
  },
  {
    id: 'tiktok-pixel',
    name: 'TikTok Pixel',
    description: 'Track TikTok ad conversions and build retargeting audiences.',
    icon: '🎵',
    category: 'marketing',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'pixel_id',
        name: 'TikTok Pixel ID',
        type: 'text',
        required: true,
        placeholder: 'Your TikTok Pixel ID',
      },
    ],
  },

  // =====================================
  // COMMUNICATION INTEGRATIONS
  // =====================================
  {
    id: 'twilio',
    name: 'Twilio SMS',
    description: 'Send SMS appointment reminders and marketing messages.',
    icon: '💬',
    category: 'communication',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'account_sid',
        name: 'Account SID',
        type: 'text',
        required: true,
      },
      {
        id: 'auth_token',
        name: 'Auth Token',
        type: 'password',
        required: true,
      },
      {
        id: 'phone_number',
        name: 'Twilio Phone Number',
        type: 'text',
        required: true,
        placeholder: '+1234567890',
      },
    ],
  },
  {
    id: 'sendgrid',
    name: 'SendGrid Email',
    description: 'Send transactional and marketing emails.',
    icon: '📧',
    category: 'communication',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'api_key',
        name: 'API Key',
        type: 'password',
        required: true,
      },
      {
        id: 'from_email',
        name: 'From Email',
        type: 'text',
        required: true,
        placeholder: 'hello@hellogorgeousmedspa.com',
      },
      {
        id: 'from_name',
        name: 'From Name',
        type: 'text',
        required: true,
        placeholder: 'Hello Gorgeous Med Spa',
      },
    ],
  },
  {
    id: 'resend',
    name: 'Resend Email',
    description: 'Modern email API for developers. Free tier: 3,000 emails/month.',
    icon: '✉️',
    category: 'communication',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'api_key',
        name: 'API Key',
        type: 'password',
        required: true,
      },
      {
        id: 'from_email',
        name: 'From Email',
        type: 'text',
        required: true,
        placeholder: 'hello@hellogorgeousmedspa.com',
      },
    ],
  },

  // =====================================
  // PAYMENT INTEGRATIONS
  // =====================================
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Accept credit card payments online and in-person.',
    icon: '💳',
    category: 'payment',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'publishable_key',
        name: 'Publishable Key',
        type: 'text',
        required: true,
        placeholder: 'pk_live_...',
      },
      {
        id: 'secret_key',
        name: 'Secret Key',
        type: 'password',
        required: true,
        placeholder: 'sk_live_...',
      },
      {
        id: 'webhook_secret',
        name: 'Webhook Secret',
        type: 'password',
        required: false,
        placeholder: 'whsec_...',
      },
    ],
  },
  {
    id: 'square',
    name: 'Square Payments',
    description: 'Accept payments with Square terminals and online.',
    icon: '⬜',
    category: 'payment',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'access_token',
        name: 'Access Token',
        type: 'password',
        required: true,
      },
      {
        id: 'location_id',
        name: 'Location ID',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'afterpay',
    name: 'Afterpay',
    description: 'Let clients pay in 4 interest-free installments.',
    icon: '🅰️',
    category: 'payment',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'merchant_id',
        name: 'Merchant ID',
        type: 'text',
        required: true,
      },
      {
        id: 'secret_key',
        name: 'Secret Key',
        type: 'password',
        required: true,
      },
    ],
  },
  {
    id: 'cherry',
    name: 'Cherry Financing',
    description: 'Offer patient financing for treatments.',
    icon: '🍒',
    category: 'payment',
    status: 'inactive',
    isConfigured: false,
    configFields: [
      {
        id: 'merchant_id',
        name: 'Merchant ID',
        type: 'text',
        required: true,
      },
      {
        id: 'api_key',
        name: 'API Key',
        type: 'password',
        required: true,
      },
    ],
  },
];

// ============================================================
// TRACKING CODE GENERATORS
// ============================================================

/**
 * Generate Google Analytics tracking code
 */
export function generateGACode(measurementId: string): string {
  return `
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}');
</script>
`;
}

/**
 * Generate Meta Pixel tracking code
 */
export function generateMetaPixelCode(pixelId: string): string {
  return `
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
/></noscript>
`;
}

/**
 * Generate GTM code
 */
export function generateGTMCode(containerId: string): string {
  return `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');</script>
<!-- End Google Tag Manager -->

<!-- GTM noscript (add after <body>) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
`;
}

/**
 * Generate TikTok Pixel code
 */
export function generateTikTokPixelCode(pixelId: string): string {
  return `
<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${pixelId}');
  ttq.page();
}(window, document, 'ttq');
</script>
`;
}

// ============================================================
// TRACKING EVENTS
// ============================================================

export interface TrackingEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
}

/**
 * Track an event across all configured analytics platforms.
 * Gated: does not fire on medical/intake routes (see lib/no-track-paths.ts).
 */
export function trackEvent(event: TrackingEvent, config: Record<string, IntegrationConfig>): void {
  if (typeof window === "undefined") return;
  // Gate: don't fire events on medical/intake routes
  if (isNoTrackPath(window.location.pathname)) return;

  // Google Analytics
  if (config['google-analytics']?.values?.measurement_id) {
    (window as any).gtag?.('event', event.name, {
      event_category: event.category,
      ...event.properties,
    });
  }

  // Meta Pixel
  if (config['meta-pixel']?.values?.pixel_id) {
    (window as any).fbq?.('track', event.name, event.properties);
  }

  // TikTok
  if (config['tiktok-pixel']?.values?.pixel_id) {
    (window as any).ttq?.track(event.name, event.properties);
  }
}

/**
 * Standard e-commerce events
 */
export const TRACKING_EVENTS = {
  // Booking events
  VIEW_SERVICE: 'ViewContent',
  ADD_TO_CART: 'AddToCart',
  INITIATE_BOOKING: 'InitiateCheckout',
  COMPLETE_BOOKING: 'Purchase',
  
  // Lead events
  SUBMIT_FORM: 'Lead',
  SIGN_UP: 'CompleteRegistration',
  
  // Engagement events
  CONTACT: 'Contact',
  SEARCH: 'Search',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get integrations by category
 */
export function getIntegrationsByCategory(category: Integration['category']): Integration[] {
  return INTEGRATIONS.filter(i => i.category === category);
}

/**
 * Get integration by ID
 */
export function getIntegration(id: string): Integration | undefined {
  return INTEGRATIONS.find(i => i.id === id);
}

/**
 * Get all active integrations
 */
export function getActiveIntegrations(configs: Record<string, IntegrationConfig>): Integration[] {
  return INTEGRATIONS.filter(i => configs[i.id]?.values && Object.keys(configs[i.id].values).length > 0);
}

/**
 * Validate integration config
 */
export function validateIntegrationConfig(
  integration: Integration,
  values: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  integration.configFields.forEach(field => {
    if (field.required && !values[field.id]) {
      errors.push(`${field.name} is required`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}
