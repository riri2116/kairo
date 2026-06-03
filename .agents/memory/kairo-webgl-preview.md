---
name: WebGL / R3F in Replit preview
description: Three.js / React Three Fiber renders blank in the agent preview browser; how to keep the page alive
---

# WebGL fails in the Replit preview/screenshot browser

The agent's preview + screenshot browser has **no GPU**, so any Three.js / React Three Fiber
`<Canvas>` throws `THREE.WebGLRenderer: A WebGL context could not be created` and, because the
error propagates up through React, it **blanks the entire page**. Real user browsers render fine.

**Why:** the headless preview environment can't create a WebGL context. This is an environment
limitation, NOT a code bug — do not "fix" the shader/scene in response to it.

**How to apply:** any WebGL/R3F feature must degrade gracefully, two layers:
1. A `webglSupported()` check (try `getContext('webgl2'||'webgl')`) before mounting `<Canvas>`;
   render a CSS fallback when unsupported.
2. A React error boundary (`getDerivedStateFromError`) wrapping the Canvas as a backstop, since
   context loss can throw at render time.
Both render a CSS-gradient fallback (`.ribbon-fallback`). With the guard in place the preview
console is clean. Verdict on visuals must come from the user's real browser, not the screenshot.
