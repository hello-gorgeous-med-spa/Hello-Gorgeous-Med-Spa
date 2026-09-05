import { randomUUID } from 'crypto';

export function newReviewTrackingToken(): string {
  return randomUUID();
}

export function siteBaseUrl(fallback?: string): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    fallback ||
    'https://www.hellogorgeousmedspa.com';
  return raw.replace(/\/$/, '');
}

export function trackedGoogleReviewUrl(token: string, baseUrl?: string): string {
  return `${siteBaseUrl(baseUrl)}/r/google-review/${token}`;
}
