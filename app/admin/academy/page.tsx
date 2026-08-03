import type { Metadata } from 'next';
import { AcademyClient } from './AcademyClient';

export const metadata: Metadata = {
  title: 'RE GEN Academy | Hello Gorgeous Admin',
  description: 'Staff training platform for Hello Gorgeous Med Spa',
  robots: { index: false, follow: false },
};

export default function AcademyPage() {
  return <AcademyClient />;
}
