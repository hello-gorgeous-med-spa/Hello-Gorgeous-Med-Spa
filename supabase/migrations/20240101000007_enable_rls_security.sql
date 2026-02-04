-- ============================================================
-- MIGRATION 007: Enable Row Level Security (RLS) on All Tables
-- Fixes Supabase security linter warnings
-- ============================================================

-- ============================================================
-- PART 1: Enable RLS on ALL public tables
-- ============================================================

-- Core tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.providers ENABLE ROW LEVEL SECURITY;

-- Appointments & Scheduling
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.provider_capabilities ENABLE ROW LEVEL SECURITY;

-- Services
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.service_workflows ENABLE ROW LEVEL SECURITY;

-- Clinical / Treatment
ALTER TABLE IF EXISTS public.treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.client_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.medications_administered ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.consent_audit_log ENABLE ROW LEVEL SECURITY;

-- Memberships
ALTER TABLE IF EXISTS public.client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.membership_benefit_usage ENABLE ROW LEVEL SECURITY;

-- Financial / Transactions
ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sale_payments ENABLE ROW LEVEL SECURITY;

-- Gift Cards
ALTER TABLE IF EXISTS public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gift_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gift_card_settings ENABLE ROW LEVEL SECURITY;

-- Inventory
ALTER TABLE IF EXISTS public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inventory_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Messaging
ALTER TABLE IF EXISTS public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;

-- Referrals & Loyalty
ALTER TABLE IF EXISTS public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.referral_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- CMS
ALTER TABLE IF EXISTS public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_ctas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_site_settings ENABLE ROW LEVEL SECURITY;

-- System / Config
ALTER TABLE IF EXISTS public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.config_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Marketing
ALTER TABLE IF EXISTS public.marketing_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketing_events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 2: Create Service Role Policies (Full Access for API)
-- These allow your Next.js API routes to work normally
-- ============================================================

-- Helper function to check if user is service role
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('role', true) = 'service_role'
     OR current_setting('request.jwt.claim.role', true) = 'service_role'
$$;

-- Helper function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('request.jwt.claim.role', true) = 'authenticated'
$$;

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claim.sub', true))::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  )
$$;

-- ============================================================
-- PART 3: Sensitive Tables - Service Role Only
-- These contain PHI, financial data, or sensitive info
-- ============================================================

-- Users & Profiles (service role only)
DROP POLICY IF EXISTS "Service role full access to users" ON public.users;
CREATE POLICY "Service role full access to users" ON public.users
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to user_profiles" ON public.user_profiles;
CREATE POLICY "Service role full access to user_profiles" ON public.user_profiles
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to clients" ON public.clients;
CREATE POLICY "Service role full access to clients" ON public.clients
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to providers" ON public.providers;
CREATE POLICY "Service role full access to providers" ON public.providers
  FOR ALL USING (public.is_service_role());

-- Appointments (service role only)
DROP POLICY IF EXISTS "Service role full access to appointments" ON public.appointments;
CREATE POLICY "Service role full access to appointments" ON public.appointments
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to provider_availability" ON public.provider_availability;
CREATE POLICY "Service role full access to provider_availability" ON public.provider_availability
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to provider_capabilities" ON public.provider_capabilities;
CREATE POLICY "Service role full access to provider_capabilities" ON public.provider_capabilities
  FOR ALL USING (public.is_service_role());

-- Clinical/Medical (service role only - PHI protection)
DROP POLICY IF EXISTS "Service role full access to treatment_records" ON public.treatment_records;
CREATE POLICY "Service role full access to treatment_records" ON public.treatment_records
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to client_documents" ON public.client_documents;
CREATE POLICY "Service role full access to client_documents" ON public.client_documents
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to client_intakes" ON public.client_intakes;
CREATE POLICY "Service role full access to client_intakes" ON public.client_intakes
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to intake_forms" ON public.intake_forms;
CREATE POLICY "Service role full access to intake_forms" ON public.intake_forms
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to medications_administered" ON public.medications_administered;
CREATE POLICY "Service role full access to medications_administered" ON public.medications_administered
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to consent_audit_log" ON public.consent_audit_log;
CREATE POLICY "Service role full access to consent_audit_log" ON public.consent_audit_log
  FOR ALL USING (public.is_service_role());

-- Financial (service role only)
DROP POLICY IF EXISTS "Service role full access to transactions" ON public.transactions;
CREATE POLICY "Service role full access to transactions" ON public.transactions
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to sales" ON public.sales;
CREATE POLICY "Service role full access to sales" ON public.sales
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to sale_items" ON public.sale_items;
CREATE POLICY "Service role full access to sale_items" ON public.sale_items
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to sale_payments" ON public.sale_payments;
CREATE POLICY "Service role full access to sale_payments" ON public.sale_payments
  FOR ALL USING (public.is_service_role());

