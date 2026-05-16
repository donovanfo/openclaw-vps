---
name: tool-evaluator
description: Use when evaluating a new tool, platform, software, or AI product before adopting it, comparing tools against existing stack, or deciding whether something is worth the cost and integration effort.
---

# Purpose
Structured assessment before adopting any new tool, platform, or AI product. Prevents tool sprawl, duplicate subscriptions, and wasted onboarding time. Produces a scored evaluation with a clear recommendation — adopt, trial, or reject — so the decision is documented and defensible.

# Inputs
```json
{
  "tool_name": "name of the tool being evaluated",
  "use_case": "what problem it would solve or what it would replace",
  "current_solution": "what we do today for this problem (tool or manual process)",
  "source": "where the tool came from — recommendation, ad, research, etc."
}
```

# Process

## Step 1: Research the tool
Use WebSearch to gather current information on:
- What the tool does and its core features
- Pricing (including per-seat, per-use, or API costs)
- Integration options (native, Zapier, API)
- Reviews and user sentiment (G2, Reddit, Product Hunt)
- Company background — funded startup vs established product

Summarize in 3-5 bullet points. Do not editorialize yet.

## Step 2: Map against the existing stack
Review the current stack (documented in `context/current-priorities.md` and any tools referenced in CLAUDE.md):
- Does this tool overlap with anything we already use?
- Does it integrate with our core tools: SharePoint, Jira, Outlook, Claude Code?
- Would adopting it require removing or replacing something?

Flag any overlap or conflict.

## Step 3: Score against evaluation criteria

Score each criterion 1-5:

| Criterion | Weight | Score (1-5) | Weighted |
|---|---|---|---|
| Solves a real, recurring problem | 30% | | |
| Integrates with SharePoint / Jira / Outlook | 20% | | |
| Cost justified by time or revenue impact | 20% | | |
| Low learning curve for the team | 15% | | |
| Proven product (not beta / early access) | 15% | | |
| **Total weighted score** | | | **/5** |

**Thresholds:**
- 4.0-5.0: Adopt
- 3.0-3.9: Trial (free trial or 30-day pilot)
- Below 3.0: Reject

## Step 4: Produce evaluation report

```markdown
# Tool Evaluation: [Tool Name]
**Date:** [date]
**Evaluated by:** Tool Evaluator
**Use case:** [use_case]
**Current solution:** [current_solution]

---

## What It Does
[3-5 bullets — factual, from research]

## Pricing
[Pricing tiers and relevant cost for our usage]

## Integration Assessment
| Integration | Available | Notes |
|---|---|---|
| SharePoint / OneDrive | Yes / No / Via Zapier | |
| Jira | Yes / No / Via Zapier | |
| Outlook / Teams | Yes / No | |
| Claude / API | Yes / No | |

## Stack Overlap
[Any tools it duplicates or conflicts with]

## Scoring

| Criterion | Weight | Score | Weighted |
|---|---|---|---|
| Solves a real, recurring problem | 30% | | |
| Integrates with SharePoint / Jira / Outlook | 20% | | |
| Cost justified | 20% | | |
| Low learning curve | 15% | | |
| Proven product | 15% | | |
| **Total** | | | **/5** |

## Recommendation
**ADOPT / TRIAL / REJECT**

[2-3 sentences: why, and what the next step is if Adopt or Trial]

## Next Step (if Adopt or Trial)
- [ ] [Specific action — who does it, by when]
```

## Step 5: Save and log
Save to `output/tool-evaluator/[tool-name]-evaluation.md`.

Log the decision in `decisions/log.md` with date, tool name, and recommendation.

If recommendation is Adopt, flag to Donovan for final approval before any subscription or account creation.

# Quality Checklist
- [ ] Tool researched from current sources (not assumptions)
- [ ] Stack overlap identified
- [ ] All 5 criteria scored with rationale
- [ ] Recommendation matches the score threshold
- [ ] Decision logged in `decisions/log.md`
- [ ] Donovan notified if recommendation is Adopt

# Guardrails
- Do not recommend adoption without a score >= 4.0
- Do not create accounts, start trials, or make purchases — evaluate only
- Flag any tool with unclear pricing as a risk
- If the tool is an AI product, note whether it competes with or complements Claude Code