'use client';

// ============================================================
// SUPABASE DATA HOOKS
// React hooks for fetching live data from Supabase
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './client';
import type { 
  Client, 
  Appointment, 
  Service, 
  Staff, 
  Transaction,
  AppointmentWithRelations,
  ClientWithStats 
} from './types';

// ============================================================
// DASHBOARD STATS HOOK
// ============================================================

interface DashboardStats {
  todaysAppointments: number;
  completed: number;
  revenue: number;
  newClients: number;
  weeklyRevenue: number;
  avgTicket: number;
  pendingCharts: number;
  expiringConsents: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    todaysAppointments: 0,
    completed: 0,
    revenue: 0,
    newClients: 0,
    weeklyRevenue: 0,
    avgTicket: 0,
    pendingCharts: 0,
    expiringConsents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!isSupabaseConfigured()) {
        // Return mock data if Supabase not configured
        setStats({
          todaysAppointments: 12,
          completed: 4,
          revenue: 2450,
          newClients: 2,
          weeklyRevenue: 18750,
          avgTicket: 276,
          pendingCharts: 3,
          expiringConsents: 2,
        });
        setLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Get today's appointments
        const { data: todaysAppts, error: apptError } = await supabase
          .from('appointments')
          .select('*')
          .gte('starts_at', `${today}T00:00:00`)
          .lt('starts_at', `${today}T23:59:59`);

        if (apptError) throw apptError;

        // Get today's transactions
        const { data: todaysTx, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .gte('created_at', `${today}T00:00:00`)
          .lt('created_at', `${today}T23:59:59`)
          .eq('status', 'completed');

        if (txError) throw txError;

        // Get weekly transactions
        const { data: weeklyTx, error: weeklyError } = await supabase
          .from('transactions')
          .select('*')
          .gte('created_at', weekAgo)
          .eq('status', 'completed');

        if (weeklyError) throw weeklyError;

        // Get new clients today
        const { data: newClients, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .gte('created_at', `${today}T00:00:00`);

        if (clientError) throw clientError;

        // Calculate stats
        const completed = todaysAppts?.filter(a => a.status === 'completed').length || 0;
        const todaysRevenue = todaysTx?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;
        const weekRevenue = weeklyTx?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0;
        const avgTicket = weeklyTx?.length ? Math.round(weekRevenue / weeklyTx.length) : 0;

        setStats({
          todaysAppointments: todaysAppts?.length || 0,
          completed,
          revenue: todaysRevenue,
          newClients: newClients?.length || 0,
          weeklyRevenue: weekRevenue,
          avgTicket,
          pendingCharts: 3, // TODO: Calculate from clinical_notes
          expiringConsents: 2, // TODO: Calculate from consents
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

// ============================================================
// APPOINTMENTS HOOKS
// ============================================================

export function useAppointments(date?: string, providerId?: string) {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Mock data
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('appointments')
        .select(`
          *,
          client:clients(*),
          provider:providers(*),
          service:services(*)
        `)
        .order('starts_at', { ascending: true });

      if (date) {
        query = query
          .gte('starts_at', `${date}T00:00:00`)
          .lt('starts_at', `${date}T23:59:59`);
      }

      if (providerId) {
        query = query.eq('provider_id', providerId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, [date, providerId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetch: fetchAppointments };
}

export function useTodaysAppointments() {
  const today = new Date().toISOString().split('T')[0];
  return useAppointments(today);
}

// ============================================================
// CLIENTS HOOKS
// ============================================================

export function useClients(searchQuery?: string, limit = 50) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchClients = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setClients([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Clients table joins with users table for name/email/phone
      let query = supabase
        .from('clients')
        .select(`
          *,
          users!inner(id, first_name, last_name, email, phone)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(limit);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;
      
      // Flatten the data to include user info at top level
      const flattenedClients = (data || []).map((client: any) => ({
        ...client,
        first_name: client.users?.first_name,
        last_name: client.users?.last_name,
        email: client.users?.email,
        phone: client.users?.phone,
      }));

      // Filter by search query if provided (client-side for now)
      let filteredClients = flattenedClients;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredClients = flattenedClients.filter((c: any) => 
          c.first_name?.toLowerCase().includes(query) ||
          c.last_name?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.phone?.includes(query)
        );
      }

      setClients(filteredClients);
      setTotal(count || 0);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, limit]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, total, refetch: fetchClients };
}

export function useClient(id: string) {
  const [client, setClient] = useState<ClientWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClient() {
      if (!isSupabaseConfigured() || !id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setClient(data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch client');
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [id]);

  return { client, loading, error };
}

// ============================================================
// SERVICES HOOKS
// ============================================================

export function useServices(categoryId?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      if (!isSupabaseConfigured()) {
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [categoryId]);

  return { services, loading, error };
}

// ============================================================
// STAFF/PROVIDERS HOOKS
// ============================================================

export function useProviders() {
  const [providers, setProviders] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      if (!isSupabaseConfigured()) {
        // Return default providers
        setProviders([
          {
            id: 'p1',
            user_id: null,
            first_name: 'Ryan',
            last_name: 'Kent',
            email: 'ryan@hellogorgeousmedspa.com',
            phone: null,
            role: 'provider',
            title: 'APRN, FNP-BC',
            bio: null,
            avatar_url: null,
            is_provider: true,
            license_number: null,
            license_expiration: null,
            service_ids: null,
            location_ids: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'p2',
            user_id: null,
            first_name: 'Danielle',
            last_name: 'Glazier-Alcala',
            email: 'danielle@hellogorgeousmedspa.com',
            phone: null,
            role: 'owner',
            title: 'Owner, NP',
            bio: null,
            avatar_url: null,
            is_provider: true,
            license_number: null,
            license_expiration: null,
            service_ids: null,
            location_ids: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setLoading(false);
        return;
      }

      try {
        // Try to fetch from providers table with user info
        const { data: providerData, error: providerError } = await supabase
          .from('providers')
          .select(`
            id,
            user_id,
            credentials,
            is_active,
            users!inner(first_name, last_name, email, phone, role)
          `)
          .eq('is_active', true);

        if (!providerError && providerData && providerData.length > 0) {
          // Map provider data to Staff format
          const mappedProviders: Staff[] = providerData.map((p: any) => ({
            id: p.id,
            user_id: p.user_id,
            first_name: p.users.first_name,
            last_name: p.users.last_name,
            email: p.users.email,
            phone: p.users.phone,
            role: p.users.role || 'provider',
            title: p.credentials || '',
            bio: null,
            avatar_url: null,
            is_provider: true,
            license_number: null,
            license_expiration: null,
            service_ids: null,
            location_ids: null,
            is_active: p.is_active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));
          setProviders(mappedProviders);
          setLoading(false);
          return;
        }

        // If providers query fails, use defaults
        console.log('No providers found in database, using defaults');
        setProviders([
          {
            id: 'default-1',
            user_id: null,
            first_name: 'Ryan',
            last_name: 'Kent',
            email: 'ryan@hellogorgeousmedspa.com',
            phone: null,
            role: 'provider',
            title: 'APRN, FNP-BC',
            bio: null,
            avatar_url: null,
            is_provider: true,
            license_number: null,
            license_expiration: null,
            service_ids: null,
            location_ids: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'default-2',
            user_id: null,
            first_name: 'Danielle',
            last_name: 'Glazier-Alcala',
            email: 'danielle@hellogorgeousmedspa.com',
            phone: null,
            role: 'owner',
            title: 'Owner, NP',
            bio: null,
            avatar_url: null,
            is_provider: true,
            license_number: null,
            license_expiration: null,
            service_ids: null,
            location_ids: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch providers');
        // Use defaults on error
        setProviders([
          {
            id: 'default-1',
            user_id: null,
            first_name: 'Ryan',
            last_name: 'Kent',
            email: 'ryan@hellogorgeousmedspa.com',
            phone: null,
            role: 'provider',
            title: 'APRN, FNP-BC',
            bio: null,
            avatar_url: null,
            is_provider: true,
            license_number: null,
            license_expiration: null,
            service_ids: null,
            location_ids: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 'default-2',
            user_id: null,
            first_name: 'Danielle',
            last_name: 'Glazier-Alcala',
            email: 'danielle@hellogorgeousmedspa.com',
            phone: null,
            role: 'owner',
            title: 'Owner, NP',
            bio: null,
            avatar_url: null,
            is_provider: true,
            license_number: null,
            license_expiration: null,
            service_ids: null,
            location_ids: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  return { providers, loading, error };
}

// ============================================================
// TRANSACTIONS HOOKS
// ============================================================

export function useRecentPayments(limit = 10) {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      if (!isSupabaseConfigured()) {
        setPayments([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('transactions')
          .select(`
            *,
            client:clients(
              id,
              user_id,
              users(first_name, last_name)
            )
          `)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;
        setPayments(data || []);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [limit]);

  return { payments, loading, error };
}

// ============================================================
// SERVICES HOOKS
// ============================================================

export function useServicesWithStats() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    if (!isSupabaseConfigured()) {
      setServices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('services')
        .select(`
          *,
          category:service_categories(id, name)
        `)
        .order('name');

      if (fetchError) throw fetchError;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, refetch: fetchServices };
}

// ============================================================
// INVENTORY HOOKS
// ============================================================

export function useInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      if (!isSupabaseConfigured()) {
        // Return mock data
        setInventory([
          { id: '1', name: 'Botox', brand: 'Allergan', category: 'neurotoxin', currentStock: 450, reorderPoint: 100, price: 12, cost: 8 },
          { id: '2', name: 'Dysport', brand: 'Galderma', category: 'neurotoxin', currentStock: 200, reorderPoint: 50, price: 4, cost: 2.5 },
          { id: '3', name: 'Juvederm Ultra', brand: 'Allergan', category: 'filler', currentStock: 25, reorderPoint: 10, price: 450, cost: 280 },
          { id: '4', name: 'Restylane', brand: 'Galderma', category: 'filler', currentStock: 18, reorderPoint: 10, price: 425, cost: 260 },
          { id: '5', name: 'Sculptra', brand: 'Galderma', category: 'biostimulator', currentStock: 8, reorderPoint: 5, price: 850, cost: 500 },
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('inventory_items')
          .select(`
            *,
            lots:inventory_lots(*)
          `)
          .eq('is_active', true)
          .order('name');

        if (fetchError) throw fetchError;
        setInventory(data || []);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  return { inventory, loading, error };
}

// ============================================================
// REPORTS HOOKS
// ============================================================

export function useReports(type: string, startDate: string, endDate: string) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/reports?type=${type}&startDate=${startDate}&endDate=${endDate}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch report');
        
        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [type, startDate, endDate]);

  return { report, loading, error };
}

// ============================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================

export function useRealtimeAppointments(date: string) {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Initial fetch
    const fetchInitial = async () => {
      const { data } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(*),
          provider:providers(*),
          service:services(*)
        `)
        .gte('starts_at', `${date}T00:00:00`)
        .lt('starts_at', `${date}T23:59:59`)
        .order('starts_at');

      if (data) setAppointments(data);
    };

    fetchInitial();

    // Subscribe to changes
    const subscription = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        () => {
          // Refetch on any change
          fetchInitial();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [date]);

  return appointments;
}

// Real-time clients subscription
export function useRealtimeClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Initial fetch
    const fetchInitial = async () => {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) setClients(data);
    };

    fetchInitial();

    // Subscribe to changes
    const subscription = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
        },
        () => {
          fetchInitial();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return clients;
}

// Real-time transactions subscription
export function useRealtimeTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchInitial = async () => {
      const { data } = await supabase
        .from('transactions')
        .select(`
          *,
          client:clients(
            id,
            user_id,
            users(first_name, last_name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) setTransactions(data);
    };

    fetchInitial();

    const subscription = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
        },
        () => {
          fetchInitial();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return transactions;
}

// ============================================================
// MUTATION HOOKS
// ============================================================

export function useCreateAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = async (data: {
    client_id: string;
    provider_id?: string;
    service_id?: string;
    starts_at: string;
    duration_minutes?: number;
    notes?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      const result = await response.json();
      return result.appointment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create appointment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAppointment, loading, error };
}

export function useUpdateAppointment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appointment');
      }

      const result = await response.json();
      return result.appointment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update appointment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateAppointment, loading, error };
}

export function useCreateClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (data: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    notes?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create client');
      }

      const result = await response.json();
      return result.client;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create client';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createClient, loading, error };
}

export function useCreateTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = async (data: {
    client_id?: string;
    appointment_id?: string;
    subtotal: number;
    discount_amount?: number;
    tax_amount?: number;
    tip_amount?: number;
    payment_method: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transaction');
      }

      const result = await response.json();
      return result.transaction;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
}
