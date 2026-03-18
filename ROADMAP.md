# Quarter Cup — Roadmap

## v1.0 (Current) — Static Quest Board
- [x] Quest board with example quests
- [x] Leaderboard with pixel avatars
- [x] Point system (priority x effort)
- [x] Retro 8-bit pixel art theme
- [x] GitHub Action to detect quest IDs in merged PRs
- [x] How It Works page with rules and point table
- [x] Example data — swap in your own quests and players

## v1.1 — Jira Integration (Source of Truth)
- [ ] Connect to Jira as the source of truth for backlog items
- [ ] Quests auto-sync from Jira tickets (no manual quests.ts editing)
- [ ] Quest status updates when Jira ticket status changes
- [ ] Jira ticket link on each quest card
- [ ] No duplication needed — Jira is the canonical backlog, Quarter Cup reads from it

### Design note
Engineers don't have to use Quarter Cup at all. They work in Jira + GitHub as normal. Quarter Cup passively watches both systems and updates the leaderboard. It's opt-in for the fun, invisible for the work.

## v1.2 — Sprints & Special Events
- [ ] Sprint system — time-boxed competition periods (e.g., 1 week, 2 weeks)
- [ ] **Epic Sprint mode** — special sprints with bonus point multipliers and unique badges
- [ ] Sprint history — past sprints with winners and stats
- [ ] Sprint countdown timer on the header
- [ ] Unique "Launch Sprint" badge for participants in the first-ever sprint

## v1.3 — Achievements & Badges
- [ ] Achievement system separate from quest points
- [ ] Badges for learning objectives (incentivize tool adoption):
  - "First Blood" — Complete your first quest
  - "Speedrunner" — Complete a quest within 1 hour of claiming
  - "Bug Hunter" — Report 5 bugs (add 5 items to backlog)
  - "Full Stack" — Complete quests tagged both `frontend` and `backend`
  - "Launch Hero" — Ship code during an Epic Sprint
  - Custom badges defined per-org
- [ ] Badge rarity display: "2 of 8 engineers have this badge" / "Only 25% unlocked"
- [ ] Badge showcase on player profiles
- [ ] Badges are permanent — once earned, always displayed

## v1.4 — Discovery Points (Half Credit for Finding)
- [ ] **Finding rule:** Adding an item to the backlog earns half the quest's points
- [ ] **Solving rule:** Completing the quest earns the other half
- [ ] Finding + solving your own issue = full points
- [ ] Encourages everyone to report bugs and suggest improvements
- [ ] Discovery points tracked separately on leaderboard ("X found / Y solved")

## v1.5 — Claim System (Uber-Style)
- [ ] Real-time notifications when new quests appear
- [ ] "Claim" button — first to claim gets the quest
- [ ] Time-boxed claims — you have N hours to complete before it goes back to the pool
- [ ] Unclaimed quests after X hours get broadcast to the team
- [ ] Slack/Discord notifications for new high-value quests
- [ ] Only one active claim per person (finish or release before claiming another)

## v1.6 — Meta Quests (Improve the Tool Itself)
- [ ] Separate quest category for Quarter Cup's own backlog
- [ ] Anyone can add improvement ideas for the tool
- [ ] Completing a meta quest earns **Contributor Points** — a distinct point type
- [ ] Contributor badge is public — visible on the open source repo and player profile
- [ ] "Open Source Contributor" achievement tier: 1 PR = Bronze, 5 = Silver, 10 = Gold
- [ ] Meta quests show on a separate tab or filter ("Improve the Game" section)
- [ ] External open source contributors earn badges too (community growth)
- [ ] The tool literally gamifies improving itself — self-sustaining feedback loop

## v1.7 — Dynamic Scoring & Difficulty Adjustment
- [ ] **Relative point values** — points are variables, not static. All quest values shift relative to each other as the backlog evolves.
- [ ] **RICE scoring integration** — Use Reach, Impact, Confidence, Effort (or similar framework) to auto-calculate quest priority and points.
- [ ] **Difficulty adjustment** — Like Bitcoin's difficulty retarget: if quests are getting solved too fast, point values decrease; if the backlog grows, values increase. Keeps the game balanced.
- [ ] **Early adopter bonus** — Points earned in early sprints are worth more (rewards people who start competing first).
- [ ] **Quest decomposition** — Large quests can be broken into sub-quests. Multiple team members can tackle different parts. Parent quest completes when all sub-quests are done.
- [ ] **Priority/effort matrix view** — Visual quadrant showing what's important + easy (do first), important + hard (plan), easy + unimportant (fill time), hard + unimportant (skip). Doubles as a planning tool.

## v2.0 — Open Source Polish
- [ ] Setup wizard for new orgs (connect Jira, GitHub, add team)
- [ ] Configurable integrations: Jira, GitHub, Linear, custom API
- [ ] Claude Code MCP integration — manage quests from your terminal
- [ ] Theme customization (not just pixel art)
- [ ] Docker deployment option
- [ ] Documentation site

## Architecture Notes

### Data flow
```
Jira (backlog source) ──► Quarter Cup reads tickets
GitHub (PR merges)    ──► Quarter Cup detects completions
                           ▼
                      Leaderboard updates
                      Badges awarded
                      Sprint progress tracked
```

### Key principles
- Quarter Cup is a **read-only overlay** on top of Jira + GitHub. Engineers never have to interact with it directly.
- **All company data stays in your systems** (Jira, GitHub). Quarter Cup stores only scores and badges.
- The quest board is just a fun view of your existing tickets.
- The tool is generic — any company can use it with their own backlog system.