-- Memberships (service role only)
DROP POLICY IF EXISTS "Service role full access to client_memberships" ON public.client_memberships;
CREATE POLICY "Service role full access to client_memberships" ON public.client_memberships
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to membership_plans" ON public.membership_plans;
CREATE POLICY "Service role full access to membership_plans" ON public.membership_plans
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to membership_benefit_usage" ON public.membership_benefit_usage;
CREATE POLICY "Service role full access to membership_benefit_usage" ON public.membership_benefit_usage
  FOR ALL USING (public.is_service_role());

-- Gift Cards (service role only)
DROP POLICY IF EXISTS "Service role full access to gift_cards" ON public.gift_cards;
CREATE POLICY "Service role full access to gift_cards" ON public.gift_cards
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to gift_card_transactions" ON public.gift_card_transactions;
CREATE POLICY "Service role full access to gift_card_transactions" ON public.gift_card_transactions
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to gift_card_settings" ON public.gift_card_settings;
CREATE POLICY "Service role full access to gift_card_settings" ON public.gift_card_settings
  FOR ALL USING (public.is_service_role());

-- Inventory (service role only)
DROP POLICY IF EXISTS "Service role full access to inventory_items" ON public.inventory_items;
CREATE POLICY "Service role full access to inventory_items" ON public.inventory_items
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to inventory_lots" ON public.inventory_lots;
CREATE POLICY "Service role full access to inventory_lots" ON public.inventory_lots
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to inventory_transactions" ON public.inventory_transactions;
CREATE POLICY "Service role full access to inventory_transactions" ON public.inventory_transactions
  FOR ALL USING (public.is_service_role());

-- Messaging (service role only)
DROP POLICY IF EXISTS "Service role full access to conversations" ON public.conversations;
CREATE POLICY "Service role full access to conversations" ON public.conversations
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to messages" ON public.messages;
CREATE POLICY "Service role full access to messages" ON public.messages
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to sms_messages" ON public.sms_messages;
CREATE POLICY "Service role full access to sms_messages" ON public.sms_messages
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to notifications" ON public.notifications;
CREATE POLICY "Service role full access to notifications" ON public.notifications
  FOR ALL USING (public.is_service_role());

-- Referrals & Loyalty (service role only)
DROP POLICY IF EXISTS "Service role full access to referral_codes" ON public.referral_codes;
CREATE POLICY "Service role full access to referral_codes" ON public.referral_codes
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to referral_redemptions" ON public.referral_redemptions;
CREATE POLICY "Service role full access to referral_redemptions" ON public.referral_redemptions
  FOR ALL USING (public.is_service_role());

-- Only create policies if tables exist
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'loyalty_accounts') THEN
    DROP POLICY IF EXISTS "Service role full access to loyalty_accounts" ON public.loyalty_accounts;
    CREATE POLICY "Service role full access to loyalty_accounts" ON public.loyalty_accounts FOR ALL USING (public.is_service_role());
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'loyalty_transactions') THEN
    DROP POLICY IF EXISTS "Service role full access to loyalty_transactions" ON public.loyalty_transactions;
    CREATE POLICY "Service role full access to loyalty_transactions" ON public.loyalty_transactions FOR ALL USING (public.is_service_role());
  END IF;
END $$;

-- System/Admin (service role only)
DROP POLICY IF EXISTS "Service role full access to system_config" ON public.system_config;
CREATE POLICY "Service role full access to system_config" ON public.system_config
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to business_rules" ON public.business_rules;
CREATE POLICY "Service role full access to business_rules" ON public.business_rules
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to feature_flags" ON public.feature_flags;
CREATE POLICY "Service role full access to feature_flags" ON public.feature_flags
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to config_audit_log" ON public.config_audit_log;
CREATE POLICY "Service role full access to config_audit_log" ON public.config_audit_log
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to audit_logs" ON public.audit_logs;
CREATE POLICY "Service role full access to audit_logs" ON public.audit_logs
  FOR ALL USING (public.is_service_role());

-- Marketing (service role only) - only if tables exist
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'marketing_preferences') THEN
    DROP POLICY IF EXISTS "Service role full access to marketing_preferences" ON public.marketing_preferences;
    CREATE POLICY "Service role full access to marketing_preferences" ON public.marketing_preferences FOR ALL USING (public.is_service_role());
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'marketing_events') THEN
    DROP POLICY IF EXISTS "Service role full access to marketing_events" ON public.marketing_events;
    CREATE POLICY "Service role full access to marketing_events" ON public.marketing_events FOR ALL USING (public.is_service_role());
  END IF;
END $$;

-- ============================================================
-- PART 4: Public Read Access for Website Content
-- These need anon read access for the public website
-- ============================================================

