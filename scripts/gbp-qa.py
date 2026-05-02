#!/usr/bin/env python3
"""
Generate paste-ready Q&A entries for Google Business Profile.

Status: Google deprecated the My Business Q&A API in 2024. Q&A entries
still exist as a feature in Google Maps/Search and are still indexed for
ranking, but the API no longer accepts posts. This script now writes the
preset entries to a markdown file you can paste directly into the Google
Maps app on your phone (Profile -> Updates -> Q&A) in ~2 minutes.

Why Q&A still matters:
  - Q&A entries appear directly on your knowledge panel and local pack
    listing. Google indexes them as content for ranking.
  - The owner can post BOTH the question and the answer (allowed by
    Google's policy as long as the question is something a customer
    might genuinely ask).
  - For a freshly-launched service or specialty offering, a pre-emptive
    Q&A captures long-tail search traffic on the listing itself.

Usage:
  python3 scripts/gbp-qa.py                      # writes all presets to docs/
  python3 scripts/gbp-qa.py --preset NAME        # just print one entry

How to actually post (manual, ~2 min):
  1. Open the Google Maps app on your phone (signed in as the owner)
  2. Profile (your photo, top right) -> Your Business profile
  3. Tap the spa -> "Q&A" tab
  4. Tap "Ask a question", paste the question, post
  5. Tap your new question -> "Answer", paste the answer, post
  6. Repeat for each entry
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

QA_API = "https://mybusinessqanda.googleapis.com/v1"

PRESETS: dict[str, dict[str, str]] = {
    "solaria-co2-launch": {
        "question": "Do you offer CO2 laser resurfacing in Oswego?",
        "answer": (
            "Yes — we now offer InMode Solaria CO2 fractional laser resurfacing right here in "
            "downtown Oswego. Full face is $899 right now (launch special; typically $1,500+ at "
            "plastic surgery offices). It treats deep wrinkles, acne scars, sun damage, "
            "hyperpigmentation, and skin laxity in a single treatment with 5-7 days of downtime. "
            "Free consultations are required to confirm candidacy. Call 630-636-6193 or visit "
            "https://hellogorgeousmedspa.com/services/solaria-co2."
        ),
    },
    "solaria-co2-pricing": {
        "question": "How much does CO2 laser cost at Hello Gorgeous?",
        "answer": (
            "Our launch special for full-face Solaria CO2 fractional laser is $899 (typically "
            "$1,500+ at plastic surgery offices). A package of 3 sessions is $2,397 for clients "
            "with deeper scarring or significant sun damage. Add-on areas (neck, eyes, hands, body) "
            "are priced separately. Free consultation required. Call 630-636-6193."
        ),
    },
    "solaria-co2-vs-morpheus": {
        "question": "What's the difference between Solaria CO2 laser and Morpheus8?",
        "answer": (
            "Both treat similar concerns but work very differently. Morpheus8 is RF microneedling — "
            "tiny needles deliver radiofrequency energy up to 8mm deep, with 2-3 days downtime, "
            "best for collagen rebuilding, body contouring, and subtle scarring. Solaria CO2 is "
            "ablative laser resurfacing — it actually removes the top layer of damaged skin to "
            "force a complete rebuild, with 5-7 days downtime, best for deep wrinkles, severe "
            "acne scars, and significant sun damage. Many clients combine both, and we offer "
            "both right here in Oswego. Free consult required to determine which is right for "
            "you. 630-636-6193."
        ),
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


def refresh_token(env: dict[str, str]) -> str:
    data = urllib.parse.urlencode({
        "client_id": env["GOOGLE_CLIENT_ID"],
        "client_secret": env["GOOGLE_CLIENT_SECRET"],
        "refresh_token": env["GOOGLE_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token", data=data, method="POST"
    )
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=20) as resp:
        out = json.loads(resp.read())
    if "access_token" not in out:
        sys.exit(f"OAuth refresh failed: {out}")
    return out["access_token"]


def http_json(
    url: str, method: str, headers: dict[str, str], body: dict | None = None
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


def post_question_and_answer(
    token: str, location_id: str, question: str, answer: str
) -> None:
    headers = {"Authorization": f"Bearer {token}"}

    # Step 1: post the question against the location.
    q_url = f"{QA_API}/locations/{location_id}/questions"
    q_body = {"text": question}
    status, data = http_json(q_url, "POST", headers, q_body)
    if status not in (200, 201):
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        sys.exit(f"Question post failed ({status}): {msg}\n{json.dumps(data, indent=2)}")
    q_name = data.get("name", "")
    if not q_name:
        sys.exit(f"No question name returned: {data}")
    print(f"✓ Question posted: {q_name}")

    # Step 2: PUT the owner's answer (upsertAnswer endpoint).
    a_url = f"{QA_API}/{q_name}/answers:upsert"
    a_body = {"answer": {"text": answer}}
    status, data = http_json(a_url, "POST", headers, a_body)
    if status not in (200, 201):
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        sys.exit(f"Answer post failed ({status}): {msg}\n{json.dumps(data, indent=2)}")
    print(f"✓ Owner answer attached")
    print(f"  question: {question}")
    print(f"  answer:   {answer[:100]}...")


def list_questions(token: str, location_id: str) -> None:
    headers = {"Authorization": f"Bearer {token}"}
    url = f"{QA_API}/locations/{location_id}/questions?pageSize=20"
    status, data = http_json(url, "GET", headers)
    if status != 200:
        msg = (data.get("error") or {}).get("message") or f"HTTP {status}"
        sys.exit(f"List failed: {msg}")
    qs = data.get("questions", []) or []
    if not qs:
        print("No questions on this listing yet.")
        return
    for q in qs:
        text = (q.get("text") or "")[:120]
        author_type = (q.get("author") or {}).get("type", "")
        when = q.get("createTime", "")[:10]
        ans = (q.get("topAnswers") or [])
        ans_text = (ans[0].get("text") if ans else "")[:120]
        print(f"  [{when}] {author_type}: {text}")
        if ans_text:
            print(f"    ↳ answer: {ans_text}")


def write_paste_file() -> Path:
    """Write all presets to a markdown file the owner can paste from."""
    import datetime as dt

    out = REPO_ROOT / "docs" / f"GBP_QA_PASTE_{dt.date.today().isoformat()}.md"
    out.parent.mkdir(parents=True, exist_ok=True)

    lines: list[str] = []
    lines.append("# Google Business Profile — Q&A entries to paste")
    lines.append("")
    lines.append(
        "Google deprecated the Q&A API, so these need to be added manually. "
        "Total time: ~2 minutes from your phone."
    )
    lines.append("")
    lines.append("## How to post each one (mobile, fastest)")
    lines.append("")
    lines.append("1. Open **Google Maps** on your phone (signed in as the owner)")
    lines.append("2. Tap your profile photo (top right) -> **Your Business profile**")
    lines.append("3. Tap **Hello Gorgeous Med Spa** -> the **Q&A** tab")
    lines.append("4. Tap **Ask a question**, paste the **question**, post")
    lines.append("5. Tap the question you just posted -> **Answer**, paste the **answer**, post")
    lines.append("6. Repeat for each entry below")
    lines.append("")
    lines.append("(Owner-posted Q&A is allowed by Google policy as long as the")
    lines.append("question is something a customer might genuinely ask.)")
    lines.append("")
    lines.append("---")
    lines.append("")

    for i, (key, p) in enumerate(PRESETS.items(), start=1):
        lines.append(f"## {i}. `{key}`")
        lines.append("")
        lines.append("**Question (paste this):**")
        lines.append("")
        lines.append("```")
        lines.append(p["question"])
        lines.append("```")
        lines.append("")
        lines.append("**Answer (paste this):**")
        lines.append("")
        lines.append("```")
        lines.append(p["answer"])
        lines.append("```")
        lines.append("")
        lines.append("---")
        lines.append("")

    out.write_text("\n".join(lines))
    return out


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--preset", choices=list(PRESETS.keys()),
                        help="Print a single Q&A entry to stdout (no file write).")
    args = parser.parse_args()

    if args.preset:
        p = PRESETS[args.preset]
        print(f"QUESTION:\n{p['question']}\n")
        print(f"ANSWER:\n{p['answer']}")
        return 0

    out = write_paste_file()
    print(f"Wrote {len(PRESETS)} paste-ready Q&A entries to:")
    print(f"  {out.relative_to(REPO_ROOT)}")
    print()
    print("Open Google Maps on your phone -> Your Business profile -> Q&A tab")
    print("and paste each one. ~2 minutes total.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
