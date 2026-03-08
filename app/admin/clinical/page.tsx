// ============================================================
// Clinical section index — redirect to Guidance hub
// ============================================================

import { redirect } from 'next/navigation';

export default function ClinicalIndexPage() {
  redirect('/admin/clinical/guidance');
}
