---
name: evidence-collector
description: Use when documenting proof of campaign delivery, collecting links to published assets, assembling a client delivery package, or creating a record of what was produced and when before billing or closing a project.
---

# Purpose
Create a verifiable evidence package for every completed campaign or project. Documents what was produced, when it was published, where it lives, and what results were recorded at delivery. Used before billing, before closing a Jira project, and as the source of truth for client reporting. Prevents disputes and supports performance-reporting.

# Inputs
```json
{
  "client_id": "client folder identifier",
  "project_name": "name of the campaign or project",
  "billing_period": "month or date range",
  "deliverables_list": "list of expected deliverables from the brief or Jira"
}
```

# Process

## Step 1: Pull deliverables from Jira
Using the Atlassian MCP, pull all completed Jira tickets for the client in the billing period. For each ticket:
- Confirm status is Done
- Note the ticket ID, title, and completion date
- Note the assigned team member

If Jira is unavailable, ask Donovan to paste the deliverables list directly.

## Step 2: Locate assets in SharePoint
For each deliverable, find the corresponding file in SharePoint using `tools/onedrive.py`:
- Confirm the file exists
- Copy the SharePoint link
- Note the file type and version

Flag any deliverable where the SharePoint file is missing. Do not mark it as complete until the file is located.

## Step 3: Document published assets
For any asset that was published externally (social post, email, blog post, ad), collect:
- Platform (LinkedIn, Instagram, Mailchimp, etc.)
- Publish date
- URL or post ID (where accessible)
- Reach or impressions at time of collection (if available in the platform)

Note: Do not screenshot. Collect links and data points only.

## Step 4: Record metrics at delivery
For any campaign with trackable results, record the metrics as of the evidence collection date:
- Impressions
- Clicks / CTR
- Conversions (if tracked)
- Open rate / click rate (email)
- Engagement rate (social)

Label all metrics with the date collected. These are point-in-time snapshots, not final results.

## Step 5: Produce evidence package

```markdown
# Evidence Package: [Client Name] — [Project / Billing Period]
**Prepared:** [date]
**Prepared by:** Evidence Collector
**Client:** [client_id]
**Period covered:** [billing_period]

---

## Deliverables Summary

| # | Deliverable | Jira Ticket | Completed | SharePoint Link | Status |
|---|---|---|---|---|---|
| 1 | [Deliverable name] | [TICKET-ID] | [date] | [link] | Complete |
| 2 | | | | | Missing — flag |

---

## Published Assets

| Asset | Platform | Published | URL / Post ID | Reach at Collection |
|---|---|---|---|---|
| [Asset name] | [Platform] | [date] | [link] | [metric] |

---

## Metrics at Delivery Date: [date]

| Campaign / Asset | Metric | Value |
|---|---|---|
| [Name] | Impressions | |
| | CTR | |
| | Conversions | |

---

## Flags
- [Any missing files, unpublished assets, or unresolved items]

---

## Package Status
**Complete:** Yes / No
**Blocking items:** [list or "None"]
```

## Step 6: Save and link
Save the evidence package to `clients/[client_id]/outputs/evidence/[YYYY-MM]-evidence-package.md`.

Upload to client SharePoint via `tools/onedrive.py`. Add the SharePoint link as a comment on the billing Jira ticket.

# Quality Checklist
- [ ] Every Jira deliverable accounted for
- [ ] Every deliverable has a SharePoint link
- [ ] Published assets have URLs or post IDs
- [ ] Metrics are dated and labeled as point-in-time
- [ ] Missing items flagged — not ignored
- [ ] Package saved locally and uploaded to SharePoint
- [ ] SharePoint link added to Jira

# Guardrails
- Never mark a deliverable complete without a SharePoint file link
- Metrics are snapshots — never extrapolate or project
- Do not delete or overwrite previous evidence packages
- If a deliverable is missing, flag it and pause — do not close the project