-- Services (public read, service role write)
DROP POLICY IF EXISTS "Service role full access to services" ON public.services;
CREATE POLICY "Service role full access to services" ON public.services
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to active services" ON public.services;
CREATE POLICY "Public read access to active services" ON public.services
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access to service_categories" ON public.service_categories;
CREATE POLICY "Service role full access to service_categories" ON public.service_categories
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to service_categories" ON public.service_categories;
CREATE POLICY "Public read access to service_categories" ON public.service_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access to service_workflows" ON public.service_workflows;
CREATE POLICY "Service role full access to service_workflows" ON public.service_workflows
  FOR ALL USING (public.is_service_role());

-- CMS (public read for published, service role write)
DROP POLICY IF EXISTS "Service role full access to cms_pages" ON public.cms_pages;
CREATE POLICY "Service role full access to cms_pages" ON public.cms_pages
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to published cms_pages" ON public.cms_pages;
CREATE POLICY "Public read access to published cms_pages" ON public.cms_pages
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Service role full access to cms_page_versions" ON public.cms_page_versions;
CREATE POLICY "Service role full access to cms_page_versions" ON public.cms_page_versions
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Service role full access to cms_sections" ON public.cms_sections;
CREATE POLICY "Service role full access to cms_sections" ON public.cms_sections
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to cms_sections" ON public.cms_sections;
CREATE POLICY "Public read access to cms_sections" ON public.cms_sections
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access to cms_navigation" ON public.cms_navigation;
CREATE POLICY "Service role full access to cms_navigation" ON public.cms_navigation
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to cms_navigation" ON public.cms_navigation;
CREATE POLICY "Public read access to cms_navigation" ON public.cms_navigation
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access to cms_promotions" ON public.cms_promotions;
CREATE POLICY "Service role full access to cms_promotions" ON public.cms_promotions
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to active cms_promotions" ON public.cms_promotions;
CREATE POLICY "Public read access to active cms_promotions" ON public.cms_promotions
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access to cms_ctas" ON public.cms_ctas;
CREATE POLICY "Service role full access to cms_ctas" ON public.cms_ctas
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to cms_ctas" ON public.cms_ctas;
CREATE POLICY "Public read access to cms_ctas" ON public.cms_ctas
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access to cms_media" ON public.cms_media;
CREATE POLICY "Service role full access to cms_media" ON public.cms_media
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to cms_media" ON public.cms_media;
CREATE POLICY "Public read access to cms_media" ON public.cms_media
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access to cms_site_settings" ON public.cms_site_settings;
CREATE POLICY "Service role full access to cms_site_settings" ON public.cms_site_settings
  FOR ALL USING (public.is_service_role());

DROP POLICY IF EXISTS "Public read access to cms_site_settings" ON public.cms_site_settings;
CREATE POLICY "Public read access to cms_site_settings" ON public.cms_site_settings
  FOR SELECT USING (true);

-- ============================================================
-- PART 5: Fix Security Definer Views
-- Change to SECURITY INVOKER (uses caller's permissions)
-- ============================================================

-- Drop and recreate views with SECURITY INVOKER
DROP VIEW IF EXISTS public.today_sales_summary CASCADE;
CREATE OR REPLACE VIEW public.today_sales_summary
WITH (security_invoker = true)
AS
SELECT 
  COUNT(*) as total_sales,
  COALESCE(SUM(net_total), 0) as total_revenue,
  COALESCE(SUM(tip_total), 0) as total_tips,
  COALESCE(SUM(gross_total), 0) as gross_revenue
FROM public.sales
WHERE DATE(created_at) = CURRENT_DATE
  AND status = 'completed';

DROP VIEW IF EXISTS public.sales_detailed CASCADE;
CREATE OR REPLACE VIEW public.sales_detailed
WITH (security_invoker = true)
AS
SELECT 
  s.*,
  up.first_name as client_first_name,
  up.last_name as client_last_name,
  up.email as client_email
FROM public.sales s
LEFT JOIN public.clients c ON s.client_id = c.id
LEFT JOIN public.user_profiles up ON c.user_id = up.user_id;

-- ============================================================
-- PART 6: Clean up old permissive policies
-- Remove any "Allow all" policies that bypass security
-- ============================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Find and drop overly permissive policies
  FOR r IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND policyname LIKE 'Allow all%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                   r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ============================================================
-- VERIFICATION: List all tables and their RLS status
-- Run this query to verify: SELECT * FROM pg_tables WHERE schemaname = 'public';
-- ============================================================

COMMENT ON FUNCTION public.is_service_role() IS 'Check if current connection is using service role key';
COMMENT ON FUNCTION public.is_authenticated() IS 'Check if current user is authenticated';
COMMENT ON FUNCTION public.current_user_id() IS 'Get the current authenticated user ID from JWT';
