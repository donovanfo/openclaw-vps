---
name: seo-content
description: Use when someone asks to write a blog post, create a landing page, build a city hub page, write SEO content, or produce any long-form content intended to rank in search.
dependencies: [brand-context-manager]
---

# Purpose
Produce SEO-optimized content that ranks and converts. Covers blog posts, landing pages, and local hub pages (e.g. AdaptAtHome city pages). Every piece targets one primary keyword, serves one audience intent, and drives one clear action.

# Dependencies
- brand-context-manager (validates brand, loads tone and voice)
- campaign-strategy output (if content is part of a campaign)

# Inputs
- Primary keyword (required): e.g. "adaptive equipment Winnipeg" or "fractional CMO for B2B"
- Content type (required): blog | landing-page | city-hub | pillar-page
- Brand/client (required): e.g. "symbicore" or "adaptathome"
- Target audience (required): pull from brand_context or specify
- Word count target (optional): defaults by content type (see below)
- Supporting keywords (optional): 3-5 related terms to weave in naturally

# Content Type Defaults

| Type | Target Word Count | Primary Intent |
|------|------------------|----------------|
| Blog post | 1,200-2,000 | Educate / build authority |
| Landing page | 600-900 | Convert |
| City hub page | 800-1,200 | Local search + trust |
| Pillar page | 2,500-4,000 | Rank for broad topic cluster |

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm brand_id, load tone, voice attributes, and banned words. Do not proceed without validated brand context.

## Step 2: Analyze the keyword
Before writing, define:
- **Search intent:** Informational / Navigational / Commercial / Transactional
- **SERP implication:** What format does this intent demand? (List post, how-to, comparison, local page)
- **Audience moment:** What triggered this search? What does the reader need to feel/know/do next?

If the keyword intent does not match the requested content type, flag it and recommend the correct format before proceeding.

## Step 3: Build the content outline
Produce the outline before writing body copy. Get implicit approval before proceeding to draft.

```
Title: [Primary keyword + value hook, under 60 chars]
Meta description: [Benefit + keyword + CTA, 140-155 chars]

H1: [Matches title intent, not identical]
H2: [Section 1]
  H3: [Subsection if needed]
H2: [Section 2]
H2: [Section 3]
...
H2: FAQ (if informational intent)
CTA section: [One clear next action]
```

## Step 4: Write the draft
Follow these rules:

**Structure:**
- First 100 words must confirm the reader is in the right place and establish authority
- Each H2 section answers one question completely
- No section over 300 words without a visual break (subhead, bullet list, or table)
- Final section is always a single clear CTA — not "learn more"

**Tone (from brand_context):**
- Symbicore: Direct, analytical, owner-first. No passive voice. No fluff.
- AdaptAtHome: Warm, trust-first, human. Plain language. Written for someone stressed at 11pm.
- Apply client-specific tone from brand_context for all other clients.

**SEO mechanics:**
- Primary keyword in: H1, first 100 words, one H2, meta description, URL slug (provide slug recommendation)
- Supporting keywords used naturally — never forced
- Internal link placeholders: `[INTERNAL LINK: topic]` where relevant
- Image alt text recommendations included at the end

## Step 5: Write metadata and schema

**Title tag:** Under 60 chars. Primary keyword near front.
**Meta description:** 140-155 chars. Benefit + keyword + action.
**URL slug:** lowercase, hyphens, primary keyword, under 60 chars.

**Schema recommendation** (provide the type, not the full JSON):
- Blog post: Article schema
- Landing page: WebPage or Service schema
- City hub: LocalBusiness + BreadcrumbList schema (AdaptAtHome)
- Pillar page: Article schema with speakable

## Step 6: Output
Save draft to `output/seo-content/[brand-id]/[slug].md`.

Include at the top of the file:
```
---
title: [title tag]
meta_description: [meta description]
slug: /[url-slug]
keyword: [primary keyword]
intent: [informational|commercial|transactional]
brand: [brand_id]
content_type: [type]
status: draft
---
```

## Step 7: Compliance check
Before delivering, verify:
- [ ] Zero banned words from brand_context
- [ ] Tone matches brand voice
- [ ] CTA does not use "Learn More" or "Submit"
- [ ] No passive voice in Symbicore content
- [ ] Plain language score appropriate for AdaptAtHome (Grade 8 reading level or below)

# Guardrails
- Never keyword-stuff — if a keyword can't be used naturally, use it less
- Never write a CTA as "Learn More" or "Submit"
- City hub pages for AdaptAtHome must mention real local context (hospital names, health authority, neighbourhood)
- Do not write content that contradicts claims in brand_context messaging_samples
- If word count target conflicts with quality, flag it rather than padding