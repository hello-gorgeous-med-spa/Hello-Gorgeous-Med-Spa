'use client';

// ============================================================
// Post to social — Tell the agent what to post → now or schedule
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Channel = 'facebook' | 'instagram' | 'google';
interface ChannelStatus {
  configured: boolean;
  note?: string;
}
interface Results {
  facebook?: { ok: boolean; id?: string; error?: string };
  instagram?: { ok: boolean; id?: string; error?: string };
  google?: { ok: boolean; id?: string; error?: string };
}
interface ScheduledPost {
  id: string;
  message: string;
  link: string | null;
  image_url: string | null;
  channels: string[];
  scheduled_at: string;
  status: string;
  created_at: string;
}

export default function PostSocialPage() {
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [channels, setChannels] = useState<Channel[]>(['facebook']);
  const [scheduleDatetime, setScheduleDatetime] = useState('');
  const [status, setStatus] = useState<Record<string, ChannelStatus> | null>(null);
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<Results | null>(null);
  const [scheduledResult, setScheduledResult] = useState<{ id: string; scheduledAt: string } | null>(null);
  const [scheduledList, setScheduledList] = useState<ScheduledPost[]>([]);

  const fetchScheduled = useCallback(() => {
    fetch('/api/social/scheduled')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data?.scheduled && setScheduledList(data.scheduled));
  }, []);

  useEffect(() => {
    fetch('/api/social/status')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setStatus(data));
    fetchScheduled();
  }, [fetchScheduled]);

  const toggleChannel = (ch: Channel) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || channels.length === 0) return;
    setPosting(true);
    setResult(null);
    setScheduledResult(null);
    try {
      const payload: Record<string, unknown> = {
        message: message.trim(),
        link: link.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        channels,
      };
      if (scheduleDatetime) {
        const d = new Date(scheduleDatetime);
        if (!Number.isNaN(d.getTime())) payload.scheduledAt = d.toISOString();
      }
      const res = await fetch('/api/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.scheduled && data.id) {
        setScheduledResult({ id: data.id, scheduledAt: data.scheduledAt });
        fetchScheduled();
      } else if (data.results) {
        setResult(data.results);
      } else {
        setResult({ facebook: { ok: false, error: data.error || 'Request failed' } });
      }
    } catch (err) {
      setResult({ facebook: { ok: false, error: (err as Error).message } });
    } finally {
      setPosting(false);
    }
  };

  const channelLabel: Record<Channel, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    google: 'Google Business',
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/marketing" className="text-pink-600 hover:underline text-sm">
            ← Marketing
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-black mb-2">Post to social</h1>
        <p className="text-black mb-6">
          Write once, publish to <strong>Facebook</strong>, <strong>Google Business</strong>, and/or Instagram. Use <strong>Square</strong> for email campaigns (links on the main Marketing page). Instagram is optional — connect when ready. Set env vars below per channel.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-5">
          <div>
            <label className="block font-medium text-black mb-1">Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you want to post?"
              rows={4}
              className="w-full border rounded-lg px-3 py-2 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-black mb-1">Link (optional)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.hellogorgeousmedspa.com/book"
              className="w-full border rounded-lg px-3 py-2 text-black"
            />
          </div>
          <div>
            <label className="block font-medium text-black mb-1">Image URL (optional for FB; required for Instagram)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2 text-black"
            />
            <p className="text-xs text-black mt-1">Image must be publicly accessible. For Instagram, a photo is required.</p>
          </div>
          <div>
            <span className="block font-medium text-black mb-2">Post to</span>
            <div className="flex flex-wrap gap-4">
              {(['facebook', 'instagram', 'google'] as Channel[]).map((ch) => (
                <label key={ch} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channels.includes(ch)}
                    onChange={() => toggleChannel(ch)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-black">{channelLabel[ch]}</span>
                  {status?.[ch] && (
                    <span className={`text-xs ${status[ch].configured ? 'text-green-600' : 'text-amber-600'}`}>
                      {status[ch].configured ? '✓' : 'Not configured'}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium text-black mb-1">Schedule for (optional)</label>
            <input
              type="datetime-local"
              value={scheduleDatetime}
              onChange={(e) => setScheduleDatetime(e.target.value)}
              min={(() => {
                const d = new Date(Date.now() + 60 * 1000);
                const p = (n: number) => String(n).padStart(2, '0');
                return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
              })()}
              max={(() => {
                const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const p = (n: number) => String(n).padStart(2, '0');
                return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
              })()}
              className="w-full border rounded-lg px-3 py-2 text-black"
            />
            <p className="text-xs text-black mt-1">Leave empty to post now. Min 1 min from now, max 30 days. Cron runs every 15 min.</p>
          </div>
          <button
            type="submit"
            disabled={posting || !message.trim() || channels.length === 0}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {posting ? (scheduleDatetime ? 'Scheduling…' : 'Posting…') : scheduleDatetime ? 'Schedule post' : 'Post now'}
          </button>
        </form>

        {scheduledResult && (
          <div className="mt-6 p-4 rounded-xl border bg-emerald-50 border-emerald-200">
            <h3 className="font-semibold text-emerald-900 mb-2">Scheduled</h3>
            <p className="text-sm text-emerald-800">
              Post will go out at <strong>{new Date(scheduledResult.scheduledAt).toLocaleString()}</strong>. Cron runs every 15 minutes.
            </p>
          </div>
        )}
        {result && (
          <div className="mt-6 p-4 rounded-xl border bg-white">
            <h3 className="font-semibold text-black mb-2">Result</h3>
            <ul className="space-y-1 text-sm">
              {(Object.entries(result) as [Channel, { ok: boolean; id?: string; error?: string }][]).map(([ch, r]) => (
                r && (
                  <li key={ch} className={r.ok ? 'text-green-700' : 'text-red-700'}>
                    {channelLabel[ch]}: {r.ok ? `Posted ✓${r.id ? ` (${r.id})` : ''}` : r.error}
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
        {scheduledList.length > 0 && (
          <div className="mt-6 p-4 rounded-xl border bg-white">
            <h3 className="font-semibold text-black mb-2">Upcoming scheduled posts</h3>
            <ul className="space-y-2 text-sm">
              {scheduledList.map((p) => (
                <li key={p.id} className="flex flex-wrap items-baseline gap-2 text-black">
                  <span className="font-medium text-gray-500">
                    {new Date(p.scheduled_at).toLocaleString()}
                  </span>
                  <span className="truncate max-w-md">{p.message}</span>
                  <span className="text-gray-500">→ {p.channels?.join(', ') || '—'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-black">
          <h3 className="font-semibold text-amber-900 mb-2">How to connect</h3>
          <p className="mb-2">Add these environment variables (e.g. in Vercel or .env.local):</p>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            <li><code className="bg-amber-100 px-1 rounded">META_PAGE_ID</code> — Your Facebook Page ID</li>
            <li><code className="bg-amber-100 px-1 rounded">META_PAGE_ACCESS_TOKEN</code> — Page access token (with pages_manage_posts)</li>
            <li><code className="bg-amber-100 px-1 rounded">META_INSTAGRAM_BUSINESS_ACCOUNT_ID</code> — IG Business Account ID (Page must be linked to IG)</li>
            <li>Google: add <code className="bg-amber-100 px-1 rounded">GOOGLE_CLIENT_ID</code> and <code className="bg-amber-100 px-1 rounded">GOOGLE_CLIENT_SECRET</code> from Google Cloud, then use <strong>Connect Google</strong> below to get the rest.</li>
          </ul>
          <p className="mt-3 text-amber-800">
            <strong>Google:</strong> Add <code className="bg-amber-100 px-1 rounded">GOOGLE_CLIENT_ID</code> and <code className="bg-amber-100 px-1 rounded">GOOGLE_CLIENT_SECRET</code> in Vercel first. In Google Cloud OAuth client, add this redirect URI: <code className="bg-amber-100 px-1 rounded text-xs break-all">https://www.hellogorgeousmedspa.com/api/social/google-callback</code> (or your site domain). Then click:
          </p>
          <a
            href="/api/social/google-connect"
            className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-sm"
          >
            Connect Google (get refresh token + Account/Location IDs)
          </a>
          <p className="mt-2 text-amber-800">
            Get tokens from{' '}
            <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">
              Meta for Developers
            </a>
            {' '}→ your app → Tools → Graph API Explorer (Page token) and Page settings → Instagram for the IG account ID.
          </p>
        </div>
      </div>
    </div>
  );
}
