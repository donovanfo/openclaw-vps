---
name: performance-reporting
description: Use when someone asks for a performance report, wants to see what's working, needs campaign results, or wants data on marketing metrics.
---

# Purpose
Pull performance data from available sources and produce a Symbicore-branded client report structured around funnel stages and formatted as an EOS-style meeting document. The report is built to be used in a client meeting — not just read after one.

# Dependencies
- brand-context-manager (brand context for the client being reported on)
- `tools/agency_analytics.py` (pulls live data from AA via browser automation)
- `tools/report_generator.py` (generates Symbicore-branded .docx with color-coded status cells)
- `tools/onedrive.py` (uploads to client SharePoint)
- Atlassian MCP `addCommentToJiraIssue` (links report in Jira, assigned to Camille)
- Fireflies MCP `fireflies_get_transcripts` + `fireflies_get_summary` (pull recent client meetings)

# Inputs
- Client brand ID (required): e.g. `pioneering-technology`
- Report period (required): YYYY-MM format — if not given, default to last complete month
- Data source (optional): `agency-analytics` (default if client_id is configured), `manual` (PDF/CSV in inputs folder)

# Data Sources

## Agency Analytics (preferred)
If `agency_analytics.client_id` is set in the client's brand config, run:
```
python tools/agency_analytics.py --client [brand_id] --period [YYYY-MM]
```
Raw data saves to `clients/[id]/inputs/agency-analytics/aa-raw-[period].json`.

Only extract sections listed in `agency_analytics.sections` in the client config.
Standard sections: `google_analytics`, `google_ads`, `search_console`, `facebook`, `linkedin`, `seo_rankings`, `site_audit`, `google_business`

## Meeting Intelligence (always run)
Before writing the report, pull the 2 most recent Fireflies meetings that include the client:
```
fireflies_get_transcripts(keyword="[client name]", limit=5)
```
Get full summaries for the 2 most relevant results via `fireflies_get_summary`. Extract:
- Open issues, concerns, or decisions raised by the client or team
- Any metrics or results mentioned verbally (often more current than dashboard data)
- Action items already committed to — these should appear in To-Dos if not yet complete
- Client sentiment and strategic context

Meeting intelligence feeds directly into Headlines, Issues, and To-Dos. Never surface confidential internal sentiment about Symbicore in the client-facing report — use meeting context to sharpen accuracy, not to expose internal discussions.

## Manual Input (fallback)
If no client_id is configured, look in `clients/[id]/inputs/` for:
- PDF report exports
- CSV exports from individual platforms
- Any data the user drops in the inputs folder

Always state which source was used and what is missing. Never fabricate metrics.

## Setting Up a New Client in AA
1. Run `python tools/agency_analytics.py --list-campaigns` — expands group folders automatically
2. Match campaign to client by name
3. Add to brand config: `"agency_analytics": { "client_id": "12345", "sections": [...] }`
4. Re-run extraction

# Report Structure

Every report follows this structure. Do not use channel-based sections (e.g. "Google Ads", "Facebook"). Channels appear as data points within funnel stages.

## Header
```
[Client Name] — Marketing Performance Report
Period: [Month YYYY] | Prepared by: Symbicore | Date: [Date]
90-Day Goal: [goals_90_day from brand config]
```

## 1. Wins
3–5 bullet points. What went right this period. Start here — EOS meetings open with good news. Each win should be a specific, data-backed positive: a metric that improved, a campaign that performed, a milestone reached. No vague statements.

## 2. Headlines
5–7 bullet points. The most important observations this period — positive and negative. Written for a decision-maker who reads only this page.

Each headline follows this pattern: **observation + business implication or opportunity.** Do not assign blame or use emotionally charged language. The tone is diagnostic — here is what the data shows, here is what it means. Never write a headline that implies Symbicore or any named party is responsible for a failure. Surface the issue neutrally, then point to the opportunity.

## 3. Scorecard
KPI table with columns: KPI | Target | Prior Period | [Current Period] | Trend | Status.

**Status values and colors (applied as cell background in .docx):**
- `ON TRACK` → Green
- `MONITOR` → Yellow
- `OFF TRACK` → Red
- `NO DATA` → Light grey
- `BASELINE` → Light blue

**Trend column:** Use ↑ ↓ → to show direction vs. prior period.

**Metric selection rules — predictive over vanity:**
- Include: conversion rate, cost per lead trend, ROAS trend, organic CTR, avg position movement, lead volume, pipeline influence, call attribution
- Avoid as standalone KPIs: total impressions, total followers, raw click counts (include only when tied to a trend or conversion signal)
- Every KPI must have a "so what" — a metric that can't be connected to a business outcome does not belong in the scorecard

If no target exists, flag as BASELINE. Targets must come from client config or prior-period data — never invented.

