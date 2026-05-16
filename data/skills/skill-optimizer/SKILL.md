---
name: skill-optimizer
description: Use when you want to audit, test, improve, deploy, or expand skills and agent souls across Claude Code, Claude Desktop, OpenClaw VPS, and Paperclip VPS. Triggers when someone says "optimize skills", "audit skills", "improve skill X", "test skills", "find weak skills", "sync skills to VPS", "what new skills exist", "expand agent capabilities", "update agent souls", "sync agent souls", or wants to run the skill improvement loop. Also use for discovering and incorporating new skills showcased by Anthropic or the community.
---

# Skill Optimizer

Full lifecycle manager for Symbicore's skill and agent capability stack. Four phases: Find, Test, Optimize, Sync. Covers Claude Code skills AND Paperclip agent souls.

```
/skill-optimizer [skill-name | souls | discover | sync]
```

| Mode | What it does |
|------|-------------|
| `/skill-optimizer` | Full audit + optimize top candidates |
| `/skill-optimizer [name]` | Target a single skill |
| `/skill-optimizer souls` | Audit and sync all Paperclip agent souls |
| `/skill-optimizer discover` | Research new skills from ecosystem + community |
| `/skill-optimizer sync` | Deploy all skills + souls to all targets without optimizing |

---

## Phase 1: FIND — Audit & Prioritize

### 1a. Skill health check

For each of the 49 canonical skills in `.claude/skills/`:

| Signal | Pass criteria |
|--------|--------------|
| SKILL.md exists | File present |
| Description specificity | Includes concrete trigger phrases, not just a noun |
| Content depth | > 40 lines of actionable steps |
| Output format | At least one template, example, or schema |
| Staleness | Modified within 90 days |
| Usage signals | Referenced in a Jira task or Fireflies transcript in last 30 days |

**Quick depth check:**
```bash
for skill in .claude/skills/*/SKILL.md; do
  lines=$(wc -l < "$skill")
  name=$(echo "$skill" | cut -d'/' -f3)
  printf "%4d  %s\n" "$lines" "$name"
done | sort -n
```

Skills under 40 lines are thin. Skills under 20 lines are stubs — prioritize immediately.

### 1b. Soul health check (Paperclip agents)

Agent souls live in `infrastructure/paperclip/agents/souls/`. For each soul:

| Signal | Pass criteria |
|--------|--------------|
| Strategic posture defined | At least 5 principles |
| Voice and tone section | Present and client-facing-safe |
| Tool routing specified | Knows which MCP/scripts to use |
| Skill references | Lists skills the agent should invoke |
| Escalation rules | Clear conditions for routing to CEO |

Souls that lack skill references are agents flying blind — they can't invoke the right capability even if the skill exists.

### 1c. Gap detection

Pull recent Jira tasks and Fireflies transcripts (last 30 days):
- A workflow that appeared 3+ times without a matching skill → **build it** (use `skill-creator`)
- A skill that was invoked but produced complaints in Fireflies → **optimize it** (use Phase 3)
- An agent soul that was involved in a failed task → **update the soul** (add routing clarity)

**Output of Phase 1:** Ranked list of 1–5 skills or souls to act on this session.

---

## Phase 2: TEST — Evaluate Current Quality

### 2a. Skill evaluation

For each target skill, delegate to `skill-creator`:

> "Use skill-creator to evaluate `.claude/skills/[skill-name]/SKILL.md`. Run 2–3 realistic test prompts representative of real Symbicore work (client deliverables, not toy examples). Show me the benchmark results."

skill-creator handles: spawn with-skill and without-skill subagent runs → generate benchmark.json → launch eval viewer.

Save baseline results to `.tmp/skill-audit-[skill-name]-[YYYY-MM-DD].json`.

### 2b. Soul evaluation

Souls are harder to eval quantitatively. Use this qualitative checklist:

- Read the soul vs. a recent Jira task assigned to that agent
- Ask: could this agent, reading only its soul, route this task correctly?
- Ask: does the soul reference the right skills for this agent's function?
- Ask: would the agent know when to escalate vs. execute?

Failure on any → update the soul before syncing.

---

## Phase 3: OPTIMIZE — Iterate to Improvement

### 3a. Skill content improvement

Common failure patterns and fixes:

| Pattern | Fix |
|---------|-----|
| Skill triggers but wrong format | Add output template with exact structure |
| Skill doesn't trigger reliably | Run description optimizer (step 3c) |
| Skill skips steps | Add numbered checklist, make each step atomic |
| Token-heavy runs | Bundle repeated code into `scripts/`, simplify prose |
| Baseline beats skill | Skill adds noise — cut ruthlessly |
| Skill ignores brand rules | Add explicit reference to compliance-auditor gate |

### 3b. Soul improvement

