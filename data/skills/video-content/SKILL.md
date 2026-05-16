---
name: video-content
description: Use when someone asks to make a video, write a video script, create a storyboard, plan Reels or TikTok content, build a YouTube video, produce a video ad, or plan any video content for any platform.
dependencies: [brand-context-manager, campaign-strategy]
---

# Purpose
End-to-end video production workflow: concept → script → storyboard → shot list → production brief → motion graphics specs → thumbnail → captions → platform optimization. Every deliverable is production-ready for a videographer, editor, or motion designer to execute without additional briefing.

# Dependencies
- brand-context-manager (validates brand, loads tone and visual identity)
- brand-design-system (motion principles, color, typography for on-screen elements)
- campaign-strategy output (for topic, audience, and CTA alignment)

# Inputs
- Platform (required): youtube | linkedin | instagram-reels | tiktok | facebook | video-ad
- Video type (required): thought-leadership | educational | testimonial | product-demo | brand | ad
- Topic/angle (required): what the video is about — pull from campaign-strategy or specify
- Target length (optional): defaults by platform (see below)
- Brand/client (required): defaults to symbicore
- Existing assets (optional): B-roll references, logo files, existing footage

# Platform Specs

| Platform | Target Length | Aspect Ratio | Resolution | Key Constraint |
|----------|--------------|--------------|------------|----------------|
| YouTube | 6-15 min (long), 60s (shorts) | 16:9 (long) / 9:16 (Shorts) | 1080p min, 4K preferred | Hook in first 30s or viewers leave |
| LinkedIn | 60-90s | 16:9 or 1:1 | 1080p | Auto-plays silent — captions critical |
| Instagram Reels | 15-30s (peak), up to 90s | 9:16 | 1080x1920px | First frame is the thumbnail |
| TikTok | 15-60s (peak), up to 10min | 9:16 | 1080x1920px | Hook in first 2 seconds, no exceptions |
| Facebook | 60-180s | 16:9 or 1:1 | 1080p | Auto-plays silent — captions critical |
| Video ad (pre-roll) | 6s (bumper), 15s, 30s | 16:9 | 1080p | 6s must work without sound |

# Process

## Step 1: Load brand context
Call brand-context-manager. Confirm brand_id, load tone, and reference brand-design-system for on-screen typography, colors, and motion principles.

## Step 2: Define the video's single job
Every video has one job. State it before writing anything:
```
This video moves [audience] from [current state] to [action/feeling/belief] in [length].
```

If no campaign brief exists, ask for objective and audience before proceeding.

## Step 3: Write the concept

Produce a one-paragraph concept statement:
```
Concept: [title]
Hook: [the first line or image that stops the scroll]
Core message: [the one thing the viewer will remember]
Emotional arc: [how the viewer feels at start vs. end]
CTA: [what the viewer does next]
```

Short-form (under 60s): Present concept, confirm, then move directly to script.
Long-form (over 60s): Present concept + outline, confirm structure before scripting.

## Step 4: Write the script

**Script format:**

```
VIDEO: [Title]
Platform: [platform]
Target length: [duration]
Brand: [brand_id]

---

[00:00-00:03] HOOK
VISUAL: [what's on screen]
AUDIO/VO: "[spoken words]"
ON-SCREEN TEXT: "[text overlay if any]"

[00:03-00:10] SETUP
VISUAL: [what's on screen]
AUDIO/VO: "[spoken words]"
ON-SCREEN TEXT: "[text overlay if any]"

[continues for full video]

---

FINAL FRAME
VISUAL: [end card design]
ON-SCREEN TEXT: [CTA text]
AUDIO: [music fade / VO sign-off]
LOGO ANIMATION: [required — describe animation type (e.g. fade-in, slide-up, scale-in), start timecode, duration in seconds, and final resting position (e.g. bottom-right, centered). Never leave blank.]
```

**Script writing rules by brand:**

**Symbicore:**
- Open with a provocation or data point — never a pleasantry
- Short sentences. Each line reads at natural speaking pace.
- No passive voice. No filler ("um", "so", "you know")
- Maximum 150 words per minute (comfortable speaking pace)
- Every 30 seconds must have a new visual or on-screen element to maintain attention

**AdaptAtHome:**
- Open by acknowledging the viewer's situation — empathy before information
- Plain language, Grade 8 reading level
- Warm, human tone — not clinical or corporate
- Avoid medical jargon unless defining it immediately

## Step 5: Write the storyboard

For each scene block in the script, produce a storyboard frame description:

```
FRAME [N]
Timecode: [00:00-00:05]
Shot type: [wide / medium / close-up / over-shoulder / screen-record / b-roll / motion-graphic]
Description: [what is visually on screen — be specific enough for a videographer or motion designer]
On-screen text: [any text overlays, position, style]
Transition: [cut / fade / swipe / none]
```

For motion-graphic-heavy content (ads, LinkedIn), produce frame-by-frame specs with dimensions and animation direction.

## Step 6: Write the shot list (live-action only)

For any video requiring filming:

| Shot # | Scene | Shot type | Subject | Location/Setting | Duration | Notes |
|--------|-------|-----------|---------|-----------------|----------|-------|
| 1 | Hook | Close-up | Presenter face | Studio / office | 3s | High energy, direct camera |

Include: equipment notes (tripod vs. handheld), lighting direction (natural / studio), and audio notes (lapel mic / boom / voiceover).

## Step 7: Production brief

A one-page handoff document for the videographer or editor:

