#!/usr/bin/env python3
"""
Upload a photo (or batch of photos) to your Google Business Profile listing.

Two upload modes:
  1. --url   Pass a publicly accessible HTTPS image URL. Google fetches it.
             Easiest path. Image must be ≥250x250px, ≤10MB, JPG/PNG.
  2. --file  Pass a local file path. We do a resumable upload directly to
             Google. Slightly slower, no public URL needed.

Categories (Google's enum):
  COVER, PROFILE, LOGO, EXTERIOR, INTERIOR, PRODUCT, AT_WORK,
  FOOD_AND_DRINK, MENU, COMMON_AREA, ROOMS, TEAMS, ADDITIONAL

Quick examples:

  # Upload from public URL (recommended):
  python3 scripts/gbp-upload-photo.py \\
    --url https://www.hellogorgeousmedspa.com/images/solaria/solaria-device-hero.png \\
    --category INTERIOR \\
    --description "Our Solaria CO2 fractional laser device"

  # Upload local file:
  python3 scripts/gbp-upload-photo.py \\
    --file public/images/solaria/solaria-device-hero.png \\
    --category INTERIOR

  # Bulk preset — uploads several Solaria launch photos at once:
  python3 scripts/gbp-upload-photo.py --preset solaria-launch

  # List photos currently on your GBP listing:
  python3 scripts/gbp-upload-photo.py --list

Auth: reads GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN
+ GOOGLE_BUSINESS_ACCOUNT_ID + GOOGLE_BUSINESS_LOCATION_ID from .env.local.
The refresh token must include the `business.manage` scope.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import sys
import urllib.parse
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]


# -------------------------------------------------------------------------- env
def load_env():
    env: dict[str, str] = {}
    env_path = ROOT / ".env.local"
    if not env_path.exists():
        sys.exit(f"missing {env_path}")
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


ENV = load_env()


def required(key: str) -> str:
    val = ENV.get(key, "").strip()
    if not val:
        sys.exit(f"missing env var: {key}")
    return val


# ----------------------------------------------------------------------- oauth
def get_access_token() -> str:
    body = urllib.parse.urlencode(
        {
            "client_id": required("GOOGLE_CLIENT_ID"),
            "client_secret": required("GOOGLE_CLIENT_SECRET"),
            "refresh_token": required("GOOGLE_REFRESH_TOKEN"),
            "grant_type": "refresh_token",
        }
    ).encode()
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())["access_token"]


def gbp_path() -> str:
    """Returns 'accounts/{accountId}/locations/{locationId}'."""
    return (
        f"accounts/{required('GOOGLE_BUSINESS_ACCOUNT_ID')}"
        f"/locations/{required('GOOGLE_BUSINESS_LOCATION_ID')}"
    )


# ---------------------------------------------------------------- gbp media v4
GBP_BASE = "https://mybusiness.googleapis.com/v4"


def list_media(token: str) -> list[dict]:
    items: list[dict] = []
    page_token: Optional[str] = None
    while True:
        params = {"pageSize": "100"}
        if page_token:
            params["pageToken"] = page_token
        url = f"{GBP_BASE}/{gbp_path()}/media?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read())
        items.extend(data.get("mediaItems", []))
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return items


def upload_via_source_url(
    token: str,
    image_url: str,
    category: str,
    description: Optional[str],
) -> dict:
    """Tell Google to fetch the image from a public HTTPS URL."""
    payload: dict = {
        "mediaFormat": "PHOTO",
        "locationAssociation": {"category": category},
        "sourceUrl": image_url,
    }
    if description:
        payload["description"] = description
    req = urllib.request.Request(
        f"{GBP_BASE}/{gbp_path()}/media",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def upload_via_local_file(
    token: str,
    file_path: Path,
    category: str,
    description: Optional[str],
) -> dict:
    """Resumable upload: ask Google for an upload URL, push bytes, then create media."""
    if not file_path.exists():
        sys.exit(f"file not found: {file_path}")

    mime = mimetypes.guess_type(str(file_path))[0] or "image/jpeg"
    if mime not in ("image/jpeg", "image/png"):
        sys.exit(f"unsupported mime type {mime}; GBP accepts only JPG/PNG")

    # 1. Start an upload session.
    start_req = urllib.request.Request(
        f"{GBP_BASE}/{gbp_path()}/media:startUpload",
        data=b"{}",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(start_req, timeout=60) as r:
        start_data = json.loads(r.read())
    resource_name = start_data["resourceName"]

    # 2. PUT the binary bytes to the upload endpoint.
    upload_url = f"https://mybusiness.googleapis.com/upload/v1/media/{resource_name}"
    file_bytes = file_path.read_bytes()
    put_req = urllib.request.Request(
        upload_url,
        data=file_bytes,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": mime,
            "Content-Length": str(len(file_bytes)),
        },
        method="POST",
    )
    with urllib.request.urlopen(put_req, timeout=300):
        pass

    # 3. Create the media item referencing the uploaded resource.
    payload: dict = {
        "mediaFormat": "PHOTO",
        "locationAssociation": {"category": category},
        "dataRef": {"resourceName": resource_name},
    }
    if description:
        payload["description"] = description
    create_req = urllib.request.Request(
        f"{GBP_BASE}/{gbp_path()}/media",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(create_req, timeout=120) as r:
        return json.loads(r.read())


# --------------------------------------------------------------------- presets
SITE_URL = "https://www.hellogorgeousmedspa.com"

PRESETS: dict[str, list[dict]] = {
    "solaria-launch": [
        {
            "url": f"{SITE_URL}/images/solaria/solaria-device-hero.png",
            "category": "INTERIOR",
            "description": (
                "InMode Solaria CO2 fractional laser at Hello Gorgeous Med Spa, Oswego IL. "
                "Gold-standard skin resurfacing for deep wrinkles, acne scars, and sun damage. "
                "$899 full face launch special. Book free consult at hellogorgeousmedspa.com/services/solaria-co2"
            ),
        },
        {
            "url": f"{SITE_URL}/images/solaria/solaria-workstation.png",
            "category": "INTERIOR",
            "description": (
                "Solaria CO2 workstation in our Oswego treatment room. "
                "FDA-cleared fractional ablative laser by InMode."
            ),
        },
    ],
    "morpheus8": [
        {
            "url": f"{SITE_URL}/images/morpheus8/morpheus8-burst-hero.png",
            "category": "INTERIOR",
            "description": (
                "Morpheus8 Burst RF microneedling at Hello Gorgeous Med Spa. "
                "Verified InMode provider in Oswego, IL serving Naperville, Aurora, Plainfield."
            ),
        },
    ],
    "morpheus8-burst-deep": [
        {
            "url": f"{SITE_URL}/images/morpheus8/morpheus8-burst-deep-neck-tightening-before-after.png",
            "category": "PRODUCT",
            "description": (
                "REAL PATIENT — Morpheus8 Burst + Deep neck tightening before & after at Hello Gorgeous "
                "Med Spa, Oswego IL. The newest InMode Morpheus8 Burst + Deep technology delivers "
                "multi-depth RF up to 8mm, smoothing crepey neck skin where surface microneedling "
                "can't reach. Free consultation: hellogorgeousmedspa.com/services/morpheus8"
            ),
        },
        {
            "url": f"{SITE_URL}/images/morpheus8/morpheus8-burst-deep-knee-crepey-skin-before-after.png",
            "category": "PRODUCT",
            "description": (
                "REAL PATIENT — Morpheus8 Burst + Deep before & after on crepey knee and elbow skin. "
                "Hello Gorgeous Med Spa Oswego IL is a verified InMode provider with the newest "
                "Burst + Deep RF microneedling. Dramatic skin tightening for body areas other devices "
                "can't effectively treat. Book free consult."
            ),
        },
        {
            "url": f"{SITE_URL}/images/morpheus8/morpheus8-burst-deep-thighs-skin-tightening-before-after.png",
            "category": "PRODUCT",
            "description": (
                "REAL PATIENT — Morpheus8 Burst + Deep above-knee thigh skin tightening before & "
                "after. Hello Gorgeous Med Spa, Oswego IL — newest InMode Burst + Deep technology "
                "for body contouring + collagen rebuild after weight loss or aging. Serving Oswego, "
                "Naperville, Aurora, Plainfield."
            ),
        },
    ],
    "branding": [
        {
            "url": f"{SITE_URL}/images/logo-full.png",
            "category": "LOGO",
            "description": "Hello Gorgeous Med Spa — official logo",
        },
        {
            "url": f"{SITE_URL}/images/hero-banner.png",
            "category": "COVER",
            "description": "Hello Gorgeous Med Spa cover photo",
        },
    ],
}


# ------------------------------------------------------------------------ main
def cmd_list(token: str) -> None:
    items = list_media(token)
    print(f"Total photos on GBP listing: {len(items)}")
    for i, m in enumerate(items, 1):
        cat = (m.get("locationAssociation") or {}).get("category", "?")
        attr = (m.get("attribution") or {}).get("takenTimestamp", "?")
        url = m.get("googleUrl") or m.get("sourceUrl") or "?"
        print(f"  {i}. [{cat}] {attr}  {url[:80]}")


def cmd_upload(
    token: str,
    *,
    url: Optional[str],
    file_path: Optional[Path],
    category: str,
    description: Optional[str],
) -> None:
    print(
        f"Uploading photo to GBP — category={category}, "
        f"source={'URL' if url else 'FILE'}",
        flush=True,
    )
    try:
        if url:
            result = upload_via_source_url(token, url, category, description)
        else:
            assert file_path is not None
            result = upload_via_local_file(token, file_path, category, description)
        print("✓ uploaded successfully", flush=True)
        print(f"  name:      {result.get('name', '?')}")
        print(f"  google url:{result.get('googleUrl', '?')}")
        if result.get("thumbnailUrl"):
            print(f"  thumbnail: {result['thumbnailUrl']}")
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        sys.exit(f"upload failed: HTTP {e.code}\n{body}")
    except urllib.error.URLError as e:
        sys.exit(f"upload failed (network): {e}")


def cmd_preset(token: str, preset_name: str) -> None:
    items = PRESETS.get(preset_name)
    if not items:
        sys.exit(f"unknown preset: {preset_name}. Available: {', '.join(PRESETS.keys())}")
    print(f"Running preset '{preset_name}' — {len(items)} photo(s) to upload", flush=True)
    for idx, item in enumerate(items, 1):
        print(f"\n[{idx}/{len(items)}] {item['url']}")
        cmd_upload(
            token,
            url=item["url"],
            file_path=None,
            category=item["category"],
            description=item.get("description"),
        )


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--url", help="public HTTPS URL of an image to upload")
    p.add_argument("--file", help="local file path to upload")
    p.add_argument("--category", default="ADDITIONAL", help="photo category (default: ADDITIONAL)")
    p.add_argument("--description", help="optional photo description")
    p.add_argument("--list", action="store_true", help="list current photos on GBP listing")
    p.add_argument("--preset", help=f"named preset bundle ({', '.join(PRESETS.keys())})")
    args = p.parse_args()

    token = get_access_token()

    if args.list:
        cmd_list(token)
        return

    if args.preset:
        cmd_preset(token, args.preset)
        return

    if not (args.url or args.file):
        p.error("must pass --url, --file, --list, or --preset")

    cmd_upload(
        token,
        url=args.url,
        file_path=Path(args.file) if args.file else None,
        category=args.category.upper(),
        description=args.description,
    )


if __name__ == "__main__":
    main()
