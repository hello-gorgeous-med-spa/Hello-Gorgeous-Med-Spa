#!/usr/bin/env python3
"""
Sync real Google Business Profile reviews into Supabase `client_reviews`
========================================================================

Pulls every review from Google Business Profile (v4 API), classifies each
one by which service it mentions (botox / weight loss / morpheus8 / lip
filler / etc.), and upserts into the Supabase `client_reviews` table.

Why this matters:
  - The RealPatientReviews component on every SEO landing page reads from
    `client_reviews` first, falling back to curated HOME_TESTIMONIALS only
    when no real reviews match the service. Once this sync runs, your
    landing pages show actual Google reviewer names + their actual quotes.
  - Schema.org Review markup uses the real names, so Google can pull
    accurate reviewer attribution into rich snippets in the SERPs.

Required env vars (read from .env.local):
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
  GOOGLE_REFRESH_TOKEN         (with `business.manage` scope)
  GOOGLE_BUSINESS_ACCOUNT_ID
  GOOGLE_BUSINESS_LOCATION_ID
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY    (admin key — bypasses RLS for upsert)

Run:
  python3 -u scripts/sync-google-reviews.py
"""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from collections import Counter
from pathlib import Path

# Deterministic namespace so re-running this script is idempotent — the
# UUID for a given Google review id is always the same, so upserts merge
# instead of inserting duplicates.
GOOGLE_REVIEW_NS = uuid.uuid5(uuid.NAMESPACE_URL, "hellogorgeousmedspa.com/google-reviews")

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env.local"

GBP_V4 = "https://mybusiness.googleapis.com/v4"

# Service classification keywords. Order matters: first match wins.
# Aligned with components/RealPatientReviews.tsx SERVICE_FILTERS so the
# tags here match what the component looks for in service_name.
SERVICE_RULES: list[tuple[str, list[str]]] = [
    ("Weight Loss", [
        "weight loss", "semaglutide", "tirzepatide", "ozempic", "wegovy",
        "mounjaro", "zepbound", "glp-1", "glp1", "lost weight", "shed",
        "down 10", "down 20", "down 30", "lost 10", "lost 20", "lost 30",
        "weight management",
    ]),
    ("Morpheus8", [
        "morpheus", "rf microneedling", "skin tightening", "burst",
        "quantum rf", "tightening", "acne scar",
    ]),
    ("Solaria CO2", ["solaria", "co2 laser", "co2 resurfacing", "fractional co2"]),
    ("Lip Filler", ["lip filler", "lip plump", " lips ", "lip injection"]),
    ("Dermal Fillers", [
        "filler", "cheek filler", "chin filler", "jawline filler",
        "facial balancing", "voluma", "juvederm", "restylane",
    ]),
    ("Botox", [
        "botox", "dysport", "jeuveau", "xeomin", "daxxify", "neurotoxin",
        "tox ", "11s", "forehead lines", "crow's feet", "frown lines",
    ]),
    ("Hormone Therapy", ["hormone", "biote", "testosterone", "trt", "menopause"]),
    ("IV Therapy", ["iv therapy", "iv drip", "iv hydration", "myer's", "myers"]),
    ("Microneedling", ["microneedling", "rf needling", "collagen induction"]),
    ("Hydrafacial", ["hydrafacial", "hydra facial", "hydra-facial"]),
    ("Chemical Peel", ["chemical peel", "vi peel", "perfect peel"]),
    ("Laser Hair Removal", ["laser hair", "hair removal", "diolaze"]),
    ("Lash Spa", ["lash", "eyelash", "lashes"]),
    ("PRF/PRP", ["prf", " prp ", "platelet"]),
    ("Facial", ["facial", "geneo", "dermaplaning"]),
]


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


def http_post_form(url: str, fields: dict[str, str]) -> dict:
    data = urllib.parse.urlencode(fields).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get(url: str, headers: dict[str, str]) -> dict:
    req = urllib.request.Request(url, method="GET")
    for k, v in headers.items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_post_json(
    url: str, body: dict, headers: dict[str, str], method: str = "POST"
) -> dict:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    for k, v in headers.items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_gbp_access_token(env: dict[str, str]) -> str:
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


STAR_MAP = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5}


def star_to_int(value) -> int:
    if isinstance(value, (int, float)):
        i = int(value)
        return i if 1 <= i <= 5 else 0
    if isinstance(value, str):
        return STAR_MAP.get(value.upper(), 0)
    return 0


def classify_service(text: str) -> str | None:
    t = (text or "").lower()
    for label, keywords in SERVICE_RULES:
        for kw in keywords:
            if kw in t:
                return label
    return None


