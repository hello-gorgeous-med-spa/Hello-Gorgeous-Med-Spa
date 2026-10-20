"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  chicagoTimeLabel,
  formatSquarePrice,
  guessChartTemplate,
  squarePaymentLabel,
  type ChartTemplateGuess,
} from "@/lib/charting/square-visit";

export type SquareChartVisit = {
  id: string;
  square_booking_id?: string;
  starts_at?: string | null;
  status?: string;
  client_name?: string;
  service_name?: string;
  price_cents?: number;
  likely_unpaid?: boolean;
  has_payment_today?: boolean;
  customer_id?: string | null;
  client_id?: string | null;
  chart_template?: ChartTemplateGuess;
};

type Props = {
  /** admin = template notes; soap = appointment-optional SOAP hub */
  hub?: "admin" | "soap";
};

function chicagoTodayLabel() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function shiftChicagoDate(label: string, days: number) {
  const [y, m, d] = label.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days, 12));
  return next.toISOString().slice(0, 10);
}

function chartNoteHref(visit: SquareChartVisit, hub: "admin" | "soap") {
  const bookingId = visit.square_booking_id || visit.id;
  const template = visit.chart_template || guessChartTemplate(visit.service_name || "");
  const params = new URLSearchParams();
  params.set("appointment_id", bookingId);
  if (visit.client_id) params.set("client_id", visit.client_id);
  if (visit.service_name) params.set("square_service", visit.service_name);
  if (visit.starts_at) params.set("square_starts_at", visit.starts_at);
  params.set("square_paid", visit.has_payment_today ? "1" : "0");
  if (typeof visit.price_cents === "number") {
    params.set("square_price", String(visit.price_cents));
  }
  if (visit.client_name) params.set("square_client", visit.client_name);
  if (visit.likely_unpaid) params.set("square_unpaid", "1");

  if (hub === "soap" || !visit.client_id) {
    params.set("new", "1");
    if (visit.client_name) params.set("client_search", visit.client_name);
    return `/charting?${params.toString()}`;
  }

  params.set("template", template);
  return `/admin/charting/new?${params.toString()}`;
}

export default function SquareTodayForCharting({ hub = "admin" }: Props) {
  const [date, setDate] = useState(chicagoTodayLabel);
  const [visits, setVisits] = useState<SquareChartVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);

  const load = useCallback(async (day: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/square/appointments?date=${encodeURIComponent(day)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        setVisits([]);
        setError(data.error || "Could not load Square appointments.");
        setCalendarUrl(data.calendarUrl || null);
        return;
      }
      setVisits(data.appointments || []);
      setCalendarUrl(data.calendarUrl || null);
    } catch {
      setVisits([]);
      setError("Could not load Square appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(date);
  }, [date, load]);

  const nowMs = Date.now();
  const nextUp = useMemo(() => {
    return visits.find((v) => {
      const start = v.starts_at ? new Date(v.starts_at).getTime() : 0;
      return start >= nowMs - 30 * 60_000;
    });
  }, [visits, nowMs]);

  return (
    <section className="bg-white rounded-xl border-2 border-black overflow-hidden">
      <div className="px-4 py-3 border-b border-black flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black">Today on Square</h2>
          <p className="text-sm text-black">
            Live book — tap Chart to open the note for that visit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDate((d) => shiftChicagoDate(d, -1))}
            className="px-2 py-1 border border-black rounded-lg text-sm text-black hover:bg-gray-50"
          >
            ←
          </button>
          <span className="text-sm font-medium text-black min-w-[7.5rem] text-center">{date}</span>
          <button
            type="button"
            onClick={() => setDate((d) => shiftChicagoDate(d, 1))}
            className="px-2 py-1 border border-black rounded-lg text-sm text-black hover:bg-gray-50"
          >
            →
          </button>
          {date !== chicagoTodayLabel() && (
            <button
              type="button"
              onClick={() => setDate(chicagoTodayLabel())}
              className="px-2 py-1 text-sm text-[#2D63A4] font-medium"
            >
              Today
            </button>
          )}
          <button
            type="button"
            onClick={() => load(date)}
            className="px-2 py-1 text-sm text-black hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-black">Loading Square…</div>
      ) : error ? (
        <div className="p-4 text-sm text-black space-y-2">
          <p>
            {error === "Authentication required"
              ? "Sign in as staff to load today’s Square book."
              : error}
          </p>
          <div className="flex flex-wrap gap-3">
            {error === "Authentication required" && (
              <Link href="/login?returnTo=/admin/charting" className="text-[#2D63A4] font-medium">
                Staff sign in →
              </Link>
            )}
            {calendarUrl && (
              <a href={calendarUrl} target="_blank" rel="noreferrer" className="text-[#2D63A4] font-medium">
                Open Square Appointments →
              </a>
            )}
          </div>
        </div>
      ) : visits.length === 0 ? (
        <div className="p-6 text-sm text-black">No Square appointments on this day.</div>
      ) : (
        <ul className="divide-y divide-black">
          {visits.map((visit) => {
            const pay = squarePaymentLabel(visit);
            const price = formatSquarePrice(visit.price_cents);
            const isNext = nextUp?.id === visit.id;
            const href = chartNoteHref(visit, hub);
            return (
              <li
                key={visit.id}
                className={`px-4 py-3 flex flex-wrap items-center gap-3 ${
                  isNext ? "bg-pink-50" : "bg-white"
                }`}
              >
                <div className="w-16 shrink-0 font-semibold text-black">
                  {chicagoTimeLabel(visit.starts_at)}
                </div>
                <div className="flex-1 min-w-[12rem]">
                  <div className="font-medium text-black">{visit.client_name || "Guest"}</div>
                  <div className="text-sm text-black">
                    {visit.service_name || "Service"}
                    {price ? ` · ${price}` : ""}
                  </div>
                  <div className="text-xs text-black mt-0.5">
                    {pay}
                    {visit.client_id ? " · Chart linked" : " · Match client when you chart"}
                    {isNext ? " · Up next" : ""}
                  </div>
                </div>
                <Link
                  href={href}
                  className="px-3 py-1.5 bg-[#FF2D8E] text-white text-sm font-medium rounded-lg hover:bg-black"
                >
                  Chart
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
