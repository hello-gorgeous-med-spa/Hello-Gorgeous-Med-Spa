import { NextRequest, NextResponse } from "next/server";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { listSquareBookingsForDay } from "@/lib/square/list-bookings-for-day";

/**
 * Hub: today's Square appointments with a best-effort unpaid flag
 * (no completed payment for that customer today, and service price > $0).
 */
export async function GET(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const result = await listSquareBookingsForDay();

  if (!result.ok) {
    return NextResponse.json(
      {
        appointments: [],
        error: result.error,
        setupPath: result.setupPath,
        calendarUrl: result.calendarUrl,
      },
      { status: result.setupPath ? 200 : 500 },
    );
  }

  return NextResponse.json({
    date: result.date,
    appointments: result.appointments.map((a) => ({
      id: a.id,
      status: a.status,
      startAt: a.startAt,
      customerId: a.customerId,
      customerName: a.customerName,
      serviceName: a.serviceName,
      priceCents: a.priceCents,
      likelyUnpaid: a.likelyUnpaid,
      hasPaymentToday: a.hasPaymentToday,
      locationId: a.locationId,
    })),
    unpaidCount: result.unpaidCount,
    totalCount: result.totalCount,
    calendarUrl: result.calendarUrl,
    checkoutHint: result.checkoutHint,
    connection: result.connection,
    note: result.note,
  });
}
