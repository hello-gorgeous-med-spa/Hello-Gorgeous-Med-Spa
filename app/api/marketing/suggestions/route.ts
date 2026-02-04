// ============================================================
// AI MARKETING SUGGESTIONS API
// Generate personalized campaign recommendations
// ============================================================

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function GET() {
  const supabase = getSupabase();
  const suggestions: any[] = [];
  const insights: any[] = [];
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  if (!supabase) {
    // Return demo suggestions
    return NextResponse.json({
      suggestions: [
        {
          id: 'demo-1',
          type: 'win_back',
          title: 'Win Back Inactive Clients',
          description: 'Clients who haven\'t visited in 60+ days might need a reminder',
          audience: 'inactive clients',
          audienceCount: 45,
          suggestedMessage: 'Hi {first_name}! We miss you at Hello Gorgeous! ✨\n\nIt\'s been a while since your last visit. Come back and enjoy 15% off your next treatment.\n\nBook now: {booking_link}',
          channel: 'both',
          priority: 'high',
          potentialRevenue: 4500,
        },
        {
          id: 'demo-2',
          type: 'birthday',
          title: 'Birthday Wishes',
          description: 'Celebrate clients with upcoming birthdays',
          audience: 'clients with birthdays this month',
          audienceCount: 12,
          suggestedMessage: 'Happy Birthday {first_name}! 🎂\n\nCelebrate with a special gift from us - $25 off any treatment this month!\n\nBook your birthday treat: {booking_link}',
          channel: 'email',
          priority: 'medium',
          potentialRevenue: 1200,
        },
      ],
      insights: [
        { id: '1', icon: '📧', title: 'Email Open Rate', value: '32%', trend: 'up', trendValue: '+5% this month' },
        { id: '2', icon: '💬', title: 'SMS Response', value: '18%', trend: 'up', trendValue: '+2% this month' },
        { id: '3', icon: '🔄', title: 'Rebook Rate', value: '68%', trend: 'neutral', trendValue: 'Steady' },
        { id: '4', icon: '💰', title: 'Campaign Revenue', value: '$3.2K', trend: 'up', trendValue: '+12% this month' },
      ],
    });
  }

  try {
    // 1. Find inactive clients (no appointment in 60+ days)
    const { data: allClients } = await supabase
      .from('clients')
      .select('id, user_id, last_visit_at, lifetime_value_cents');

    const { data: recentAppointments } = await supabase
      .from('appointments')
      .select('client_id')
      .gte('starts_at', sixtyDaysAgo.toISOString())
      .not('status', 'in', '("cancelled","no_show")');

    const recentClientIds = new Set((recentAppointments || []).map((a: any) => a.client_id));
    const inactiveClients = (allClients || []).filter((c: any) => 
      !recentClientIds.has(c.id) && c.last_visit_at
    );

    if (inactiveClients.length > 5) {
      const avgValue = inactiveClients.reduce((sum: number, c: any) => sum + (c.lifetime_value_cents || 0), 0) / inactiveClients.length / 100;
      suggestions.push({
        id: 'winback-1',
        type: 'win_back',
        title: 'Win Back Inactive Clients',
        description: `${inactiveClients.length} clients haven't visited in 60+ days. A friendly reminder could bring them back!`,
        audience: 'inactive clients',
        audienceCount: inactiveClients.length,
        suggestedMessage: `Hi {first_name}! We miss seeing you at Hello Gorgeous! ✨\n\nIt's been a while since your last visit, and we'd love to welcome you back.\n\nAs a special thank you for being part of our family, enjoy 15% off your next treatment.\n\nBook now: {booking_link}\n\nSee you soon!\n- The Hello Gorgeous Team`,
        channel: 'both',
        priority: 'high',
        potentialRevenue: Math.round(inactiveClients.length * avgValue * 0.3), // 30% conversion estimate
      });
    }

    // 2. Find clients due for rebooking (regular visitors who are past their typical interval)
    const { data: frequentVisitors } = await supabase
      .from('clients')
      .select('id, visit_count')
      .gte('visit_count', 3);

    const frequentIds = new Set((frequentVisitors || []).map((c: any) => c.id));
    const dueForRebooking = (allClients || []).filter((c: any) => {
      if (!frequentIds.has(c.id)) return false;
      const lastVisit = c.last_visit_at ? new Date(c.last_visit_at) : null;
      if (!lastVisit) return false;
      const daysSinceVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceVisit >= 28 && daysSinceVisit < 60; // 4-8 weeks ago
    });

    if (dueForRebooking.length > 3) {
      suggestions.push({
        id: 'rebook-1',
        type: 'rebooking',
        title: 'Time to Rebook Reminder',
        description: `${dueForRebooking.length} regular clients are due for their next appointment`,
        audience: 'regular clients due for rebooking',
        audienceCount: dueForRebooking.length,
        suggestedMessage: `Hi {first_name}! 📅\n\nIt's been about a month since your last visit - the perfect time to schedule your next treatment!\n\nKeep your results looking fresh. Book your next appointment today:\n{booking_link}\n\nWe can't wait to see you!`,
        channel: 'sms',
        priority: 'medium',
        potentialRevenue: Math.round(dueForRebooking.length * 150 * 0.4), // $150 avg, 40% conversion
      });
    }

    // 3. Birthday campaign - find clients with birthdays this month
    const currentMonth = now.getMonth() + 1;
    const { data: birthdayClients } = await supabase
      .from('clients')
      .select('id, date_of_birth')
      .not('date_of_birth', 'is', null);

    const thisMonthBirthdays = (birthdayClients || []).filter((c: any) => {
      const dob = new Date(c.date_of_birth);
      return dob.getMonth() + 1 === currentMonth;
    });

    if (thisMonthBirthdays.length > 0) {
      suggestions.push({
        id: 'birthday-1',
        type: 'birthday',
        title: 'Birthday Celebrations',
        description: `${thisMonthBirthdays.length} clients have birthdays this month!`,
        audience: 'clients with birthdays this month',
        audienceCount: thisMonthBirthdays.length,
        suggestedMessage: `Happy Birthday {first_name}! 🎂🎉\n\nWe're celebrating YOU this month with a special birthday gift!\n\nEnjoy $25 OFF any treatment during your birthday month.\n\nBook your birthday treat: {booking_link}\n\nWishing you a gorgeous year ahead!\n💗 Hello Gorgeous`,
        channel: 'email',
        priority: 'medium',
        potentialRevenue: Math.round(thisMonthBirthdays.length * 175 * 0.5),
      });
    }

    // 4. New client follow-up
    const { data: newClients } = await supabase
      .from('clients')
      .select('id')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .lte('visit_count', 1);

    if ((newClients?.length || 0) > 3) {
      suggestions.push({
        id: 'newclient-1',
        type: 'new_service',
        title: 'New Client Follow-up',
        description: 'Welcome new clients and encourage a second visit',
        audience: 'new clients with only 1 visit',
        audienceCount: newClients?.length || 0,
        suggestedMessage: `Hi {first_name}! 💗\n\nThank you for choosing Hello Gorgeous for your recent visit! We hope you loved your experience.\n\nWe'd love to see you again! Book your next appointment and try one of our other popular treatments.\n\nBook now: {booking_link}\n\nSee you soon!`,
        channel: 'email',
        priority: 'low',
        potentialRevenue: Math.round((newClients?.length || 0) * 125 * 0.35),
      });
    }

    // Generate insights
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    const { count: activeClients } = await supabase
      .from('appointments')
      .select('client_id', { count: 'exact', head: true })
      .gte('starts_at', thirtyDaysAgo.toISOString())
      .not('status', 'in', '("cancelled","no_show")');

    const engagementRate = totalClients ? Math.round((activeClients || 0) / totalClients * 100) : 0;

    insights.push(
      { id: '1', icon: '👥', title: 'Total Clients', value: (totalClients || 0).toLocaleString(), trend: 'neutral', trendValue: '' },
      { id: '2', icon: '🔄', title: 'Active (30 days)', value: `${engagementRate}%`, trend: engagementRate > 30 ? 'up' : 'down', trendValue: '' },
      { id: '3', icon: '😴', title: 'Inactive', value: inactiveClients.length.toString(), trend: 'neutral', trendValue: '60+ days' },
      { id: '4', icon: '🎂', title: 'Birthdays', value: thisMonthBirthdays.length.toString(), trend: 'neutral', trendValue: 'this month' },
    );

    return NextResponse.json({
      suggestions: suggestions.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      }),
      insights,
    });

  } catch (error) {
    console.error('Marketing suggestions error:', error);
    return NextResponse.json({
      suggestions: [],
      insights: [],
    });
  }
}
