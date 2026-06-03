---
name: Gemini free-tier model choice
description: Which Gemini model to use on a free (no-billing) Google AI Studio key.
---

On a free Google AI Studio key (no billing enabled), `gemini-2.5-pro` returns an immediate quota/`RESOURCE_EXHAUSTED` (429) error — it effectively has **no free tier**. `gemini-2.5-flash` has a generous free tier and works out of the box.

**Why:** A brand-new free GEMINI_API_KEY failed every `generateContent` call on `gemini-2.5-pro` with "quota exceeded" even on the very first request; switching the model to `gemini-2.5-flash` fixed it with no other changes.

**How to apply:** When a feature must run on a user's own free Gemini key, default to `gemini-2.5-flash` (JSON mode via `config.responseMimeType: "application/json"` + `config.systemInstruction` is fully supported). Only use a pro model if the user has billing enabled.
