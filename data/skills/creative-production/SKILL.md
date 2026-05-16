---
name: creative-production
description: Use when someone asks to design a carousel, build social media templates, produce display ads, create Stories or Reels frames, generate print-ready specs, make assets production-ready, or execute any design format beyond a static single-image post.
dependencies: [brand-context-manager, brand-design-system, marketing-creatives]
---

# Purpose
Production execution layer. Translates creative briefs from marketing-creatives into fully specified, buildable design files across all formats: carousels, Stories/Reels frames, display ad sets, video ad specs, and print. Every output is specific enough for a designer or the Canva Connect API to execute without additional briefing.

# Dependencies
- brand-context-manager (validates brand, loads palette and fonts)
- brand-design-system (typography scale, spacing system, motion principles)
- marketing-creatives output (creative brief and copy — must exist before running this skill)

# Inputs
- Format (required): carousel | stories | reels | display-ads | print | video-ad-spec | canva-api
- Copy source (required): marketing-creatives output or paste copy directly
- Brand/client (required): brand_id
- Platform (required if digital): instagram | linkedin | facebook | google-display | meta-ads | youtube
- Quantity (optional): number of frames / ad sizes / pages

# Format Library & Specs

## Carousel Posts

| Platform | Dimensions | Frame count | File format |
|----------|------------|-------------|-------------|
| Instagram | 1080x1080px (square) or 1080x1350px (portrait) | 3-10 | PNG/JPG |
| LinkedIn | 1080x1080px | 3-8 | PDF (document post) or PNG |
| Facebook | 1080x1080px | 2-10 | PNG/JPG |

## Stories & Reels Frames

| Platform | Dimensions | Safe zone | Duration |
|----------|------------|-----------|----------|
| Instagram Stories | 1080x1920px | Keep content above 250px from bottom (CTA bar) and below 250px from top (UI) | 15s per frame |
| Instagram Reels cover | 1080x1920px | Same as Stories | N/A |
| TikTok | 1080x1920px | Same safe zones | Per clip |
| Facebook Stories | 1080x1920px | Same | 20s per frame |

## Display Ad Set (IAB Standard Sizes)

| Size | Dimensions | Common name |
|------|------------|-------------|
| Leaderboard | 728x90px | Top of page |
| Medium Rectangle | 300x250px | Most common, highest inventory |
| Half Page | 300x600px | High impact |
| Large Rectangle | 336x280px | — |
| Wide Skyscraper | 160x600px | Sidebar |
| Billboard | 970x250px | Premium placement |
| Mobile Banner | 320x50px | Mobile web |
| Large Mobile | 320x100px | Mobile web |

Always produce at minimum: 300x250, 728x90, 160x600, 320x50.

## Video Ad Formats

| Format | Length | Dimensions | Platform |
|--------|--------|------------|---------|
| Bumper | 6s | 1920x1080px | YouTube pre-roll |
| Pre-roll | 15s or 30s | 1920x1080px | YouTube / programmatic |
| Meta in-feed | 15s | 1080x1080px or 1080x1350px | Facebook/Instagram |
| LinkedIn video ad | 15-30s | 1920x1080px | LinkedIn |
| Reels ad | 15-30s | 1080x1920px | Instagram |

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm brand_id. Reference brand-design-system for typography, spacing, and motion specs. Confirm marketing-creatives output exists or ask for copy input directly.

## Step 2: Confirm the format and produce a production plan
State what will be produced before writing specs:
```
Producing: [format] for [platform]
Frames/sizes: [count or list]
Copy source: [marketing-creatives ref or inline]
Brand: [brand_id]
```
Confirm before proceeding to detailed specs.

## Step 3: Design specs by format

---

### Carousel Design

For each frame, produce:

