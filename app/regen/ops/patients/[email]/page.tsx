import PatientChartClient from './ChartClient';
import { loadOpsChart } from '@/lib/regen/ops-chart-data';

export const dynamic = 'force-dynamic';

export default async function PatientChartPage({ params }: { params: Promise<{ email: string }> }) {
  const { email: raw } = await params;
  const email = decodeURIComponent(raw || '');
  const data = await loadOpsChart(email);
  return <PatientChartClient email={email} initialData={data} />;
}
