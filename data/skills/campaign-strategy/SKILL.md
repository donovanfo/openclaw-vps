---
name: campaign-strategy
description: Use when someone asks to plan a campaign, build a marketing strategy, create a campaign brief, or translate a business goal into a marketing plan.
---

# Purpose
Translate a business objective into a structured campaign plan: channel mix, messaging framework, content calendar, and KPIs. This is the top of every production workflow — downstream skills (copywriting, marketing-creatives) depend on this output.

# Dependencies
Run brand-context-manager first. Block execution if brand context is not validated.

# Inputs
- Business objective (required): e.g. "generate 20 qualified leads in Q2"
- Target audience (required): pull from brand_context or ask
- Budget (optional): shapes channel mix recommendations
- Timeline (optional): shapes content calendar length
- Campaign context (optional): existing assets, competitive notes

If any required input is missing, ask before proceeding. Do not fabricate inputs.

# Process

## Step 1: Load brand context
Call brand-context-manager to validate brand_id. If it returns `validated: false`, stop and surface the error. Do not proceed.

## Step 2: Clarify the objective
Restate the business objective in this format:

```
Goal: [specific, measurable outcome]
By when: [deadline or timeframe]
Starting from: [current baseline if known]
```

If the objective is vague ("grow brand awareness"), push back and get a measurable goal before continuing.

## Step 3: Define the audience
Use the validated brand_context audience data. If targeting a specific sub-segment, document explicitly:
- Who they are
- What they care about (pain, goal, trigger)
- Where they spend attention (channel implications)

## Step 4: Build the channel mix
Recommend 2-4 channels based on objective, audience, and budget. For each channel:

| Channel | Role | Content Format | Effort |
|---------|------|---------------|--------|
| LinkedIn | Awareness/consideration | Thought leadership posts | Medium |
| Email | Conversion | Nurture sequence | Medium |

Role options: Awareness / Consideration / Conversion
Effort options: Low / Medium / High

## Step 5: Develop the messaging framework
Produce a one-page messaging framework:
- **Core message:** The single idea the campaign communicates
- **Proof points:** 3 supporting facts or claims
- **Tone:** Pulled from brand_context voice attributes
- **Differentiator:** What makes this campaign's POV distinct

## Step 6: Build the content calendar
Produce a phased content calendar. Minimum 4 weeks; scale to campaign length.

| Week | Channel | Content Type | Topic/Angle | CTA | Status |
|------|---------|-------------|-------------|-----|--------|
| 1 | LinkedIn | Post | [angle] | [cta] | Draft |

## Step 7: Define KPIs
Set 3-5 KPIs with targets. Include one leading indicator and one lagging indicator.

| KPI | Target | Measurement Source |
|-----|--------|--------------------|
| Leads generated | 20 | CRM |
| Engagement rate | 4%+ | LinkedIn Analytics |

## Step 8: Output the campaign brief
Save to `output/campaign-briefs/[campaign-slug]-brief.md`.

```markdown
# Campaign Brief: [Campaign Name]
**Date:** [date]
**Brand:** [brand_id]
**Objective:** [restated measurable goal]

## Audience
[audience segment definition]

## Channel Mix
[channel table]

## Messaging Framework
[core message, proof points, tone, differentiator]

## Content Calendar
[content calendar table]

## KPIs
[KPI table]

## Handoff
Copywriting skill: use this brief as input for copy generation.
```

# Guardrails
- Never start without validated brand context
- Never fabricate metrics or audience data — use what's in brand_context or ask
- If budget is unknown, provide channel recommendations with effort levels only
- Do not produce a brief for a vague objective — push back first
- Brief body (excluding calendar) must be under 2 pages