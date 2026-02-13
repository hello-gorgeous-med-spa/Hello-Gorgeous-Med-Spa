# Adding photos to the website

Place image files in the folders below. The site references them by path (e.g. `/images/gallery/your-file.jpg`).

| Folder | Used for |
|--------|----------|
| **gallery/** | Main “See the Difference” photo gallery on the homepage. Add files here, then add an entry in `components/PhotoGallery.tsx` with `src`, `alt`, and `caption`. |
| **hero-banner.png** | Large hero image on the homepage (replace the file to change it). |
| **team/** | Team / provider headshots (e.g. `components/MeetProviders.tsx`). |
| **providers/** | Provider pages and mascot sections. |
| **results/** | Before/after or treatment results (e.g. service pages). |
| **partners/** | Partner / brand logos. |
| **events/** | Event imagery (e.g. botox party page). |

**Tips:** Use descriptive file names and keep file sizes reasonable (e.g. under 500KB for gallery). Supported formats: PNG, JPG, WebP.
