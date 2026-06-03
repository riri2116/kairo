---
name: Theming / dark mode
description: How global light/dark mode works in Kairo and the convention any new UI must follow.
---

# Global theme system

- Theme is a single app-wide context (`src/lib/theme.jsx`): `useTheme()` → `{ theme, toggle, setTheme }`. It sets `data-theme` on `<html>` and persists to `localStorage` key `kairo-theme`. Default when unset is `light`.
- A tiny inline bootstrap in `index.html` reads `kairo-theme` and sets `data-theme` **before** React mounts. This is what prevents a first-paint light flash for returning dark users — keep it in sync if the storage key or default ever changes.
- Colors are driven by semantic CSS variables defined twice in `src/index.css`: light values under `:root`, dark overrides under `[data-theme="dark"]`. Dashboard styles live in `src/dashboard/dashboard.css` and consume the same tokens.

## Convention for new UI
**Rule:** never hardcode a raw hex for surface/text/border in new components — use the semantic tokens (`--bg`, `--surface`/`-2`/`-3`, `--text-primary`/`-secondary`/`-tertiary`, `--border`/`-strong`, `--inverse-surface`/`-text`, status tokens). For unavoidable accent tints (pastel icon chips, skeleton shimmers, "running" states) that have no token, add an explicit `[data-theme="dark"]` override next to the light rule.

**Why:** the whole app must work in both modes; a stray light hex flashes bright in dark mode and a dark text color can land on a dark surface (unreadable). Tokens or paired dark overrides are the only safe options.

**How to apply:** when adding/editing dashboard or landing CSS, grep the diff for raw hex backgrounds/colors; either tokenize them or add a paired `[data-theme="dark"]` rule.
