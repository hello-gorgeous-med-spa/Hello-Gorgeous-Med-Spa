# Hello Gorgeous — Video Asset Library

## Folder Structure

```
assets/
├── logos/          # Brand logos and watermarks
├── devices/        # InMode device photos (Morpheus8, Solaria, QuantumRF)
├── treatments/     # Treatment-in-progress photos
├── clients/        # Before/after client photos (with consent)
├── backgrounds/    # Background textures and gradients
├── audio/          # Background music and sound effects
└── assets.json     # Asset manifest (maps friendly names to paths)
```

## How to Add Assets

1. Drop the image/audio file into the correct folder
2. Open `assets.json` and add an entry with a friendly name
3. Use in compositions: `const src = useAsset("devices", "morpheus8-burst")`

## Image Requirements

- Minimum 1080px on shortest side
- PNG preferred for logos/devices (transparency)
- JPG for photos (smaller file size)
- 16:9 or square crop for backgrounds

## Audio Requirements

- MP3 format, 128-320kbps
- Royalty-free or licensed for commercial use
- 30-60 seconds typical length
