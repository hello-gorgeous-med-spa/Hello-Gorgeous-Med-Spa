#!/usr/bin/env python3
"""
Sync Square Appointments services → Google Business Profile "Services"
======================================================================

GBP "Services" is a separate listing from posts. Filling it in is one of
the few local-SEO inputs Google still cross-references against your
website + Square catalog when ranking the Local Pack and generating
AI-Overview business summaries.

This script pulls your live Square Appointments catalog (the source of
truth — same data the website uses) and PATCHes it into GBP as
freeForm service items, one per Square service, with descriptions
truncated to 240 chars (GBP cap is 250).

Endpoint: Business Information API v1
  PATCH /v1/locations/{LOCATION_ID}?updateMask=serviceItems
  GET   /v1/locations/{LOCATION_ID}?readMask=serviceItems,categories

DESTRUCTIVE: PATCH replaces the entire serviceItems list — there is no
partial update. Always run --dry-run (default) first; only use --push
once the diff looks right.

Usage:
  # Default — fetch Square + GBP, show what would change. NO writes.
  python3 scripts/gbp-sync-services.py

  # Inspect what GBP currently has
  python3 scripts/gbp-sync-services.py --show-current

  # Inspect what we would push (full payload)
  python3 scripts/gbp-sync-services.py --dump-planned

  # ACTUALLY PUSH (overwrites GBP services list)
  python3 scripts/gbp-sync-services.py --push

Env (read from .env.local):
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
  GOOGLE_BUSINESS_LOCATION_ID
  SQUARE_ACCESS_TOKEN, SQUARE_ENVIRONMENT (production/sandbox)
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env.local"

GBP_INFO_V1 = "https://mybusinessbusinessinformation.googleapis.com/v1"
SQUARE_API_VERSION = "2024-12-18"

# GBP description hard cap is 250; leave headroom for trailing punctuation.
DESCRIPTION_MAX = 240
# Service display names should be short. GBP doesn't publish a hard limit
# but anything over 58 chars renders truncated in the GBP UI.
DISPLAY_NAME_MAX = 80
# Default GBP category for free-form service items. Overridden at runtime
# from the location's primary category once we read it.
DEFAULT_GCID = "gcid:medical_spa"


# ---------------------------------------------------------------------------
# env + http helpers — same pattern as gbp-post.py (stdlib only)
# ---------------------------------------------------------------------------

def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.exists():
        return env
    for raw in ENV_FILE.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def http_post_form(url: str, fields: dict[str, str]) -> dict:
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read())


def http_request_json(
    url: str,
    method: str,
    headers: dict[str, str],
    body: dict | None = None,
) -> tuple[int, dict]:
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    for k, v in headers.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e:
        body_err = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(body_err)
        except Exception:
            return e.code, {"error": {"message": body_err}}


def get_google_token(env: dict[str, str]) -> str:
    res = http_post_form(
        "https://oauth2.googleapis.com/token",
        {
            "client_id": env["GOOGLE_CLIENT_ID"],
            "client_secret": env["GOOGLE_CLIENT_SECRET"],
            "refresh_token": env["GOOGLE_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        },
    )
    if "access_token" not in res:
        sys.exit(f"OAuth refresh failed: {res}")
    return res["access_token"]


# ---------------------------------------------------------------------------
# Square — pull live ITEM catalog with pagination
# ---------------------------------------------------------------------------

def square_host(env: dict[str, str]) -> str:
    val = (env.get("SQUARE_ENVIRONMENT") or env.get("SQUARE_ENV") or "").lower()
    if val == "production":
        return "https://connect.squareup.com"
    return "https://connect.squareupsandbox.com"


def fetch_square_items(env: dict[str, str]) -> list[dict]:
    """Return all ITEM-type catalog objects with non-deleted item_data."""
    token = env.get("SQUARE_ACCESS_TOKEN")
    if not token:
        sys.exit("SQUARE_ACCESS_TOKEN missing")
    host = square_host(env)
    headers = {
        "Authorization": f"Bearer {token}",
        "Square-Version": SQUARE_API_VERSION,
    }
    items: list[dict] = []
    cursor = ""
    while True:
        url = f"{host}/v2/catalog/list?types=ITEM"
        if cursor:
            url += f"&cursor={urllib.parse.quote(cursor)}"
        status, data = http_request_json(url, "GET", headers)
        if status != 200:
            sys.exit(f"Square list failed ({status}): {json.dumps(data)[:300]}")
        for o in data.get("objects", []) or []:
            if o.get("type") != "ITEM" or o.get("is_deleted"):
                continue
            if not o.get("item_data", {}).get("name"):
                continue
            items.append(o)
        cursor = data.get("cursor") or ""
        if not cursor:
            break
    return items


# ---------------------------------------------------------------------------
# GBP — read current location info + services
# ---------------------------------------------------------------------------

def fetch_location(token: str, location_id: str) -> dict:
    url = (
        f"{GBP_INFO_V1}/locations/{location_id}"
        f"?readMask=serviceItems,categories,title"
    )
    status, data = http_request_json(url, "GET", {"Authorization": f"Bearer {token}"})
    if status != 200:
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        sys.exit(f"GBP location read failed ({status}): {msg}")
    return data


def location_primary_gcid(location: dict) -> str:
    cats = location.get("categories") or {}
    primary = cats.get("primaryCategory") or {}
    cid = primary.get("name") or primary.get("categoryId")
    return cid if cid and cid.startswith("gcid:") else DEFAULT_GCID


# ---------------------------------------------------------------------------
# Build the planned serviceItems[] payload from Square items
# ---------------------------------------------------------------------------

def truncate(s: str, n: int) -> str:
    s = (s or "").strip()
    if len(s) <= n:
        return s
    cut = s[: n - 1].rstrip()
    # avoid cutting mid-word if a clean break exists in the last 25 chars
    sp = cut.rfind(" ", max(0, len(cut) - 25))
    if sp >= n - 25:
        cut = cut[:sp].rstrip()
    return cut + "…"


def build_planned_service_items(
    square_items: list[dict],
    gcid: str,
) -> tuple[list[dict], list[dict]]:
    """Return (serviceItems[], skipped[]). Skipped items lack a description."""
    planned: list[dict] = []
    skipped: list[dict] = []
    seen_names: set[str] = set()
    for item in square_items:
        d = item.get("item_data", {}) or {}
        name = (d.get("name") or "").strip()
        desc = (d.get("description") or d.get("description_plaintext") or "").strip()
        if not name:
            continue
        if not desc:
            skipped.append({"name": name, "reason": "no description"})
            continue
        if name in seen_names:
            skipped.append({"name": name, "reason": "duplicate name"})
            continue
        seen_names.add(name)
        planned.append({
            "freeFormServiceItem": {
                "category": gcid,
                "label": {
                    "displayName": truncate(name, DISPLAY_NAME_MAX),
                    "description": truncate(desc, DESCRIPTION_MAX),
                    "languageCode": "en-US",
                },
            },
        })
    return planned, skipped


def diff_summary(current: list[dict], planned: list[dict]) -> str:
    def names(items: list[dict]) -> set[str]:
        out: set[str] = set()
        for it in items:
            ff = it.get("freeFormServiceItem") or {}
            label = ff.get("label") or {}
            n = label.get("displayName")
            if n:
                out.add(n)
            st = it.get("structuredServiceItem") or {}
            sid = st.get("serviceTypeId")
            if sid:
                out.add(f"[structured:{sid}]")
        return out
    cur = names(current)
    new = names(planned)
    added = sorted(new - cur)
    removed = sorted(cur - new)
    kept = sorted(cur & new)
    lines = [
        f"current GBP services:  {len(current)}",
        f"planned GBP services:  {len(planned)}",
        f"  → added (new):       {len(added)}",
        f"  → removed (drop):    {len(removed)}",
        f"  → kept (overlap):    {len(kept)}",
    ]
    if added:
        lines.append("\nFirst 10 added:")
        for n in added[:10]:
            lines.append(f"  + {n}")
    if removed:
        lines.append("\nFirst 10 removed:")
        for n in removed[:10]:
            lines.append(f"  - {n}")
    return "\n".join(lines)


def push_service_items(token: str, location_id: str, items: list[dict]) -> dict:
    url = f"{GBP_INFO_V1}/locations/{location_id}?updateMask=serviceItems"
    status, data = http_request_json(
        url, "PATCH", {"Authorization": f"Bearer {token}"},
        body={"serviceItems": items},
    )
    if status != 200:
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        details = (data.get("error") or {}).get("details")
        sys.exit(
            f"PATCH failed ({status}): {msg}\n"
            + (json.dumps(details, indent=2) if details else "")
        )
    return data


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--push", action="store_true",
                        help="Actually PATCH GBP. Default is dry-run.")
    parser.add_argument("--show-current", action="store_true",
                        help="Print current GBP services + primary category, then exit.")
    parser.add_argument("--dump-planned", action="store_true",
                        help="Print the full planned serviceItems[] JSON.")
    parser.add_argument("--gcid", default="",
                        help="Override GBP category ID (e.g. gcid:medical_spa).")
    args = parser.parse_args()

    env = load_env()
    needed = [
        "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN",
        "GOOGLE_BUSINESS_LOCATION_ID",
    ]
    miss = [k for k in needed if not env.get(k)]
    if miss:
        sys.exit(f"Missing env vars: {', '.join(miss)}")

    token = get_google_token(env)
    location_id = env["GOOGLE_BUSINESS_LOCATION_ID"]

    location = fetch_location(token, location_id)
    current_items = location.get("serviceItems", []) or []
    gcid = args.gcid or location_primary_gcid(location)
    print(f"Location: {location.get('title') or location_id}")
    print(f"Primary GBP category for free-form items: {gcid}")
    print(f"Current GBP serviceItems count: {len(current_items)}\n")

    if args.show_current:
        for it in current_items:
            ff = it.get("freeFormServiceItem") or {}
            label = ff.get("label") or {}
            st = it.get("structuredServiceItem") or {}
            if label:
                desc = (label.get("description") or "").replace("\n", " ")
                print(f"  · {label.get('displayName','(no name)')}  [{len(desc)} chars]")
                if desc:
                    print(f"      {desc[:120]}")
            elif st:
                print(f"  · [structured] serviceTypeId={st.get('serviceTypeId')}")
        return 0

    print("Pulling live Square catalog (this is the source of truth)...")
    square_items = fetch_square_items(env)
    with_desc = sum(
        1 for i in square_items
        if (i.get("item_data", {}).get("description")
            or i.get("item_data", {}).get("description_plaintext"))
    )
    print(f"Square items: {len(square_items)} total, {with_desc} with descriptions\n")

    planned, skipped = build_planned_service_items(square_items, gcid)
    print(diff_summary(current_items, planned))
    if skipped:
        print(f"\nSkipped {len(skipped)} Square items (no description / duplicate):")
        for s in skipped[:20]:
            print(f"  · {s['name']}  ({s['reason']})")

    if args.dump_planned:
        print("\n--- planned serviceItems[] ---")
        print(json.dumps(planned, indent=2))

    if not args.push:
        print(
            "\nDRY RUN — no changes pushed to GBP."
            "\nReview the diff above, then re-run with --push to apply."
        )
        return 0

    print(f"\nPATCHing {len(planned)} serviceItems to GBP...")
    push_service_items(token, location_id, planned)
    print("✓ GBP serviceItems updated.")
    print("Re-run with --show-current to verify.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
