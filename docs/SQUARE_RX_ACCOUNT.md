# Phase 1 — Square account hygiene (RX cutover)

**Canonical account:** Hello Gorgeous Med Spa RX  
**Merchant:** `MLK7PBDE336M4`  
**Location:** `L3QDRS4DX9ZE4`  
**Booking site ID:** `pf2o75yphk7vw6`

## Live booking URLs

| Use | URL |
|-----|-----|
| Org booking site | https://square.site/book/L3QDRS4DX9ZE4/hello-gorgeous-med-spa-rx-oswego-il |
| Appointments start (QR / print) | https://app.squareup.com/appointments/book/pf2o75yphk7vw6/L3QDRS4DX9ZE4/start |
| Site entry | https://www.hellogorgeousmedspa.com/book |
| Embed script | https://square.site/appointments/buyer/widget/pf2o75yphk7vw6/L3QDRS4DX9ZE4.js |

## Retired (old Square account — do not use)

- Location `PYYB8NKD45N8P`
- Booking site `c6d3183a-3e54-4f32-8923-61c56c170c64`

## Still on Fresha (intentional until migrated)

- VIP Model deposit paid plan (`VIP_MODEL_SQUARE_URL` still points at Fresha paid plans)

## Telehealth (migrated to Square)

- NP telehealth / $49 program consult → Square **Medical Visit with Ryan Kent, FNP-BC**
  (`SQUARE_RX_TELEHEALTH_BOOKING_URL` / `HG_RX_TELEHEALTH_*` / `PROGRAM_CONSULT_BOOKING_URL`)
- Deep link: https://book.squareup.com/appointments/pf2o75yphk7vw6/location/L3QDRS4DX9ZE4/services/ZLCRRG4BM6W2DCLWDWIDVBPA

## Cancel-old-account checklist (when ready)

1. [ ] Zero new bookings on old location for 60 days  
2. [ ] Terminals paired to RX  
3. [ ] Webhooks + OAuth on RX only  
4. [ ] GBP / IG bio / printed QR all use RX URLs  
5. [ ] Gift cards / memberships migrated  
6. [ ] Export old-account history  
7. [ ] Cancel old subscription  
