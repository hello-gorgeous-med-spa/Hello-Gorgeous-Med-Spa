// ============================================================
// SUPABASE DATABASE TYPES
// Auto-generated types for Hello Gorgeous OS database
// ============================================================

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          gender: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string | null;
          state: string | null;
          postal_code: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          client_type: string;
          status: string;
          source: string | null;
          notes: string | null;
          tags: string[] | null;
          is_vip: boolean;
          total_visits: number;
          total_spent: number;
          last_visit_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at' | 'total_visits' | 'total_spent'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      appointments: {
        Row: {
          id: string;
          client_id: string;
          provider_id: string | null;
          service_id: string | null;
          location_id: string | null;
          scheduled_at: string;
          duration_minutes: number;
          status: string;
          type: string;
          notes: string | null;
          internal_notes: string | null;
          cancellation_reason: string | null;
          no_show_reason: string | null;
          check_in_at: string | null;
          check_out_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category_id: string | null;
          duration_minutes: number;
          buffer_minutes: number;
          price: number;
          cost: number | null;
          is_active: boolean;
          requires_consultation: boolean;
          requires_consent: boolean;
          consent_form_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      staff: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          role: string;
          title: string | null;
          bio: string | null;
          avatar_url: string | null;
          is_provider: boolean;
          license_number: string | null;
          license_expiration: string | null;
          service_ids: string[] | null;
          location_ids: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['staff']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          client_id: string | null;
          appointment_id: string | null;
          type: string;
          status: string;
          subtotal: number;
          discount_amount: number;
          tax_amount: number;
          tip_amount: number;
          total_amount: number;
          payment_method: string | null;
          stripe_payment_intent_id: string | null;
          notes: string | null;
          processed_by: string | null;
          processed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      clinical_notes: {
        Row: {
          id: string;
          client_id: string;
          appointment_id: string | null;
          provider_id: string | null;
          note_type: string;
          subjective: string | null;
          objective: string | null;
          assessment: string | null;
          plan: string | null;
          treatment_details: any | null;
          internal_notes: string | null;
          is_signed: boolean;
          signed_at: string | null;
          signed_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clinical_notes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clinical_notes']['Insert']>;
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Views: {};
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    Functions: {};
  };
}

// Helper types
export type Client = Database['public']['Tables']['clients']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Staff = Database['public']['Tables']['staff']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type ClinicalNote = Database['public']['Tables']['clinical_notes']['Row'];

// Extended types with relations
export interface AppointmentWithRelations extends Appointment {
  client?: Client;
  provider?: Staff;
  service?: Service;
}

export interface ClientWithStats extends Client {
  appointmentCount?: number;
  upcomingAppointment?: Appointment;
}
