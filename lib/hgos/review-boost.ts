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
  
  // Hello Gorgeous Google Business Profile
  // Find your Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
  googlePlaceId: 'ChIJ_____YOUR_PLACE_ID_____', // TODO: Replace with actual Place ID
  googleReviewUrl: 'https://g.page/r/YOUR_REVIEW_LINK', // TODO: Replace with actual review link
  
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
// REVIEW FLOW LOGIC
// ============================================================

/**
 * Generate feedback collection URL
 */
export function generateFeedbackUrl(appointmentId: string, token: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || SITE.url;
  return `${baseUrl}/feedback/${appointmentId}?token=${token}`;
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
 * Determine next action based on rating
 */
export function getReviewAction(rating: number, config: ReviewBoostConfig = DEFAULT_REVIEW_BOOST_CONFIG): {
  action: 'redirect_google' | 'internal_followup' | 'thank_you';
  message: string;
  redirectUrl?: string;
} {
  if (rating >= config.minRatingForGoogleRedirect) {
    return {
      action: 'redirect_google',
      message: config.thankYouMessage.replace('{googleReviewLink}', getGoogleReviewUrl(config)),
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
