# AnteAGE marketing assets (Jul 2026)

Official AnteAGE creative for website, Square booking, and social.

## Videos (vertical 1080×1920)

| File | Use |
|---|---|
| `/videos/anteage/anteage-treatment-reel.mp4` (~10s, 3MB) | Instagram/Facebook Reels, Stories, ads |
| `/videos/anteage/anteage-treatment-hero.mp4` (~73s, 23MB web) | Website showcase, longer IG/FB video post |
| `/images/anteage/video-poster-reel.jpg` | Poster / link preview for reel |
| `/images/anteage/video-poster-hero.jpg` | Poster for hero video |

## Still images

| File | Best for |
|---|---|
| `/images/anteage/hair/mdx-biosome-hair-solution-ba.png` | AnteAGE MD Scalp / Hair Restoration (Square + `/services/hair-restoration-exosomes`) |
| `/images/anteage/mdx-brightening-exosome-vials.png` | Product / Square category hero |
| `/images/anteage/mdx-brightening-before-after-spots.png` | Brightening B&A social |
| `/images/anteage/mdx-brightening-before-after-eyes.png` | Crow’s feet / glow B&A |
| `/images/anteage/growth-factor-before-after.png` | Microneedling + GF scar results |
| `/images/anteage/people-growth-factor-feature.png` | Social proof (People en Español) |
| `/images/anteage/md-microneedling-kit.png` | Kit / clinical product shot |

Square JPG copies live under `/images/square-appointments/anteage-*`.

## Social presets (Admin posting)

In `lib/facebook-page-presets.ts`:

- **AnteAGE MDX Brightening Exosomes**
- **AnteAGE — People en Español feature**
- **AnteAGE treatment reel** (still preview; attach the MP4 when posting)

## Website

`AnteAGEShowcase` on the site now uses the new slideshow + both treatment videos.

## Square

Run:

```bash
node --env-file=.env.local scripts/square-upload-anteage-images.mjs --apply
```

Services under **AnteAGE Skin Regeneration** get matching product / before-after images.
