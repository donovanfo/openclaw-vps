---
name: lead-research
description: Use when someone asks to build a prospecting list, research a target account, find contact details for outreach, map an industry segment for business development, or produce any deliverable intended to fuel a sales pipeline.
dependencies: [market-research]
---

# Purpose
Produce structured, actionable prospecting intelligence for business development. Covers three modes: list building (find and qualify targets matching a profile), account research (deep profile on a specific company), and contact research (background on a specific person). Output feeds directly into proposal-writer or email-marketing.

# Inputs
- Research mode (required): list-building | account-research | contact-research
- Brand/client (required): who is prospecting — determines the seller's value proposition
- Target profile (required): who are we looking for? Industry, role, company size, geography, trigger events
- List size (optional): for list-building — default 25 targets
- Specific target (required for account/contact modes): company name, URL, or LinkedIn URL
- Purpose (required): outreach | conference prep | RFP | referral mapping

# Process

## Mode 1: List Building

### Step 1: Define the ICP precisely
```
Target profile:
- Industry/vertical: [e.g. fee-only financial planners in Canada]
- Company size: [revenue range or headcount]
- Geography: [province, state, country]
- Role: [decision-maker title(s)]
- Trigger signals: [what indicates they need this now]
- Exclusions: [existing clients, competitors, wrong size]
```
If the ICP is vague, ask for specifics before building.

### Step 2: Source targets
Search in this order:
1. LinkedIn search with role/geography/industry filters
2. Industry association and membership directories
3. Conference speaker lists and exhibitor directories
4. Apollo.io data (if available in `tools/`)
5. Firecrawl (`tools/`) for association/directory pages
6. Google: `site:[association-domain] members` or `"[role title]" "[geography]"`

Capture per target: Company | Contact Name | Title | Location | Source | Signal | Notes

### Step 3: Qualify and output
Apply ICP filter. Minimum 80% match confidence before including. Flag unverified entries.

```markdown
---
client: [brand_id]
list_name: [descriptive name]
date: [date]
icp_summary: [one sentence — who and why]
total_targets: [n]
---

# Target List: [Name]

| # | Company | Contact | Title | Location | Signal | Source | Priority |
|---|---------|---------|-------|----------|--------|--------|----------|

## Notes
[Gaps, confidence level, suggested outreach angle]

## Recommended next step
[email-marketing cold sequence | proposal-writer | Donovan review]
```

---

## Mode 2: Account Research
Deep profile on a specific company before outreach or proposal.

Capture:
- What they do, size, locations, revenue (if public), ownership
- Key decision-makers and their backgrounds (LinkedIn)
- Last 90 days news: funding, leadership changes, new initiatives, press mentions
- Likely pain based on industry, size, and news
- Specific Symbicore services that map to their needs
- Existing relationship: any prior Symbicore connection or proposals
- Recommended approach: cold email | warm intro | event | LinkedIn

Output: `account-profile-[company-slug].md`

---

## Mode 3: Contact Research
Background on a specific individual for outreach personalization or pre-meeting prep.

Capture:
- Role, tenure, previous companies and titles
- Public statements: LinkedIn posts, articles, interviews
- Trigger events: recent promotions, company announcements, content published
- Connection points: mutual contacts, shared industry involvement, overlap with Donovan
- 2-3 specific, non-generic conversation openers based on research

Output: `contact-profile-[name-slug].md`

---

## Quality check
- [ ] ICP defined before searching
- [ ] List-building: minimum 80% ICP match per entry
- [ ] No fabricated contact details — unverified fields flagged
- [ ] Account/contact: all claims sourced
- [ ] Recommended next step included

## Output path
`clients/[brand-id]/outputs/lead-research/[list-name].md`

# Guardrails
- Never fabricate contact data — mark unverified and note the source
- Do not build lists larger than 100 without checking with Donovan
- Contact research uses publicly available information only
- Flag any target that appears to be an existing Symbicore client
- If Apollo.io or Firecrawl fail, proceed with manual research — do not stop
