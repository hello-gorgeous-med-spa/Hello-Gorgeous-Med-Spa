import { permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * NP Landing Page - PERMANENTLY REDIRECTED (Oct 2026)
 * 
 * This page previously promoted "NP On Site" as a differentiator.
 * As of Oct 2026, there is no on-site NP. The practice offers
 * physician-led care under Medical Director Dr. Mukesh Arora, MD.
 * 
 * 308 permanent redirect to /why-choose-us per owner approval.
 * Using permanentRedirect() for proper 308 status code.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NursePractitionerMedSpaOswegoPage() {
  permanentRedirect('/why-choose-us');
}
