---
name: revenue-analysis
description: Use when someone asks for a revenue analysis, wants to understand why revenue changed, needs a deep dive into channel performance, or requires week-over-week and year-over-year revenue attribution with root cause analysis.
---

# Purpose

Produce a deep revenue analysis with three-period bridging, channel attribution with discrepancy explanations, product/brand mix analysis, root cause ranking by revenue impact, prioritized fix list, and recovery projections. Built on the PTAC4Less analysis pattern.

This skill is distinct from `performance-reporting` (which summarizes all marketing channels) — revenue-analysis is a diagnostic tool: it explains *why* revenue changed and *what to do about it*.

# Dependencies

- brand-context-manager (required)
- `tools/agency_analytics.py` (channel data — use if AA is configured for the client)
- `tools/sharepoint.py` `sync_resources_from_sharepoint()` (pull raw data from SharePoint inputs)
- Fireflies MCP `fireflies_get_transcripts` + `fireflies_get_summary` (context from recent client calls)
- Atlassian MCP `addCommentToJiraIssue` (link report in Jira)
- `tools/sharepoint.py` `upload_deliverable()` (deliver to SharePoint For Review)

# Inputs

- Client brand ID (required)
- Report period (required): ISO week or YYYY-MM format (e.g., `2026-W10` or `2026-03`)
- Raw data file (required if AA not available): Brandon-style synopsis in `clients/[id]/inputs/`
  - Expected filename pattern: `[client]-revenue-synopsis-[period].md` or `.csv`
- Comparison periods (optional): defaults to same week prior month (MoM) and same week prior year (YoY)

# Data Sourcing

## Step 1 — Sync inputs from SharePoint
```python
from tools.sharepoint import sync_resources_from_sharepoint
sync_resources_from_sharepoint(client_id)
```
Pulls everything in `{client}/Resources/` to `clients/{id}/inputs/`. Raw data files (revenue synopses, platform exports) live here.

## Step 2 — Pull meeting context
Run before analysis — never after:
```
fireflies_get_transcripts(keyword="[client name]", limit=5, fromDate="[2 weeks ago]")
```
Get full summaries for the 2 most relevant results. Extract:
- Any pricing decisions, product changes, or catalog decisions mentioned
- Platform migration context (e.g., email platform changes, ad account restructures)
- Metrics mentioned verbally that may differ from dashboard data
- Any channel pauses, budget changes, or audience changes the client mentioned

Meeting context is essential for explaining discrepancies. A platform showing zero revenue is not always a bug — it may be a deliberate pause or migration the team mentioned in a call.

## Step 3 — Extract platform data
If AA is configured:
```bash
python tools/agency_analytics.py --client [brand_id] --period [YYYY-MM]
```
Use sections: `google_analytics`, `google_ads`, `microsoft_ads`, `search_console`, `facebook`, `linkedin`

If not configured, use raw data from `clients/[id]/inputs/`.

## Data Confidence Rule
Every metric in the report must be sourced and labeled. Use this legend in the Data Sources section:
- **High** — direct platform pull or confirmed BigCommerce/Shopify export
- **Medium** — AA dashboard extraction (browser automation; subject to UI rendering issues)
- **Low** — manually entered, estimated, or inferred from meeting context
- **Unavailable** — no data for this metric; state reason

Never fabricate figures. If data is missing, say so and explain why.

---

# Analysis Framework

## Section 1 — Revenue Trend Analysis

### 1.1 Three-Period Revenue Bridge
Always show three periods side by side:
- **Period A:** Same week/month one year ago (YoY baseline)
- **Period B:** Most recent complete prior period (MoM or prior week baseline)
- **Period C:** Current period (the period being analyzed)

| Metric | Period A (YoY) | Period B (MoM) | Period C (Current) | YoY | MoM |
|--------|---------------|----------------|-------------------|-----|-----|
| Revenue | | | | | |
| Orders | | | | | |
| AOV | | | | | |

