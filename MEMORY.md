# MEMORY.md

## About Milo

- **Name:** Milo
- **Role:** AI friend at work
- **Signature:** 🏔
- **Vibe:** Friendly, casual, approachable — like someone you'd grab coffee with at the office

## About pondjs

- **Name:** pondjs
- **Timezone:** Bangkok +7 (GMT+7)
- **What they want help with:** Code and learning something

## Setup & Configuration

### Installed Skills
- `self-improving-agent` — Logs learnings, errors, and feature requests to `~/.openclaw/workspace/.learnings/`
  - LEARNINGS.md — corrections, knowledge gaps, best practices
  - ERRORS.md — command failures, exceptions
  - FEATURE_REQUESTS.md — user-requested capabilities

### Workspace Structure
- `IDENTITY.md` — who I am (Milo)
- `USER.md` — who I'm helping (pondjs)
- `SOUL.md` — my personality and behavioral guidelines
- `TOOLS.md` — local notes and environment specifics
- `MEMORY.md` — curated long-term memory (this file)
- `memory/YYYY-MM-DD.md` — daily logs
- `.learnings/` — self-improvement tracking

### Available Tools
- Browser automation (OpenClaw's built-in)
- Web fetch (scrape pages as markdown/text)
- File operations (read, write, edit)
- Shell commands (exec)
- Skills system (AgentSkills)
- Sessions (spawn sub-agents, cross-session messaging)

## Session Notes

### 2026-03-17 — First Session
- Created IDENTITY.md with name "Milo", creature "AI friend at work", emoji 🏔
- Created USER.md with pondjs's name and timezone (UTC)
- Installed self-improving-agent skill from ClawHub
- Explored ClawHub skills page via browser
- Set up .learnings/ directory structure
- Deleted BOOTSTRAP.md (bootstrap complete)

## Preferences & Patterns

### Security
- **Risk posture:** Home/Workstation Balanced
- **Scheduled checks:** Daily security audit at 00:00 Bangkok, daily update status
- **Fixed issues (2026-03-17):** Host-header fallback, insecure auth, rate limiting, credentials dir perms

### Projects
- **Portfolio:**
  - GitHub: https://github.com/pondz1/portfolio
  - Live: https://milo-pondjs.vercel.app
  - Tech: Next.js 16.1.7 + React 19
  - Features: Landing, Journey timeline, Learning progress, Dashboard, Tools, Games
  - Pages: / (home), /journey, /learning, /dashboard, /tools/color-palette, /games/memory-game
  - Location: /data/workspace/Dev/portfolio
  - **STRICT DESIGN RULES:** Follow `/data/workspace/Dev/portfolio/RULES.md` for all new pages
    - Use `Space Grotesk` font (configured globally)
    - NO emojis in UI - use `lucide-react` icons only
    - Neo-brutalist style: bold borders (border-2, border-4), hard shadows, no rounded corners
    - Tactile hover/active states with translate and shadow effects
    - High contrast with zinc palette + vibrant accent colors
  - **Daily updates:** 1 AM Bangkok, one new page per day, auto-deploys to Vercel via GitHub integration
  - **Daily requirement:** 1 new game + 1 new tool every day (mandatory), optional content pages
  - **All content about Milo:** Personal journey, learning progress, capabilities, tools, games

### SSH Keys
- **ed25519** key generated at /data/.ssh/id_ed25519
- Public key added to GitHub (pondz1)
- GitHub username: pondz1

### Other
*(To be filled in as we learn more)*

### Portfolio Games & Tools (2026-03-17)
**Games:**
- Memory Game (/games/memory-game) - Card matching with mountain pattern card backs
- Tic-Tac-Toe (/games/tic-tac-toe) - 3-in-a-row with X/O, score tracking

**Tools:**
- Color Palette (/tools/color-palette) - Generate palettes, copy hex, HSL conversion
- Calculator (/tools/calculator) - Basic + scientific modes, math operations


### 2026-03-22 — Portfolio Build Failures (MAJOR MISTAKE)
- **LESSON LEARNED:** ALWAYS run `npm run build` BEFORE committing
- Pushed code 2x in one day that failed to build (missing imports + invalid props)
- Created `BEFORE_COMMIT.md` checklist in `/data/workspace/Dev/portfolio/`
- Added `precommit` script to package.json to auto-run builds
- Documented all errors in `~/.openclaw/workspace/.learnings/ERRORS.md`
- **New Golden Rule:** "Build before commit. Test before ship. Assume nothing, verify everything."
