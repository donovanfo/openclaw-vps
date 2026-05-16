---
name: compliance-auditor
description: Use when validating any creative asset, checking brand compliance, auditing copy for banned words, or verifying output before delivery. Runs after marketing-creatives and blocks non-compliant output.
dependencies: [brand-context-manager]
---

# Purpose
Automated brand compliance checking. Blocks non-compliant creative from reaching export. No asset moves forward until this skill approves. Compliance score must be >= 95% or the asset is BLOCKED.

# Inputs
```json
{
  "brand_context": "@import brand-context-manager output",
  "creative_asset": "@import marketing-creatives output"
}
```

# Validation Rules
```json
{
  "colors": {
    "rule": "All hex values must be in approved palette",
    "block_if_violated": true
  },
  "fonts": {
    "rule": "Only approved font families",
    "block_if_violated": true
  },
  "banned_words": {
    "rule": "Zero tolerance for banned words in any copy",
    "block_if_violated": true
  },
  "tone": {
    "rule": "Must match brand tone descriptors",
    "block_if_violated": false,
    "warn_if_violated": true
  },
  "platform_specs": {
    "instagram": {"dimensions": "1080x1080", "max_caption": 2200},
    "linkedin": {"dimensions": "1200x627", "max_text": 3000},
    "block_if_violated": true
  }
}
```

# Outputs
```json
{
  "status": "approved|blocked",
  "compliance_score": 98,
  "errors": [],
  "warnings": [],
  "audit_log": "timestamp | asset_id | approved|blocked"
}
```

# Quality Checklist
- [ ] Blocks non-compliant assets
- [ ] Checks banned words in all copy
- [ ] Validates colors against palette
- [ ] Validates fonts against approved list
- [ ] Provides clear error messages
- [ ] Logs all audits
- [ ] Compliance score calculated

Rules config: `.claude/skills/compliance-auditor/rules/compliance-checklist.json`