```
CAROUSEL: [Campaign name]
Platform: [platform] | Dimensions: [WxH]
Total frames: [n]

FRAME 1 — Cover
Role: Hook — stop the scroll
Layout: [full-bleed image | split | text-only | data callout]
Background: [color hex or image description]
Text block:
  - Headline: "[text]" | Font: Inter 700 | Size: 32px | Color: #FFFFFF
  - Subtext: "[text]" | Font: Inter 400 | Size: 16px | Color: #D1D5DB
Visual element: [icon / image / shape — description]
Brand element: Logo [position, size]
CTA hint: "Swipe →" | Font: Inter 600 | Size: 14px | Position: bottom-right

FRAME 2 — [Point 1]
Role: Deliver first insight
Layout: [layout choice]
[repeat structure]

FRAME [N] — CTA
Role: Convert
Text: "[CTA text — specific action]"
Visual: [what reinforces the CTA]
Link/next step: [where this leads]
```

**Carousel design rules:**
- Frame 1 must work as a standalone post if shared individually
- Each frame delivers one idea — no frame is a filler
- Consistent margin: 40px on all sides
- Frame counter optional (e.g. "01/06") — use only if it aids navigation
- Final frame always has a single, specific CTA

---

### Stories / Reels Frame Specs

```
STORIES/REELS: [Campaign name]
Platform: [platform] | Dimensions: 1080x1920px
Total frames: [n]

SAFE ZONE: Content between y=250px and y=1670px

FRAME 1
Timecode: 0-3s
Background: [color hex or video description]
Layer 1 (bottom): [background color/image]
Layer 2: [text block — position within safe zone]
  - Text: "[text]" | Font: Inter 700 | Size: 48px | Color: #FFFFFF
  - Position: center, y=800px
Layer 3 (top): [overlay, logo, sticker if any]
Animation: [fade in | slide up | none] | Duration: 300ms

[Continue per frame]

INTERACTIVE ELEMENTS (Stories only):
- Sticker: [poll / question / link] | Position: y=1300px (above CTA bar)
- Swipe-up / Link: [URL or action]
```

---

### Display Ad Set

For each size, produce:

```
DISPLAY AD SET: [Campaign name]
Brand: [brand_id]

AD: 300x250 (Medium Rectangle) — PRIMARY UNIT
Background: [hex]
Logo: [position, max-height: 30px]
Headline: "[text]" | Font: Inter 700 | Size: 18px | Max: 2 lines
Body: "[text]" | Font: Inter 400 | Size: 13px | Max: 2 lines
CTA button: "[text]" | Background: #10B981 | Text: #FFFFFF | Size: 14px bold | Height: 36px
Animation: [static | animated — if animated, describe 3-frame sequence]
File: PNG (static) or HTML5 / GIF (animated) | Max file size: 150KB

AD: 728x90 (Leaderboard)
[same structure — adapted for horizontal format]
Constraint: Single line headline only. CTA button right-aligned.

AD: 160x600 (Wide Skyscraper)
[same structure — adapted for vertical format]

AD: 320x50 (Mobile Banner)
[same structure — minimal: logo + 1 line + CTA button only]
```