Interpretation rule: If YoY decline is severe but MoM is moderate, structural change is underway. If both are equally severe, the problem is recent and acute. State which pattern applies.

### 1.2 Channel Revenue Collapse Table
Show all active channels. For channels showing zero or dramatic decline, explain why in a sub-note.

| Channel | Period A (YoY) | Period B (MoM) | Period C (Current) | YoY |
|---------|---------------|----------------|-------------------|-----|
| Google Ads | | | | |
| Microsoft Ads | | | | |
| Meta Ads | | | | |
| Email | | | | |
| Organic/Direct | | | | |
| Other | | | | |
| TOTAL | | | | |

**Channel discrepancy rule:** When a channel shows zero revenue or an implausible number, always explain the measurement gap before interpreting the data. Common discrepancies to address:

- **Google Ads dashboard vs. GA4 reported revenue:** Google Ads attributes revenue to *ad clicks* (last-click, 30-day window by default). GA4 uses *session-level attribution* (often last non-direct click, 30 days). The same conversion can be counted by both or neither depending on session gaps. When numbers diverge >15%, note which attribution model each uses and why they differ.
- **Microsoft Ads showing $0 but ad sets generating revenue:** Microsoft Ads does not natively sync conversion data from Google Ads-linked campaigns unless Universal Event Tracking is configured and firing. If ad sets were imported from Google Ads (common), revenue tracking relies on Microsoft's own UET pixel — which is often misconfigured or missing on checkout confirmation pages. State this explicitly: "Microsoft Ads reports $0 revenue — this is a tracking gap, not a sales gap. Revenue from Microsoft Ads traffic is likely attributed to Direct or organic in GA4."
- **Email showing $0 for multiple consecutive periods:** Two consecutive zero-revenue email weeks indicates infrastructure failure (deliverability, DNS/DKIM/SPF, list suppression) — not content failure. Flag immediately and provide diagnostic steps.
- **Organic/Direct baseline collapse:** If organic revenue drops sharply alongside paid, the root cause is product or site (not channel). When every channel underperforms simultaneously, attribution is not the issue — the funnel is broken.

### 1.3 Product / Brand Revenue Mix
Show the breakdown by product category or brand:

| Product/Brand | Period A | Period B | Period C | YoY Change |
|--------------|---------|---------|---------|------------|

Interpretation: A brand or category that was strong in a prior period but collapsed in the current period is diagnostic. Isolate it and ask: did pricing change? Did inventory change? Did competition change? One of these three is always the answer.

### 1.4 Revenue Gap Decomposition
Break the total YoY gap into components:

| Cause | Revenue Impact | % of Gap | Nature |
|-------|---------------|----------|--------|
| [Factor 1] | -$ | % | Intentional / Correctable / Structural |
| Recovery (new/replacement) | +$ | % | |
| Net gap | -$ | | |

Calculate the **recovery rate**: `new revenue added / revenue removed`. This is the single most diagnostic number. Below 20% = crisis. 20–50% = declining. Above 50% = manageable transition.

---

## Section 2 — Advertising Analysis

For each active paid channel, produce:

### Per-Channel Table
| Metric | Period A (YoY) | Period B (MoM) | Period C (Current) | YoY | MoM |
|--------|---------------|----------------|-------------------|-----|-----|
| Spend | | | | | |
| Revenue | | | | | |
| ROAS (Platform) | | | | | |
| True ROAS* | | | | | |
| Net Profit | | | | | |

*True ROAS = Revenue / (Spend × 3) — accounts for COGS at ~33% margin. Adjust multiplier for the client's actual margin if known.

**If True ROAS < 1.0:** The channel is losing money. State this explicitly. Do not soften it.

### T12M Benchmark
Always compare current-week metrics against trailing 12-month weekly averages. The T12M average represents what the channel achieves under normal conditions:

| Metric | T12M Weekly Avg | This Period | vs Benchmark |
|--------|----------------|-------------|-------------|

