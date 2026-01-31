// ADMIN CHARTS PAGE - Redirect to Provider Charts
import { redirect } from 'next/navigation';

export default function AdminChartsPage() {
  redirect('/provider/clients');
}
