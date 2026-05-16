---
name: brand-design-system
description: Use when someone asks to create brand guidelines, define a design system, document visual identity, set logo usage rules, establish typography or color systems, define imagery direction, or produce brand standards for any client.
dependencies: [brand-context-manager]
---

# Purpose
The visual brand bible. Translates brand config (colors, fonts, tone) into a complete visual identity system with precise rules for every application: logo, typography, color, spacing, imagery, illustration, iconography, motion, and print. This skill runs alongside brand-context-manager as a foundation — all design production skills depend on it.

# Dependencies
- brand-context-manager (validates brand_id, loads base config)

# Inputs
- Brand/client (required): brand_id
- Scope (optional): full | logo | typography | color | imagery | motion | print — defaults to full
- Output format (optional): internal-guide | client-deliverable | design-token-export

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm brand_id and load config. The config provides the base palette, fonts, and tone — this skill builds the full visual system on top of it.

## Step 2: Define the visual identity foundation

### Logo System
Document the following (pull from brand assets or ask if unavailable):
- Primary logo: full lockup, horizontal, stacked variants
- Clear space rule: minimum clear space = [X] height of the logo mark
- Minimum size: [Xpx] digital, [Xmm] print
- Approved backgrounds: dark, light, reversed
- Forbidden uses: stretched, rotated, recolored, outlined, drop shadow, gradient applied
- File formats available: SVG (master), PNG (web), PDF (print)

### Color System
Expand the base palette from brand_context into a complete color system:

| Role | Name | Hex | RGB | CMYK | Use case |
|------|------|-----|-----|------|----------|
| Primary | Dark Slate | #1F2937 | 31,41,55 | — | Backgrounds, headers, body text on light |
| Accent | Emerald | #10B981 | 16,185,129 | — | CTAs, highlights, links, badges |
| Primary-light | — | #374151 | — | — | Secondary backgrounds, card surfaces |
| Neutral-50 | — | #F9FAFB | — | — | Page backgrounds |
| Neutral-200 | — | #E5E7EB | — | — | Borders, dividers |
| Neutral-500 | — | #6B7280 | — | — | Body text, captions |
| White | — | #FFFFFF | — | — | Reversed text, icon fills |

**Semantic color rules:**
- Success: #10B981 (accent)
- Error: #EF4444
- Warning: #F59E0B
- Info: #3B82F6

**Do not use:** Any hex value not in this system without explicit approval.

### Typography System

**Web:**
| Level | Font | Weight | Size | Line height | Letter spacing |
|-------|------|--------|------|-------------|----------------|
| Display | Inter | 800 | 48-64px | 1.1 | -0.03em |
| H1 | Inter | 700 | 32px | 1.2 | -0.02em |
| H2 | Inter | 700 | 24px | 1.3 | -0.01em |
| H3 | Inter | 600 | 20px | 1.4 | 0 |
| H4 | Inter | 600 | 18px | 1.4 | 0 |
| Body | Inter | 400 | 16px | 1.6 | 0 |
| Small | Inter | 400 | 14px | 1.5 | 0 |
| Caption | Inter | 400 | 12px | 1.4 | 0.01em |
| Label | Inter | 600 | 12px | 1 | 0.08em uppercase |

**Print:**
| Level | Font | Weight | Size |
|-------|------|--------|------|
| Headline | Gotham | Bold | 36-72pt |
| Subhead | Gotham | Medium | 18-24pt |
| Body | Gotham | Book | 10-12pt |
| Caption | Gotham | Light | 8-9pt |

### Spacing System
Base unit: 4px. All spacing is a multiple of 4.

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Icon padding, tight inline |
| space-2 | 8px | Component internal padding |
| space-3 | 12px | Small gaps between elements |
| space-4 | 16px | Standard component gap |
| space-6 | 24px | Section sub-spacing |
| space-8 | 32px | Card padding, medium gap |
| space-12 | 48px | Section spacing |
| space-16 | 64px | Large section spacing |
| space-24 | 96px | Hero/full-bleed spacing |

Grid: 12-column, 24px gutters, max container 1280px.

## Step 3: Define imagery direction

