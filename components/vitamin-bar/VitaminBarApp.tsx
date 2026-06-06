"use client";

import { useEffect, useState } from "react";

import { BOOKING_URL } from "@/lib/flows";
import {
  VITAMIN_BAR,
  VITAMIN_MEMBERSHIPS,
  shotsByCategory,
  type VitaminMembership,
  type VitaminShot,
} from "@/lib/vitamin-bar";

type Tab = "menu" | "membership" | "visit" | "checkin";

const PINK = "#E6007E";

// ---- Install (Add to Home Screen) prompt handling ----
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return { canInstall: !!deferred && !installed, promptInstall };
}

function priceLabel(n: number) {
  return `$${n}`;
}

export function VitaminBarApp() {
  const [tab, setTab] = useState<Tab>("menu");
  const [selected, setSelected] = useState<VitaminShot | null>(null);
  const { canInstall, promptInstall } = useInstallPrompt();

  return (
    <div className="min-h-screen bg-[#faf7f9] text-black pb-24">
      {/* App header */}
      <header className="sticky top-0 z-30 bg-black text-white">
        <div className="mx-auto max-w-xl px-5 pt-5 pb-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#FFB8DC]">
            Hello Gorgeous Med Spa
          </p>
          <h1 className="mt-1 font-serif text-2xl font-light">{VITAMIN_BAR.name}</h1>
          <p className="text-sm text-white/60">{VITAMIN_BAR.tagline}</p>
          {canInstall && (
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E6007E] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
            >
              ⤓ Add to home screen
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5">
        {tab === "menu" && <MenuTab onSelect={setSelected} />}
        {tab === "membership" && <MembershipTab memberships={VITAMIN_MEMBERSHIPS} />}
        {tab === "visit" && <VisitTab />}
        {tab === "checkin" && <CheckinTab />}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/10 bg-white">
        <div className="mx-auto grid max-w-xl grid-cols-4">
          {([
            ["menu", "Menu", "💉"],
            ["membership", "Membership", "⭐"],
            ["visit", "Visit", "🚗"],
            ["checkin", "I'm here", "📍"],
          ] as [Tab, string, string][]).map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-0.5 py-3 text-[11px] font-semibold ${
                tab === id ? "text-[#E6007E]" : "text-black/45"
              }`}
            >
              <span className="text-lg leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Shot detail sheet */}
      {selected && <ShotSheet shot={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ============================================================
// MENU
// ============================================================
function MenuTab({ onSelect }: { onSelect: (s: VitaminShot) => void }) {
  const groups = shotsByCategory();
  return (
    <div className="py-5">
      <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
        <p className="text-sm font-bold text-[#E6007E]">{VITAMIN_BAR.driveThru.headline}</p>
        <p className="mt-1 text-sm text-black/70">{VITAMIN_BAR.driveThru.blurb}</p>
      </div>

      {groups.map((g) => (
        <section key={g.category} className="mt-7">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-black/50">
            {g.label}
          </h2>
          <div className="space-y-3">
            {g.shots.map((shot) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => onSelect(shot)}
                className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 text-left transition active:scale-[0.99]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">{shot.name}</span>
                    {shot.favorite && (
                      <span className="shrink-0 rounded-full bg-[#FFF0F7] px-2 py-0.5 text-[9px] font-bold uppercase text-[#E6007E]">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-black/60">{shot.benefit}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold text-[#E6007E]">{priceLabel(shot.price)}</div>
                  {shot.memberPrice != null && (
                    <div className="text-[10px] text-black/40">
                      {priceLabel(shot.memberPrice)} member
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-8 text-center text-xs text-black/40">
        Prices shown are starting prices. Provider-administered. Some shots require a quick
        screening before your first dose.
      </p>
    </div>
  );
}

function ShotSheet({ shot, onClose }: { shot: VitaminShot; onClose: () => void }) {
  const freshaUrl = shot.freshaUrl || BOOKING_URL;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-t-3xl bg-white p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/15" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{shot.name}</h3>
            <p className="mt-1 text-sm text-black/65">{shot.benefit}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-[#E6007E]">{priceLabel(shot.price)}</div>
            {shot.memberPrice != null && (
              <div className="text-[11px] text-black/45">{priceLabel(shot.memberPrice)} member</div>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {shot.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#FFF0F7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#E6007E]"
            >
              {t}
            </span>
          ))}
        </div>

        {shot.consultFirst && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Quick provider screening required before your first dose — we&apos;ll handle it at your
            visit.
          </p>
        )}

        <div className="mt-5 space-y-2.5">
          {shot.squarePayUrl ? (
            <a
              href={shot.squarePayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-[#E6007E] py-3.5 text-center font-bold text-white"
            >
              Pre-pay {priceLabel(shot.price)} & reserve
            </a>
          ) : (
            <div className="rounded-xl border border-black/10 bg-[#faf7f9] py-3 text-center text-sm font-medium text-black/60">
              Pay at the window — {priceLabel(shot.price)}
            </div>
          )}
          <a
            href={freshaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border-2 border-[#E6007E] py-3.5 text-center font-bold text-[#E6007E]"
          >
            Schedule a drive-thru time
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full py-2 text-center text-sm text-black/45"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MEMBERSHIP
// ============================================================
function MembershipTab({ memberships }: { memberships: VitaminMembership[] }) {
  return (
    <div className="py-5">
      <h2 className="text-xl font-bold">Membership</h2>
      <p className="mt-1 text-sm text-black/60">
        Make glowing a habit. Members get monthly shots, member pricing, and the skip-the-line lane.
      </p>

      <div className="mt-5 space-y-4">
        {memberships.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border-2 p-5 ${
              m.highlight
                ? "border-[#E6007E] bg-white shadow-[5px_5px_0_0_rgba(230,0,126,0.3)]"
                : "border-black/10 bg-white"
            }`}
          >
            {m.highlight && (
              <span className="mb-2 inline-block rounded-full bg-[#E6007E] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Most popular
              </span>
            )}
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-bold">{m.name}</h3>
              <div className="text-right">
                <span className="text-2xl font-black text-[#E6007E]">${m.pricePerMonth}</span>
                <span className="text-sm text-black/45">/mo</span>
              </div>
            </div>
            <p className="mt-1 text-sm font-medium text-black/70">{m.summary}</p>
            <ul className="mt-3 space-y-1.5">
              {m.perks.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-black/75">
                  <span className="text-[#E6007E]">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            {m.squarePayUrl ? (
              <a
                href={m.squarePayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl bg-[#E6007E] py-3.5 text-center font-bold text-white"
              >
                Join {m.name}
              </a>
            ) : (
              <a
                href={VITAMIN_BAR.phoneHref}
                className="mt-4 block rounded-xl border-2 border-[#E6007E] py-3.5 text-center font-bold text-[#E6007E]"
              >
                Call to join — {VITAMIN_BAR.phone}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// VISIT (schedule + drive-thru info)
// ============================================================
function VisitTab() {
  return (
    <div className="py-5">
      <h2 className="text-xl font-bold">Plan your visit</h2>
      <div className="mt-4 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]">
        <p className="text-sm font-bold text-[#E6007E]">How the drive-thru works</p>
        <ol className="mt-3 space-y-2 text-sm text-black/75">
          <li><span className="font-bold text-[#E6007E]">1.</span> Pick your shot in the Menu and pre-pay (or pay at the window).</li>
          <li><span className="font-bold text-[#E6007E]">2.</span> Schedule a 10-minute window below.</li>
          <li><span className="font-bold text-[#E6007E]">3.</span> When you arrive, tap <strong>I&apos;m here</strong> — we&apos;ll meet you for a quick in-and-out.</li>
        </ol>
      </div>

      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block rounded-xl bg-[#E6007E] py-4 text-center font-bold text-white"
      >
        Schedule a drive-thru time
      </a>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 text-sm">
        <p className="font-semibold">{VITAMIN_BAR.address}</p>
        <p className="mt-1 text-black/60">{VITAMIN_BAR.driveThru.hoursNote}</p>
        <p className="mt-2 text-black/60">{VITAMIN_BAR.driveThru.arrivalNote}</p>
        <a href={VITAMIN_BAR.phoneHref} className="mt-3 inline-block font-bold text-[#E6007E]">
          Call {VITAMIN_BAR.phone}
        </a>
      </div>
    </div>
  );
}

// ============================================================
// CHECK-IN (curbside / I'm here)
// ============================================================
function CheckinTab() {
  const [phone, setPhone] = useState("");
  const [spot, setSpot] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ ok: false, text: data.error || "Could not check you in. See the front desk." });
        return;
      }
      setResult({
        ok: true,
        text:
          (data.message || "You're checked in!") +
          " Stay in your spot — we'll be right out.",
      });
      setPhone("");
      setSpot("");
    } catch {
      setResult({ ok: false, text: "Network error. Please try again or call us." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="py-5">
      <h2 className="text-xl font-bold">I&apos;m here</h2>
      <p className="mt-1 text-sm text-black/60">
        Pulled up? Check in with the mobile number we have on file and we&apos;ll come to you.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-black/50">
            Mobile phone
          </label>
          <input
            type="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(630) 555-1234"
            className="w-full rounded-xl border-2 border-black/15 px-4 py-3.5 text-lg outline-none focus:border-[#E6007E]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-black/50">
            Parking spot / vehicle (optional)
          </label>
          <input
            type="text"
            value={spot}
            onChange={(e) => setSpot(e.target.value)}
            placeholder="e.g. white SUV out front"
            className="w-full rounded-xl border-2 border-black/15 px-4 py-3 outline-none focus:border-[#E6007E]"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[#E6007E] py-4 text-center font-bold text-white disabled:opacity-50"
          style={{ backgroundColor: PINK }}
        >
          {busy ? "Checking you in…" : "Tap to check in"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-5 rounded-xl p-4 text-sm font-medium ${
            result.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
          }`}
        >
          {result.text}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-black/40">
        Trouble checking in? Call{" "}
        <a href={VITAMIN_BAR.phoneHref} className="font-bold text-[#E6007E]">
          {VITAMIN_BAR.phone}
        </a>
      </p>
    </div>
  );
}
