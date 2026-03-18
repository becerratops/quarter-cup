# Quarter Cup

A retro-styled engineering quest tracker that gamifies your team's backlog. Each backlog item becomes a quest with point values, acceptance criteria, and difficulty ratings. Engineers earn points by merging PRs that solve quests. Compete for the Quarter Cup!

## Features

- **Quest Board** — Browse backlog items as quests, filtered by priority and effort
- **Leaderboard** — Track who's crushing it with real-time point totals
- **GitHub Integration** — Reference quest IDs in PRs to auto-detect completions
- **Retro Pixel Art Theme** — 8-bit aesthetic with scanline effects and pixel avatars
- **Point System** — Priority x Effort = Points (Urgent + Large = maximum value)

## Quick Start

```bash
npm install
npm run dev
```

## How Points Work

| | XS (<1h) | S (1-3h) | M (3-8h) | L (1-2d) |
|---|---|---|---|---|
| **Urgent (4x)** | 4 | 8 | 12 | 20 |
| **Crucial (3x)** | 3 | 6 | 9 | 15 |
| **Would Love (2x)** | 2 | 4 | 6 | 10 |
| **Nice to Have (1x)** | 1 | 2 | 3 | 5 |

## Claiming a Quest

1. Find a quest on the Quest Board
2. Create a branch with the quest ID: `fix/q-001-rc-showing-error`
3. Reference the quest ID in your PR title or description
4. When your PR merges to `dev`, points are awarded

## Customizing for Your Team

Edit `src/data/quests.ts` to define your own quests. Edit `src/data/players.ts` to add your team members.

## Tech Stack

- React 18 + TypeScript + Vite
- CSS custom properties for theming
- Press Start 2P + VT323 fonts (Google Fonts)
- GitHub Actions for PR detection

## License

MIT
