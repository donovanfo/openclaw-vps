---
name: sprint-prioritizer
description: Use when planning a sprint, prioritizing the Jira backlog, setting team priorities for the week or month, or deciding what gets worked on next across client projects.
---

# Purpose
Pull open Jira work, apply a priority scoring framework, and output a ranked sprint plan with team assignments. Solves the team's biggest pain point: knowing which client requests and deadlines to sequence so that revenue-critical and time-sensitive work ships first. Produces a plan Donovan can approve and the team can execute.

# Inputs
```json
{
  "sprint_period": "date range for this sprint (e.g. March 10-21)",
  "team_capacity": {
    "camille": "hours available",
    "kate": "hours available",
    "victoria": "hours available",
    "alexander": "hours available",
    "alexi": "hours available"
  },
  "filters": "optional — specific client IDs or project types to include/exclude"
}
```

# Priority Scoring Framework

Score each open ticket across four dimensions. Higher score = higher priority.

| Dimension | Weight | Score 1 | Score 3 | Score 5 |
|---|---|---|---|---|
| **Deadline pressure** | 35% | >3 weeks | 1-3 weeks | <1 week or overdue |
| **Revenue impact** | 30% | Internal / low-value | Existing retainer | New revenue / at-risk renewal |
| **Client tier** | 20% | Prospect / inactive | Active retainer | Strategic / largest account |
| **Effort estimate** | 15% | >8 hours | 4-8 hours | <4 hours |

**Priority Score = sum of (Score x Weight) across all four dimensions**

Tickets scoring >= 4.0: Sprint 1 (must ship this period)
Tickets scoring 3.0-3.9: Sprint 2 (schedule if capacity allows)
Tickets scoring < 3.0: Backlog (defer)

# Process

## Step 1: Pull Jira backlog
Using the Atlassian MCP (`searchJiraIssuesUsingJql`), pull all open tickets that are:
- Not in Done or Closed status
- Assigned to any Symbicore team member OR unassigned

JQL: `project in (all Symbicore projects) AND status not in (Done, Closed) ORDER BY created ASC`

If Jira is unavailable, ask Donovan to paste the backlog.

## Step 2: Score each ticket
For each open ticket, apply the priority scoring framework. Where the ticket lacks context (no due date, no client linked), flag it and ask Donovan to clarify before scoring.

## Step 3: Assign to team
For Sprint 1 tickets, assign based on:
- Skill match (Victoria = design, Alexander = web, Camille/Kate = marketing coordination)
- Available capacity in the sprint period
- Current active client load per team member

Do not over-assign. If Sprint 1 tickets exceed team capacity, surface the conflict to Donovan for a decision — do not silently defer.

## Step 4: Produce sprint plan

```markdown
# Sprint Plan: [Sprint Period]
**Generated:** [date]
**Team capacity:** [total hours across team]

---

## Sprint 1 — Must Ship This Period

| Priority | Ticket | Client | Deliverable | Owner | Est. Hours | Due |
|---|---|---|---|---|---|---|
| 1 | [TICKET-ID] | [Client] | [What] | [Name] | [Hrs] | [Date] |
| 2 | | | | | | |

**Sprint 1 total hours:** [X] / [capacity available]

---

## Sprint 2 — Schedule If Capacity Allows

| Priority | Ticket | Client | Deliverable | Owner | Est. Hours | Due |
|---|---|---|---|---|---|---|
| | | | | | | |

---

## Deferred to Backlog

| Ticket | Client | Reason for deferral |
|---|---|---|
| | | |

---

## Capacity Conflicts
[Any Sprint 1 tickets that exceed available capacity — surface the trade-off for Donovan to decide]

---

## Action Required from Donovan
- [ ] [Any tickets needing clarification before scoring]
- [ ] [Any capacity conflicts to resolve]
- [ ] Approve this plan before sending to team
```

## Step 5: Push to team (after Donovan approves)
Once Donovan approves the plan:
- Update Jira ticket priorities and assignments using `editJiraIssue` (one ticket at a time)
- Add a sprint comment to each Sprint 1 ticket: "Assigned for sprint [period] — priority [rank]"
- Assign to Alexi for project management oversight

Do not push to Jira until Donovan explicitly approves the plan.

# Quality Checklist
- [ ] All open tickets pulled from Jira
- [ ] Every ticket scored on all four dimensions
- [ ] Tickets with missing context flagged before scoring
- [ ] Sprint 1 tickets do not exceed team capacity (or conflict surfaced)
- [ ] Assignments match team skills
- [ ] Donovan approval confirmed before Jira updates

# Guardrails
- Never update Jira without Donovan's approval — sprint plans affect the whole team
- Flag capacity conflicts explicitly — do not silently defer Sprint 1 work
- If a client deadline is imminent and the ticket is not in Sprint 1, escalate immediately
- Do not score internal or admin tasks above client-facing revenue work