def fetch_all_reviews(token: str, account_id: str, location_id: str) -> list[dict]:
    reviews: list[dict] = []
    page_token: str | None = None
    headers = {"Authorization": f"Bearer {token}"}
    while True:
        params = "pageSize=50&orderBy=updateTime%20desc"
        if page_token:
            params += f"&pageToken={urllib.parse.quote(page_token)}"
        url = f"{GBP_V4}/accounts/{account_id}/locations/{location_id}/reviews?{params}"
        data = http_get(url, headers)
        page = data.get("reviews", []) or []
        reviews.extend(page)
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return reviews


def normalize_review(raw: dict) -> dict | None:
    rid = raw.get("reviewId") or ""
    if not rid and "name" in raw:
        m = re.search(r"/reviews/([^/]+)$", raw.get("name", ""))
        if m:
            rid = m.group(1)
    if not rid:
        return None
    rating = star_to_int(raw.get("starRating"))
    if rating <= 0:
        return None
    text = (raw.get("comment") or "").strip()
    reviewer = (raw.get("reviewer") or {}).get("displayName", "").strip()
    if not reviewer:
        reviewer = "Google Reviewer"
    short_name = format_short_name(reviewer)
    service = classify_service(text)
    create_time = raw.get("updateTime") or raw.get("createTime") or None
    return {
        "id": str(uuid.uuid5(GOOGLE_REVIEW_NS, rid)),
        "rating": rating,
        "review_text": text or None,
        "client_name": short_name,
        "service_name": service,
        "source": "google",
        "is_verified": True,
        "created_at": create_time,
    }


def format_short_name(full: str) -> str:
    parts = full.strip().split()
    if not parts:
        return "Google Reviewer"
    if len(parts) == 1:
        return parts[0]
    return f"{parts[0]} {parts[-1][0].upper()}."


def upsert_to_supabase(env: dict[str, str], rows: list[dict]) -> int:
    """Upsert in batches via Supabase REST. Uses ON CONFLICT (id) to dedupe."""
    if not rows:
        return 0
    base = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
    key = env["SUPABASE_SERVICE_ROLE_KEY"]
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Prefer": "resolution=merge-duplicates,return=representation",
    }
    url = f"{base}/rest/v1/client_reviews?on_conflict=id"
    upserted = 0
    BATCH = 50
    for i in range(0, len(rows), BATCH):
        batch = rows[i : i + BATCH]
        try:
            res = http_post_json(url, batch, headers)
            if isinstance(res, list):
                upserted += len(res)
        except urllib.error.HTTPError as e:
            body = ""
            try:
                body = e.read().decode("utf-8")
            except Exception:
                pass
            print(f"  upsert HTTP {e.code}: {body[:300]}", flush=True)
        except Exception as e:
            print(f"  upsert error: {e}", flush=True)
    return upserted


def main() -> int:
    env = load_env()
    needed = [
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_REFRESH_TOKEN",
        "GOOGLE_BUSINESS_ACCOUNT_ID",
        "GOOGLE_BUSINESS_LOCATION_ID",
        "NEXT_PUBLIC_SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
    ]
    missing = [k for k in needed if not env.get(k)]
    if missing:
        sys.exit(f"Missing env vars: {', '.join(missing)}")

    print("Refreshing Google access token...", flush=True)
    token = get_gbp_access_token(env)

    account_id = env["GOOGLE_BUSINESS_ACCOUNT_ID"]
    location_id = env["GOOGLE_BUSINESS_LOCATION_ID"]
    print(
        f"Fetching reviews for accounts/{account_id}/locations/{location_id} ...",
        flush=True,
    )
    started = time.time()
    raw_reviews = fetch_all_reviews(token, account_id, location_id)
    print(
        f"  pulled {len(raw_reviews)} reviews in {time.time() - started:.1f}s",
        flush=True,
    )

    rows: list[dict] = []
    skipped = 0
    for raw in raw_reviews:
        norm = normalize_review(raw)
        if norm is None:
            skipped += 1
            continue
        # client_reviews.review_text is NOT NULL — skip rating-only reviews
        if not (norm["review_text"] or "").strip():
            skipped += 1
            continue
        rows.append(norm)

    by_service = Counter(r["service_name"] or "unclassified" for r in rows)
    by_rating = Counter(r["rating"] for r in rows)

    print()
    print(f"Normalized {len(rows)} reviews ({skipped} skipped — no rating or id):")
    print(f"  Rating distribution: {dict(sorted(by_rating.items()))}")
    print(f"  Service classification:")
    for svc, count in by_service.most_common():
        print(f"    {svc:>20}  {count}")

    sample_with_text = [r for r in rows if (r["review_text"] or "").strip()]
    print()
    print(f"  {len(sample_with_text)} reviews have text content")

    print()
    print("Upserting to Supabase `client_reviews`...", flush=True)
    upserted = upsert_to_supabase(env, rows)
    print(f"  upserted {upserted} rows")

    print()
    print("Done. RealPatientReviews on every landing page will now show")
    print("real Google reviewer names and quotes for matching service categories.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
