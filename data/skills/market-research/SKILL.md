---
name: market-research
description: Use when someone asks to research a market, understand an audience, analyze competitors, find industry trends, identify customer pain points, or gather intelligence before building a strategy.
---

# Purpose
The intelligence layer that feeds campaign-strategy. Research target markets, audience segments, and competitive landscapes to produce a structured intelligence brief. Nothing strategic should be written without this — assumptions are not research.

# Inputs
- Research focus (required): market | audience | competitor | all
- Brand/client (required): brand_id — determines the lens (what industry, what buyer)
- Specific targets (optional): competitor names, audience segments, industry verticals, geographic markets
- Depth (optional): quick-scan (1-2 hours) | standard | deep-dive

# Research Depth Defaults

| Depth | Scope | Use when |
|-------|-------|----------|
| quick-scan | Top-level positioning, obvious competitors, broad audience traits | Early ideation, sanity check |
| standard | Full competitive analysis, audience pain mapping, market sizing estimate | New campaign, new client |
| deep-dive | Multi-source research, persona development, trend analysis, white space mapping | New market entry, annual strategy |

# Process

## Step 1: Load brand context
Call brand-context-manager to confirm brand_id. This defines the lens: who the client is, what they sell, and who their buyer is. Research without this anchor produces generic findings.

## Step 2: Define research questions
Before searching, state what decisions this research will inform:

```
Research brief:
- Brand: [brand_id]
- Decision to be made: [e.g. "which channels to prioritize for Q2 campaign"]
- Key questions:
  1. [What are our target buyers' top 3 pain points right now?]
  2. [How are the top 3 competitors positioning their messaging?]
  3. [What channels are underserved in this market?]
- Depth: [quick-scan | standard | deep-dive]
```

Do not start gathering data until research questions are defined.

## Step 3: Audience intelligence

### Primary research questions:
- Who is the buyer? (role, company type, revenue range, industry)
- What triggers the search for a solution? (the "11pm Google" moment)
- What pain are they actively trying to solve right now?
- What language do they use to describe the problem? (exact phrases, not paraphrases)
- What objections do they have to buying?
- Where do they spend attention online?

### Sources to consult:
- Reddit: search relevant subreddits for raw, unfiltered buyer language
- LinkedIn: job postings reveal what companies are investing in; comments reveal hot topics
- G2 / Capterra / Trustpilot: reviews reveal real pain points in competitor's words
- Quora / forums: search "how do I [problem]" to find intent signals
- Fathom/Fireflies transcripts: `tools/fathom_fireflies_sync.py` — extract themes from past client conversations

### Output — Audience Profile:
```
## Audience: [Segment Name]
**Role:** [Job title(s)]
**Company:** [Size, industry, revenue range]
**Trigger:** [What made them start looking]
**Pain:** [Top 3 problems, in their words]
**Goal:** [What they're trying to achieve]
**Objections:** [Why they might not buy]
**Language:** [Exact phrases they use — direct quotes from reviews/forums]
**Channels:** [Where they spend attention]
**Decision process:** [Who else is involved, how long it takes]
```

## Step 4: Competitive intelligence

For each competitor identified (minimum 3, maximum 6):

### What to analyze:
- Positioning: What do they claim to be? What's their headline value prop?
- Messaging: What pain do they address? What language do they use?
- Channels: Where are they active? What content types?
- Cadence: How often do they post/publish?
- Ads: What are they running? (Use Meta Ad Library, Google Ads Transparency)
- SEO: What keywords are they ranking for? What content is performing?
- Tone: What voice and style?
- Gaps: What are they NOT saying? Who are they NOT serving?

### Output — Competitor Card:
```
## Competitor: [Company Name]
**URL:** [website]
**Positioning headline:** [their tagline or hero headline]
**Core claim:** [what they promise in one sentence]
**Target audience:** [who they're going after]
**Channels active:** [LinkedIn / Google Ads / content / email / etc.]
**Content tone:** [formal / casual / data-driven / story-led]
**Apparent strength:** [what they do well]
**Apparent weakness:** [where they're vulnerable or silent]
**Messaging gap:** [what they're not saying that our client could own]
```

## Step 5: Market intelligence

- What is the estimated market size? (TAM/SAM — approximate is fine, cite source)
- Is the market growing, shrinking, or stable? What's driving change?
- What are the top 3 trends reshaping this market in the next 12 months?
- Are there regulatory, economic, or technological forces that create urgency?
- Are there underserved segments or geographies?

## Step 6: Synthesize findings — White Space Analysis

After gathering data, identify the opportunity:

```
## White Space Analysis

**What the market is saying:** [dominant narrative — what everyone talks about]
**What the market is NOT saying:** [the gap — what nobody owns]
**Our client's opportunity:** [the angle they can credibly own based on their brand and strengths]
**Proof requirement:** [what evidence they need to make this claim credibly]
```

The white space is the most valuable output of market research. It tells campaign-strategy what angle to take.

## Step 7: Output

Save to `output/market-research/[brand-id]/[research-slug]-intelligence-brief.md`.

Structure:
```markdown
# Market Intelligence Brief: [Topic]
**Brand:** [brand_id]
**Date:** [date]
**Research depth:** [quick-scan | standard | deep-dive]

## Executive Summary
[3-5 sentences: what we found, what it means, what we recommend]

## Audience Intelligence
[Audience profiles]

## Competitive Landscape
[Competitor cards]

## Market Context
[Trends, sizing, forces]

## White Space Analysis
[The opportunity]

## Recommended angles for campaign-strategy
1. [Angle 1 — based on gap found]
2. [Angle 2]
```

End with an explicit handoff:
```
Handoff to campaign-strategy: Use the white space analysis and recommended angles as input.
```

## Step 8: Quality check
- [ ] Research questions defined before data gathered
- [ ] Audience pain described in buyer language — not paraphrased
- [ ] Minimum 3 competitors analyzed
- [ ] White space analysis completed — not just data, but the insight
- [ ] Recommendations are specific enough for campaign-strategy to act on

# Guardrails
- Never fabricate data — if a source doesn't yield a clear answer, state what was found and what remains unknown
- Never present assumptions as findings — label clearly: "Observed:" vs. "Hypothesis:"
- If competitor ad library is inaccessible, note it and use public content instead
- Research brief must state what decision it informs — research without a decision to make is wasted
- Quick-scan must not try to answer deep-dive questions — scope to the depth requested