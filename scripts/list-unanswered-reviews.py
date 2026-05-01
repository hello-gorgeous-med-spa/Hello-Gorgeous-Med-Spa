#!/usr/bin/env python3
"""
List Google Business Profile reviews that have NO owner reply yet.

Why: Google explicitly factors review-response rate into local rankings, and
a fast public reply on a 1-star review is the cheapest way to neutralize a
negative impression in the SERP. This audit shows you which reviews still
need a human (or AI-drafted) response.

Output: writes docs/UNANSWERED_REVIEWS_<date>.md and prints a summary.

Run: python3 -u scripts/list-unanswered-reviews.py
"""

from __future__ import annotations

import datetime as dt
import json
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env.local"
DOCS_DIR = REPO_ROOT / "docs"

GBP_V4 = "https://mybusiness.googleapis.com/v4"
STAR_MAP = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5}


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


def main() -> int:
    env = load_env()
    res = http_post_form(
        "https://oauth2.googleapis.com/token",
        {
            "client_id": env["GOOGLE_CLIENT_ID"],
            "client_secret": env["GOOGLE_CLIENT_SECRET"],
            "refresh_token": env["GOOGLE_REFRESH_TOKEN"],
            "grant_type": "refresh_token",
        },
    )
    token = res.get("access_token")
    if not token:
        sys.exit(f"Token refresh failed: {res}")

    account_id = env["GOOGLE_BUSINESS_ACCOUNT_ID"]
    location_id = env["GOOGLE_BUSINESS_LOCATION_ID"]

    reviews: list[dict] = []
    page_token = None
    while True:
        params = "pageSize=50&orderBy=updateTime%20desc"
        if page_token:
            params += f"&pageToken={urllib.parse.quote(page_token)}"
        url = f"{GBP_V4}/accounts/{account_id}/locations/{location_id}/reviews?{params}"
        data = http_get(url, {"Authorization": f"Bearer {token}"})
        reviews.extend(data.get("reviews", []) or [])
        page_token = data.get("nextPageToken")
        if not page_token:
            break

    total = len(reviews)
    unanswered = [r for r in reviews if not r.get("reviewReply")]
    by_rating = Counter(STAR_MAP.get(r.get("starRating", ""), 0) for r in unanswered)
    answered = total - len(unanswered)
    response_rate = (answered / total * 100) if total else 0

    today = dt.date.today().isoformat()
    out_md = DOCS_DIR / f"UNANSWERED_REVIEWS_{today}.md"
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    lines: list[str] = []
    lines.append(f"# Unanswered Google Reviews — {today}")
    lines.append("")
    lines.append(f"**Total reviews:** {total}")
    lines.append(f"**Already replied:** {answered} ({response_rate:.0f}% response rate)")
    lines.append(f"**Unanswered:** {len(unanswered)}")
    lines.append("")
    lines.append("**Unanswered by rating:**")
    for stars in [5, 4, 3, 2, 1]:
        n = by_rating.get(stars, 0)
        if n:
            flag = " 🚨" if stars <= 2 else ""
            lines.append(f"- {stars}-star: {n}{flag}")
    lines.append("")
    lines.append("---")
    lines.append("")

    sorted_unans = sorted(
        unanswered,
        key=lambda r: (
            STAR_MAP.get(r.get("starRating", ""), 0),
            r.get("updateTime") or "",
        ),
    )

    for r in sorted_unans:
        stars = STAR_MAP.get(r.get("starRating", ""), 0)
        reviewer = (r.get("reviewer") or {}).get("displayName", "Anonymous")
        when = (r.get("updateTime") or r.get("createTime") or "")[:10]
        comment = (r.get("comment") or "").strip()
        rid = r.get("reviewId") or r.get("name", "").split("/reviews/")[-1]
        flag = ""
        if stars <= 2:
            flag = " 🚨 PRIORITY"
        lines.append(f"### {stars}{'★' * stars}{'☆' * (5 - stars)}  {reviewer} — {when}{flag}")
        lines.append(f"`reviewId:` `{rid}`")
        lines.append("")
        if comment:
            lines.append("> " + comment.replace("\n", "\n> "))
        else:
            lines.append("_(rating only — no text)_")
        lines.append("")
        lines.append("---")
        lines.append("")

    out_md.write_text("\n".join(lines))

    print(f"Total reviews:      {total}")
    print(f"Already replied:    {answered} ({response_rate:.0f}%)")
    print(f"Unanswered:         {len(unanswered)}")
    print()
    print("Unanswered by rating:")
    for stars in [5, 4, 3, 2, 1]:
        n = by_rating.get(stars, 0)
        if n:
            print(f"  {stars}-star: {n}")
    print()
    print(f"Detail report: {out_md.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
