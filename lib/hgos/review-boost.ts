// ============================================================
// HELLO GORGEOUS OS - GOOGLE REVIEW BOOST
// Automatically route happy clients to leave Google reviews
// FREE - Fresha charges $14.95/month for this
// ============================================================

import { SITE } from '@/lib/seo';

export interface ReviewRequest {
  appointmentId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  providerName: string;
  serviceName: string;
  appointmentDate: string;
  /** Client's home town — used to add a natural city mention to the Google review ask. */
  clientCity?: string;
}

export interface ReviewFeedback {
  rating: number; // 1-5
  comment?: string;
  wouldRecommend: boolean;
  appointmentId: string;
  clientId: string;
  submittedAt: string;
}

export interface ReviewBoostConfig {
  enabled: boolean;
  // Google Business Profile settings
  googlePlaceId: string;
  googleReviewUrl: string;
  // Thresholds
  minRatingForGoogleRedirect: number; // Typically 4 or 5
  // Timing
  sendAfterMinutes: number; // How long after appointment to send request
  reminderAfterHours: number; // When to send reminder if no response
  maxReminders: number;
  // Messaging
  requestSubject: string;
  requestMessage: string;
  thankYouMessage: string;
  lowRatingMessage: string;
}

// ============================================================
// DEFAULT CONFIGURATION
// ============================================================

export const DEFAULT_REVIEW_BOOST_CONFIG: ReviewBoostConfig = {
  enabled: true,
  
  // Hello Gorgeous Google Business Profile — sourced from canonical SITE config.
  googlePlaceId: SITE.placeId,
  googleReviewUrl: SITE.googleReviewUrl,
  
  // Only redirect 4+ star ratings to Google
  minRatingForGoogleRedirect: 4,
  
  // Send review request 2 hours after appointment completion
  sendAfterMinutes: 120,
  reminderAfterHours: 24,
  maxReminders: 1,
  
  // Email/SMS templates
  requestSubject: 'How was your visit to Hello Gorgeous? ✨',
  requestMessage: `Hi {clientName}!

Thank you for visiting Hello Gorgeous Med Spa today for your {serviceName} with {providerName}.

We'd love to hear about your experience! It only takes 30 seconds:

{feedbackLink}

Your feedback helps us continue providing exceptional care.

With gratitude,
The Hello Gorgeous Team 💎`,

  thankYouMessage: `Thank you so much for your feedback! We're thrilled you had a great experience. 

Would you mind sharing your experience on Google? It helps others discover us!

{googleReviewLink}`,

  lowRatingMessage: `Thank you for your honest feedback. We're sorry your experience wasn't perfect.

Our team will reach out to you shortly to make things right. Your satisfaction is our top priority.

If you'd like to speak with us directly, please call (630) 636-6193.`,
};

// ============================================================
// CITY-TAGGED REVIEW NUDGES (Local SEO / Map Pack)
// ============================================================
// Google's Map Pack ranking for a town is strongly influenced by reviews
// whose TEXT mentions that town. We never incentivize or gate reviews — we
// simply suggest that clients mention where they drove in from, which is
// honest and policy-compliant. Matched case-insensitively on the client's city.

export const REVIEW_CITY_NUDGES: Record<string, string> = {
  aurora: "If you drove in from Aurora, it'd mean the world if you mentioned that in your review! 💕",
  naperville: "If you came from Naperville, a quick mention of that in your review really helps other locals find us! 💕",
  oswego: "A quick mention that you're local to Oswego in your review helps your neighbors find us! 💕",
  montgomery: "If you're from Montgomery, mentioning that in your review helps other locals discover us! 💕",
  plainfield: "If you drove in from Plainfield, a mention of that in your review helps other locals find us! 💕",
  yorkville: "If you're from Yorkville, mentioning that in your review helps your neighbors find us! 💕",
  "north aurora": "If you came from North Aurora, mentioning that in your review helps other locals find us! 💕",
};

/**
 * Returns a natural, policy-safe sentence asking the client to mention their
 * town, or "" if the city isn't one we target.
 *
 * Robust to real-world CRM/Square data: handles casing, trailing state
 * ("Aurora, IL" / "Aurora IL"), zip codes, and multi-word towns. Prefers the
 * most specific match (e.g. "North Aurora" over "Aurora").
 */
