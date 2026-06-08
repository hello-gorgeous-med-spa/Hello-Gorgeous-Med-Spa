-- ─── Unit Bank ────────────────────────────────────────────────────────────────
-- Tracks neurotoxin unit rewards earned and redeemed per client

create table if not exists public.unit_bank (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid not null references public.clients(id) on delete cascade,
  type             text not null check (type in ('earned','redeemed','bonus','adjusted','expired')),
  units            integer not null,                        -- positive = earn, negative = redeem
  balance_after    integer not null default 0,
  note             text,                                    -- e.g. "20 units Botox 6/7/26", "Referral bonus"
  toxin            text,                                    -- botox | dysport | jeuveau | xeomin | daxxify
  units_purchased  integer,                                 -- how many units the client bought (for earn records)
  created_at       timestamptz not null default now(),
  created_by       text                                     -- staff member name or 'system'
);

-- Running balance view per client
create or replace view public.unit_bank_balances as
  select
    client_id,
    coalesce(sum(units), 0)::integer as balance,
    coalesce(sum(case when type = 'earned' then units else 0 end), 0)::integer as total_earned,
    coalesce(sum(case when type = 'redeemed' then abs(units) else 0 end), 0)::integer as total_redeemed,
    max(created_at) as last_activity
  from public.unit_bank
  group by client_id;

-- Index for fast client lookups
create index if not exists unit_bank_client_id_idx on public.unit_bank(client_id);
create index if not exists unit_bank_created_at_idx on public.unit_bank(created_at desc);

-- RLS
alter table public.unit_bank enable row level security;

create policy "Service role full access to unit_bank"
  on public.unit_bank for all
  using (true)
  with check (true);

comment on table public.unit_bank is 'Hello Gorgeous Unit Bank — neurotoxin rewards program. Clients earn units back on every toxin purchase.';