```markdown
# Production Brief: [Video Title]
**Brand:** [brand_id]
**Platform:** [platform]
**Target length:** [duration]
**Due date:** [date]

## Overview
[Concept statement — 2 sentences]

## Tone & Feel
[Visual references or descriptors: e.g. "clean, dark studio, direct-to-camera, no B-roll fluff"]

## On-Screen Design Specs
- Font: [brand typography]
- Colors: [hex values from brand-design-system]
- Logo placement: [position and clear space rule]
- Lower thirds: [style and timing]

## Music Direction
[Tempo, mood, licensed source — e.g. "mid-tempo, confident, no lyrics — source from Epidemic Sound"]

## Deliverables Required
- [ ] Edited video (platform spec)
- [ ] Square crop (1:1) for social
- [ ] Vertical crop (9:16) for Stories/Reels if applicable
- [ ] Thumbnail (see below)
- [ ] SRT caption file

## Asset Handoff
[Where to find brand assets, footage, music]
```

## Step 8: Generate thumbnail via KIE.ai

After writing the thumbnail spec, call `tools/kie_ai.py generate_image()` with `asset_type="thumbnail"` (uses `gpt4o-image` — best text rendering at small sizes).

Pass the thumbnail spec background description and primary text as the prompt. Always pass `brand_context`.

## Step 8b: Generate video clips via KIE.ai (optional)

For short-form social content (Reels, TikTok, bumper ads), call `tools/kie_ai.py generate_video()` to produce actual video output:

| Use case | `asset_type` | Model | Notes |
|---|---|---|---|
| Reels / TikTok / Stories | `social-clip` | veo3_fast | 9:16, fast turnaround |
| LinkedIn video | `linkedin-video` | veo3_fast | 16:9, silent-play safe |
| Brand film / cinematic | `brand-video` | veo3 | Native audio sync — use for hero brand content |
| Pre-roll / bumper ad | `video-ad` | veo3_fast | 16:9, 6-15s |
| Animate existing image | `video-edit` | runway | Pass image as `input_image_url` |

When to generate vs. brief for human production:
- Generate: short-form ads, social clips under 30s, animated stills, motion graphic concepts
- Human production: testimonials, live-action with speakers, long-form YouTube, anything requiring on-location footage

**Anatomy QA (mandatory for any AI-generated clip featuring people):**
After generation, review every frame where a person appears before delivering. Check:
- [ ] Correct number of arms and hands (2 arms, 2 hands)
- [ ] Correct number of legs
- [ ] Fingers look natural (AI frequently over-generates)
- [ ] No body parts merging into objects or background
If any defect is found, regenerate with a revised prompt that explicitly constrains anatomy (e.g. "woman with two arms, natural human anatomy") or flag for human production instead. Do not deliver a clip with anatomy defects.

## Step 8c: Thumbnail design spec

```
THUMBNAIL: [Video Title]
Platform: [platform]
Dimensions: [1280x720px YouTube / 1080x1080px LinkedIn / 1080x1920px Reels]

Layout:
- Background: [color or image description]
- Primary text: [max 4 words — large, bold, high contrast]
- Secondary element: [face / product / graphic]
- Brand element: [logo position]

Design rules:
- Text readable at 120x68px (mobile thumbnail size)
- No more than 3 visual elements
- High contrast — passes at grayscale
- No clickbait imagery that contradicts video content
```

## Step 9: Captions & platform metadata

**Caption file (.SRT):**
Produce a properly formatted SRT file with:
- Max 2 lines per subtitle
- Max 42 characters per line
- Reading pace: 150-180 words per minute
- Timing aligned to script

```
1
00:00:00,000 --> 00:00:03,000
Most B2B companies waste 40%
of their ad spend.

2
00:00:03,000 --> 00:00:07,000
Here's the leak in your pipeline
and how to fix it.
```

**Platform metadata:**
```
Title: [Primary keyword + value hook, platform character limit]
Description: [First 2 lines appear without "show more" — hook + context]
Tags/Hashtags: [3-5 relevant, no hashtag spam]
Chapters (YouTube): [Timecode: Chapter name]
```

## Step 10: Output

Save all deliverables to `output/video-content/[brand-id]/[video-slug]/`:
- `script.md`
- `storyboard.md`
- `shot-list.md` (live action only)
- `production-brief.md`
- `thumbnail-spec.md`
- `captions.srt`
- `metadata.md`

## Step 11: Compliance check
- [ ] No banned words in script or on-screen text
- [ ] CTA is specific — not "Learn More" or "Subscribe for more content"
- [ ] Hook lands within first 3 seconds for short-form, 30 seconds for long-form
- [ ] Captions included — auto-play on silent is the default on LinkedIn and Facebook
- [ ] Thumbnail readable at mobile size
- [ ] On-screen text uses brand typography and colors only
- [ ] FINAL FRAME includes a logo animation spec (type, start timecode, duration, resting position) — BLOCKING if missing
- [ ] All AI-generated clips featuring people have passed anatomy QA (no extra limbs, no merged body parts) — BLOCKING if defect found

# Guardrails
- Never write a script longer than the target platform length allows at 150wpm
- Never start a video with a logo animation — open with the hook
- TikTok and Reels require a hook in the first 2 seconds — if the concept doesn't have one, fix the concept
- Do not produce a script without a defined CTA — every video ends with one clear next action
- If the video is a testimonial, do not write the words for the subject — write the interview questions and editing direction instead
- Every script MUST include a LOGO ANIMATION field on the FINAL FRAME — omitting it is a production error, not an optional field
- Never deliver AI-generated video containing people without completing anatomy QA first — extra limbs are a client-facing quality failure; regenerate or escalate to human production