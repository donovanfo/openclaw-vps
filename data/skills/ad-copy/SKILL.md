---
name: ad-copy
description: Use when someone asks to write paid ad copy, create Google Ads, build Meta ads, draft LinkedIn sponsored content, or produce any copy for paid media campaigns.
dependencies: [brand-context-manager, campaign-strategy]
---

# Purpose
Write paid media copy for Google, Meta, and LinkedIn that fits platform specs exactly, passes brand compliance, and is built around one offer and one audience. Character limits are hard constraints, not guidelines.

# Dependencies
- brand-context-manager (validates brand, loads tone and banned words)
- campaign-strategy output (for objective, audience, and offer)

# Inputs
- Platform (required): google-search | google-display | meta | linkedin-ads | all
- Campaign objective (required): awareness | traffic | lead-gen | conversion
- Offer (required): what the ad is selling or promoting — be specific
- Audience (required): pull from campaign-strategy or specify
- Landing page URL (optional): helps frame the CTA and message match
- Budget tier (optional): informs format recommendations

# Platform Specs (Hard Limits)

## Google Search (Responsive Search Ads)
| Element | Limit | Quantity |
|---------|-------|----------|
| Headlines | 30 chars each | 10-15 (write 15) |
| Descriptions | 90 chars each | 2-4 (write 4) |
| Display path | 15 chars each | 2 fields |

Rules: Headlines must make sense in any combination. Do not rely on order. Include primary keyword in at least 3 headlines. At least 1 headline = clear CTA.

## Google Display
| Element | Limit |
|---------|-------|
| Short headline | 30 chars |
| Long headline | 90 chars |
| Description | 90 chars |
| Business name | 25 chars |

## Meta (Facebook / Instagram)
| Element | Limit | Notes |
|---------|-------|-------|
| Primary text | 125 chars (preview) / 2,200 max | Write for 125 — the rest is truncated |
| Headline | 40 chars | Shows below image |
| Description | 30 chars | Optional, below headline |
| CTA button | Platform options | Choose from: Book Now, Contact Us, Get Quote, Learn More*, Sign Up |

*"Learn More" is a platform CTA button label — acceptable. Never use as copy in the ad body.

## LinkedIn Sponsored Content
| Element | Limit |
|---------|-------|
| Intro text | 150 chars (preview) / 600 max |
| Headline | 70 chars |
| Description | 100 chars |
| CTA button | Platform options |

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm brand_id, load tone and banned words. Do not proceed without validated brand context.

## Step 2: Define the ad's single job
Every ad has one job. State it:
```
This ad moves [audience] from [current state] to [action] by [mechanism].
```

If the campaign-strategy brief exists, pull the objective, audience, and offer directly. If not, ask before writing.

## Step 3: Develop the message hierarchy
Before writing copy, define:
- **Hook:** The one thing that will stop this audience mid-scroll
- **Claim:** The specific, provable promise
- **Proof:** One data point or evidence that supports the claim (if available)
- **CTA:** The single action — specific, not vague

Example:
```
Hook: Most B2B companies waste 40% of their ad spend on the wrong audiences.
Claim: Symbicore's pipeline model finds the leak in 2 weeks.
Proof: 3 of our last 5 clients cut CAC by 30%+ in 90 days.
CTA: Book a 30-minute pipeline audit.
```

## Step 4: Write ad copy sets

Produce 2 variants (A/B) for each placement. Label clearly.

**Output format per platform:**

### Google Search — Responsive Search Ads
```
Campaign: [campaign name]
Objective: [objective]
Audience: [audience]

VARIANT A
Headlines (15):
1. [30 chars max]
2. [30 chars max]
...
15. [30 chars max]

Descriptions (4):
1. [90 chars max]
2. [90 chars max]
3. [90 chars max]
4. [90 chars max]

Display paths: /[path1]/[path2]
```

### Meta — Single Image / Carousel
```
VARIANT A
Primary text: [125 chars max — write for truncation point]
Headline: [40 chars max]
Description: [30 chars max]
CTA button: [Book Now | Contact Us | Get Quote | Sign Up]

VARIANT B
[same structure]
```

### LinkedIn Sponsored Content
```
VARIANT A
Intro text: [150 chars max for preview]
Headline: [70 chars max]
Description: [100 chars max]
CTA button: [platform option]

VARIANT B
[same structure]
```

## Step 5: Character count validation
After writing, verify every element against the spec table. Flag any that exceed limits and rewrite before delivering. Do not deliver copy that exceeds platform limits.

Mark each element: `[XX/30]` to show char count vs. limit.

## Step 6: Output
Save to `output/ad-copy/[brand-id]/[campaign-slug]/[platform].md`.

Include at the top:
```
---
campaign: [campaign name]
platform: [platform]
objective: [objective]
audience: [audience]
brand: [brand_id]
status: draft
---
```

## Step 7: Compliance check
- [ ] All elements within character limits
- [ ] No banned words from brand_context
- [ ] No passive voice (Symbicore)
- [ ] No "Learn More" in ad body copy (CTA button use is acceptable)
- [ ] Claim is specific and provable — not a generic boast
- [ ] A/B variants are meaningfully different (not just one word changed)

# Guardrails
- Never write a headline that only works in a specific position — Google randomizes order
- Never make a claim that cannot be substantiated if challenged
- If no offer is defined, do not write the ad — ask for the offer first
- "Revolutionary", "game-changing", and all other banned words apply in ads as everywhere else
- Superlatives ("best", "#1") require proof or must be removed