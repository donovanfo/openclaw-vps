---
name: newsletter-writing
description: Use when someone asks to write a newsletter issue, produce a recurring publication for a client, or create structured editorial content for subscribers. Distinct from email-marketing — this is a publication, not a campaign sequence.
dependencies: [brand-context-manager]
---

# Purpose
Produce polished newsletter issues for client audiences. Newsletters are recurring publications with consistent editorial structure — not promotional sequences. Every issue reinforces community, delivers value, and keeps the brand top of mind with minimal selling.

# Dependencies
- brand-context-manager (validates brand, loads tone and audience)

# Inputs
- Brand/client (required): brand_id
- Issue number (required): e.g. "Issue 3" or "March 2026"
- Featured story or theme (required): the main topic or event driving this issue
- Secondary items (optional): news updates, upcoming events, announcements to include
- Audience segment (optional): defaults to primary subscriber audience from brand_context
- Length preference (optional): standard (400-600 words) | brief (200-300 words) | extended (600-900 words)

# Newsletter Structure

Every issue follows this editorial architecture:

| Section | Purpose | Word Count |
|---------|---------|------------|
| Header | Issue number, date, brief hook | 1-2 sentences |
| Featured Story | Main editorial piece — one topic, told well | 200-300 words |
| News & Updates | 2-3 brief items: milestones, announcements, changes | 30-50 words each |
| What's Coming | Upcoming events, deadlines, or dates worth knowing | 50-75 words |
| Closing / CTA | Warm close + one specific action | 30-50 words |

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm brand_id, load tone, audience profile, and banned words.

## Step 2: Identify the issue anchor
Every good newsletter issue has one clear reason to open it. State it:
```
This issue is about: [one thing — the featured story, a milestone, a season, a theme]
```
If no clear anchor exists, ask for one before writing.

## Step 3: Write the featured story
- One topic only
- Open with a specific detail, person, or moment — not a mission statement
- Write for the reader's situation, not about the organization
- End with a connection back to the subscriber's life or next step
- For nonprofit clients (CMHA): center a community story, impact stat, or timely topic

## Step 4: Write news and updates
Each item:
```
**[Headline — 5-8 words]**
[One or two sentences. What happened. Why it matters to the reader.]
```
Maximum 3 items.

## Step 5: Write What's Coming
```
- [Event or date] — [Date] — [One-line description or action]
```
Do not include items more than 6 weeks out unless advance registration required.

## Step 6: Write the closing CTA
One specific action. Not "Thanks for reading."
- "Register for [event] by [date] — spots are limited."
- "Know someone who could use [service]? Forward this issue."
- Never use "Learn More."

## Step 7: Assemble and output

Full issue format:
```markdown
---
client: [brand_id]
issue: [number or date]
theme: [anchor topic]
status: draft
---

# [Newsletter Name] | Issue [#] | [Month Year]

[Hook — 1-2 sentences]

---

## [Featured Story Headline]
[200-300 words]

---

## News & Updates

**[Item 1 headline]**
[1-2 sentences]

**[Item 2 headline]**
[1-2 sentences]

---

## What's Coming
- [Item 1] — [Date]
- [Item 2] — [Date]

---

[Closing line + CTA]

[Sign-off — name or team]
```

Save to `clients/[brand-id]/outputs/newsletters/issue-[number]-[month]-[year].md`

## Quality check
- [ ] Featured story has one anchor topic
- [ ] Opens with a specific detail, not a mission statement
- [ ] CTA is specific — not "Learn More" or "Thank you for reading"
- [ ] No banned words from brand_context
- [ ] 80% value, 20% ask ratio

# Guardrails
- This is a publication, not a sales email
- Do not cram every organizational update into one issue
- Never write a featured story that is really just an announcement
- Word counts are targets, not minimums
