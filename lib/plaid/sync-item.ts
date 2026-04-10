import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlaidApi } from "plaid";
import { decryptToken, encryptToken } from "@/lib/square/encryption";
import { mapPlaidToHgCategory } from "@/lib/plaid/category-map";

type ItemRow = {
  item_id: string;
  access_token_encrypted: string;
  cursor: string | null;
  institution_name: string | null;
};

export async function refreshPlaidAccounts(
  plaid: PlaidApi,
  supabase: SupabaseClient,
  itemId: string,
  accessToken: string
): Promise<void> {
  const res = await plaid.accountsBalanceGet({ access_token: accessToken });
  const now = new Date().toISOString();
  for (const a of res.data.accounts || []) {
    const bal = a.balances;
    await supabase.from("hg_plaid_accounts").upsert(
      {
        item_id: itemId,
        plaid_account_id: a.account_id,
        name: a.name,
        official_name: a.official_name || null,
        type: a.type,
        subtype: a.subtype || null,
        mask: a.mask || null,
        current_balance: bal.current != null ? Number(bal.current) : null,
        available_balance: bal.available != null ? Number(bal.available) : null,
        currency: bal.iso_currency_code || "USD",
        updated_at: now,
      },
      { onConflict: "plaid_account_id" }
    );
  }
}

export async function syncPlaidItemTransactions(
  plaid: PlaidApi,
  supabase: SupabaseClient,
  item: ItemRow
): Promise<{ added: number; modified: number; removed: number }> {
  const accessToken = decryptToken(item.access_token_encrypted);
  let cursor = item.cursor || undefined;
  let hasMore = true;
  const counts = { added: 0, modified: 0, removed: 0 };
  const institution = item.institution_name || "";

  while (hasMore) {
    const res = await plaid.transactionsSync({
      access_token: accessToken,
      cursor,
      count: 500,
    });
    const data = res.data;

    for (const rm of data.removed || []) {
      const id = typeof rm === "string" ? rm : rm.transaction_id;
      await supabase.from("hg_plaid_transactions").delete().eq("transaction_id", id);
      counts.removed += 1;
    }

    counts.added += data.added?.length || 0;
    counts.modified += data.modified?.length || 0;

    const upsertRows = [...(data.added || []), ...(data.modified || [])].map((t) => {
      const d = t.date ? String(t.date) : new Date().toISOString().slice(0, 10);
      const mapped = mapPlaidToHgCategory(t);
      return {
        transaction_id: t.transaction_id,
        item_id: item.item_id,
        account_id: t.account_id,
        institution,
        date: d,
        name: t.name || t.merchant_name || t.original_description || "",
        amount: t.amount != null ? Number(t.amount) : null,
        category: t.personal_finance_category?.detailed || t.personal_finance_category?.primary || null,
        hg_category: mapped,
        pending: !!t.pending,
        synced_at: new Date().toISOString(),
      };
    });

    if (upsertRows.length) {
      const { error } = await supabase.from("hg_plaid_transactions").upsert(upsertRows, {
        onConflict: "transaction_id",
      });
      if (error) throw new Error(error.message);
    }

    cursor = data.next_cursor;
    hasMore = !!data.has_more;
  }

  await supabase
    .from("hg_plaid_items")
    .update({
      cursor: cursor || null,
      last_synced_at: new Date().toISOString(),
    })
    .eq("item_id", item.item_id);

  await refreshPlaidAccounts(plaid, supabase, item.item_id, accessToken);

  return counts;
}

export function encryptPlaidAccessToken(plain: string): string {
  return encryptToken(plain);
}

export function decryptPlaidAccessToken(enc: string): string {
  return decryptToken(enc);
}
