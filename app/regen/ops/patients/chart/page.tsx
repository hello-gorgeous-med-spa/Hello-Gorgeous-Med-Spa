import PatientChartClient from '../ChartClient';
import { loadOpsChart } from '@/lib/regen/ops-chart-data';

export const dynamic = 'force-dynamic';

export default async function PatientChartByQueryPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email: raw } = await searchParams;
  const email = decodeURIComponent(raw || '').trim();
  const data = await loadOpsChart(email);
  return <PatientChartClient email={email} initialData={data} />;
}
