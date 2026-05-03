#!/usr/bin/env python3
"""
One-shot: push the 24-item CURATED GBP services list (from
docs/GBP_SERVICES_PASTE_2026-05-03.md) directly via the Business
Information API.

Differences from gbp-sync-services.py (parked):
  - Hardcoded 24-item list (right altitude — categories, not 95 SKUs)
  - Drops `languageCode` from freeFormServiceItem.label (suspected
    universal-500 trigger from earlier session)
  - Refreshes OAuth token BEFORE each PATCH attempt (fixes the
    401-mid-retry bug where 600s of backoff outlasted token life)

Modes:
  --read   GET current serviceItems, print, exit 0  (default)
  --smoke  PATCH current + 1 added item (Quantum RF Lipo). Reversible
           because we preserve current items.
  --push   PATCH the full 24-item curated list as a REPLACEMENT.
           Destructive — wipes whatever's in GBP services today.
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

# 24 curated services. Source-of-truth: docs/GBP_SERVICES_PASTE_2026-05-03.md
# All descriptions ASCII-only, <=280 chars. NO languageCode field.
CURATED: list[tuple[str, str]] = [
    ("Botox", "FDA-approved Botox for forehead lines, frown lines (11s), and crow's feet. Onset 5-7 days, lasts 3-4 months. Licensed injectors, natural results, free 15-min consult. Same-week appointments at Hello Gorgeous Med Spa, downtown Oswego."),
    ("Dysport", "Dysport is a Botox alternative with faster onset (2-3 days) that spreads slightly more - great for the forehead. FDA-approved botulinum toxin, natural results, lasts 3-4 months. Licensed injectors at Hello Gorgeous Med Spa, Oswego."),
    ("Jeuveau", "Jeuveau (#Newtox) is an FDA-approved botulinum toxin similar to Botox at competitive pricing. Smooths frown lines, forehead creases, and crow's feet. Lasts 3-4 months. Licensed injectors at Hello Gorgeous Med Spa, Oswego."),
    ("Dermal Fillers", "Hyaluronic acid filler to restore volume, define cheeks, smooth nasolabial folds, and lift jawline. Priced per syringe; consultation included. Natural-looking results from licensed injectors at Hello Gorgeous Med Spa, Oswego."),
    ("Lip Filler", "HA lip filler for volume, shape, and hydration. 0.5ml for subtle enhancement or 1ml for fuller results - lasts 9-12 months on average. Conservative, natural-looking technique by licensed injectors at Hello Gorgeous Med Spa, Oswego."),
    ("Lip Flip", "Quick neurotoxin treatment that subtly flips the upper lip outward for a fuller pout. No filler, no downtime, lasts 6-8 weeks. $99 limited-time special at Hello Gorgeous Med Spa, downtown Oswego."),
    ("Morpheus8", "Morpheus8 RF microneedling stimulates collagen and tightens skin on the face and neck. Treats fine lines, laxity, and acne scars at standard depth. 2-3 sessions for full results, minimal downtime. Hello Gorgeous Med Spa, Oswego."),
    ("Morpheus8 Burst (New)", "The newest Morpheus8 protocol: Burst delivers RF energy at multiple skin depths in one pass for faster results and less discomfort than the original. Ideal for jowls, neck, and acne scar revision. One of the few Oswego med spas offering Burst."),
    ("Morpheus8 Deep (Body)", "Morpheus8 Deep uses 7-8mm tips to reach the deeper subdermal fat layer - the gold standard for tightening loose skin on the abdomen, flanks, arms, thighs, and bra line. Non-surgical body contouring with minimal downtime. Exclusive in Oswego."),
    ("CO2 Laser Resurfacing (Solaria)", "InMode Solaria CO2 fractional laser resurfacing treats deep wrinkles, acne scars, sun damage, and skin laxity in a single session. 5-7 days downtime. Launch pricing $899 (typically $1,500+ at plastic surgery offices). Oswego."),
    ("Laser Hair Removal", "Long-pulsed laser hair removal for face and body, all skin types. Most clients see permanent reduction in 6-8 sessions. Single-area, multi-area, and prepaid packages available at Hello Gorgeous Med Spa, downtown Oswego."),
    ("IPL Photofacial", "IPL photofacial targets sun spots, redness, broken capillaries, and uneven tone. Optional pairing with AnteAGE growth factors to accelerate healing and amplify results. Minimal downtime. Hello Gorgeous Med Spa, Oswego."),
    ("Quantum RF Lipo", "Quantum RF is the new non-surgical alternative to liposuction - radiofrequency energy melts fat and tightens skin in one 75-minute session, no incisions, no downtime. Treats abdomen, flanks, arms, and thighs. Results visible in 4-6 weeks. Exclusive to Hello Gorgeous Med Spa in Oswego."),
    ("Semaglutide (Weight Loss)", "Semaglutide is the GLP-1 medication used in Ozempic and Wegovy, prescribed for medically supervised weight loss. Initial consult, labs, and weekly NP support included. Compounded option available at Hello Gorgeous Med Spa, Oswego."),
    ("Tirzepatide (Weight Loss)", "Tirzepatide is a GLP-1 + GIP dual-agonist (same molecule as Mounjaro and Zepbound) for medically supervised weight loss. Tiered dosing, compounded option, weekly support. Hello Gorgeous Med Spa, Oswego."),
    ("Retatrutide (Weight Loss)", "Retatrutide is a triple-action GLP-1 / GIP / glucagon agonist - the next generation beyond semaglutide and tirzepatide, with 24%+ average loss in trials. Physician-supervised, compounded at Hello Gorgeous Med Spa, Oswego."),
    ("PRP Microneedling", "Platelet-rich plasma microneedling triggers collagen production for firmer, brighter, more even-toned skin. Uses your own growth factors. 3-session series typical. Available at Hello Gorgeous Med Spa, Oswego."),
    ("Exosome Treatment", "AnteAGE exosome therapy delivers signaling proteins for cellular regeneration. Reduces inflammation, accelerates healing, anti-ages from the inside out. Pairs well with microneedling or laser. Hello Gorgeous Med Spa, Oswego."),
    ("AnteAGE Stem Cell Treatment", "AnteAGE MD bone-marrow-derived stem cell growth factors layered with microneedling or CO2 laser to maximize collagen response and accelerate healing. The premium add-on at Hello Gorgeous Med Spa, Oswego."),
    ("IV Hydration Therapy", "IV hydration drips delivered by licensed nurses - hydration, immunity, beauty, recovery, and Myers cocktail formulas available. 30-45 minute sessions in our private suite at Hello Gorgeous Med Spa, downtown Oswego."),
    ("Vitamin Injections (B12)", "B12, B-complex, and lipotropic vitamin injections for energy, metabolism, and mood support. Quick walk-in service or add-on to any visit. Hello Gorgeous Med Spa, downtown Oswego."),
    ("NAD+ Therapy", "NAD+ IV infusion for cellular energy, mental clarity, and anti-aging at the mitochondrial level. 3-hour drip in our private suite; benefits felt within 24-48 hours. Hello Gorgeous Med Spa, Oswego."),
    ("GlowTox Facial (Signature)", "Our signature 60-minute facial: hydration + dermaplaning + Baby Tox in one session. Baby Tox uses superficial micro-doses for natural glow without altering facial movement. Hello Gorgeous Med Spa, downtown Oswego."),
    ("Mommy Makeover", "Six rejuvenating treatments in one bundle: PRP microneedling, IV therapy, 40 units of Botox, 3 laser hair removal sessions, IPL photofacial, and B12 injection. $1,500+ value. Hello Gorgeous Med Spa, Oswego."),
]


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.exists():
        sys.exit(f".env.local not found at {ENV_FILE}")
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


def http_request_json(url, method, headers, body=None):
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


def fresh_token(env: dict[str, str]) -> str:
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


def fetch_location(token: str, location_id: str) -> dict:
    url = f"{GBP_INFO_V1}/locations/{location_id}?readMask=serviceItems,categories,title"
    status, data = http_request_json(url, "GET", {"Authorization": f"Bearer {token}"})
    if status != 200:
        sys.exit(f"GET location failed ({status}): {json.dumps(data)[:400]}")
    return data


def primary_gcid(location: dict) -> str:
    cats = location.get("categories") or {}
    primary = cats.get("primaryCategory") or {}
    cid = primary.get("name") or primary.get("categoryId") or ""
    return cid if cid.startswith("gcid:") else "gcid:medical_spa"


def free_form(name: str, desc: str, gcid: str) -> dict:
    """Build a freeFormServiceItem WITHOUT languageCode.
    Category must include 'categories/' prefix per the GET response shape.
    """
    cat = gcid if gcid.startswith("categories/") else f"categories/{gcid}"
    return {
        "freeFormServiceItem": {
            "category": cat,
            "label": {
                "displayName": name,
                "description": desc,
                # NO languageCode — suspected universal-500 trigger
            },
        },
    }


def push_with_token_refresh(env: dict[str, str], location_id: str, items: list[dict]) -> dict:
    """PATCH with retries; refresh token before each attempt."""
    import time
    delays = [0, 60, 180]  # short backoff; we drop on 4xx anyway
    url = f"{GBP_INFO_V1}/locations/{location_id}?updateMask=serviceItems"
    last = (0, {})
    for i, delay in enumerate(delays, start=1):
        if delay:
            print(f"  retry {i-1} -> sleeping {delay}s, then refreshing token")
            time.sleep(delay)
        token = fresh_token(env)  # <-- fresh every attempt
        status, data = http_request_json(
            url, "PATCH", {"Authorization": f"Bearer {token}"},
            body={"serviceItems": items},
        )
        if status == 200:
            print(f"  attempt {i}: 200 OK")
            return data
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        print(f"  attempt {i}: {status} -> {msg}")
        last = (status, data)
        if status in (400, 401, 403):
            break  # permanent — don't waste retries
    sys.exit(f"\nPATCH failed after {len(delays)} attempts: {json.dumps(last[1])[:600]}")


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--read", action="store_true", help="GET current services and exit")
    p.add_argument("--smoke", action="store_true", help="PATCH current + 1 test item")
    p.add_argument("--push", action="store_true", help="PATCH full 24-item curated list (DESTRUCTIVE)")
    args = p.parse_args()

    env = load_env()
    location_id = env.get("GOOGLE_BUSINESS_LOCATION_ID")
    if not location_id:
        sys.exit("GOOGLE_BUSINESS_LOCATION_ID missing from .env.local")

    token = fresh_token(env)
    location = fetch_location(token, location_id)
    gcid = primary_gcid(location)
    current = location.get("serviceItems") or []

    print(f"Location: {location.get('title') or location_id}")
    print(f"Primary GCID: {gcid}")
    print(f"Current serviceItems: {len(current)}")
    for s in current[:50]:
        ff = s.get("freeFormServiceItem") or {}
        label = ff.get("label") or {}
        st = s.get("structuredServiceItem") or {}
        kind = "structured" if st else "free-form"
        name = label.get("displayName") or st.get("serviceTypeId") or "(?)"
        print(f"  - [{kind}] {name}")
    if len(current) > 50:
        print(f"  ... and {len(current) - 50} more")

    if args.read or (not args.smoke and not args.push):
        return

    if args.smoke:
        # Preserve current items + add 1 test ("Quantum RF Lipo" — high-value, likely not present)
        test_name, test_desc = next((n, d) for n, d in CURATED if "Quantum RF" in n)
        new_item = free_form(test_name, test_desc, gcid)
        items = list(current) + [new_item]
        print(f"\nSMOKE: pushing {len(current)} existing + 1 new ({test_name}) = {len(items)} total")
        print("       (no languageCode in new item; existing items kept verbatim)")
        push_with_token_refresh(env, location_id, items)
        print("\n✓ Smoke test PASSED — Quantum RF Lipo is now live in GBP services")
        print("  Run with --push to replace current with the full 24-item curated list")
        return

    if args.push:
        # Preserve existing STRUCTURED items (they match Google's official
        # service categories — rank better than free-form for those queries).
        # Replace free-form items with our curated 24.
        kept_structured = [s for s in current if s.get("structuredServiceItem")]
        items = kept_structured + [free_form(n, d, gcid) for n, d in CURATED]
        print(f"\nPUSH: keeping {len(kept_structured)} structured + replacing free-form with curated 24 = {len(items)} total")
        push_with_token_refresh(env, location_id, items)
        print(f"\n✓ Pushed {len(items)} services to GBP")


if __name__ == "__main__":
    main()
