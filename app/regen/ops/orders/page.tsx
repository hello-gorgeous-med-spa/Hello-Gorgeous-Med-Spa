import OrdersList from './OrdersList';
import { loadOpsOrders } from '@/lib/regen/ops-live-data';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await loadOpsOrders();
  return <OrdersList initialOrders={orders as never} />;
}