A channel with flat spend but collapsed revenue is a product/landing page problem, not a media buying problem. Diagnose accordingly.

### Channel-Specific Diagnostic Notes
Include for each channel where performance is anomalous:
- **Google Ads:** Check if spend is flat while revenue dropped (conversion problem, not reach problem). Check product feed freshness, landing page destination, quality scores.
- **Microsoft Ads paused:** State whether the pause decision was correct given ROAS. Include reactivation criteria.
- **Meta/LinkedIn:** Separate CPM trends from conversion trends. CPM inflation is a market problem; conversion drop is a funnel problem.

---

## Section 3 — Root Cause Analysis

Rank causes by revenue impact (largest first). For each:

### Root Cause [N] — [Name]
**Revenue impact:** -$X (N% of total gap)
**Confidence:** High / Medium / Low
**Timeline to fix:** [hours / days / weeks]

[2–4 sentences: what happened, why it matters, what evidence confirms this is the cause.]

**Fix:** Specific action, owner, and expected outcome.

Do not list a root cause unless you can state its revenue impact in dollars. Guesses without dollar values are observations, not root causes.

---

## Section 4 — Prioritized Fix List

Ranked by revenue impact and execution speed. Three tiers only.

### P1 — Execute within 24 hours
One action per bullet. Each must include: action, owner, revenue at stake, risk if delayed.

### P2 — Execute within 1 week
Same format. These are important but not instantly executable.

### P3 — Execute within 2–4 weeks
Structural fixes. Include clear success metrics so the team knows when the fix is working.

---

## Section 5 — Recovery Projection

Scenario table with revenue impact of each action tier:

| Scenario | Weekly Revenue (est.) | vs. Current |
|----------|----------------------|-------------|
| Current state (no changes) | $X | Baseline |
| P1 actions complete | $X–$X | +X%–X% |
| P1 + P2 complete | $X–$X | +X%–X% |
| Full recovery (all P actions) | $X–$X | N–N weeks |

Use ranges, not point estimates. Be conservative on the low end.

---

## Section 6 — Data Sources & Confidence

| Source | Data Used | Confidence |
|--------|-----------|-----------|
| [Platform / file name] | [what it provided] | High / Medium / Low |

End with a note on any data gaps that affected the analysis.

---

# Output Format

- Filename: `[client]-revenue-analysis-[period].md`
- Save to: `.tmp/[client]-revenue-analysis-[period].md`
- Convert to `.docx` via `tools/md_to_export.py`
- Upload to SharePoint via `tools/sharepoint.py upload_deliverable(client, .tmp/file.docx)`
  - Local `.tmp/` file deleted automatically after confirmed upload
- Link in Jira via Atlassian MCP `addCommentToJiraIssue`, assigned to Camille for review

---

# Quality Standards

Before delivering:
- Every metric has a source label (High / Medium / Low / Unavailable)
- Every channel anomaly has an explanation (not just a number)
- Platform attribution discrepancies are explained, not glossed over
- Root causes are ranked by dollar impact (not by how easy they are to explain)
- Recovery projections use ranges, not false precision
- No banned words or passive voice (see `.claude/rules/brand-enforcement.md`)
- Compliance score must be >= 95% before delivery

---

# When to Use This Skill vs. performance-reporting

| Use `revenue-analysis` when... | Use `performance-reporting` when... |
|-------------------------------|--------------------------------------|
| Revenue dropped significantly and you need to know why | You need a full-channel marketing summary |
| You need root causes ranked by dollar impact | You need a client-ready EOS-format meeting doc |
| A specific channel, brand, or product is underperforming | You need funnel metrics, SEO, GBP, and social in one place |
| The client or team needs a fix list with owners | You need a recurring weekly/monthly performance snapshot |

Both skills can be run in the same session — run `revenue-analysis` first if there is a revenue anomaly, then `performance-reporting` for the full picture.
