#!/usr/bin/env python3
"""
Publish a question + owner answer to Google Business Profile Q&A.

Why it matters:
  - Q&A entries appear directly on your knowledge panel and local pack
    listing. Google indexes them as content for ranking.
  - The owner can post BOTH the question and the answer (allowed by
    Google's policy as long as the question is something a customer
    might genuinely ask).
  - For a service that is unique in the area ("only place doing CO2 in
    the Fox Valley"), a pre-emptive Q&A captures that long-tail search
    traffic on the listing itself.

Usage:
  python3 scripts/gbp-qa.py --preset solaria-co2-only-fox-valley
  python3 scripts/gbp-qa.py --question "..." --answer "..."
  python3 scripts/gbp-qa.py --list

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

QA_API = "https://mybusinessqanda.googleapis.com/v1"

PRESETS: dict[str, dict[str, str]] = {
    "solaria-co2-only-fox-valley": {
        "question": "Do you offer CO2 laser resurfacing? Is anyone in the Fox Valley doing it?",
        "answer": (
            "Yes — and we are currently the only practice in the Fox Valley offering Solaria CO2 "
            "fractional laser resurfacing by InMode. Full face is $899 right now (launch special, "
            "regularly $1,500+). It treats deep wrinkles, acne scars, sun damage, hyperpigmentation, "
            "and skin laxity in a single treatment with 5-7 days of downtime. Free consultations are "
            "required to confirm candidacy. Call 630-636-6193 or visit "
            "https://hellogorgeousmedspa.com/services/solaria-co2."
        ),
    },
    "solaria-co2-pricing": {
        "question": "How much does CO2 laser cost at Hello Gorgeous?",
        "answer": (
            "Our launch special for full-face Solaria CO2 fractional laser is $899 (regularly $1,500+ "
            "elsewhere). A package of 3 sessions is $2,397 for clients with deeper scarring or "
            "significant sun damage. Add-on areas (neck, eyes, hands, body) are priced separately. "
            "Free consultation required. Call 630-636-6193."
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
            "acne scars, and significant sun damage. Many clients combine both. We are the only "
            "practice in the Fox Valley with both technologies. Free consult required to determine "
            "which is right for you. 630-636-6193."
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--preset", choices=list(PRESETS.keys()))
    parser.add_argument("--question")
    parser.add_argument("--answer")
    parser.add_argument("--list", action="store_true")
    args = parser.parse_args()

    env = load_env()
    needed = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN",
              "GOOGLE_BUSINESS_LOCATION_ID"]
    miss = [k for k in needed if not env.get(k)]
    if miss:
        sys.exit(f"Missing env vars: {', '.join(miss)}")

    token = refresh_token(env)
    location_id = env["GOOGLE_BUSINESS_LOCATION_ID"]

    if args.list:
        list_questions(token, location_id)
        return 0

    if args.preset:
        p = PRESETS[args.preset]
        q, a = p["question"], p["answer"]
    elif args.question and args.answer:
        q, a = args.question.strip(), args.answer.strip()
    else:
        sys.exit("Provide --preset NAME, or --question TEXT --answer TEXT, or --list.")

    post_question_and_answer(token, location_id, q, a)
    return 0


if __name__ == "__main__":
    sys.exit(main())
