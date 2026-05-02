#!/usr/bin/env python3
"""
Publish a post to Google Business Profile (Local Posts API)
===========================================================

Lightweight CLI for publishing announcement posts to your GBP listing.
Posts appear in the Updates section of your Google profile and on the
local-pack listing for ~7 days, contributing meaningful local-SEO signal
when they include the business's target keywords.

Why this matters:
  - GBP posts are one of the few daily local-ranking signals you control.
  - A post about a pricing special with the keyword "co2 laser oswego"
    is direct ranking input for that exact term.

Usage examples:

  # Publish the bundled Solaria CO₂ launch announcement
  python3 scripts/gbp-post.py --preset solaria-co2-launch

  # Publish a custom post
  python3 scripts/gbp-post.py \
      --summary "Your post body up to 1500 chars" \
      --link "https://hellogorgeousmedspa.com/services/solaria-co2" \
      --image "https://hellogorgeousmedspa.com/images/solaria/solaria-device.png"

  # List recent posts published via the API (not the GBP web UI)
  python3 scripts/gbp-post.py --list

Env (read from .env.local):
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
  GOOGLE_BUSINESS_ACCOUNT_ID, GOOGLE_BUSINESS_LOCATION_ID
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

GBP_V4 = "https://mybusiness.googleapis.com/v4"

# Pre-built post copy. Each preset is a launch-quality post with embedded
# target keywords for local search. Keep summary under 1500 chars.
PRESETS: dict[str, dict] = {
    "solaria-co2-launch": {
        "summary": (
            "★ NEW at Hello Gorgeous: Solaria CO₂ Laser is here — full face for $899 "
            "(launch special, typically $1,500+ at plastic surgery offices).\n\n"
            "We've added the InMode Solaria CO₂ fractional laser — the gold standard for "
            "skin resurfacing — right here in downtown Oswego.\n\n"
            "What it treats in ONE session:\n"
            "• Deep wrinkles + fine lines\n"
            "• Acne scars (ice pick, boxcar, rolling)\n"
            "• Sun damage + age spots\n"
            "• Uneven texture + enlarged pores\n"
            "• Hyperpigmentation + skin laxity\n\n"
            "Free consultation required — message us or call 630-636-6193.\n\n"
            "Serving Oswego, Naperville, Aurora, Plainfield, Yorkville.\n\n"
            "Learn more: https://hellogorgeousmedspa.com/services/solaria-co2"
        ),
        "link": "https://hellogorgeousmedspa.com/services/solaria-co2",
        "image": "https://hellogorgeousmedspa.com/images/solaria/solaria-device-hero.png",
    },
    "solaria-co2-aurora": {
        "summary": (
            "Aurora & Naperville clients — InMode Solaria CO₂ fractional laser is now available "
            "in downtown Oswego, just 10–15 minutes away.\n\n"
            "Full face Solaria CO₂ launch special: $899 (typically $1,500+ at plastic surgery offices).\n\n"
            "Skip the drive into the city — get gold-standard CO₂ resurfacing close to home with "
            "a real provider who actually picks up the phone.\n\n"
            "Acne scars, deep wrinkles, sun damage, hyperpigmentation — handled in one treatment.\n\n"
            "Call 630-636-6193 to book your free consultation.\n\n"
            "https://hellogorgeousmedspa.com/co2-laser-aurora-il"
        ),
        "link": "https://hellogorgeousmedspa.com/co2-laser-aurora-il",
        "image": "https://hellogorgeousmedspa.com/images/solaria/solaria-device-hero.png",
    },
    "solaria-co2-acne-scars": {
        "summary": (
            "Acne scars? Solaria CO₂ fractional laser is the most effective treatment available for "
            "ice pick, boxcar, and rolling scars — and we just added it to our toolkit at Hello Gorgeous.\n\n"
            "Launch special: $899 full face (typically $1,500+ at plastic surgery offices).\n\n"
            "InMode Solaria CO₂ creates dramatic, visible improvement in a single session; results "
            "continue improving for 3–6 months as your skin rebuilds collagen.\n\n"
            "Free consultations available. Call 630-636-6193 or book online.\n\n"
            "https://hellogorgeousmedspa.com/services/solaria-co2"
        ),
        "link": "https://hellogorgeousmedspa.com/services/solaria-co2",
        "image": "https://hellogorgeousmedspa.com/images/solaria/solaria-device-hero.png",
    },
}


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


def http_get(url: str, headers: dict[str, str]) -> tuple[int, dict]:
    req = urllib.request.Request(url, method="GET")
    for k, v in headers.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"error": {"message": body}}


def http_post_json(url: str, body: dict, headers: dict[str, str]) -> tuple[int, dict]:
    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method="POST")
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


def get_token(env: dict[str, str]) -> str:
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


def publish_post(
    token: str,
    account_id: str,
    location_id: str,
    summary: str,
    image_url: str | None = None,
) -> None:
    body: dict = {
        "languageCode": "en-US",
        "summary": summary,
        "topicType": "STANDARD",
    }
    if image_url:
        body["media"] = [{"mediaFormat": "PHOTO", "sourceUrl": image_url}]

    url = f"{GBP_V4}/accounts/{account_id}/locations/{location_id}/localPosts"
    status, data = http_post_json(url, body, {"Authorization": f"Bearer {token}"})

    if status not in (200, 201):
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        details = (data.get("error") or {}).get("details")
        sys.exit(f"Post failed ({status}): {msg}\n{json.dumps(details, indent=2) if details else ''}")

    name = data.get("name", "(no name returned)")
    state = data.get("state", "PUBLISHED")
    search_url = data.get("searchUrl", "")
    print(f"✓ Posted to GBP")
    print(f"  state:     {state}")
    print(f"  name:      {name}")
    if search_url:
        print(f"  searchUrl: {search_url}")


def list_recent_posts(
    token: str, account_id: str, location_id: str, limit: int = 10
) -> None:
    url = f"{GBP_V4}/accounts/{account_id}/locations/{location_id}/localPosts?pageSize={limit}"
    status, data = http_get(url, {"Authorization": f"Bearer {token}"})
    if status != 200:
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        sys.exit(f"List failed: {msg}")
    posts = data.get("localPosts", []) or []
    if not posts:
        print("No recent posts found via API.")
        return
    for p in posts:
        when = p.get("createTime", "")[:10]
        state = p.get("state", "")
        topic = p.get("topicType", "")
        summary = (p.get("summary") or "").replace("\n", " ")
        print(f"  {when}  {state:>10}  {topic:>10}  {summary[:90]}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--preset", choices=list(PRESETS.keys()),
                        help="Use a bundled launch post.")
    parser.add_argument("--summary", help="Custom post body (up to 1500 chars).")
    parser.add_argument("--link", help="Optional URL appended to the summary if not already present.")
    parser.add_argument("--image", help="Optional photo URL (must be public https).")
    parser.add_argument("--list", action="store_true",
                        help="List recent posts instead of publishing.")
    args = parser.parse_args()

    env = load_env()
    needed = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN",
              "GOOGLE_BUSINESS_ACCOUNT_ID", "GOOGLE_BUSINESS_LOCATION_ID"]
    miss = [k for k in needed if not env.get(k)]
    if miss:
        sys.exit(f"Missing env vars: {', '.join(miss)}")

    token = get_token(env)
    account_id = env["GOOGLE_BUSINESS_ACCOUNT_ID"]
    location_id = env["GOOGLE_BUSINESS_LOCATION_ID"]

    if args.list:
        list_recent_posts(token, account_id, location_id)
        return 0

    if args.preset:
        preset = PRESETS[args.preset]
        summary = preset["summary"]
        image = preset.get("image")
    elif args.summary:
        summary = args.summary
        if args.link and args.link not in summary:
            summary = f"{summary}\n\n{args.link}"
        image = args.image
    else:
        sys.exit("Provide --preset NAME or --summary TEXT (use --list to see existing posts).")

    publish_post(token, account_id, location_id, summary, image_url=image)
    return 0


if __name__ == "__main__":
    sys.exit(main())
