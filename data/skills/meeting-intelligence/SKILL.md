---
name: meeting-intelligence
description: Use when someone asks to process a meeting transcript, summarize a call, extract action items from a meeting, turn a client call into follow-up content, or sync Fathom or Fireflies notes.
---

# Purpose
Extract maximum value from meeting recordings and transcripts. A single client call contains strategy, objections, quotable insights, action items, and content ideas. This skill processes Fathom/Fireflies transcripts into structured outputs — meeting summary, action items, follow-up email, CRM notes, and content ideas — so nothing gets lost between the call and the next step.

# Dependencies
- `tools/fathom_fireflies_sync.py` — pulls transcripts from Fathom or Fireflies
- brand-context-manager (for any client-facing outputs — confirms brand_id)

# Inputs
- Transcript source (required): fathom | fireflies | paste-direct
- Meeting ID or URL (required if fathom/fireflies): the meeting identifier
- Meeting type (required): client-strategy | client-check-in | sales-call | discovery | internal | interview
- Participants (optional): who was on the call — helps label speakers correctly
- Priority outputs (optional): which outputs to produce (defaults to all)

# Meeting Type Profiles

| Type | Primary outputs | Key focus |
|------|----------------|-----------|
| client-strategy | Summary, action items, follow-up email, content ideas | Decisions made, strategic direction |
| client-check-in | Summary, action items, follow-up email | Progress, blockers, next steps |
| sales-call | Summary, CRM notes, follow-up email, objection log | Buying signals, objections, next step agreed |
| discovery | Summary, CRM notes, audience intelligence extract | Client pain, language they use, situation |
| internal | Summary, action items | Decisions, owners, deadlines |
| interview | Transcript highlights, content ideas, quote extraction | Best quotes, key insights for repurposing |

# Process

## Step 1: Pull the transcript
Run `tools/fathom_fireflies_sync.py get_transcript [meeting_id]`.

If the tool fails or the meeting ID is invalid, ask the user to paste the transcript directly. Do not proceed without a transcript.

## Step 2: Identify speakers and meeting context

From the transcript, identify:
- Who spoke (label by name or role if names are unclear)
- Meeting date and duration
- Meeting type (confirm or infer from context)
- Primary topic

Log any sections where the transcript is unclear or garbled — do not guess at meaning.

## Step 3: Produce outputs by meeting type

---

### Output 1: Meeting Summary

```markdown
# Meeting Summary: [Topic or Client Name]
**Date:** [date]
**Duration:** [length]
**Participants:** [names/roles]
**Meeting type:** [type]

## What Was Discussed
[3-5 bullet points — each covers one topic from the call, in plain language]

## Key Decisions Made
[Bullet list — only confirmed decisions, not discussions]
- [Decision 1] — decided by [who]
- [Decision 2]

## Key Insights / What We Learned
[Observations from the conversation that inform strategy or next steps]
- [Insight 1]
- [Insight 2]

## Open Questions (unresolved)
- [Question 1] — owner: [who will resolve]
- [Question 2]
```

---

### Output 2: Action Items

```markdown
# Action Items: [Meeting name]
**Date:** [date]

| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | [Specific action — verb + object] | [Name] | [Date or "ASAP"] | Open |
| 2 | | | | |

**Next meeting:** [Date if confirmed, or "TBD"]
```

Rules:
- Every action item has an owner and a due date — no orphaned tasks
- Actions are specific: "Send revised proposal by Friday" not "follow up"
- If an action is Donovan's, note it explicitly so it can be pushed to Microsoft To Do or Jira

---

### Output 3: Follow-Up Email

Write a follow-up email from Donovan (or the Symbicore account) to the client/prospect:

Apply email-marketing skill tone rules:
- Open with a specific reference to what was discussed — not "Great talking with you"
- Summarize the 2-3 most important points in plain language
- List action items with owners and dates
- State the next step clearly — one specific action
- Under 150 words

