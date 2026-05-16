---
name: website-copywriting
description: Use when someone asks to rewrite website copy, audit a homepage, overhaul a landing page, rewrite page sections, or improve web messaging for a client or for Symbicore.
dependencies: [brand-context-manager, market-research]
---

# Purpose
Rewrite website pages to convert browsers into buyers. Website copy fails when it talks about the company instead of the visitor's problem. This skill audits existing copy, diagnoses why it underperforms, and produces section-by-section rewrites with current vs. new comparisons. Output feeds into frontend-design or a developer brief.

# Inputs
- Brand/client (required): brand_id
- Page(s) to rewrite (required): homepage | landing-page | about | services | specific URL
- Existing copy (required): paste or provide URL — cannot audit what hasn't been read
- Objective (required): what should this page make the visitor do? One specific action.
- Audience (required): who is the primary visitor arriving at this page?
- Market research input (optional but strongly recommended): audience pain points from market-research

# Page Section Architecture

## Homepage
| Section | Job | Length |
|---------|-----|--------|
| Hero H1 | State outcome for the visitor — not what you do | Max 12 words |
| Subhead | Who it's for and what makes it different | Max 25 words |
| Problem | Name the pain in the visitor's language | 30-50 words |
| Solution | The life after the problem is solved | 40-60 words |
| Social proof | Specific results — numbers, names, outcomes | 2-3 proof points |
| Services | What they can buy or do next | 3-5 items, 15-20 words each |
| CTA | One clear next step — name the action and outcome | 10-15 words |

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm brand_id, ICP, tone rules, and banned words.

## Step 2: Audit existing copy
Score against these failure modes:

| Failure Mode | Signal |
|---|---|
| Company-centric | More "We/Our" than visitor references |
| Vague value prop | Hero is a slogan, not a benefit |
| Feature-first | Leads with what you do, not what it solves |
| Jargon overload | Uses terms visitors wouldn't Google |
| Weak CTA | "Learn More", "Contact Us", or multiple CTAs |
| Missing proof | No specific results, testimonials, or evidence |

Produce:
```
## Copy Audit: [Page]
**Failure modes:**
- [Mode] — [specific example from current copy]

**What's working (keep):**
- [line or section worth preserving]

**Strategic recommendation:**
[One sentence: what this page needs to do differently]
```

## Step 3: Confirm the one job of this page
```
Visitor: [who arrives here — role, situation]
Pain: [what they're struggling with in their language]
Action: [one specific thing we want them to do]
Belief required: [what they need to believe before they'll act]
```
If this can't be stated clearly, resolve it before writing.

## Step 4: Write section by section
For each section:
```markdown
### [Section Name]

**Current:**
> [existing copy — verbatim]

**Problem:** [why this underperforms — one sentence]

**Rewrite:**
[new copy]

**Rationale:** [why this works better]
```

Rules:
- H1: Lead with the visitor's outcome. Max 12 words. No company name in the headline.
- Problem: Use exact language the audience uses — not "many businesses struggle with..."
- Solution: Never list features. Describe the outcome.
- Proof: Specific beats vague. "3 of 5 clients grew pipeline 40%" beats "proven results."
- CTA: Name the action and outcome. "Book a 30-minute strategy call" beats "Contact us."

## Step 5: Output

```markdown
---
client: [brand_id]
page: [name or URL]
date: [date]
objective: [one action the page should drive]
primary_audience: [who this is written for]
status: draft
---

# Website Copy Rewrite: [Page]

## Audit Summary
[3-5 bullets]

## Strategic Recommendation
[One sentence]

---

## Section Rewrites

### Hero
H1: [rewrite]
Subhead: [rewrite]
CTA button: [rewrite]

### [Next section]
...

---

## Implementation Notes
[Character limits, image direction, developer guidance]
```

Save to `clients/[brand-id]/outputs/website-copywriting/[page-slug]-rewrite.md`

## Quality check
- [ ] Audit completed before writing
- [ ] One page objective stated before writing
- [ ] H1 is 12 words or fewer
- [ ] No "We/Our" in hero section
- [ ] Problem uses visitor language — not company language
- [ ] Proof contains a number, name, or specific result
- [ ] CTA names the action and outcome
- [ ] No banned words from brand_context
- [ ] Current vs. rewrite comparison for every section

# Guardrails
- Do not start writing without reading existing copy
- Do not write a homepage that serves more than one primary audience
- If market-research output is unavailable, ask for audience pain points — do not guess
- A rewrite that says the same thing differently is not a rewrite — the strategy must change
- Flag claims in current copy that can't be substantiated — do not carry them forward