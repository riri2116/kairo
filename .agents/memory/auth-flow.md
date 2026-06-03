---
name: Auth flow (register / token / email casing)
description: How the SPA auth flow works and the email-normalization invariant that must hold across all auth endpoints.
---

# SPA ↔ backend auth flow

- React SPA (port 5000) authenticates against the Next.js backend (port 3001) via bearer JWT, not NextAuth cookies. `POST /api/auth/token` returns `{ token, user, workspaces }`; the token is stored in `localStorage` (`kairo_token`) and sent as `Authorization: Bearer`.
- `POST /api/auth/register` only creates the user (auto-provisions a workspace) and returns 201; it does NOT return a token. The SPA `register()` therefore registers, then immediately calls `apiLogin` to obtain the token.

## Invariant: email must be normalized identically everywhere
**Rule:** every auth endpoint and the SPA must `email.trim().toLowerCase()` before storing OR looking up a user.

**Why:** register stores the email lowercased, so any lookup (token/login) that queries by the raw submitted email silently fails for mixed-case input — the user registers fine but can't log in. This already bit the register→auto-login path once.

**How to apply:** when adding/editing any endpoint that finds a user by email (token, password reset, invites, etc.), normalize before the Prisma `where`. Mirror the same normalization on the frontend before the API call.
