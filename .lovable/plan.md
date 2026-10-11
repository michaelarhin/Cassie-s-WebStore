
# Rebrand: Velvet Ruins to Solange-Inspired Neo-Soul Artist

Inspired by Solange's "A Seat at the Table" (#100 on Apple Music's 100 Best Albums), we'll transform the site from a post-punk band into a solo neo-soul/R&B artist with warm, earthy, introspective aesthetics.

---

## New Brand Identity

- **Artist Name:** "Aura Sable"
- **Genre:** Neo-Soul / Alternative R&B
- **Tagline:** "Quiet Power, Radiant Sound"
- **Origin:** Houston, Texas (nod to Solange's roots)
- **Active Since:** 2017

---

## 1. Replace All Images (11 assets)

Source new HD images from Pexels matching the warm, earthy, Solange-inspired aesthetic:

| Asset | New Direction |
|-------|--------------|
| `hero-bg.jpg` | Warm golden-hour portrait or silhouette of a woman, soft natural light |
| `band-photo.jpg` | Solo artist portrait, warm tones, natural setting |
| `album-neon-shadows.jpg` | Warm abstract art, earth tones |
| `album-midnight-echo.jpg` | Golden hour landscape or intimate portrait |
| `album-silent-thunder.jpg` | Muted desert or sand dunes |
| `album-cosmic-drift.jpg` | Warm bokeh or sunset sky |
| `album-lost-horizon.jpg` | Floral or botanical, soft pastels |
| `album-electric-dreams.jpg` | Studio/microphone shot, warm lighting |
| `merch-vinyl.jpg` | Vinyl record, warm ambient light |
| `merch-tshirt.jpg` | Fashion/apparel flat lay, earthy palette |
| `merch-hoodie.jpg` | Cozy knitwear/hoodie, natural tones |

---

## 2. Update All Text Content

### `src/data/mockData.ts` -- Complete text overhaul:

**Albums (renamed + re-described):**
- "Neon Shadows" becomes "Golden Hour" (LP, 2024) -- "A luminous meditation on self-discovery and reclamation"
- "Midnight Echo" becomes "Still Waters" (Album, 2023) -- "Nine tracks of intimate reflection recorded in analog warmth"
- "Silent Thunder" becomes "Soft Power" (Single, 2024) -- "A hymn to quiet resilience and inner strength"
- "Cosmic Drift" becomes "Terra" (EP, 2022) -- "Four songs rooted in earth, ancestry, and belonging"
- "Lost Horizon" becomes "Bloom" (Mixtape, 2023) -- "Collaborative explorations in sound and sisterhood"
- "Electric Dreams" becomes "First Light" (Album, 2021) -- "Debut album charting a journey from shadow to radiance"

**Merch (updated names):**
- "Neon Shadows Vinyl" becomes "Golden Hour Vinyl (Amber, Limited Edition)"
- "Midnight Echo CD" becomes "Still Waters CD (Digipak)"
- "Tour 2024 T-Shirt" becomes "Radiance Tour 2024 T-Shirt (Sand)"
- "Band Logo Hoodie" becomes "Aura Sable Logo Hoodie (Terracotta)"
- "Cosmic Drift Poster" becomes "Terra Limited Edition Print"
- "Electric Dreams Cassette" becomes "First Light Cassette (Clear)"

**Videos (updated titles):**
- Rename all video titles to match new album names
- Update director names and descriptions

**Tour dates (updated names):**
- "Spring Awakening Tour" becomes "Radiance Tour"
- Update all tour names to match the new warm, soulful aesthetic

### `src/pages/Index.tsx` -- Homepage:
- Band name: "Velvet Ruins" becomes "Aura Sable" (single line, no split)
- Subtitle: "Cinematic Post-Punk" becomes "Neo-Soul / Alternative R&B"
- Location: "Brooklyn, New York" becomes "Houston, Texas"
- Side labels: "Since 2019" becomes "Since 2017", "POST-PUNK" becomes "NEO-SOUL"
- Alt text updated throughout

### `src/pages/InfoPage.tsx` -- Bio:
- Full rewrite: Solo artist bio about Aura Sable, a Houston-born neo-soul artist blending vulnerability with sonic warmth
- Members section becomes "Collaborators" -- session musicians and producers
- Contact emails: management@aurasable.com, press@aurasable.com

### `src/components/Footer.tsx`:
- Brand name: "Aura Sable"
- Tagline: "Exploring vulnerability and strength through neo-soul since 2017."
- Email: management@aurasable.com
- Location: "Houston, Texas"

### `src/components/Header.tsx`:
- No text changes needed (nav labels are generic: Intro, Music, Tours, etc.)

---

## 3. Files to Edit

| File | Changes |
|------|---------|
| `src/assets/` (11 files) | Replace all images |
| `src/data/mockData.ts` | All album, merch, video, tour text |
| `src/pages/Index.tsx` | Brand name, subtitle, side labels, alt text |
| `src/pages/InfoPage.tsx` | Full bio rewrite, contact info |
| `src/components/Footer.tsx` | Brand name, tagline, email, location |

No design, color, or layout changes -- purely images and text as requested.
