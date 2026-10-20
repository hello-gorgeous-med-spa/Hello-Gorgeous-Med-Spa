import { NextRequest, NextResponse } from "next/server";
import { requireProviderAreaAccess } from "@/lib/api-auth";
import { attachHgClientsToSquareDayAppointments } from "@/lib/charting/attach-square-clients";
import { guessChartTemplate } from "@/lib/charting/square-visit";
import {
  listSquareBookingsForDay,
  squareBookingDisplayStatus,
} from "@/lib/square/list-bookings-for-day";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Admin dashboard: today's (or ?date=YYYY-MM-DD) Square Appointments calendar.
 * Live read from Square Bookings API — source of truth for what is scheduled.
 */
export async function GET(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  const date = req.nextUrl.searchParams.get("date") || undefined;
  const result = await listSquareBookingsForDay({ dateLabel: date });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        source: "square",
        appointments: [],
        error: result.error,
        setupPath: result.setupPath,
        calendarUrl: result.calendarUrl,
        date: result.date,
      },
      { status: result.setupPath ? 200 : 500 },
    );
  }

  const clientLinks = await attachHgClientsToSquareDayAppointments(result.appointments);

  return NextResponse.json({
    ok: true,
    source: "square",
    date: result.date,
    totalCount: result.totalCount,
    unpaidCount: result.unpaidCount,
    calendarUrl: result.calendarUrl,
    connection: result.connection,
    note: result.note,
    appointments: result.appointments.map((a) => {
      const link = clientLinks.get(a.id);
      return {
        id: a.id,
        square_booking_id: a.id,
        starts_at: a.startAt,
        status: squareBookingDisplayStatus(a.status),
        square_status: a.status,
        client_name: a.customerName,
        service_name: a.serviceName,
        price_cents: a.priceCents,
        likely_unpaid: a.likelyUnpaid,
        has_payment_today: a.hasPaymentToday,
        customer_id: a.customerId,
        customer_email: a.customerEmail,
        customer_phone: a.customerPhone,
        duration_minutes: a.durationMinutes,
        team_member_id: a.teamMemberId,
        client_id: link?.client_id ?? null,
        chart_template: guessChartTemplate(a.serviceName),
      };
    }),
  });
}
