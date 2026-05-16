---
name: proposal-writer
description: Use when someone asks to write a proposal, create a statement of work, build a pitch for a new client engagement, draft a retainer agreement scope, or produce any document that defines and prices a client engagement.
---

# Purpose
Turn a validated client brief into a proposal that wins the engagement. A proposal is a sales document, not a project plan. It answers one question: "Why Symbicore, why this approach, why now, and what exactly are we getting?" Every word moves the prospect toward yes.

# Dependencies
- brand-context-manager (validates brand, loads Symbicore tone)
- client-brief-intake output (the validated brief is the primary input)

# Inputs
- Client brief (required): output from client-brief-intake, or paste the brief directly
- Engagement type (required): retainer | project | discovery | advisory
- Investment range (optional): pricing tier or range — used to frame the investment section
- Proposal format (optional): formal | streamlined — defaults to formal

# Engagement Type Defaults

| Type | Scope | Typical length | Pricing model |
|------|-------|---------------|---------------|
| Retainer | Ongoing fractional CMO or agency services | 3-12 months | Monthly fee |
| Project | Defined scope, fixed deliverables | 4-16 weeks | Fixed fee |
| Discovery | Audit, strategy, or research sprint | 2-4 weeks | Fixed fee |
| Advisory | Strategic counsel, no execution | Monthly | Hourly or monthly retainer |

# Process

## Step 1: Load brand context
Call brand-context-manager. This proposal is a Symbicore document — it reflects Symbicore's brand, tone, and positioning. Apply owner-direct voice throughout.

## Step 2: Read the client brief
Pull from client-brief-intake output. Extract and restate:
- The client's objective (in their terms, not ours)
- The problem they're trying to solve
- What they've tried before (if known)
- Their timeline and constraints
- The measurable outcome they want

If the brief is incomplete, ask before writing the proposal. A proposal built on assumptions loses credibility.

## Step 3: Build the proposal narrative arc

A winning proposal tells a story:
1. We understand your situation better than you expect
2. Here's exactly what's causing the problem
3. Here's our specific approach to fix it
4. Here's the evidence we can do this
5. Here's exactly what you get and what it costs
6. Here's what happens next

Outline the arc before writing. Confirm the approach if the engagement is complex.

## Step 4: Write the proposal

### Section 1 — Situation (not "Executive Summary")
Restate the client's problem in their language. Demonstrate that you understand their business, their market, and the specific pressure they're under. This section should make the prospect think: "They get it."

- 2-3 paragraphs
- No Symbicore positioning yet — this is entirely about them
- Specific: reference their industry, their stage, their stated goal
- End with: the cost of inaction (what happens if this doesn't get fixed)

### Section 2 — Our Diagnosis
What is actually causing the problem? Give a specific, credible diagnosis — not a generic "you need better marketing."

- 1-2 paragraphs or a short bulleted diagnostic
- Grounded in the brief — reference specifics from what the client shared
- Honest: if there are constraints or challenges, acknowledge them here
- Do not diagnose problems you haven't been briefed on

### Section 3 — Our Approach
How Symbicore will solve it. Specific, sequenced, and jargon-free.

```
Phase 1: [Name] — [Weeks X-X]
What we do: [specific activities]
What you get: [specific deliverables]

Phase 2: [Name] — [Weeks X-X]
What we do: [specific activities]
What you get: [specific deliverables]

[Continue for all phases]
```

- No more than 3 phases for a project, 2 for discovery
- Each deliverable must be concrete — not "strategic recommendations"
- Name each phase with a verb: "Diagnose", "Build", "Launch", "Optimize"

### Section 4 — Why Symbicore
This is the only place Symbicore talks about itself — and it's brief.

- 1 paragraph: the specific experience or track record relevant to THIS client
- 1-2 proof points: specific results (with permission) or relevant context
- No generic credentials — "15 years of experience" means nothing. Results mean everything.

### Section 5 — Deliverables & Timeline

```
## What You Receive

| Deliverable | Description | Timeline |
|-------------|-------------|----------|
| [Deliverable 1] | [Specific description — 1 line] | Week [X] |
| [Deliverable 2] | [Specific description] | Week [X] |

## Project Timeline
[Start date] → [End date]
Key milestones: [list 3-5 dates or checkpoints]
```

### Section 6 — Investment

Frame pricing as investment, not cost. Anchor against the value of the outcome, not the hours.

**Format:**
```
## Investment

[Engagement type]: [Price]
[Payment terms: e.g. 50% upfront, 50% on delivery / Monthly in advance]

What's included:
[Bullet list of included deliverables and scope]

What's not included (out of scope):
[Bullet list — be specific to avoid scope creep]

Optional add-ons:
[Any items the client might want to add — with price]
```

**Pricing language rules:**
- Never say "cost" — say "investment"
- Never apologize for price — state it directly
- Always include what's NOT included — this protects both parties
- If pricing is tiered, present the recommended tier first

### Section 7 — Next Steps

One paragraph. One clear action.

```
To move forward: [specific action — e.g. "sign and return the agreement below" or "reply to confirm the kickoff date"]
[Proposal validity: e.g. "This proposal is valid for 14 days."]
[Start date: e.g. "Earliest available start: [date]"]
```

Never "let us know if you have questions." State the action.

## Step 5: Statement of Work (SOW) — if requested

A SOW is a legal/operational document. Produce separately from the proposal.

```markdown
# Statement of Work
**Client:** [Client name]
**Vendor:** Symbicore Inc.
**Effective date:** [date]
**Project:** [Project name]

## Scope of Work
[Detailed deliverable list]

## Assumptions
[What Symbicore assumes the client will provide or do]

## Client Responsibilities
[What the client must deliver for Symbicore to do its work]

## Out of Scope
[Explicit exclusions]

## Timeline
[Milestones and deadlines]

## Investment & Payment Terms
[Pricing and payment schedule]

## Change Order Process
[How scope changes are handled]

## Acceptance Criteria
[How deliverables are approved]
```

## Step 6: Output
Save to `output/proposals/[client-slug]-[project-slug]-proposal.md`.
SOW (if applicable): `output/proposals/[client-slug]-[project-slug]-sow.md`.

## Step 7: Quality check
- [ ] Situation section written in client's language — not Symbicore's
- [ ] Diagnosis is specific to THIS client — not generic
- [ ] Every deliverable is concrete and testable — not vague
- [ ] Pricing stated directly — no hedging
- [ ] Out-of-scope items listed explicitly
- [ ] Next step is a single, specific action
- [ ] No banned words from brand_context
- [ ] No passive voice

# Guardrails
- Never write a proposal for a scope that hasn't been validated in the brief
- Never include deliverables that weren't discussed — scope creep starts here
- Never price a proposal without knowing what the client's budget range is (at minimum approximate) — if unknown, ask before writing the investment section
- "Revolutionary", "game-changing", and all other banned words are doubly banned in proposals — prospects can smell generic positioning
- If the brief reveals a mismatch between what the client wants and what Symbicore does well, flag it rather than writing around it