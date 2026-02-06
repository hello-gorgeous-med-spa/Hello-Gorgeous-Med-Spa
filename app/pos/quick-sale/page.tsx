// ============================================================
// QUICK SALE PAGE - REDIRECTS TO MAIN POS
// All payments now processed through Square Terminal
// The main POS page has a "Walk-in Sale" tab for quick sales
// ============================================================

import { redirect } from 'next/navigation';

export default function QuickSalePage() {
  // Redirect to main POS page with walk-in tab active
  redirect('/pos');
}
