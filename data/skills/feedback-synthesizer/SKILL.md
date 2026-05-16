---
name: feedback-synthesizer
description: Use when processing client feedback, revision requests, satisfaction responses, or any client commentary on a campaign or deliverable. Turns raw feedback into structured insights that inform the next campaign cycle.
---

# Purpose
Convert raw client feedback — emails, revision notes, call comments, survey responses — into structured insights that the team can act on. Prevents feedback from getting lost in inboxes or Jira comments. Surfaces patterns across multiple feedback points and feeds actionable insights into campaign-strategy and the next production cycle.

# Inputs
```json
{
  "client_id": "client identifier",
  "feedback_sources": "email thread | revision notes | call transcript | survey | Jira comments",
  "campaign_or_deliverable": "what the feedback is about",
  "feedback_period": "date range the feedback covers"
}
```

# Feedback Categories

Every piece of feedback gets tagged to one or more categories:

| Category | What it covers |
|---|---|
| **Strategy** | Campaign direction, messaging angle, audience targeting |
| **Content** | Copy, tone, length, messaging accuracy |
| **Design** | Visual style, layout, colors, imagery |
| **Execution** | Timing, process, responsiveness, turnaround |
| **Results** | Performance vs expectations, metrics, ROI sentiment |
| **Relationship** | Communication style, how the team is working together |

# Process

## Step 1: Collect and read all feedback
Gather all feedback from the stated sources. If the source is an email thread or Jira comments, read the full thread — not just the most recent message. Context matters.

If feedback is from a call transcript, run meeting-intelligence first to extract the relevant segments before proceeding.

## Step 2: Tag and categorize each piece of feedback
For each distinct piece of feedback, record:
- Verbatim quote or close paraphrase
- Category tag (from table above)
- Sentiment: Positive / Negative / Neutral / Constructive
- Actionable: Yes / No
- Priority: High / Medium / Low (based on client tier, specificity, and urgency)

## Step 3: Identify patterns
Look across all feedback items:
- Are multiple pieces of feedback pointing to the same underlying issue?
- Is there a pattern across multiple deliverables or campaigns?
- Is the client dissatisfied with a specific team member, process, or output type?

A pattern requires at least 2 separate feedback items pointing to the same issue.

## Step 4: Separate actionable from non-actionable
**Actionable:** Specific change the team can make to a deliverable, process, or campaign direction.
**Non-actionable:** Vague preferences, contradictory feedback, or feedback that conflicts with strategy.

For non-actionable feedback: document it and note why it is not being acted on.

## Step 5: Produce feedback synthesis report

```markdown
# Feedback Synthesis: [Client Name] — [Campaign / Period]
**Date synthesized:** [date]
**Sources:** [list of sources]
**Deliverable or campaign:** [name]

---

## Feedback Log

| # | Verbatim / Paraphrase | Category | Sentiment | Actionable | Priority |
|---|---|---|---|---|---|
| 1 | "[quote]" | Content | Negative | Yes | High |
| 2 | "[quote]" | Design | Constructive | Yes | Medium |

---

## Patterns Identified

| Pattern | Evidence (ticket/quote #) | Category | Impact |
|---|---|---|---|
| [Pattern description] | [#1, #3] | [Category] | High / Medium / Low |

---

## Recommended Actions

| Action | Owner | Timeline | Links to feedback # |
|---|---|---|---|
| [Specific change] | [Team member] | [Sprint / date] | [#1, #2] |

---

## Non-Actionable Feedback
| Feedback | Reason not actioned |
|---|---|
| "[quote]" | [Contradicts strategy / too vague / client preference vs best practice] |

---

## Strategic Implications
[2-3 bullets — insights that should inform the next campaign cycle, not just the current deliverable]

---

## Recommended Next Step
[One specific action for Donovan to take based on this synthesis]
```

## Step 6: Route outputs
Save to `clients/[client_id]/outputs/feedback/[YYYY-MM]-feedback-synthesis.md`.

If strategic implications are significant, flag them for campaign-strategy on the next cycle.

If patterns reveal an execution or process problem, flag to Alexi for process review.

If recommended actions require Jira tickets, draft them and ask Donovan to approve before creating.

# Quality Checklist
- [ ] All feedback sources read in full — not skimmed
- [ ] Every feedback item categorized and tagged
- [ ] Patterns require at least 2 data points — no single-point patterns
- [ ] Non-actionable feedback documented with a reason
- [ ] Recommended actions are specific and assigned
- [ ] Strategic implications surface anything that should change in the next campaign cycle
- [ ] Output saved to client folder

# Guardrails
- Never discard feedback — document everything, even if non-actionable
- Do not interpret vague feedback as positive — flag as ambiguous
- Verbatim quotes are more reliable than paraphrases — use them when available
- If feedback contradicts the strategy, surface it to Donovan rather than acting on it unilaterally
- Client satisfaction patterns that repeat across 3+ feedback points escalate to Donovan immediately