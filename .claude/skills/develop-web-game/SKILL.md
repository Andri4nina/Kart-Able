---
name: develop-web-game
description: Use when building or iterating on the SMKW web game (smkw-ui) and a reliable development + testing loop is needed - implement small changes, drive the game with short input bursts and pauses, inspect screenshots, window.render_game_to_text() output and console errors. Adapted from openai/skills develop-web-game.
---

# Develop Web Game (SMKW)

Build the game in small steps and validate every change: implement, act, pause, observe, adjust.
Project rules first: `docs/REGLES_D_OR.md` (no linear gradients, no emoji, lucide-react icons only when useful).

## Integration points (already provided by smkw-ui)

- Single canvas (R3F `<Canvas>` in `src/scenes/GameCanvas.jsx`).
- `window.render_game_to_text()`: concise JSON of the current state (screen, stack, locale, visible buttons, match setup, HUD, camera, settings, coordinate note).
- `window.advanceTime(ms)`: switches R3F to manual time and steps 1/60 s frames deterministically.
- `window.resumeRealtime()`: back to the realtime loop (manual debugging).
- `window.simulatePlayerInput(deviceId, action)`: drive local players without hardware (`keyboard-1`, `keyboard-2`, `pointer`, `gamepad-N`; actions `start`, `confirm`, `back`, `up`, `down`, `left`, `right`).
- Stable selectors: see `docs/TESTING.md` (or read `buttons` from `render_game_to_text()`).
- Keys: arrows navigate, `Enter` confirm, `Escape` close / previous screen / leave match, `F` fullscreen.
- All UI text goes through i18n (`src/locales/*.json`); run `npm run check:i18n` after touching UI text.

Keep these hooks up to date whenever gameplay state is added (player position/velocity, entities, timers, score...).

## Workflow

1. **Pick one goal** (a feature or behavior).
2. **Implement small**.
3. **Read `progress.md` first**; keep the `Original prompt:` line at the top; append notes after each meaningful chunk.
4. **Run the dev server**: `npm run dev` in `smkw-ui/` (port 5173).
5. **Drive the game**:
   - Codex Playwright client if installed (`$CODEX_HOME/skills/develop-web-game/scripts/web_game_playwright_client.js`):
     `node "$WEB_GAME_CLIENT" --url http://localhost:5173 --actions-file "$WEB_GAME_ACTIONS" --click-selector "#start-btn" --iterations 3 --pause-ms 250`
   - Otherwise the Claude built-in browser: click by ref/selector, call `window.advanceTime(ms)`, then screenshot.
6. **Inspect** after each burst: open the screenshot, read `render_game_to_text()`, read console errors. Screenshots are the source of truth.
7. **Fix the first new console error** before continuing.
8. **Verify full interaction chains** (cause, intermediate states, outcome), not just the first step.
9. **Reset between scenarios** (reload; settings live in localStorage `smkw-settings`).
10. **Run `npm run check` and `npm run build`** before declaring a step done.
11. **Document**: every new element gets `docs/elements/<element>.md` from `_TEMPLATE.md`.

## Gotchas

- A hidden page (`document.visibilityState === 'hidden'`) gets no ResizeObserver / rAF callbacks: the R3F Canvas does not mount and the test hooks are missing. Test with the page visible or in headless mode.
- After the first `advanceTime`, the loop stays manual; reload or call `resumeRealtime()`.
- The test browser may report `prefers-reduced-motion: reduce`; the scene is then intentionally frozen. Set Settings > Motion to Full to test animations.