When updating a soul:
- Add a `## Skills Reference` section listing the 5–10 most relevant canonical skills by name
- Add explicit tool routing (mirrors `operational-rules.md` routing table, scoped to this agent's function)
- Add escalation triggers: "If the task requires budget approval > $X, route to CEO"
- Ensure tone section reflects the agent's function (Creative Director ≠ QA Manager)

Soul template additions:
```markdown
## Skills This Agent Invokes
- copywriting — for all client copy tasks
- compliance-auditor — validates every output before delivery
- creative-production — when visual assets are needed

## Tool Routing
| Task | Tool |
|------|------|
| Generate images | tools/adobe_firefly.py (client) or tools/kie_ai.py (drafts) |
| Upload deliverable | tools/sharepoint.py upload_deliverable() |
| Log Jira task | Atlassian MCP: addCommentToJiraIssue |

## Escalation Triggers
- Budget required > $500 → route to CEO
- Client relationship at risk → notify CEO immediately
- Blocked > 24h → create Jira ticket with `blocked` label
```

### 3c. Description optimization (skills only)

After content improvements, run the trigger optimizer:

```bash
python .claude/skills/skill-creator/scripts/run_loop.py \
  --eval-set .tmp/trigger-evals-[skill-name].json \
  --skill-path .claude/skills/[skill-name] \
  --model claude-sonnet-4-6 \
  --max-iterations 5 \
  --verbose
```

Apply `best_description` to SKILL.md frontmatter.

### 3d. Quality gate

Do not sync until:
- [ ] Skills: pass_rate >= 80% (or meaningful lift over baseline)
- [ ] Skills: SKILL.md under 500 lines
- [ ] Skills: description updated with optimizer output
- [ ] Souls: skill references section present
- [ ] Souls: tool routing table present
- [ ] Neither: hardcoded secrets or local-only paths

---

## Phase 4: SYNC — Deploy to All Targets

One command deploys skills + souls to every platform:

```bash
./tools/sync-to-openclaw.sh
```

This syncs to:

| Target | Path | What gets synced |
|--------|------|-----------------|
| Claude Desktop | `~/.claude/skills/` | All 49 canonical SKILL.md files |
| OpenClaw VPS | `/opt/openclaw-vps/data/skills/` | All 49 canonical SKILL.md files |
| Paperclip VPS (skills) | `/opt/paperclip-vps/data/skills/` | All 49 canonical SKILL.md files |
| Paperclip VPS (souls) | `/opt/paperclip-vps/data/souls/` | All soul files from `infrastructure/paperclip/agents/souls/` |

**Dry run first:**
```bash
./tools/sync-to-openclaw.sh --dry-run
```

**Restart OpenClaw after sync if needed:**
```bash
ssh root@srv1516187.hstgr.cloud \
  "cd /opt/openclaw-vps && docker compose restart openclaw"
```

---

## Phase 5: DISCOVER — Ecosystem Intelligence

Run this monthly (or after Anthropic announcements) to find skills the community has built that we should adopt or adapt.

### 5a. Sources to monitor

| Source | What to look for |
|--------|-----------------|
| Anthropic docs (docs.anthropic.com/en/docs/claude-code/skills) | Official new skills and patterns |
| Claude Code GitHub releases | New built-in capabilities, API changes |
| Anthropic skill marketplace / community repos | Verified skills from verified builders |
| Fireflies transcripts (our own meetings) | Recurring requests that hint at missing skills |
| Jira task history | Task types that took too many turns — candidate for a skill |

### 5b. Evaluation criteria for adopting an external skill

A community skill is worth adopting if:
- It addresses a real Symbicore workflow (not a toy example)
- It has >30 lines of actionable instructions
- It is compatible with our tool stack (Python, MCP integrations, SharePoint)
- It does not duplicate an existing canonical skill

If it duplicates one: compare quality. If the external version is better, merge the best parts into ours (do not just replace — our skills carry Symbicore-specific context).

### 5c. Capability expansion candidates (Q2 2026 watch list)

Track these capability gaps as potential new canonical skills:

| Gap | Priority | Notes |
|-----|----------|-------|
| Client onboarding workflow | High | Recurring 3+ times in Fireflies |
| HubSpot CRM sync | High | Needed for revops skill completeness |
| Canva-to-SharePoint pipeline | Medium | Creative production bottleneck |
| Automated performance dashboard | Medium | Monthly reporting is manual |
| Competitor tracking + alerts | Low | Would feed market-research skill |

Update this table monthly. When a gap becomes a confirmed canonical skill, run `skill-creator` to build it, then add it to the SKILLS array in `sync-to-openclaw.sh`.

---

## Continuous Improvement Cadence

| Frequency | Action |
|-----------|--------|
| Per session | Did the skill I just used perform well? If not, flag it for Phase 2 |
| Weekly | Optimize 1–2 lowest-scoring skills; sync |
| Monthly | Full 49-skill + soul audit; run discover phase; update watch list |
| Quarterly | Purge skills with < 60% pass rate after 2 optimization attempts; review soul effectiveness |

---

## Adding a New Canonical Skill

When a new skill is ready:

1. Confirm the SKILL.md is in `.claude/skills/[name]/SKILL.md`
2. Add the name to the SKILLS array in `tools/sync-to-openclaw.sh`
3. Add a one-line entry to the CLAUDE.md skill registry under the correct category
4. Run: `./tools/sync-to-openclaw.sh`
5. Update `context/current-priorities.md` if the skill addresses an active priority

---

## Quick Reference

```bash
# Audit skill depth
for skill in .claude/skills/*/SKILL.md; do
  lines=$(wc -l < "$skill")
  name=$(echo "$skill" | cut -d'/' -f3)
  printf "%4d  %s\n" "$lines" "$name"
done | sort -n | column -t

# Full sync (skills + souls → all targets)
./tools/sync-to-openclaw.sh

# Dry-run preview
./tools/sync-to-openclaw.sh --dry-run

# Optimize a specific skill description
python .claude/skills/skill-creator/scripts/run_loop.py \
  --skill-path .claude/skills/[name] \
  --model claude-sonnet-4-6 \
  --max-iterations 5

# Restart OpenClaw on VPS
ssh root@srv1516187.hstgr.cloud \
  "cd /opt/openclaw-vps && docker compose restart openclaw"
```
