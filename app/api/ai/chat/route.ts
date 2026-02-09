// ============================================================
import { createClient } from '@supabase/supabase-js';
// AI CHAT API - Natural Language Business Intelligence
// Processes questions and returns insights with visualizations
// Logs to AI Watchdog for audit/compliance
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// Query patterns and their handlers
interface QueryHandler {
  patterns: RegExp[];
  handler: (supabase: any, match: RegExpMatchArray | null) => Promise<{ response: string; chart?: any }>;
}

const QUERY_HANDLERS: QueryHandler[] = [
  // Today's appointments
  {
    patterns: [
      /how many (appointments?|bookings?) (do i have |are there )?today/i,
      /today'?s? (appointments?|bookings?|schedule)/i,
      /what'?s? (on )?my schedule today/i,
    ],
    handler: async (supabase) => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

      const { data: appointments, count } = await supabase
        .from('appointments')
        .select('*, clients(id), user_profiles!appointments_client_id_fkey(first_name, last_name)', { count: 'exact' })
        .gte('starts_at', todayStart)
        .lt('starts_at', todayEnd)
        .not('status', 'eq', 'cancelled')
        .order('starts_at');

      const confirmed = appointments?.filter((a: any) => a.status === 'confirmed').length || 0;
      const completed = appointments?.filter((a: any) => a.status === 'completed').length || 0;
      const pending = appointments?.filter((a: any) => a.status === 'pending').length || 0;

      return {
        response: `You have **${count || 0} appointments** scheduled for today:\n\n• ${confirmed} confirmed\n• ${completed} completed\n• ${pending} pending`,
        chart: {
          type: 'metric',
          title: "Today's Appointments",
          data: {
            value: count || 0,
            subtitle: `${confirmed} confirmed, ${completed} completed`,
          },
        },
      };
    },
  },

  // Revenue queries
  {
    patterns: [
      /revenue (this |today|this )?week/i,
      /this week'?s? (revenue|sales|earnings)/i,
      /how much (did i|have i) (make|earn|sell) this week/i,
      /what'?s? my revenue this week/i,
    ],
    handler: async (supabase) => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { data: sales } = await supabase
        .from('sales')
        .select('net_total, created_at')
        .gte('created_at', weekStart.toISOString())
        .eq('status', 'completed');

      const totalRevenue = (sales || []).reduce((sum: number, s: any) => sum + (s.net_total || 0), 0) / 100;

      // Group by day
      const dailyRevenue: Record<string, number> = {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      days.forEach(d => dailyRevenue[d] = 0);

      (sales || []).forEach((s: any) => {
        const day = days[new Date(s.created_at).getDay()];
        dailyRevenue[day] += (s.net_total || 0) / 100;
      });

      return {
        response: `Your revenue this week is **$${totalRevenue.toLocaleString()}** from ${sales?.length || 0} transactions.`,
        chart: {
          type: 'bar',
          title: 'Revenue by Day (This Week)',
          data: Object.entries(dailyRevenue).map(([label, value]) => ({ label, value: Math.round(value) })),
        },
      };
    },
  },

  // New vs returning clients
  {
    patterns: [
      /new vs\.? returning (clients?|customers?)/i,
      /returning (clients?|customers?)/i,
      /client (retention|breakdown)/i,
    ],
    handler: async (supabase) => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Get appointments this month
      const { data: appointments } = await supabase
        .from('appointments')
        .select('client_id, clients(created_at)')
        .gte('starts_at', monthStart)
        .not('status', 'in', '("cancelled","no_show")');

      const uniqueClients = new Set<string>();
      let newClients = 0;
      let returningClients = 0;

      (appointments || []).forEach((a: any) => {
        if (a.client_id && !uniqueClients.has(a.client_id)) {
          uniqueClients.add(a.client_id);
          const clientCreated = a.clients?.created_at ? new Date(a.clients.created_at) : null;
          if (clientCreated && clientCreated >= new Date(monthStart)) {
            newClients++;
          } else {
            returningClients++;
          }
        }
      });

      const total = newClients + returningClients;
      const newPct = total > 0 ? Math.round((newClients / total) * 100) : 0;
      const retPct = total > 0 ? Math.round((returningClients / total) * 100) : 0;

      return {
        response: `This month, **${newPct}% are new clients** and **${retPct}% are returning clients**.\n\n• ${newClients} new clients\n• ${returningClients} returning clients`,
        chart: {
          type: 'bar',
          title: 'New vs Returning Clients (This Month)',
          data: [
            { label: 'New', value: newClients },
            { label: 'Returning', value: returningClients },
          ],
        },
      };
    },
  },

  // Top clients
  {
    patterns: [
      /top (\d+)? ?(clients?|customers?) (by )?(spend|revenue|value)/i,
      /who are my (best|top|biggest) (clients?|customers?)/i,
      /highest spending (clients?|customers?)/i,
    ],
    handler: async (supabase, match) => {
      const limit = match?.[1] ? parseInt(match[1]) : 5;

      const { data: clients } = await supabase
        .from('clients')
        .select('id, lifetime_value_cents, user_profiles(first_name, last_name)')
        .order('lifetime_value_cents', { ascending: false })
        .limit(limit);

      const topClients = (clients || []).map((c: any, i: number) => ({
        rank: i + 1,
        name: c.user_profiles ? `${c.user_profiles.first_name} ${c.user_profiles.last_name}` : 'Unknown',
        spent: `$${((c.lifetime_value_cents || 0) / 100).toLocaleString()}`,
      }));

      return {
        response: `Here are your top ${limit} clients by total spend:`,
        chart: {
          type: 'table',
          title: `Top ${limit} Clients by Spend`,
          labels: ['#', 'Client', 'Total Spent'],
          data: topClients.map((c: any) => ({ rank: c.rank, name: c.name, spent: c.spent })),
        },
      };
    },
  },

  // Busiest day
  {
    patterns: [
      /busiest day/i,
      /what day (is|are) (my )?busiest/i,
      /when (am i|are we) (most )?busy/i,
    ],
    handler: async (supabase) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: appointments } = await supabase
        .from('appointments')
        .select('starts_at')
        .gte('starts_at', thirtyDaysAgo)
        .not('status', 'in', '("cancelled","no_show")');

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayCounts: Record<string, number> = {};
      days.forEach(d => dayCounts[d] = 0);

      (appointments || []).forEach((a: any) => {
        const day = days[new Date(a.starts_at).getDay()];
        dayCounts[day]++;
      });

      const sorted = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
      const busiest = sorted[0];

      return {
        response: `**${busiest[0]}** is your busiest day with an average of ${Math.round(busiest[1] / 4)} appointments per week (based on the last 30 days).`,
        chart: {
          type: 'bar',
          title: 'Appointments by Day of Week (Last 30 Days)',
          data: sorted.map(([label, value]) => ({ label: label.slice(0, 3), value })),
        },
      };
    },
  },

  // Popular services
  {
    patterns: [
      /(popular|top|best.?selling) services?/i,
      /what services? (are|is) (most )?(popular|booked)/i,
      /which services? (sell|book) (the )?(most|best)/i,
    ],
    handler: async (supabase) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: appointments } = await supabase
        .from('appointments')
        .select('service_id, services(name)')
        .gte('starts_at', thirtyDaysAgo)
        .not('status', 'in', '("cancelled","no_show")');

      const serviceCounts: Record<string, { name: string; count: number }> = {};

      (appointments || []).forEach((a: any) => {
        const serviceName = a.services?.name || 'Unknown';
        if (!serviceCounts[serviceName]) {
          serviceCounts[serviceName] = { name: serviceName, count: 0 };
        }
        serviceCounts[serviceName].count++;
      });

      const sorted = Object.values(serviceCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      return {
        response: `Your most popular services (last 30 days):`,
        chart: {
          type: 'bar',
          title: 'Top Services by Bookings',
          data: sorted.map(s => ({ label: s.name, value: s.count })),
        },
      };
    },
  },

  // No-show rate
  {
    patterns: [
      /no.?show (rate|percentage|%)/i,
      /how many no.?shows/i,
      /cancellation rate/i,
    ],
    handler: async (supabase) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: appointments } = await supabase
        .from('appointments')
        .select('status')
        .gte('starts_at', thirtyDaysAgo);

      const total = appointments?.length || 0;
      const noShows = appointments?.filter((a: any) => a.status === 'no_show').length || 0;
      const cancelled = appointments?.filter((a: any) => a.status === 'cancelled').length || 0;
      const completed = appointments?.filter((a: any) => a.status === 'completed').length || 0;

      const noShowRate = total > 0 ? Math.round((noShows / total) * 100) : 0;
      const cancelRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

      return {
        response: `In the last 30 days:\n\n• **No-show rate:** ${noShowRate}% (${noShows} of ${total})\n• **Cancellation rate:** ${cancelRate}% (${cancelled} of ${total})\n• **Completed:** ${completed} appointments`,
        chart: {
          type: 'bar',
          title: 'Appointment Outcomes (Last 30 Days)',
          data: [
            { label: 'Completed', value: completed },
            { label: 'Cancelled', value: cancelled },
            { label: 'No-show', value: noShows },
          ],
        },
      };
    },
  },

  // Month comparison
  {
    patterns: [
      /compare (this month|january|february|march|april|may|june|july|august|september|october|november|december) (to|vs\.?|with) (last month|january|february|march|april|may|june|july|august|september|october|november|december)/i,
      /this month vs\.? last month/i,
      /month over month/i,
    ],
    handler: async (supabase) => {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

      // This month's sales
      const { data: thisMonthSales } = await supabase
        .from('sales')
        .select('net_total')
        .gte('created_at', thisMonthStart)
        .eq('status', 'completed');

      // Last month's sales
      const { data: lastMonthSales } = await supabase
        .from('sales')
        .select('net_total')
        .gte('created_at', lastMonthStart)
        .lte('created_at', lastMonthEnd)
        .eq('status', 'completed');

      const thisMonthTotal = (thisMonthSales || []).reduce((sum: number, s: any) => sum + (s.net_total || 0), 0) / 100;
      const lastMonthTotal = (lastMonthSales || []).reduce((sum: number, s: any) => sum + (s.net_total || 0), 0) / 100;

      const change = lastMonthTotal > 0 ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : 0;
      const direction = change >= 0 ? 'up' : 'down';

      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const thisMonthName = months[now.getMonth()];
      const lastMonthName = months[now.getMonth() - 1] || 'December';

      return {
        response: `**${thisMonthName}:** $${thisMonthTotal.toLocaleString()}\n**${lastMonthName}:** $${lastMonthTotal.toLocaleString()}\n\nRevenue is **${direction} ${Math.abs(change)}%** compared to last month.`,
        chart: {
          type: 'bar',
          title: 'Month-over-Month Revenue',
          data: [
            { label: lastMonthName, value: Math.round(lastMonthTotal) },
            { label: thisMonthName, value: Math.round(thisMonthTotal) },
          ],
        },
      };
    },
  },
];

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({
      response: "I'm unable to connect to the database right now. Please check your configuration.",
    });
  }

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({
        response: "Please ask me a question about your business!",
      });
    }

    let result: { response: string; chart?: any };
    let matched = false;

    for (const handler of QUERY_HANDLERS) {
      for (const pattern of handler.patterns) {
        const match = message.match(pattern);
        if (match) {
          result = await handler.handler(supabase, match);
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      result = {
        response: `I'm not sure how to answer that yet. Try asking me about:\n\n• Today's appointments\n• This week's revenue\n• New vs returning clients\n• Top clients by spend\n• Busiest day of the week\n• Popular services\n• No-show rate\n• Month-over-month comparison`,
      };
    }

    // Audit: log to AI Watchdog (in-house compliance)
    if (isAdminConfigured() && result) {
      const admin = createAdminSupabaseClient();
      if (admin) {
        const responseText = typeof result.response === 'string' ? result.response : JSON.stringify(result.response);
        await admin.from('ai_watchdog_logs').insert({
          source: 'ai_chat',
          channel: 'web',
          request_summary: message.slice(0, 200),
          response_summary: responseText.slice(0, 150),
          full_response_preview: responseText.slice(0, 500),
          flagged: false,
        }).then(() => {}).catch((err) => console.error('Watchdog log error:', err));
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json({
      response: "Sorry, I encountered an error processing your question. Please try again.",
    });
  }
}