```
Subject: [Specific — references the meeting topic, not "Following up"]
Preview: [What the email confirms or asks for]

---

[Body — under 150 words]

[Action items as bullet list if more than 2]

[Next step — one sentence]

[Sign-off]
```

---

### Output 4: CRM Notes (sales and discovery calls)

Structured for entry into CRM or Jira:

```markdown
# CRM Notes: [Prospect/Client Name]
**Date:** [date]
**Call type:** [discovery | sales | check-in]
**Stage:** [awareness | consideration | decision | customer]

## Situation
[What is their current situation — 2-3 sentences]

## Pain
[What problem are they trying to solve — in their exact language where possible]

## Goals
[What outcome do they want]

## Timeline
[When do they need a solution / when are they making a decision]

## Budget
[Stated or inferred budget range]

## Decision Process
[Who else is involved, what the approval process looks like]

## Objections Raised
- [Objection 1] — how it was addressed
- [Objection 2]

## Buying Signals
- [What suggested genuine interest]

## Next Step Agreed
[The specific next action both parties committed to]

## Call Rating (internal)
Hot / Warm / Cold — [one line rationale]
```

---

### Output 5: Audience Intelligence Extract (discovery calls)

When a discovery call surfaces buyer language, pain points, or market insights:

```markdown
# Audience Intelligence: [Prospect/Client Name]
**Source:** Discovery call — [date]
**Brand:** [client or prospect's industry/segment]

## Exact phrases they used
- "[verbatim quote from transcript]"
- "[verbatim quote]"
(Use these in copywriting and messaging — buyer language beats marketer language)

## Pain points surfaced
- [Pain 1 — in their words]
- [Pain 2]

## What they've already tried
- [Previous attempt 1 — and why it didn't work]

## What success looks like to them
[Their definition of the outcome — in their words]
```

Feed this output into market-research and campaign-strategy when writing for this segment.

---

### Output 6: Content Ideas (interviews and strategy calls)

Extract quotable moments and content opportunities from the transcript:

```markdown
# Content Ideas: [Meeting name]
**Source:** [meeting type + date]

## Quotable moments
- "[Exact quote from transcript]" — [who said it, context]
- "[Quote 2]"

## Content angles identified
- [Topic or angle 1] → [Suggested format: LinkedIn post | article | video]
- [Topic or angle 2] → [Suggested format]

## Stats or claims mentioned
- [Stat or claim] — [source, if stated]
(Flag: verify before publishing)

## Questions asked that revealed real pain
- "[Question from transcript]" — this angle could anchor a piece on [topic]
```

Feed into content-repurposing or personal-brand skill.

## Step 4: Output
Save all outputs to `output/meeting-intelligence/[date]-[meeting-slug]/`.

Produce outputs relevant to the meeting type. Label each file clearly:
- `summary.md`
- `action-items.md`
- `follow-up-email.md`
- `crm-notes.md` (sales/discovery only)
- `audience-intel.md` (discovery only)
- `content-ideas.md` (interviews/strategy only)

## Step 5: Push action items
If action items belong to Donovan, offer to create Jira tickets or Microsoft To Do tasks. Confirm before creating — this affects shared systems.

## Step 6: Quality check
- [ ] Speaker labels are accurate — not generic "Speaker 1"
- [ ] Action items all have owners and due dates
- [ ] Follow-up email under 150 words
- [ ] Audience intelligence quotes are verbatim — not paraphrased
- [ ] No invented decisions or action items — only what was confirmed on the call
- [ ] Unclear transcript sections flagged, not guessed

# Guardrails
- Never fabricate decisions, quotes, or action items not present in the transcript
- Mark all unclear or garbled transcript sections explicitly — do not interpret
- CRM notes are internal documents — do not include in client-facing outputs
- Verbatim quotes from discovery calls are gold — always extract them exactly
- If the transcript reveals confidential client information, do not use it in content ideas without explicit permission