#!/usr/bin/env python3
"""
Auto-reply to Google Business Profile reviews
=============================================

Why this matters:
  - Google factors review-response rate into local rankings.
  - A timely public reply on a negative review neutralizes its SERP impact
    by showing future customers the business cares.
  - Replying to 5-star reviews tells Google your listing is actively managed.

Strategy (built-in safety):
  - 5★ and 4★: AUTO-SAFE. Templates are warm, brand-tone, and rotate so
    Google does not see duplicate-text replies across the corpus.
  - ≤3★: DRAFT-ONLY. The script writes drafts to a markdown file but does
    NOT auto-send. You must review them first and send via:
      python3 scripts/reply-to-reviews.py --send-negative --review-id <id>
    or via the GBP web UI / existing hub POST endpoint.

Usage:
  # Dry run (default) — writes drafts to docs/REVIEW_REPLIES_<date>.md
  python3 scripts/reply-to-reviews.py

  # Send all positive (5★ and 4★) replies live
  python3 scripts/reply-to-reviews.py --send-positive

  # Send a single negative review reply (after you have edited the draft)
  python3 scripts/reply-to-reviews.py --send-negative --review-id <id> \
      --comment "your custom text"

Env (read from .env.local):
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
  GOOGLE_BUSINESS_ACCOUNT_ID, GOOGLE_BUSINESS_LOCATION_ID
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env.local"
DOCS_DIR = REPO_ROOT / "docs"

GBP_V4 = "https://mybusiness.googleapis.com/v4"
STAR_MAP = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5}
PHONE = "(630) 636-6193"
URL = "hellogorgeousmedspa.com"

# ------------------------------------------------------------------
# Reply templates
# ------------------------------------------------------------------
# Each template uses {first} for the reviewer's first name. Templates
# rotate per-review (hash of reviewId -> index) so identical-text replies
# are never sent across the corpus, which keeps Google from flagging the
# replies as duplicate content.
# ------------------------------------------------------------------

REPLIES_5_STAR_WITH_TEXT: list[str] = [
    "Thank you so much, {first}! It made our whole day reading this. We are so happy you loved your visit and we cannot wait to see you back at Hello Gorgeous. xoxo — Danielle",
    "{first}, thank you for taking the time to write this review! Reviews like yours are the reason we love what we do. See you next visit! — The Hello Gorgeous team",
    "Aw {first}, thank you! You absolutely made our week. We are so grateful you trust us with your beauty + wellness goals. — Danielle and the HG team",
    "Thank you, {first}! We work hard to deliver an experience worth talking about and your words mean everything. We will see you soon! — Hello Gorgeous Med Spa",
    "{first}, thank you for the 5-star love! We are so glad you felt taken care of. Cannot wait to welcome you back. — Danielle, Hello Gorgeous",
    "Thank you, {first}! We treat every client like family and we are so happy that came through. See you soon! — The Hello Gorgeous team",
    "We appreciate you, {first}! Thank you for trusting us and for sharing your experience. We love having you as a client! — Hello Gorgeous Med Spa",
    "Thank you so much for the kind words, {first}! We are so happy you had a great visit and we look forward to seeing you again soon. — Danielle",
]

REPLIES_5_STAR_NO_TEXT: list[str] = [
    "Thank you so much for the 5-star review, {first}! We appreciate you and cannot wait to see you again at Hello Gorgeous! — Danielle",
    "Thank you, {first}! Your support means the world to us. See you next visit! — The Hello Gorgeous team",
    "{first}, thank you for the 5 stars! We are so glad you had a great experience. See you soon! — Hello Gorgeous Med Spa",
    "Thank you for the love, {first}! We are so grateful you chose Hello Gorgeous. — Danielle and the team",
]

REPLIES_4_STAR_WITH_TEXT: list[str] = [
    "Thank you for the 4-star review, {first}! We are so glad you had a positive experience and would love the opportunity to make your next visit a 5-star one. Please reach out at " + PHONE + " — we would love to hear more. — Danielle",
    "{first}, thank you for taking the time to share your feedback! We always want to be better and would love to hear what we can improve. Feel free to call " + PHONE + ". Thank you for trusting us! — Hello Gorgeous",
    "Thank you so much, {first}! We are happy you enjoyed your visit and we would love to know what would have made it perfect. Give us a call anytime at " + PHONE + ". — Danielle and the team",
]

REPLIES_4_STAR_NO_TEXT: list[str] = [
    "Thank you for the review, {first}! We would love to hear what we can do to make your next visit a 5-star one — please reach out anytime at " + PHONE + ". — Danielle",
    "{first}, thank you for visiting Hello Gorgeous! We would appreciate any feedback that would help us be even better next time. Call us at " + PHONE + ". — The HG team",
]

# Negative-review drafts (≤3★). These are starting points only — the owner
# MUST personalize each one before sending. They acknowledge the specific
# concern, offer a direct line, and never argue.
NEG_DRAFTS = {
    3: [
        "{first}, thank you for the honest feedback. We are sorry your visit did not meet your expectations and we want to make it right. Please call Danielle directly at " + PHONE + " — we want to hear what happened and earn back your trust. — Hello Gorgeous Med Spa",
    ],
    2: [
        "{first}, we are truly sorry your experience was not what you (or we) wanted it to be. Your feedback is the only way we can grow. Please call Danielle directly at " + PHONE + " so we can listen and make this right. — Hello Gorgeous Med Spa",
    ],
    1: [
        "{first}, we are truly sorry. This is not the experience we want for any client and we appreciate you taking the time to tell us. Please call Danielle directly at " + PHONE + " so we can hear you out and do whatever we can to make this right. — Hello Gorgeous Med Spa",
    ],
}


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------


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


def http_get(url: str, headers: dict[str, str]) -> dict:
    req = urllib.request.Request(url, method="GET")
    for k, v in headers.items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def http_put_json(url: str, body: dict, headers: dict[str, str]) -> tuple[int, dict]:
    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method="PUT")
    req.add_header("Content-Type", "application/json")
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
        sys.exit(f"Token refresh failed: {res}")
    return res["access_token"]


def first_name(full: str) -> str:
    s = (full or "").strip()
    if not s:
        return "there"
    parts = s.split()
    fn = parts[0]
    fn = "".join(c for c in fn if c.isalpha() or c in "'-")
    if not fn or len(fn) < 2:
        return "there"
    return fn[0].upper() + fn[1:]


def pick_template(rid: str, options: list[str]) -> str:
    """Deterministically pick a template index based on review id hash so
    re-runs choose the same template for the same review (idempotent) and
    no two adjacent reviews get identical text."""
    h = int(hashlib.md5(rid.encode()).hexdigest(), 16)
    return options[h % len(options)]


def fetch_all_reviews(token: str, account_id: str, location_id: str) -> list[dict]:
    out: list[dict] = []
    page_token: str | None = None
    while True:
        params = "pageSize=50&orderBy=updateTime%20desc"
        if page_token:
            params += f"&pageToken={urllib.parse.quote(page_token)}"
        url = f"{GBP_V4}/accounts/{account_id}/locations/{location_id}/reviews?{params}"
        data = http_get(url, {"Authorization": f"Bearer {token}"})
        out.extend(data.get("reviews", []) or [])
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return out


def review_id_of(r: dict) -> str:
    rid = r.get("reviewId") or ""
    if rid:
        return rid
    name = r.get("name", "")
    if "/reviews/" in name:
        return name.split("/reviews/")[-1]
    return ""


def send_reply(token: str, account_id: str, location_id: str, rid: str, comment: str) -> tuple[bool, str]:
    url = f"{GBP_V4}/accounts/{account_id}/locations/{location_id}/reviews/{rid}/reply"
    status, body = http_put_json(
        url, {"comment": comment}, {"Authorization": f"Bearer {token}"}
    )
    if status == 200:
        return True, "ok"
    msg = (body.get("error") or {}).get("message") or f"HTTP {status}"
    return False, msg


def build_reply(r: dict) -> tuple[str, str]:
    """Returns (tier, reply_text) where tier is 'auto' for 5/4★ or
    'manual' for ≤3★ drafts."""
    rid = review_id_of(r)
    rating = STAR_MAP.get(r.get("starRating", ""), 0)
    reviewer = (r.get("reviewer") or {}).get("displayName", "")
    fname = first_name(reviewer)
    has_text = bool((r.get("comment") or "").strip())

    if rating == 5:
        pool = REPLIES_5_STAR_WITH_TEXT if has_text else REPLIES_5_STAR_NO_TEXT
        return "auto", pick_template(rid, pool).format(first=fname)
    if rating == 4:
        pool = REPLIES_4_STAR_WITH_TEXT if has_text else REPLIES_4_STAR_NO_TEXT
        return "auto", pick_template(rid, pool).format(first=fname)
    if rating in (1, 2, 3):
        return "manual", pick_template(rid, NEG_DRAFTS[rating]).format(first=fname)
    return "skip", ""


# ------------------------------------------------------------------
# Modes
# ------------------------------------------------------------------


def run_dry_run(env: dict[str, str], reviews: list[dict]) -> None:
    """Write drafts to a markdown file. Send nothing."""
    today = dt.date.today().isoformat()
    out = DOCS_DIR / f"REVIEW_REPLIES_{today}.md"

    auto: list[tuple[dict, str]] = []
    manual: list[tuple[dict, str]] = []
    for r in reviews:
        if r.get("reviewReply"):
            continue
        tier, body = build_reply(r)
        if tier == "auto":
            auto.append((r, body))
        elif tier == "manual":
            manual.append((r, body))

    by_rating = Counter(STAR_MAP.get(r.get("starRating", ""), 0) for r, _ in auto + manual)

    lines: list[str] = []
    lines.append(f"# Google Review Reply Drafts — {today}")
    lines.append("")
    lines.append(f"**Auto-send safe (4★+5★):** {len(auto)}")
    lines.append(f"**Owner-review required (1★/2★/3★):** {len(manual)}")
    lines.append("")
    lines.append("**Distribution:**")
    for stars in [5, 4, 3, 2, 1]:
        n = by_rating.get(stars, 0)
        if n:
            lines.append(f"- {stars}-star: {n}")
    lines.append("")
    lines.append("To send all 4★+5★ replies live:")
    lines.append("```bash")
    lines.append("python3 scripts/reply-to-reviews.py --send-positive")
    lines.append("```")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## ⚠️ Negative-review drafts — review and edit before sending")
    lines.append("")
    for r, body in manual:
        rid = review_id_of(r)
        rating = STAR_MAP.get(r.get("starRating", ""), 0)
        reviewer = (r.get("reviewer") or {}).get("displayName", "")
        when = (r.get("updateTime") or r.get("createTime") or "")[:10]
        comment = (r.get("comment") or "").strip()
        lines.append(f"### {rating}★ {reviewer} — {when}")
        lines.append(f"`reviewId:` `{rid}`")
        lines.append("")
        if comment:
            lines.append("**Their review:**")
            lines.append("> " + comment.replace("\n", "\n> "))
            lines.append("")
        lines.append("**Draft reply:**")
        lines.append(f"> {body}")
        lines.append("")
        lines.append("**Send command (after editing if needed):**")
        lines.append("```bash")
        safe = body.replace('"', '\\"')
        lines.append(
            f"python3 scripts/reply-to-reviews.py --send-negative --review-id {rid} --comment \"{safe}\""
        )
        lines.append("```")
        lines.append("")
        lines.append("---")
        lines.append("")
    lines.append("## ✓ 4★ + 5★ auto-replies (will be sent on --send-positive)")
    lines.append("")
    for r, body in auto:
        rid = review_id_of(r)
        rating = STAR_MAP.get(r.get("starRating", ""), 0)
        reviewer = (r.get("reviewer") or {}).get("displayName", "")
        lines.append(f"- **{rating}★ {reviewer}** — `{rid[:20]}...`")
        lines.append(f"  > {body}")
    lines.append("")

    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines))

    print(f"Drafts written to {out.relative_to(REPO_ROOT)}")
    print()
    print(f"  Auto-send safe (4★+5★):  {len(auto)}")
    print(f"  Negative drafts (≤3★):   {len(manual)}")
    print()
    print("Next steps:")
    print("  1. Review negative drafts in the markdown file")
    print("  2. Run: python3 scripts/reply-to-reviews.py --send-positive")
    print("  3. For each negative review, send when ready (commands in the file)")


def run_send_positive(env: dict[str, str], reviews: list[dict]) -> None:
    """Send all 4★ and 5★ replies live."""
    token = get_token(env)
    account_id = env["GOOGLE_BUSINESS_ACCOUNT_ID"]
    location_id = env["GOOGLE_BUSINESS_LOCATION_ID"]

    sent = 0
    failed = 0
    skipped = 0
    for r in reviews:
        if r.get("reviewReply"):
            skipped += 1
            continue
        tier, body = build_reply(r)
        if tier != "auto":
            continue
        rid = review_id_of(r)
        if not rid:
            continue
        rating = STAR_MAP.get(r.get("starRating", ""), 0)
        reviewer = (r.get("reviewer") or {}).get("displayName", "Anonymous")
        ok, msg = send_reply(token, account_id, location_id, rid, body)
        if ok:
            sent += 1
            print(f"  [{rating}★] {reviewer:>30} → sent", flush=True)
        else:
            failed += 1
            print(f"  [{rating}★] {reviewer:>30} → FAIL: {msg}", flush=True)
        time.sleep(1)
    print()
    print(f"Sent: {sent}    Failed: {failed}    Already replied: {skipped}")


def run_send_negative(env: dict[str, str], review_id: str, comment: str) -> None:
    if not review_id or not comment:
        sys.exit("--review-id and --comment are both required for --send-negative")
    token = get_token(env)
    account_id = env["GOOGLE_BUSINESS_ACCOUNT_ID"]
    location_id = env["GOOGLE_BUSINESS_LOCATION_ID"]
    ok, msg = send_reply(token, account_id, location_id, review_id, comment)
    if ok:
        print(f"Reply sent for review {review_id}")
    else:
        sys.exit(f"Reply failed: {msg}")


# ------------------------------------------------------------------
# main
# ------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--send-positive", action="store_true",
                        help="Send all 4★ and 5★ replies live to Google.")
    parser.add_argument("--send-negative", action="store_true",
                        help="Send a single negative-review reply (requires --review-id and --comment).")
    parser.add_argument("--review-id", default="")
    parser.add_argument("--comment", default="")
    args = parser.parse_args()

    env = load_env()
    needed = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN",
              "GOOGLE_BUSINESS_ACCOUNT_ID", "GOOGLE_BUSINESS_LOCATION_ID"]
    miss = [k for k in needed if not env.get(k)]
    if miss:
        sys.exit(f"Missing env vars: {', '.join(miss)}")

    if args.send_negative:
        run_send_negative(env, args.review_id.strip(), args.comment.strip())
        return 0

    print("Fetching all reviews from Google Business Profile...", flush=True)
    token = get_token(env)
    reviews = fetch_all_reviews(
        token, env["GOOGLE_BUSINESS_ACCOUNT_ID"], env["GOOGLE_BUSINESS_LOCATION_ID"]
    )
    print(f"  pulled {len(reviews)} total reviews", flush=True)

    if args.send_positive:
        run_send_positive(env, reviews)
    else:
        run_dry_run(env, reviews)
    return 0


if __name__ == "__main__":
    sys.exit(main())
