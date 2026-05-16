---
name: content-repurposing
description: Use when someone asks to repurpose content, turn a blog post into social media posts, convert a video into written content, break a long piece into shorter formats, or extract content from any existing asset.
---

# Purpose
Maximum leverage from existing content. One asset, many outputs. A single well-researched blog post can generate 10+ pieces of content across formats and platforms. This skill handles the extraction, adaptation, and reformatting — not the creation of new ideas from scratch.

# Inputs
- Source content (required): paste the content directly, or provide a file path or URL
- Source type (required): blog-post | video-transcript | podcast-episode | report | email | presentation | meeting-notes | interview
- Target formats (required): list which formats to produce — see format menu below
- Brand/client (required): brand_id
- Platform context (optional): where will the repurposed content be published

# Format Menu (select one or many)

| Format | Output | Best source |
|--------|--------|-------------|
| LinkedIn posts | 3-5 standalone posts | Blog, video, report |
| Twitter/X thread | 5-10 tweet thread | Blog, interview, data |
| Instagram carousel | 5-8 slide carousel brief | Blog, report, list content |
| Email newsletter | Single send | Blog, report, event |
| Short-form video script | 60-90s script | Blog, interview, report |
| Key quotes | 5-10 pullquote graphics | Any |
| FAQ content | Q&A pairs | Interview, podcast, support content |
| SEO blog post | Full post targeting a keyword | Video, podcast, interview |
| Email sequence | 3-email nurture | Long-form blog, guide, report |
| Speaking abstract | Conference/podcast pitch | Blog, POV content |
| Slide deck outline | Presentation structure | Blog, report |

# Process

## Step 1: Load brand context
Call brand-context-manager. Load tone, banned words, and voice attributes. All repurposed content must match brand voice — not just copy-paste the source.

## Step 2: Analyze the source

Read the source content fully before producing any output. Extract:

```
Source analysis:
- Core argument or thesis: [the single most important idea]
- Supporting points: [3-5 key claims or insights]
- Data points: [any statistics, figures, or quotes worth reusing]
- Best lines: [the sharpest, most quotable sentences]
- Audience: [who this was written for originally]
- Gaps: [what's implied but not stated — useful for spin-off content]
```

Do not skip this step. Repurposing without understanding the source produces shallow, disconnected output.

## Step 3: Map source content to target formats

For each requested format, identify which part of the source drives it:

```
Format mapping:
- LinkedIn post 1 → [core argument — the "hot take" version]
- LinkedIn post 2 → [data point + implication]
- LinkedIn post 3 → [one supporting point expanded as a standalone insight]
- Carousel → [the step-by-step or listicle angle]
- Email → [the "what this means for you" version for the subscriber list]
```

If a target format doesn't have enough source material to produce quality output, flag it before writing. Do not pad.

## Step 4: Produce repurposed content

### LinkedIn Posts
Apply social-media skill rules:
- Line 1 is the hook — rewrites the core idea as a provocation or data point
- Short paragraphs, no emojis (Symbicore), one idea per post
- End with a question or sharp observation — not a pitch
- Each post must stand alone — no "As I wrote in my blog..." references

### Twitter/X Thread
- Tweet 1: Hook — the boldest claim or most surprising finding
- Tweets 2-8: One supporting point per tweet
- Final tweet: Summary + CTA or open question
- Max 280 chars per tweet (validate before delivering)

### Instagram Carousel
Produce a carousel brief (feed to creative-production for design):
```
Frame 1 (cover): [hook headline — max 6 words]
Frame 2: [point 1 — headline + 1 line]
Frame 3: [point 2]
[...]
Final frame: [CTA — specific action]
Caption: [125-char hook + context]
```

### Email Newsletter
- Subject A / Subject B (A/B variants)
- Preview text
- Opening hook (not "I hope this finds you well")
- Body: the core insight in plain language, under 150 words
- One CTA — link to the original piece or a next action

### Short-Form Video Script
- Hook (0-3s): the most provocative line from the source
- Setup (3-15s): context in 1-2 sentences
- 3 key points (15-45s): adapted for spoken delivery — not read from the page
- CTA (45-60s): one specific action
- Apply video-content skill formatting: VISUAL / AUDIO / ON-SCREEN TEXT per timecode block

### Key Quotes (Pullquote Graphics)
Extract 5-10 standalone quotes that:
- Make a complete point without context
- Are short enough to read at a glance (under 20 words ideally)
- Are attributable (Donovan Fowke or the brand)

Format:
```
Quote 1: "[exact text]"
Context: [what this quote is from, for caption use]
Visual suggestion: [how to frame it — dark bg, light bg, stat overlay, etc.]
```

### SEO Blog Post
When source is a video or podcast, extract for a searchable written article:
- Identify the primary keyword this content could rank for
- Produce a full outline (H1, H2s, H3s) before writing the draft
- Write the post following seo-content skill rules
- Note: this is a significant output — flag if source doesn't have enough depth for a full 1,200+ word post

### Email Sequence
Extract the source into a 3-email nurture arc:
- Email 1: Problem/hook — the pain point the source addresses
- Email 2: Insight — the key finding or argument
- Email 3: Solution/CTA — what to do next
Apply email-marketing skill rules (75-word max for Symbicore, A/B subjects)

### Speaking Abstract
```
Title: [Compelling session title]
Abstract (150 words): [What the talk covers, who it's for, what they'll leave with]
Key takeaways:
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]
Speaker bio note: [Which credentials/experience support this topic]
```

## Step 5: Output

Save to `output/content-repurposing/[brand-id]/[source-slug]/`.

One file per format: `linkedin-posts.md`, `email.md`, `carousel-brief.md`, etc.

Produce a `repurposing-manifest.md` listing what was produced:
```markdown
# Repurposing Manifest: [Source Title]
**Source:** [type + title/URL]
**Brand:** [brand_id]
**Date:** [date]

| Format | File | Status | Notes |
|--------|------|--------|-------|
| LinkedIn posts (3) | linkedin-posts.md | Complete | |
| Email newsletter | email.md | Complete | |
| Carousel brief | carousel-brief.md | Complete | Feed to creative-production |
```

## Step 6: Compliance check
- [ ] No banned words from brand_context
- [ ] Each format stands alone — no "as mentioned above" cross-references
- [ ] LinkedIn posts do not open with "Excited to share" or "Thrilled to announce"
- [ ] Quote extracts are verbatim from source — not paraphrased
- [ ] Video scripts follow video-content format (VISUAL / AUDIO / ON-SCREEN)
- [ ] Email follows email-marketing rules (A/B subjects, 75-word limit for Symbicore)

# Guardrails
- Never invent insights not present in the source — repurposing extracts and adapts, not fabricates
- If the source is thin (under 500 words or under 5 minutes), flag which formats are viable and which aren't
- Do not produce SEO content that competes with the original piece for the same keyword — target adjacent terms
- Quote extracts must be exact — never paraphrase a quote and present it as a direct quote
- Each format must be fully adapted for its platform, not copy-pasted from the source