"use client";

import Link from "next/link";
import React from "react";

import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_CONFIGS, getPersonaConfig } from "@/lib/personas/index";
import { PERSONA_UI } from "@/lib/personas/ui";
import { complianceFooter } from "@/lib/guardrails";
import {
  ATLAS_CLUSTERS,
  ATLAS_SERVICES,
  CARE_PATHWAYS,
  COMPARISONS,
  DISCOVERY_OPTIONS,
  servicesForCluster,
  type DiscoveryOptionId,
  type ServiceAtlasClusterId,
} from "@/lib/services-atlas";
import { useExperienceMemory } from "@/lib/memory/hooks";

type Msg = { role: "user" | "assistant"; content: string };

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return initial;
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  React.useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

async function chat({
  personaId,
  messages,
}: {
  personaId: PersonaId;
  messages: Msg[];
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personaId,
      module: "education",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  return (await res.json()) as { reply?: string };
}

function TrustMessage() {
  return (
    <div className="sticky top-24 rounded-2xl border border-black bg-white p-5">
      <p className="text-sm font-semibold text-white">You don’t need to know what to book today.</p>
      <p className="mt-2 text-sm text-black">
        Learning is always welcome here. Booking is optional, and you can start with clarity first.
      </p>
      <p className="mt-3 text-sm text-black">
        Want to understand our sourcing and standards?{" "}
        <Link className="underline" href="/clinical-partners">
          Our Clinical Partners & Standards
        </Link>
        .
      </p>
      <p className="mt-4 text-xs text-black">{complianceFooter()}</p>
    </div>
  );
}

function ComparisonBlock() {
  const [open, setOpen] = React.useState<string>(COMPARISONS[0]?.id ?? "botox-vs-dysport-vs-jeuveau");
  const current = COMPARISONS.find((c) => c.id === open) ?? COMPARISONS[0];

  return (
    <div className="rounded-2xl border border-black bg-black/40 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Comparison tools</h3>
          <p className="mt-2 text-sm text-black">
            Education-only comparisons. No recommendations, no pricing emphasis.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMPARISONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpen(c.id)}
              className={cx(
                "text-xs font-semibold rounded-full px-3 py-2 border transition",
                open === c.id
                  ? "border-[#FF2D8E]/40 bg-white text-pink-300"
                  : "border-black text-black hover:bg-white hover:text-white",
              )}
            >
              {c.title.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black bg-white p-5 overflow-auto">
        <p className="text-xs text-black">{current.disclaimer}</p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-black">
              <th className="py-2 pr-3">Topic</th>
              {current.columns.map((c) => (
                <th key={c} className="py-2 pr-3">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-black">
            {current.rows.map((r) => (
              <tr key={r.label} className="border-t border-black">
                <td className="py-3 pr-3 font-semibold text-white">{r.label}</td>
                {r.values.map((v, idx) => (
                  <td key={idx} className="py-3 pr-3 text-black">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PathwaysBlock() {
  return (
    <div className="rounded-2xl border border-black bg-black/40 p-6">
      <h3 className="text-xl font-bold text-white">Care pathways (conceptual)</h3>
      <p className="mt-2 text-sm text-black">
        These are not treatment plans—just a gentle way to understand how people often think about care over time.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {CARE_PATHWAYS.map((p) => (
          <div key={p.id} className="rounded-2xl border border-black bg-white p-5">
            <p className="text-sm font-semibold text-white">{p.title}</p>
            <p className="mt-2 text-xs text-black">{p.description}</p>
            <div className="mt-4 space-y-2 text-sm text-black">
              {p.steps.map((s) => (
                <div key={s.label} className="flex items-start gap-2">
                  <span className="text-[#FF2D8E]">•</span>
                  <span>
                    <span className="font-semibold text-white">{s.label}:</span>{" "}
                    <Link className="underline" href={`/services/${s.cluster}`}>
                      {s.cluster}
                    </Link>{" "}
                    — {s.notes}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-black">{p.disclaimer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  slug,
  name,
  plainLanguage,
  commonlyHelpsWith,
  oftenFor,
  mayNotBeFor,
  intensity,
  commitment,
  defaultPersona,
  onTalk,
  onViewed,
}: {
  slug: string;
  name: string;
  plainLanguage: string;
  commonlyHelpsWith: string[];
  oftenFor: string[];
  mayNotBeFor: string[];
  intensity: string;
  commitment: string;
  defaultPersona: PersonaId;
  onTalk: (personaId: PersonaId, prompt: string) => void;
  onViewed: (serviceSlug: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-2xl border border-black bg-gradient-to-b from-black/60 to-black p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-black">Intensity: {intensity} · Commitment: {commitment}</p>
          <h4 className="mt-2 text-xl font-bold text-white">{name}</h4>
          <p className="mt-3 text-black">{plainLanguage}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-semibold rounded-full px-3 py-2 border border-black text-black hover:bg-white transition"
        >
          {open ? "Hide" : "Learn more"}
        </button>
      </div>

      {open ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-white">What it commonly helps with</p>
            <ul className="mt-2 space-y-1 text-sm text-black">
              {commonlyHelpsWith.map((x) => (
                <li key={x}>- {x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Who it’s often for</p>
            <ul className="mt-2 space-y-1 text-sm text-black">
              {oftenFor.map((x) => (
                <li key={x}>- {x}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-white">Who it may not be for (high-level)</p>
            <ul className="mt-2 space-y-1 text-sm text-black">
              {mayNotBeFor.map((x) => (
                <li key={x}>- {x}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-black">{complianceFooter()}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/services/${slug}`}
          onClick={() => onViewed(slug)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-black text-white hover:bg-white transition"
        >
          View details
        </Link>
        <button
          type="button"
          onClick={() =>
            onTalk(
              defaultPersona,
              `I’m exploring "${name}". Can you explain what it is, what to expect, and what questions I should ask in a consult?`,
            )
          }
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-black text-white hover:bg-white transition"
        >
          Talk to us (chat)
        </button>
        <CTA href={BOOKING_URL} variant="gradient" className="px-6 py-3 text-sm">
          Book when ready (optional)
        </CTA>
      </div>
    </div>
  );
}

function ChatModal({
  open,
  onClose,
  personaId,
  initialPrompt,
}: {
  open: boolean;
  onClose: () => void;
  personaId: PersonaId;
  initialPrompt: string | null;
}) {
  const [messages, setMessages] = React.useState<Msg[]>(() => [
    { role: "assistant", content: ["Ask me anything—education only.", "", complianceFooter()].join("\n") },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const cfg = getPersonaConfig(personaId);
  const ui = PERSONA_UI[personaId];

  React.useEffect(() => {
    if (!open) return;
    if (!initialPrompt) return;
    // seed the chat once per open
    setMessages([{ role: "user", content: initialPrompt }]);
    setInput("");
    setSending(true);
    void (async () => {
      try {
        const data = await chat({ personaId, messages: [{ role: "user", content: initialPrompt }] });
        setMessages([
          { role: "user", content: initialPrompt },
          { role: "assistant", content: data.reply?.trim() || "Please try again." },
        ]);
      } finally {
        setSending(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialPrompt, personaId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm p-4">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-black bg-black/70 overflow-hidden">
          <div className="p-4 border-b border-black flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-black">Talk to us (education)</p>
              <p className="text-sm font-semibold text-white">
                {ui.emoji} {cfg.displayName} — {cfg.role}
              </p>
              <p className="mt-1 text-xs text-black">{cfg.disclaimer}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-black hover:text-white hover:bg-white transition"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="p-4 max-h-[420px] overflow-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cx(
                  "whitespace-pre-wrap text-sm leading-relaxed",
                  m.role === "user"
                    ? "text-white bg-white border border-black rounded-2xl p-4"
                    : "text-white",
                )}
              >
                {m.content}
              </div>
            ))}
            {sending ? <div className="text-sm text-black">Thinking…</div> : null}
          </div>

          <div className="p-4 border-t border-black">
            <div className="flex flex-wrap gap-2">
              {PERSONA_CONFIGS.map((p) => {
                const id = p.id as PersonaId;
                const active = id === personaId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={sending}
                    className={cx(
                      "text-xs font-semibold rounded-full px-3 py-2 border transition",
                      active
                        ? "border-[#FF2D8E]/40 bg-white text-pink-300"
                        : "border-black text-black hover:bg-white hover:text-white",
                      sending ? "opacity-60" : "",
                    )}
                    // persona switching handled by parent (close/reopen for now)
                    onClick={() => {}}
                    aria-hidden
                  >
                    <span className="mr-1">{PERSONA_UI[id].emoji}</span>
                    {p.displayName}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-xl bg-black border border-black px-4 py-3 text-white placeholder:text-black focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  const q = input.trim();
                  if (!q) return;
                  void (async () => {
                    const next: Msg[] = [...messages, { role: "user", content: q }];
                    setMessages(next);
                    setInput("");
                    setSending(true);
                    try {
                      const data = await chat({ personaId, messages: next });
                      setMessages((prev) => [...prev, { role: "assistant", content: data.reply?.trim() || "Please try again." }]);
                    } finally {
                      setSending(false);
                    }
                  })();
                }}
              />
              <button
                type="button"
                disabled={sending}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-pink-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-[#FF2D8E]/25 transition disabled:opacity-60"
                onClick={() => {
                  const q = input.trim();
                  if (!q) return;
                  void (async () => {
                    const next: Msg[] = [...messages, { role: "user", content: q }];
                    setMessages(next);
                    setInput("");
                    setSending(true);
                    try {
                      const data = await chat({ personaId, messages: next });
                      setMessages((prev) => [...prev, { role: "assistant", content: data.reply?.trim() || "Please try again." }]);
                    } finally {
                      setSending(false);
                    }
                  })();
                }}
              >
                Send
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <CTA href={BOOKING_URL} variant="gradient" className="w-full">
                Book when ready (optional)
              </CTA>
              <CTA href="/contact" variant="outline" className="w-full">
                Contact us
              </CTA>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesAtlas() {
  const memory = useExperienceMemory();
  const [selected, setSelected] = useSessionState<DiscoveryOptionId | null>("hg.atlas.discovery", null);
  const option = selected ? DISCOVERY_OPTIONS.find((o) => o.id === selected) : null;

  const [activeClusters, setActiveClusters] = React.useState<ServiceAtlasClusterId[]>(
    option?.clusters ?? (ATLAS_CLUSTERS.map((c) => c.id) as ServiceAtlasClusterId[]),
  );

  React.useEffect(() => {
    if (option) setActiveClusters(option.clusters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatPersona, setChatPersona] = React.useState<PersonaId>("peppi");
  const [chatPrompt, setChatPrompt] = React.useState<string | null>(null);

  function openTalk(personaId: PersonaId, prompt: string) {
    setChatPersona(personaId);
    setChatPrompt(prompt);
    setChatOpen(true);
    memory.trackPersona(personaId);
  }

  function trackService(slug: string) {
    memory.trackService(slug);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <ChatModal
        open={chatOpen}
        onClose={() => {
          setChatOpen(false);
          setChatPrompt(null);
        }}
        personaId={chatPersona}
        initialPrompt={chatPrompt}
      />

      <div className="lg:col-span-8">
        {/* Section 1: Discovery tool */}
        <div className="rounded-2xl border border-black bg-black/40 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm text-black">Services Atlas™</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-bold text-white">
                Explore care without pressure
              </h1>
              <p className="mt-3 text-black max-w-2xl">
                What brings you here today? Choose a path and we’ll show clusters that match—education only, booking optional.
              </p>
            </div>
            <div className="flex gap-3">
              <CTA href={BOOKING_URL} variant="gradient" className="px-5 py-3 text-sm">
                Book Now (optional)
              </CTA>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {DISCOVERY_OPTIONS.map((o) => {
              const active = o.id === selected;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setSelected(o.id);
                    memory.setPreference({ stage: "learning" });
                    memory.trackTopic(`discovery:${o.id}`);
                  }}
                  className={cx(
                    "text-left rounded-2xl border bg-gradient-to-b from-black/60 to-black p-5 transition",
                    active ? "border-[#FF2D8E]/40" : "border-black hover:border-black",
                  )}
                >
                  <p className="text-sm font-semibold text-white">{o.label}</p>
                  <p className="mt-2 text-sm text-black">{o.description}</p>
                </button>
              );
            })}
          </div>

          {option ? (
            <div className="mt-6 rounded-2xl border border-black bg-white p-5">
              <p className="text-sm font-semibold text-white">Why this path exists</p>
              <p className="mt-2 text-sm text-black">{option.whyThisExists}</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-black text-white hover:bg-white transition"
                  onClick={() =>
                    openTalk(
                      option.personaHandOff,
                      `I chose: "${option.label}". Can you help me understand which cluster to start with and what questions to ask in a consult?`,
                    )
                  }
                >
                  Talk to us (chat)
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-black text-white hover:bg-white transition"
                  onClick={() => setSelected(null)}
                >
                  Clear selection
                </button>
              </div>
              <p className="mt-4 text-xs text-black">{complianceFooter()}</p>
            </div>
          ) : null}
        </div>

        {/* Section 2 + 3: Clusters + cards */}
        <div className="mt-10 space-y-10">
          {ATLAS_CLUSTERS.filter((c) => activeClusters.includes(c.id)).map((cluster) => {
            const cards = servicesForCluster(cluster.id);
            return (
              <section key={cluster.id} className="rounded-2xl border border-black bg-black/40 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs text-black">Service cluster</p>
                    <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white">{cluster.title}</h2>
                    <p className="mt-3 text-black max-w-3xl">{cluster.description}</p>
                    <p className="mt-3 text-xs text-black">
                      Browse as a category:{" "}
                      <Link className="underline" href={`/services/${cluster.id}`}>
                        /services/{cluster.id}
                      </Link>
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        openTalk(
                          cluster.personaDefault,
                          `I’m exploring the "${cluster.title}" cluster. Can you explain what this cluster is for and what a safe next step is?`,
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-black text-white hover:bg-white transition"
                    >
                      Talk to us (chat)
                    </button>
                    <CTA href={BOOKING_URL} variant="outline" className="px-6 py-3 text-sm">
                      Book when ready (optional)
                    </CTA>
                  </div>
                </div>

                {cards.length ? (
                  <div className="mt-6 grid gap-4">
                    {cards.map((c) => (
                      <ServiceCard
                        key={c.slug}
                        slug={c.slug}
                        name={c.name}
                        plainLanguage={c.plainLanguage}
                        commonlyHelpsWith={c.commonlyHelpsWith}
                        oftenFor={c.oftenFor}
                        mayNotBeFor={c.mayNotBeFor}
                        intensity={c.intensity}
                        commitment={c.commitment}
                        defaultPersona={c.defaultPersona}
                        onTalk={openTalk}
                        onViewed={trackService}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-black bg-white p-5">
                    <p className="text-sm font-semibold text-white">Nothing listed here yet.</p>
                    <p className="mt-2 text-sm text-black">
                      If you’re exploring this area, contact us and we’ll guide you to the best next step.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <CTA href="/contact" variant="outline">
                        Talk to us
                      </CTA>
                      <CTA href={BOOKING_URL} variant="gradient">
                        Book when ready (optional)
                      </CTA>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Section 4: Comparison tools */}
        <div className="mt-10">
          <ComparisonBlock />
        </div>

        {/* Section 5: Care pathways */}
        <div className="mt-10">
          <PathwaysBlock />
        </div>

        {/* Section 6: Trust message (inline for mobile too) */}
        <div className="mt-10 lg:hidden">
          <TrustMessage />
        </div>
      </div>

      <div className="lg:col-span-4">
        <TrustMessage />

        <div className="mt-6 rounded-2xl border border-black bg-black/40 p-5">
          <p className="text-sm font-semibold text-white">Want deeper education?</p>
          <p className="mt-2 text-sm text-black">
            The Care Engine adds interactive tools for clarity, timelines, and post-treatment reassurance.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <CTA href="/care-engine" variant="gradient" className="w-full">
              Open the Care Engine™
            </CTA>
            <CTA href="/your-journey" variant="outline" className="w-full">
              Start with Your Journey
            </CTA>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black bg-black/40 p-5">
          <p className="text-sm font-semibold text-white">All services (index)</p>
          <p className="mt-2 text-sm text-black">
            Prefer the full list? It’s here for clarity.
          </p>
          <div className="mt-4 space-y-2 text-sm text-black">
            {ATLAS_SERVICES.slice(0, 10).map((s) => (
              <div key={s.slug}>
                <Link className="underline" href={`/services/${s.slug}`}>
                  {s.name}
                </Link>
              </div>
            ))}
            <div className="pt-2">
              <Link className="underline" href="/services">
                View all →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