## 4. Funnel Snapshot
Five stages. Each stage has a data table and a 2–4 sentence interpretation. Do not list every number — prioritize the metrics that explain the story at that stage. Emphasize direction and implication over raw values.

### Stage 1 — Awareness
*Are we reaching the right people?*
Data: impressions, reach, organic ranking visibility, GBP impressions, social reach. Sources: Choozle, Search Console, GBP, social platforms.

### Stage 2 — Consideration
*Are they engaging once they arrive?*
Data: sessions, bounce rate, session duration, pages per session, top pages by traffic, organic CTR. Sources: GA4, Search Console.

### Stage 3 — Conversion
*Are they taking action?*
Data: GA4 key events, Google Ads conversions, CPC, CTR by campaign, landing page performance, calls, form submissions. Sources: GA4, Google Ads.

### Stage 4 — Trust & Presence
*Are we building a brand that earns the next visit?*
Data: social followers, posts published, engagement rate, reviews, star rating, GBP interactions. Sources: Facebook, LinkedIn, GBP.

### Stage 5 — Infrastructure
*Is the technical foundation capable of supporting all of the above?*
Data: PageSpeed score (Core Web Vitals), site audit score, critical errors, duplicate content, missing H1s, server errors. Sources: PageSpeed Insights, Site Auditor.

## 5. Issues
Ranked by revenue impact. Each issue is a problem or opportunity to be discussed and solved in the meeting. Assign a priority level to every issue.

Format per issue:
```
**[P1/P2/P3] Issue [N]: [Name]**

[2–3 sentences: what it is, the data behind it, why it matters in business terms]

- **Owner:** [Symbicore / Web developer / Client]
- **Action:** [Specific next step]
- **Scope note:** [In scope / Outside current scope — recommend adding to brief / Client-owned action]
```

**Priority definitions:**
- P1 — Blocking revenue or compounding weekly. Discuss and assign owner before leaving the meeting.
- P2 — Reducing performance. Action within 2 weeks.
- P3 — Important but not urgent. Schedule for next cycle.

Scope notes are the soft upsell mechanism. Issues outside Symbicore's current scope are surfaced clearly — not omitted. This creates a natural conversation about scope expansion without a formal pitch.

## 6. To-Dos
Action table with columns: # | Action | Owner | Due. Maximum 10 items. Each To-Do maps to an Issue or a commitment from a recent meeting. Due dates: "This week", "2 weeks", "3 weeks", "Next meeting", or a specific date.

## 7. Appendix: Data Sources
Table listing each data source, the period it covers, and any relevant notes (e.g. gaps, limitations, meeting context used).

---

Footer: `Prepared by Symbicore | symbicore.com | marketing@symbicore.com`

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm client_id, active AA sections, and 90-day goals.

## Step 2: Pull meeting intelligence
Run `fireflies_get_transcripts` for the client. Pull summaries for the 2 most recent relevant meetings. Note open issues, verbal metrics, and outstanding commitments.

## Step 3: Pull data
Run `tools/agency_analytics.py` for the client and period. Note any sections that failed or returned no data — proceed with what is available.

## Step 4: Write the report
Write the full report in markdown following the structure above. Lead with Wins, then Headlines. Map every data point to a funnel stage. Rank issues by revenue impact and assign P1/P2/P3. Surface every scope note. Integrate meeting context into headlines, issues, and to-dos where relevant.

Use `clients/pioneering-technology/outputs/marketing-performance-report-2026-02.docx` as the reference example for tone, depth, and format.

## Step 5: Generate .docx
```
python tools/report_generator.py --client [brand_id] --period [YYYY-MM] --input [report.md] --output clients/[brand_id]/outputs/[filename].docx
```
The report generator applies color-coded backgrounds to Scorecard status cells automatically.

## Step 6: Upload and link
1. Upload: `python tools/onedrive.py [brand_id] upload`
   - If upload fails with 423 (resource locked): delete the existing SharePoint item via Graph API, then retry
2. Create or find a Jira task for the report delivery in the client's project
3. Update the Jira task description with the SharePoint link as a Markdown hyperlink: `[View report in SharePoint](url)`
4. Add a comment via Atlassian MCP confirming the update — assign to Camille for review

Report is NOT complete until it is in SharePoint and linked in Jira.

# Guardrails
- Never fabricate data — if a metric is unavailable, say so explicitly
- Never report a metric without a "so what" tied to business impact
- Every issue gets a scope note — omitting out-of-scope issues is not allowed
- Every issue gets a P1/P2/P3 priority tag
- Do not organize the report by channel — organize by funnel stage
- Headlines must be diagnostic: observation + implication. No blame, no drama.
- Scorecard must prioritize predictive metrics over vanity metrics
- Use `tools/report_generator.py` for .docx output — not `tools/md_to_export.py`
- Always use the brand config as color/font source of truth, not CLAUDE.md
- Meeting intelligence must be consulted before writing — never skip Step 2