### Photography
- **Style:** Authentic, high-contrast, real environments. No staged stock photos.
- **Subjects:** Business contexts, working environments, data/tech metaphors, people in action — not posed.
- **Banned:** Handshakes, generic cityscapes, smiling-at-laptop stock, overly diverse group photos that feel staged.
- **Color treatment:** Slight desaturation or duotone overlay with primary palette to unify across sources.
- **Aspect ratios:** 16:9 (landscape), 1:1 (square), 4:5 (portrait social), 9:16 (Stories/Reels).

### Illustration & Graphics
- **Style:** Geometric, clean, functional. Data visualization over decorative illustration.
- **Color:** Use brand palette only. Maximum 3 colors per illustration.
- **Iconography:** Line icons, 2px stroke, rounded caps, consistent 24x24px grid.
- **Banned:** Clipart, isometric 3D clichés, character illustrations, drop shadows on flat icons.

### Data Visualization
- **Primary charts:** Bar, line, scatter — not pie charts for anything beyond 2 segments.
- **Colors:** Accent (#10B981) for primary series, Primary (#1F2937) for secondary, neutrals for context.
- **Labels:** Always label axes. Never rely on legend alone.

## Step 4: Define motion principles (digital)

**Philosophy:** Motion serves clarity, not entertainment. Every animation reduces cognitive load or confirms an action — not for decoration.

| Motion type | Duration | Easing | Use |
|-------------|----------|--------|-----|
| Micro-interaction | 100-150ms | ease-out | Button hover, checkbox, toggle |
| Transition | 200-300ms | ease-in-out | Page section, modal, drawer |
| Page load | 400-600ms | ease-out | Hero entrance, staggered reveals |
| Scroll animation | 300-400ms | ease-out | Section reveals on scroll |

**Rules:**
- Only animate `opacity` and `transform`. Never `width`, `height`, `color`, or `margin`.
- Stagger sibling elements: 60-80ms between items.
- Respect `prefers-reduced-motion` — all animations must degrade to instant transition.

## Step 5: Define print application specs

| Asset | Size | Color mode | Resolution | Bleed |
|-------|------|------------|------------|-------|
| Business card | 85x55mm | CMYK | 300dpi | 3mm |
| Letterhead | A4 / Letter | CMYK | 300dpi | 3mm |
| Presentation | 16:9 (1920x1080px) | RGB | 150dpi | N/A |
| Social cover | Platform-specific | RGB | 72dpi | N/A |
| Large format | Varies | CMYK | 150dpi at final size | 5mm |

**Print color conversion note:** Web hex values must be converted to CMYK for print. #1F2937 ≈ C:84 M:68 Y:49 K:52. #10B981 ≈ C:73 M:5 Y:52 K:0. Always proof against brand swatches.

## Step 6: Output

Save to `output/brand-design-system/[brand-id]-design-system.md`.

Structure:
```
# [Brand] Design System
**Version:** 1.0
**Brand ID:** [brand_id]
**Last updated:** [date]

## 1. Logo System
## 2. Color System
## 3. Typography System
## 4. Spacing System
## 5. Imagery Direction
## 6. Motion Principles
## 7. Print Specs
## 8. Design Tokens (JSON)
```

Include a **Design Tokens** section at the end with a JSON export of all values for use in Figma variables and CSS custom properties:

```json
{
  "color": {
    "primary": "#1F2937",
    "accent": "#10B981"
  },
  "font": {
    "heading": "Inter",
    "body": "Inter"
  },
  "spacing": {
    "base": "4px"
  }
}
```

## Step 7: Compliance check
- [ ] All colors are from the approved palette or documented extensions
- [ ] Typography uses only approved fonts and weights
- [ ] No banned visual concepts appear in imagery direction
- [ ] Motion specs include prefers-reduced-motion fallback
- [ ] Print specs include CMYK conversion for all brand colors

# Guardrails
- Never invent new brand colors without documenting them as extensions and flagging for approval
- Logo rules must include explicit "do not" examples — not just permissions
- If brand assets (logo files, font files) are unavailable, note what is needed before completing the system
- Client design systems must not carry over Symbicore-specific decisions — each client gets a clean system derived from their own brand_context