export function getCityNudge(city?: string): string {
  if (!city) return "";
  // Normalize: lowercase, strip state suffixes / punctuation / digits, collapse spaces.
  const normalized = city
    .toLowerCase()
    .replace(/,?\s*(il|illinois)\b/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "";

  // Exact match wins.
  if (REVIEW_CITY_NUDGES[normalized]) return REVIEW_CITY_NUDGES[normalized];

  // Otherwise, match the most specific known town contained in the value
  // (longest key first so "north aurora" beats "aurora").
  const keys = Object.keys(REVIEW_CITY_NUDGES).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (normalized === key || normalized.includes(key)) {
      return REVIEW_CITY_NUDGES[key];
    }
  }
  return "";
}

// ============================================================
// REVIEW FLOW LOGIC
// ============================================================

/**
 * Generate feedback collection URL
 */
export function generateFeedbackUrl(appointmentId: string, token: string, city?: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || SITE.url;
  const cityParam = city ? `&city=${encodeURIComponent(city.trim().toLowerCase())}` : '';
  return `${baseUrl}/feedback/${appointmentId}?token=${token}${cityParam}`;
}

/**
 * Generate Google Review URL
 */
export function getGoogleReviewUrl(config: ReviewBoostConfig = DEFAULT_REVIEW_BOOST_CONFIG): string {
  // Direct link to write a review
  if (config.googleReviewUrl) {
    return config.googleReviewUrl;
  }
  // Fallback to Place ID based URL
  return `https://search.google.com/local/writereview?placeid=${config.googlePlaceId}`;
}

/**
 * Determine next action based on rating.
 * Pass the client's city to append a natural, policy-safe town mention to the Google ask.
 */
export function getReviewAction(
  rating: number,
  config: ReviewBoostConfig = DEFAULT_REVIEW_BOOST_CONFIG,
  city?: string
): {
  action: 'redirect_google' | 'internal_followup' | 'thank_you';
  message: string;
  redirectUrl?: string;
} {
  if (rating >= config.minRatingForGoogleRedirect) {
    const nudge = getCityNudge(city);
    const baseMessage = config.thankYouMessage.replace('{googleReviewLink}', getGoogleReviewUrl(config));
    return {
      action: 'redirect_google',
      message: nudge ? `${baseMessage}\n\n${nudge}` : baseMessage,
      redirectUrl: getGoogleReviewUrl(config),
    };
  } else if (rating <= 2) {
    return {
      action: 'internal_followup',
      message: config.lowRatingMessage,
    };
  } else {
    return {
      action: 'thank_you',
      message: 'Thank you for your feedback! We appreciate you taking the time to share your experience.',
    };
  }
}

/**
 * Format review request message
 */
export function formatReviewRequestMessage(
  request: ReviewRequest,
  feedbackUrl: string,
  config: ReviewBoostConfig = DEFAULT_REVIEW_BOOST_CONFIG
): { subject: string; body: string } {
  const body = config.requestMessage
    .replace('{clientName}', request.clientName.split(' ')[0])
    .replace('{serviceName}', request.serviceName)
    .replace('{providerName}', request.providerName)
    .replace('{feedbackLink}', feedbackUrl);

  return {
    subject: config.requestSubject,
    body,
  };
}

// ============================================================
// READY-TO-USE REVIEW REQUEST TEMPLATES (SMS + EMAIL)
// ============================================================
// Short, friendly, mobile-first. Placeholders: {firstName}, {serviceName},
// {feedbackLink}, {cityLine}. The {cityLine} is auto-filled from the client's
// town (or removed if unknown) so the ask feels personal and supports local SEO.

export const REVIEW_REQUEST_SMS_TEMPLATE =
  `Hi {firstName}! 💕 Thank you for visiting Hello Gorgeous Med Spa for your {serviceName}. ` +
  `We'd love a quick review — it takes 30 seconds: {feedbackLink}{cityLine}`;

export const REVIEW_REQUEST_EMAIL_SUBJECT = 'How was your visit to Hello Gorgeous? ✨';

export const REVIEW_REQUEST_EMAIL_TEMPLATE = `Hi {firstName}!

Thank you for trusting Hello Gorgeous Med Spa with your {serviceName}. We hope you're loving your results! 💎

Would you take 30 seconds to share your experience? It helps other local clients find us:

{feedbackLink}{cityLine}

With gratitude,
The Hello Gorgeous Team
74 W. Washington St., Oswego, IL 60543 · (630) 636-6193`;

/** Short city line appended to the review ask (SMS/email), or "" if city unknown. */
function reviewCityLine(city?: string, forSms = false): string {
  const nudge = getCityNudge(city);
  if (!nudge) return '';
  return forSms ? ` ${nudge}` : `\n\n${nudge}`;
}

