#!/usr/bin/env python3
"""
Search Console index audit
==========================

Fetches the live sitemap.xml, asks Google's URL Inspection API the index
status of every URL in parallel, categorizes results, and writes a
markdown report to docs/SEO_INDEX_AUDIT_<date>.md.

Required env vars (read from .env.local):
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
  GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN  (with `webmasters` scope)

Run:
  python3 -u scripts/seo-index-audit.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / ".env.local"

SITE_URL = "https://www.hellogorgeousmedspa.com/"
SITEMAP_URL = "https://www.hellogorgeousmedspa.com/sitemap.xml"
DOCS_DIR = REPO_ROOT / "docs"

WORKERS = 8           # parallel API calls (well under 600/min limit)
HTTP_TIMEOUT = 20     # per-request seconds
RETRIES = 2           # extra attempts on transient failure


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


def http_post_json(url: str, body: dict, headers: dict[str, str] | None = None) -> dict:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    for k, v in (headers or {}).items():
        req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_post_form(url: str, fields: dict[str, str]) -> dict:
    data = urllib.parse.urlencode(fields).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get(url: str) -> str:
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
        return resp.read().decode("utf-8")


def get_access_token(env: dict[str, str]) -> str:
    client_id = env.get("GOOGLE_CLIENT_ID")
    client_secret = env.get("GOOGLE_CLIENT_SECRET")
    refresh_token = env.get("GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN")
    if not (client_id and client_secret and refresh_token):
        sys.exit(
            "Missing OAuth env vars. Need GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN."
        )
    res = http_post_form(
        "https://oauth2.googleapis.com/token",
        {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        },
    )
    token = res.get("access_token")
    if not token:
        sys.exit(f"Failed to refresh token: {res}")
    return token


SITEMAP_LOC_RE = re.compile(r"<loc>([^<]+)</loc>")


def fetch_sitemap_urls() -> list[str]:
    print(f"Fetching {SITEMAP_URL} ...", flush=True)
    body = http_get(SITEMAP_URL)
    urls = SITEMAP_LOC_RE.findall(body)
    seen, result = set(), []
    for u in urls:
        u = u.strip()
        if u and u not in seen:
            seen.add(u)
            result.append(u)
    return result


def inspect_url(token: str, url: str) -> dict:
    body = {"inspectionUrl": url, "siteUrl": SITE_URL, "languageCode": "en-US"}
    last_err = None
    for attempt in range(RETRIES + 1):
        try:
            return http_post_json(
                "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
                body,
                {"Authorization": f"Bearer {token}"},
            )
        except urllib.error.HTTPError as e:
            try:
                err_body = e.read().decode("utf-8")
            except Exception:
                err_body = ""
            last_err = f"HTTP {e.code}: {err_body[:200]}"
            if e.code == 429:
                time.sleep(2 + attempt * 2)
            else:
                break
        except Exception as e:
            last_err = str(e)
            time.sleep(1 + attempt)
    return {"_error": last_err or "unknown error"}


def categorize(idx: dict | None) -> str:
    if not idx:
        return "unknown"
    verdict = (idx.get("verdict") or "").upper()
    coverage = (idx.get("coverageState") or "").lower()
    if verdict == "PASS" and "indexed" in coverage:
        return "indexed"
    if "discovered" in coverage:
        return "discovered_not_indexed"
    if "crawled" in coverage and "indexed" not in coverage:
        return "crawled_not_indexed"
    if "duplicate" in coverage:
        return "duplicate"
    if "alternate" in coverage:
        return "alternate"
    if "error" in (verdict.lower() + " " + coverage):
        return "error"
    if verdict == "NEUTRAL":
        return "discovered_not_indexed"
    if "excluded" in coverage or "noindex" in coverage:
        return "excluded"
    return "other"


def short(url: str) -> str:
    base = SITE_URL.rstrip("/")
    return url[len(base):] if url.startswith(base) else url or "/"


def inspect_with_label(token: str, url: str) -> dict:
    result = inspect_url(token, url)
    if "_error" in result:
        return {"url": url, "bucket": "api_error", "error": result["_error"]}
    ir = result.get("inspectionResult", {})
    idx = ir.get("indexStatusResult", {}) or {}
    return {
        "url": url,
        "verdict": idx.get("verdict"),
        "coverage": idx.get("coverageState"),
        "lastCrawl": idx.get("lastCrawlTime"),
        "robots": idx.get("robotsTxtState"),
        "indexingState": idx.get("indexingState"),
        "googleCanonical": idx.get("googleCanonical"),
        "userCanonical": idx.get("userCanonical"),
        "fetchState": idx.get("pageFetchState"),
        "inspectionLink": ir.get("inspectionResultLink"),
        "bucket": categorize(idx),
    }


def main() -> int:
    env = load_env()
    token = get_access_token(env)
    print("Got Google access token.", flush=True)

    urls = fetch_sitemap_urls()
    print(f"Sitemap contains {len(urls)} unique URLs. Inspecting in parallel ({WORKERS} workers)...", flush=True)

    rows: list[dict] = []
    buckets: dict[str, list[dict]] = defaultdict(list)
    completed = 0
    started = time.time()

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(inspect_with_label, token, u): u for u in urls}
        for fut in as_completed(futures):
            row = fut.result()
            rows.append(row)
            buckets[row["bucket"]].append(row)
            completed += 1
            if completed % 10 == 0 or completed == len(urls):
                rate = completed / max(0.001, time.time() - started)
                eta = max(0, (len(urls) - completed) / max(0.01, rate))
                print(
                    f"  {completed:>3}/{len(urls)}  rate={rate:.1f}/s  eta={eta:.0f}s  last={row['bucket']}",
                    flush=True,
                )

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    report_path = DOCS_DIR / f"SEO_INDEX_AUDIT_{today}.md"

    lines: list[str] = [
        f"# SEO index audit — {today}",
        "",
        f"Generated by `scripts/seo-index-audit.py` at {timestamp}. Audited every URL in `{SITEMAP_URL}` against the Search Console URL Inspection API.",
        "",
        f"**Total URLs in sitemap:** {len(urls)}",
        "",
        "## Summary",
        "",
        "| Bucket | Count | Action needed |",
        "|---|---:|---|",
    ]

    bucket_descriptions = [
        ("indexed", "✅ Indexed", "None — page is in Google's index and rank-eligible."),
        (
            "discovered_not_indexed",
            "🟡 Discovered, not indexed",
            "Google knows the URL but hasn't crawled or chose not to index. Usually thin content or weak internal linking — add internal links or beef up content.",
        ),
        (
            "crawled_not_indexed",
            "🟠 Crawled, not indexed",
            "Google crawled but excluded. Common causes: duplicate of another page, low-quality content, or `noindex` directive. Check the page.",
        ),
        ("duplicate", "🔵 Duplicate (canonical points elsewhere)", "Usually fine — Google chose a canonical version. Confirm it's the right one."),
        ("alternate", "🔵 Alternate page (mobile/AMP)", "Usually fine. No action."),
        ("excluded", "⚪ Excluded by directive", "Page has `noindex` or robots block. Confirm intentional."),
        ("error", "🔴 Error", "Page fails to render or returns an error. Investigate."),
        ("api_error", "⚙️ API error", "Search Console API didn't return a verdict — usually transient. Re-run."),
        ("other", "❓ Other", "Uncategorized — review manually."),
        ("unknown", "❓ Unknown", "No data from Search Console. Re-run after Google has had a chance to crawl."),
    ]

    for key, label, _ in bucket_descriptions:
        if key in buckets:
            lines.append(f"| {label} | {len(buckets[key])} | — |")
    lines.append("")
    lines.append("## Action items")
    lines.append("")
    needs_attention = ["discovered_not_indexed", "crawled_not_indexed", "error", "excluded", "api_error"]
    any_attention = False
    for key, label, action in bucket_descriptions:
        if key in needs_attention and key in buckets and buckets[key]:
            any_attention = True
            lines.append(f"### {label} — {len(buckets[key])} pages")
            lines.append("")
            lines.append(action)
            lines.append("")
            lines.append("| Path | Last crawl | Coverage | Link |")
            lines.append("|---|---|---|---|")
            for row in buckets[key]:
                p = short(row["url"])
                last = row.get("lastCrawl") or "never"
                cov = row.get("coverage") or row.get("error") or "—"
                ilink = row.get("inspectionLink") or ""
                ilink_md = f"[GSC]({ilink})" if ilink else "—"
                lines.append(f"| `{p}` | {last} | {cov} | {ilink_md} |")
            lines.append("")
    if not any_attention:
        lines.append("Nothing requires attention. All sitemap URLs are either indexed, duplicate-canonical, or alternate.")
        lines.append("")

    lines.append("## All indexed pages")
    lines.append("")
    if "indexed" in buckets and buckets["indexed"]:
        lines.append("<details>")
        lines.append(f"<summary>{len(buckets['indexed'])} indexed URLs</summary>")
        lines.append("")
        lines.append("| Path | Last crawl |")
        lines.append("|---|---|")
        for row in sorted(buckets["indexed"], key=lambda r: r["url"]):
            lines.append(f"| `{short(row['url'])}` | {row.get('lastCrawl') or '—'} |")
        lines.append("")
        lines.append("</details>")
    else:
        lines.append("_No indexed URLs in this audit._")
    lines.append("")

    lines.append("## Raw data")
    lines.append("")
    lines.append("Full per-URL detail saved alongside this report as JSON.")
    lines.append("")

    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines))
    json_path = DOCS_DIR / f"SEO_INDEX_AUDIT_{today}.json"
    json_path.write_text(
        json.dumps(
            {
                "generatedAt": timestamp,
                "site": SITE_URL,
                "sitemap": SITEMAP_URL,
                "totalUrls": len(urls),
                "rows": rows,
            },
            indent=2,
        )
    )

    print()
    print(f"Wrote report: {report_path}")
    print(f"Wrote JSON:   {json_path}")
    print()
    print("Bucket counts:")
    for key, label, _ in bucket_descriptions:
        if key in buckets:
            print(f"  {label}: {len(buckets[key])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
