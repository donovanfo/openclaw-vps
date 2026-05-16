---
name: skill-builder
description: Use when creating new skills, optimizing existing skills, or auditing skill quality. Guides skill development following Claude Code official best practices.
---

## What This Skill Does

Guides the creation and optimization of Claude Code skills using official best practices. Use this whenever:

- Building a new skill from scratch
- Optimizing or auditing an existing skill
- Deciding on advanced features (subagent execution, hooks, dynamic context, etc.)
- Troubleshooting a skill that isn't working correctly

For the complete technical reference on all frontmatter fields, advanced patterns, and troubleshooting, see [reference.md](reference.md).

## Quick Start: What Is a Skill?

A skill is a reusable set of instructions that tells Claude Code how to handle a specific task. Skills live in `.claude/skills/[skill-name]/SKILL.md` inside your project. When you type `/skill-name` or describe what you need in natural language, Claude loads the skill's instructions and follows them.

Think of skills as SOPs for Claude. Instead of re-explaining a workflow every conversation, you write it once and invoke it forever.

**How they work under the hood:**
- Your project's `CLAUDE.md` instructions are always loaded, every conversation
- Skill *descriptions* (from frontmatter) are always loaded so Claude knows what's available
- The full skill content only loads when the skill is actually invoked
- Once loaded, Claude follows the skill's instructions while still respecting your CLAUDE.md rules

---

## Mode 1: Build a New Skill

When building a new skill, run the **Discovery Interview** first. Do NOT start writing files until discovery is complete.

### Discovery Interview

Ask questions using AskUserQuestion, one round at a time. Each round covers one topic. Move to the next round only after the user answers. Keep going until you're 95% confident you understand the skill well enough to build it without further clarification.

**Round 1: Goal & Name**
- What does this skill do? What problem does it solve or what workflow does it automate?
- What should we call it? (Suggest a name based on their answer -- lowercase, hyphens, max 64 chars)

**Round 2: Trigger**
- What would someone say to trigger this? (Get 2-3 natural language phrases)
- Should it be user-only (`/slash-command`), Claude-auto-invocable, or both?
- Does it accept arguments? If so, what?

**Round 3: Step-by-Step Process**
- Walk me through exactly what should happen from trigger to output.
- For each step: Does Claude do it directly, or delegate to a subagent/script?
- Does this need to be conversational or is it a fire-and-forget task?

**Round 4: Inputs, Outputs & Dependencies**
- What inputs does the skill need?
- What does it produce? Where do outputs go?
- Does it need external APIs, scripts, or tools?

**Round 5: Guardrails & Edge Cases**
- What could go wrong? What are the common failure modes?
- What should this skill NOT do?
- Are there cost concerns?

**Round 6: Confirmation**

After all rounds, summarize your understanding back to the user in this format:

```
## Skill Summary: [name]

**Goal:** [one sentence]
**Trigger:** `/name` + [natural language phrases]
**Arguments:** [what it accepts, or "none"]

**Process:**
1. [step]
2. [step]

**Inputs:** [what it reads/needs]
**Outputs:** [what it produces + where]
**Dependencies:** [APIs, scripts, agents, reference files]
**Guardrails:** [what can go wrong, what to avoid]
```

Ask: "Does this capture it? Anything to add or change?" Only proceed to building once the user confirms.

**Skipping rounds:** If the user provides enough context upfront, skip rounds that are already answered.

---

## Mode 2: Audit an Existing Skill

### Frontmatter Audit
- [ ] `name` matches the directory name
- [ ] `description` uses natural keywords someone would actually say
- [ ] `disable-model-invocation: true` is set if the skill has side effects
- [ ] `argument-hint` is set if the skill accepts arguments
- [ ] No unnecessary fields are set

### Content Audit
- [ ] SKILL.md is under 500 lines
- [ ] Clear step-by-step workflow with numbered steps
- [ ] Output format specified with templates or examples
- [ ] All file paths documented
- [ ] Notes section covers edge cases and what NOT to do

### Integration Audit
- [ ] Skill is documented in CLAUDE.md
- [ ] Supporting files are referenced from SKILL.md
- [ ] API keys stored in environment variables, never hardcoded

---

## Recommended Conventions

- Skills live in `.claude/skills/[skill-name]/SKILL.md`
- Output files go in `output/[skill-name]/`
- API keys go in environment variables
- Document all active skills in CLAUDE.md
- Frontmatter `description` written as: "Use when someone asks to [action], [action], or [action]."

Full reference: `.claude/skills/skill-builder/reference.md`