**Display ad rules:**
- Every ad must be readable and actionable at its smallest size
- CTA button uses accent color (#10B981) unless brand-design-system specifies otherwise
- Animated ads: max 15s loop, max 3 cycles, must pause after 3rd cycle
- All display ads require a static fallback version

---

### Canva Connect API Population

When format = canva-api, produce the API-ready JSON for each template:

```json
{
  "template_id": "[canva_template_id]",
  "brand_id": "[brand_id]",
  "elements": {
    "headline": "[copy from marketing-creatives output]",
    "subheadline": "[subhead copy]",
    "cta": "[CTA text]",
    "body": "[body copy]",
    "colors": {
      "primary": "#1F2937",
      "accent": "#10B981",
      "background": "#FFFFFF"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    },
    "images": {
      "hero": "[image description or asset path]",
      "logo": "brand/symbicore/logo.svg"
    }
  },
  "export": {
    "format": "PNG",
    "dimensions": "1080x1080",
    "quality": "high"
  }
}
```

---

### Print Production Specs

```
PRINT ASSET: [Asset name]
Dimensions: [W x H mm] + 3mm bleed on all sides
Final trim: [W x H mm]
Safe area: 5mm inside trim edge
Resolution: 300dpi
Color mode: CMYK
Font embed: Required (outline all fonts before export)

CMYK Color Values:
- Primary (#1F2937): C:84 M:68 Y:49 K:52
- Accent (#10B981): C:73 M:5 Y:52 K:0
- White: C:0 M:0 Y:0 K:0
- Black text: C:0 M:0 Y:0 K:100 (rich black for large areas: C:60 M:40 Y:40 K:100)

Layout spec:
[describe grid, margins, content zones]

File formats required:
- [ ] Print-ready PDF (PDF/X-1a or PDF/X-4)
- [ ] Editable source file (AI or INDD)
- [ ] Low-res proof PDF for approval
```

## Step 3b: Generate images via KIE.ai

After specs are confirmed, generate AI images for any asset type that doesn't require print or Canva template output. Call `tools/kie_ai.py generate_image()` with the matching `asset_type`:

| Format | `asset_type` | Model | Notes |
|---|---|---|---|
| Carousel cover / social graphic | `social-graphic` | flux-kontext-pro | Consistent brand scenes |
| Campaign hero / brand concept | `brand-concept` or `hero-image` | flux-kontext-max | Max quality — one image per campaign |
| Stories / Reels cover | `story-frame` | flux-kontext-pro | 9:16 safe zone respected |
| Thumbnail | `thumbnail` | gpt4o-image | Text readable at 120px |
| Display ad visual | `display-ad` | gpt4o-image | Text accuracy for CTA |
| LinkedIn banner | `linkedin-banner` | gpt4o-image | 3:2, text-accurate |

Rules:
- Always pass `brand_context` — the tool injects palette and tone automatically.
- Generate a `draft` first for hero/brand-concept assets before using `flux-kontext-max`.
- Print assets (CMYK) and Canva-template assets go to designers, not KIE.ai.
- Video ad visuals go to `generate_video()` — see video-content skill.

## Step 4: Output

Save all specs to `output/creative-production/[brand-id]/[campaign-slug]/[format]/`.

Produce a `production-manifest.md` at the root of the campaign folder:
```markdown
# Production Manifest: [Campaign Name]
**Brand:** [brand_id]
**Date:** [date]
**Status:** Specs complete — ready for design

## Assets in this package
| Asset | Format | Platform | Status |
|-------|--------|----------|--------|
| Carousel | 6 frames | Instagram | Spec complete |
| Display ads | 4 sizes | Google Display | Spec complete |

## Design tools required
- [ ] Canva Pro (for templates)
- [ ] Figma (for component-based assets)
- [ ] Adobe Illustrator (for print)

## Brand assets location
`brand/[brand_id]/` — logo, fonts, brand config
```

## Step 5: Compliance check
- [ ] All dimensions match platform specs exactly
- [ ] Safe zones respected on all Stories/Reels frames
- [ ] Display ads have static fallback versions specified
- [ ] Print specs include bleed, resolution, and CMYK color mode
- [ ] No banned visual concepts (stock handshakes, generic cityscapes)
- [ ] Canva JSON references brand colors and fonts — no off-brand values
- [ ] CTA on every asset is specific — not "Learn More"

# Guardrails
- Never produce display ad specs without a static fallback — animated ads require static versions for publishers that don't support animation
- Never skip the safe zone spec for Stories/Reels — CTA bars and UI overlays obscure content outside safe zones
- Print assets require CMYK conversion — never deliver web hex values for print without converting
- If marketing-creatives output does not exist, do not write copy — request it first
- Canva template IDs must be real and confirmed — do not invent template IDs