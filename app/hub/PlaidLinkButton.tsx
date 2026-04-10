"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export function PlaidLinkButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    const r = await fetch("/api/hub/plaid/link-token", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const j = await r.json();
    if (j.link_token) setLinkToken(j.link_token);
    else setLinkToken(null);
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const onSuccess = useCallback(
    async (publicToken: string, metadata: unknown) => {
      await fetch("/api/hub/plaid/exchange", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token: publicToken, metadata }),
      });
      setLinkToken(null);
      await fetchToken();
    },
    [fetchToken]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <button
      type="button"
      className="border rounded px-3 py-2 disabled:opacity-45"
      disabled={!ready || !linkToken}
      onClick={() => open()}
    >
      Connect bank (Plaid)
    </button>
  );
}
