import TodayQueue from './TodayQueue';
import { loadOpsToday } from '@/lib/regen/ops-live-data';

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const data = await loadOpsToday();
  return (
    <TodayQueue
      initialIntakes={data.intakes as never}
      initialShipped={data.shipped as never}
      initialStats={data.stats}
    />
  );
}
