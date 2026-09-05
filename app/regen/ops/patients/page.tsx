import Link from 'next/link';
import { loadOpsToday } from '@/lib/regen/ops-live-data';

export const dynamic = 'force-dynamic';

export default async function PatientsPage() {
  const { intakes } = await loadOpsToday();
  const seen = new Set<string>();
  const rows = [];
  for (const raw of intakes) {
    const i = raw as { email?: string; name?: string; status?: string; goal?: string };
    const key = (i.email || '').toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    rows.push(i);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Patients</h1>
        <p className="text-white/50">{rows.length} people who started a visit</p>
      </div>
      {rows.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">No patients yet.</div>
      )}
      <div className="space-y-2">
        {rows.map((r) => (
          <Link
            key={r.email}
            href={`/ops/patients/${encodeURIComponent(r.email || '')}`}
            className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10"
          >
            <p className="text-white font-medium">{r.name}</p>
            <p className="text-white/50 text-sm">{r.email} · {r.goal} · {(r.status || '').replace(/_/g, ' ')}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
