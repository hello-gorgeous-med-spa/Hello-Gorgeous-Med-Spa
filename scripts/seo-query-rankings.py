#!/usr/bin/env python3
"""
Pull actual Google Search Console rankings for specific queries.

For each target query, prints:
  - clicks, impressions, CTR, average position over the last 90 days
  - which page is ranking (if any)
  - related queries Google saw the site for

Run:
  python3 scripts/seo-query-rankings.py
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env.local"
# Try multiple verified properties — pick the one with data.
# The www property was only verified recently and has no history yet.
CANDIDATE_SITES = [
    "https://hellogorgeousmedspa.com/",
    "sc-domain:hellogorgeousmedspa.com",
    "https://www.hellogorgeousmedspa.com/",
]

TARGET_QUERIES = [
    "botox near me",
    "weight loss oswego",
    "morpheus 8 oswego",
    "morpheus8 oswego",
]

DAYS = 90


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.exists():
        return env
    for raw in ENV_FILE.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def get_access_token(env: dict[str, str]) -> str:
    body = urllib.parse.urlencode(
        {
            "client_id": env["GOOGLE_CLIENT_ID"],
            "client_secret": env["GOOGLE_CLIENT_SECRET"],
            "refresh_token": env["GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        }
    ).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=body)
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode())["access_token"]


def list_sites(token: str) -> list[dict]:
    req = urllib.request.Request(
        "https://searchconsole.googleapis.com/webmasters/v3/sites", method="GET"
    )
    req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode()).get("siteEntry", [])


def query_sa(token: str, site_url: str, body: dict) -> dict:
    encoded_site = urllib.parse.quote(site_url, safe="")
    url = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{encoded_site}/searchAnalytics/query"
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise SystemExit(f"Search Analytics failed ({e.code}): {body}")


def fmt_pct(x: float) -> str:
    return f"{x * 100:.1f}%"


def pick_site_with_data(token: str, end: date, start: date) -> str:
    """Loop through verified properties and pick the first one with impressions."""
    sites = {s["siteUrl"] for s in list_sites(token) if s.get("permissionLevel") in {
        "siteOwner", "siteFullUser", "siteRestrictedUser",
    }}
    for candidate in CANDIDATE_SITES:
        if candidate not in sites:
            continue
        res = query_sa(
            token,
            candidate,
            {
                "startDate": start.isoformat(),
                "endDate": end.isoformat(),
                "dimensions": [],
                "rowLimit": 1,
            },
        )
        rows = res.get("rows", [])
        if rows and rows[0]["impressions"] > 0:
            return candidate
    raise SystemExit(
        "No verified property with Search Analytics data. Verified properties: "
        + ", ".join(sorted(sites))
    )


def main() -> int:
    env = load_env()
    token = get_access_token(env)

    end = date.today()
    start = end - timedelta(days=DAYS)
    site_url = pick_site_with_data(token, end, start)
    print(f"Site:  {site_url}")
    print(f"Range: {start} → {end} ({DAYS} days)")
    print()

    print("=" * 78)
    print("PART 1 · Performance for the 3 queries you asked about")
    print("=" * 78)
    for q in TARGET_QUERIES:
        body = {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": ["query", "page"],
            "dimensionFilterGroups": [
                {
                    "filters": [
                        {
                            "dimension": "query",
                            "operator": "contains",
                            "expression": q,
                        }
                    ]
                }
            ],
            "rowLimit": 50,
        }
        res = query_sa(token, site_url, body)
        rows = res.get("rows", [])
        print(f"\n  Query: \"{q}\"")
        if not rows:
            print(f"    No impressions in {DAYS} days. Google never showed you for this term.")
            continue
        total_clicks = sum(r["clicks"] for r in rows)
        total_impressions = sum(r["impressions"] for r in rows)
        weighted_pos = (
            sum(r["position"] * r["impressions"] for r in rows) / total_impressions
            if total_impressions
            else 0
        )
        ctr = total_clicks / total_impressions if total_impressions else 0
        print(
            f"    {total_clicks} clicks · {total_impressions} impressions · CTR {fmt_pct(ctr)} · avg position {weighted_pos:.1f}"
        )
        print(f"    Top variations & landing pages:")
        for r in sorted(rows, key=lambda x: -x["impressions"])[:8]:
            qstr, page = r["keys"][0], r["keys"][1]
            short_page = page.replace(site_url.rstrip("/"), "") or "/"
            print(
                f"      \"{qstr}\"  →  {short_page}"
                f"    {r['clicks']}c / {r['impressions']}i / pos {r['position']:.1f}"
            )

    print()
    print("=" * 78)
    print("PART 2 · Top 25 queries actually driving impressions")
    print("=" * 78)
    res = query_sa(
        token,
        site_url,
        {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": ["query"],
            "rowLimit": 25,
        },
    )
    rows = res.get("rows", [])
    if not rows:
        print("  No impression data. Are you sure the property has been verified long enough?")
    else:
        print(f"\n  {'Rank':>4}  {'Clicks':>6}  {'Impr':>6}  {'CTR':>6}  {'AvgPos':>6}  Query")
        print(f"  {'-'*4}  {'-'*6}  {'-'*6}  {'-'*6}  {'-'*6}  {'-'*40}")
        for i, r in enumerate(rows, 1):
            q = r["keys"][0]
            ctr = r["clicks"] / r["impressions"] if r["impressions"] else 0
            print(
                f"  {i:>4}  {r['clicks']:>6}  {r['impressions']:>6}  "
                f"{fmt_pct(ctr):>6}  {r['position']:>6.1f}  {q}"
            )

    print()
    print("=" * 78)
    print("PART 3 · Site-wide totals (last 90 days)")
    print("=" * 78)
    res = query_sa(
        token,
        site_url,
        {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": [],
            "rowLimit": 1,
        },
    )
    rows = res.get("rows", [])
    if rows:
        r = rows[0]
        ctr = r["clicks"] / r["impressions"] if r["impressions"] else 0
        print(
            f"\n  Total clicks: {r['clicks']}"
            f"\n  Total impressions: {r['impressions']}"
            f"\n  CTR: {fmt_pct(ctr)}"
            f"\n  Avg position: {r['position']:.1f}"
        )
    else:
        print("\n  No site-wide data returned.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
