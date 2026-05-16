---
name: marketing-roadmap
description: Use when someone asks to create a marketing roadmap, annual marketing plan, communications roadmap, campaign calendar, or a strategic activity plan for a client covering multiple months or a full year.
---

# Purpose
Produce a client-ready marketing cycle roadmap as a formatted Excel workbook. The roadmap maps every tactic to a stage of the marketing cycle, assigns ownership, and connects every activity to a measurable outcome. It is a strategic planning document — not a task management tool.

# Terminology
Use **Marketing Cycle**, not "Marketing Funnel." The cycle acknowledges that Advocacy feeds new Awareness — it is a compounding growth engine, not a drain. The five stages are:

| Stage | Definition |
|-------|------------|
| Awareness | Reaching new audiences who have no prior exposure to the brand |
| Consideration | Engaging people who know the brand and are evaluating options |
| Conversion | Driving a specific action: purchase, inquiry, sign-up, or booking |
| Retention | Deepening relationships with existing customers to maximize lifetime value |
| Advocacy | Turning loyal customers into active promoters who generate new Awareness |

# Dependencies
Run brand-context-manager first. Block execution if brand context is not validated.

# Inputs
- Client name and brand_id (required)
- Roadmap period — months in scope (required)
- Business objectives for the period (required)
- Audience segments (required — pull from brand_context or ask)
- Channels in scope (required)
- Team ownership map — name to role (required)
- Key campaigns or initiatives (required)
- Existing campaign brief links or strategy docs (optional)

If any required input is missing, ask before generating content. Do not fabricate strategy.

# Process

## Step 1: Load brand context
Call brand-context-manager. If `validated: false`, stop and surface the error.

## Step 2: Confirm scope
Before generating any content, restate and confirm:

```
Client: [name]
Period: [months in scope]
Objectives: [numbered list]
Channels: [list]
Owners: [name → role]
Key campaigns: [list]
```

Ask the user to confirm or correct. Do not proceed until confirmed.

## Step 3: Generate the JSON data file
Output a complete JSON file to `clients/[client-id]/outputs/marketing-roadmap-[year].json`.

Follow the schema exactly as defined in `.claude/skills/marketing-roadmap/roadmap-schema.json`.

### Roadmap quality standards
The roadmap must be comprehensive, not sparse. Apply these minimums:

- **6–10 roadmap rows per month** — covering multiple cycle stages and channels
- **All five cycle stages represented** at least once per month where strategically appropriate
- **No generic activities** — every activity must be specific enough to brief a team member without additional context
- **Every row has an owner** — no exceptions
- **Every row has a success metric** — connect every tactic to a measurable outcome
- **Notes column** used for approvals required, asset dependencies, or constraints

### Content calendar standards
- Minimum 4 content pieces per month (roughly weekly cadence)
- More for high-volume channels (social, email)
- Platform must be specified on every row
- Publish dates must be set (use actual calendar dates, not placeholders)

### Brand touchpoints standards
- Cover all customer-facing touchpoints: digital, collateral, voice, and service
- Minimum 8–12 touchpoints per client
- Priority (High / Medium / Low) must be set based on strategic impact
- Due dates must be realistic within the roadmap period

### KPI standards
- 6–10 KPI rows
- Mix of leading indicators (predictive) and lagging indicators (results)
- Monthly targets must reflect realistic ramp — not flat numbers
- Every goal connects to a stated business objective

## Step 4: Run the Excel generator
After saving the JSON file, run:

```bash
python3 tools/generate-roadmap-xlsx.py \
  --data clients/[client-id]/outputs/marketing-roadmap-[year].json \
  --output clients/[client-id]/outputs/marketing-roadmap-[year].xlsx
```

Confirm the file was created successfully before proceeding.

## Step 5: Log and deliver
Log in `decisions/log.md`:
```
[date] — Generated marketing cycle roadmap for [client], [period]. File: clients/[client-id]/outputs/marketing-roadmap-[year].xlsx
```

Report the output path to the user and note any activities requiring client input before the roadmap is final.

# Output Format
- **JSON data**: `clients/[client-id]/outputs/marketing-roadmap-[year].json`
- **Excel workbook**: `clients/[client-id]/outputs/marketing-roadmap-[year].xlsx`

The Excel workbook contains five tabs:
1. **HOME** — Command center: resource links, tab navigation, marketing cycle legend, status legend
2. **[Client] Roadmap** — Cycle Stage, Channel/Tactic, Month, Activity, Owner, Success Metric, Notes
3. **[Client] Calendar** — Month, Week, Topic/Pillar, Content Type, Platform, Format, Owner, Publish Date, Status
4. **[Client] Touchpoints** — Touchpoint, Category, Description, Owner, Priority, Due Date, Notes
5. **[Client] KPIs** — Goal, Success Metric, [monthly targets], Period Target

# What This Document Is NOT
- Not a task management tool — Jira or Monday handles execution tracking
- No Status column on the roadmap tab — Status lives only in the Content Calendar
- No budget column anywhere — budget planning happens separately
- Each client gets their own file — never combine multiple clients in one workbook

# Guardrails
- Never start without validated brand context
- Never fabricate campaigns, activities, or KPI targets — use confirmed inputs or ask
- Every roadmap row must have: cycle_stage, channel, month, activity, owner, success_metric
- Reject the urge to produce sparse output — a thin roadmap is a liability, not a deliverable
- Do not produce the JSON until scope is confirmed by the user
- If the Excel generator fails, surface the full error and fix before reporting completion