/**
 * Build the initial city-aware review request (sent ~2h after the visit).
 * Returns SMS body + email subject/body with the client's town woven in.
 */
export function buildCityReviewRequest(
  request: ReviewRequest,
  feedbackUrl: string
): { sms: string; emailSubject: string; emailBody: string } {
  const firstName = request.clientName.split(' ')[0];
  const fill = (tpl: string, forSms: boolean) =>
    tpl
      .replace('{firstName}', firstName)
      .replace('{serviceName}', request.serviceName)
      .replace('{feedbackLink}', feedbackUrl)
      .replace('{cityLine}', reviewCityLine(request.clientCity, forSms));

  return {
    sms: fill(REVIEW_REQUEST_SMS_TEMPLATE, true),
    emailSubject: REVIEW_REQUEST_EMAIL_SUBJECT,
    emailBody: fill(REVIEW_REQUEST_EMAIL_TEMPLATE, false),
  };
}

/**
 * Calculate when to send review request
 */
export function calculateSendTime(
  appointmentEndTime: Date,
  config: ReviewBoostConfig = DEFAULT_REVIEW_BOOST_CONFIG
): Date {
  const sendTime = new Date(appointmentEndTime);
  sendTime.setMinutes(sendTime.getMinutes() + config.sendAfterMinutes);
  return sendTime;
}

/**
 * Check if should send reminder
 */
export function shouldSendReminder(
  originalSentAt: Date,
  reminderCount: number,
  config: ReviewBoostConfig = DEFAULT_REVIEW_BOOST_CONFIG
): boolean {
  if (reminderCount >= config.maxReminders) return false;
  
  const reminderTime = new Date(originalSentAt);
  reminderTime.setHours(reminderTime.getHours() + config.reminderAfterHours);
  
  return new Date() >= reminderTime;
}

// ============================================================
// ANALYTICS HELPERS
// ============================================================

export interface ReviewStats {
  totalRequests: number;
  totalResponses: number;
  responseRate: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  googleRedirects: number;
  googleConversionRate: number;
}

/**
 * Calculate review statistics
 */
export function calculateReviewStats(feedbacks: ReviewFeedback[]): ReviewStats {
  if (feedbacks.length === 0) {
    return {
      totalRequests: 0,
      totalResponses: 0,
      responseRate: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      googleRedirects: 0,
      googleConversionRate: 0,
    };
  }

  const totalResponses = feedbacks.length;
  const sumRatings = feedbacks.reduce((sum, f) => sum + f.rating, 0);
  const averageRating = sumRatings / totalResponses;
  
  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedbacks.forEach(f => {
    ratingDistribution[f.rating] = (ratingDistribution[f.rating] || 0) + 1;
  });

  const googleRedirects = feedbacks.filter(f => f.rating >= 4).length;

  return {
    totalRequests: totalResponses, // This would come from sent requests
    totalResponses,
    responseRate: 100, // Would be calculated from requests
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    googleRedirects,
    googleConversionRate: (googleRedirects / totalResponses) * 100,
  };
}

// ============================================================
// INTEGRATION WITH NPS (Net Promoter Score)
// ============================================================

/**
 * Calculate NPS from feedback
 */
export function calculateNPS(feedbacks: ReviewFeedback[]): number {
  if (feedbacks.length === 0) return 0;

  // NPS uses "would recommend" ratings 0-10
  // We'll map our 1-5 scale: 5=10, 4=8, 3=6, 2=4, 1=2
  const promoters = feedbacks.filter(f => f.rating === 5).length;
  const detractors = feedbacks.filter(f => f.rating <= 2).length;
  
  return Math.round(((promoters - detractors) / feedbacks.length) * 100);
}

/**
 * Get NPS category
 */
export function getNPSCategory(nps: number): { label: string; color: string; description: string } {
  if (nps >= 70) {
    return { label: 'Excellent', color: 'green', description: 'World-class customer loyalty' };
  } else if (nps >= 50) {
    return { label: 'Great', color: 'emerald', description: 'Strong customer loyalty' };
  } else if (nps >= 30) {
    return { label: 'Good', color: 'yellow', description: 'Room for improvement' };
  } else if (nps >= 0) {
    return { label: 'Needs Work', color: 'orange', description: 'Focus on customer experience' };
  } else {
    return { label: 'Critical', color: 'red', description: 'Urgent attention needed' };
  }
}
