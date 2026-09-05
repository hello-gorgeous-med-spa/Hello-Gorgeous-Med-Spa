import { cookies } from 'next/headers';
import OpsShell from './OpsShell';
import { OPS_SESSION_COOKIE, verifyOpsSessionToken } from '@/lib/regen/ops-session';

export default async function RegenOpsLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(OPS_SESSION_COOKIE)?.value;
  const staff = await verifyOpsSessionToken(token);
  return <OpsShell initialStaffId={staff?.id || null}>{children}</OpsShell>;
}
