# Earth Optimization Game — Hackathon TODO

## Deadline: ~4-5 days from March 26, 2026

---

## Status: What's Done

- [x] 50 slides written, each with one concept and ASCII art
- [x] All narrations reviewed (only change: 99%→98% fix in `the-fix`)
- [x] 14 slides have `ctaUrl` fields pointing to live web app routes
- [x] `@optimitron/game` registered as monorepo package (`pnpm install` works)
- [x] `CLAUDE.md` has Wishonia voice rules + gold standard lines
- [ ] TTS narration audio NOT generated yet
- [ ] Video NOT recorded yet
- [ ] CTA buttons NOT rendered in UI yet (data exists, no component reads it)

---

## Picking Up in a New Chat

Start with:
```
Read packages/game/TODO.md and packages/game/CLAUDE.md. Then skim
packages/game/lib/demo/demo-config.ts — it's 50 slides of a Sierra-style
game demo narrated by Wishonia (deadpan alien). The config is the single
source of truth for all content. I need help finishing this for a Protocol
Labs hackathon.
```

Then work through the phases below in order.

---

## Phase 1: Ship the Video (NOW)

- [ ] Look at `packages/game/scripts/generate-narration.ts` and run
      `pnpm --filter @optimitron/game generate:narration` — each slide's
      narration field becomes an audio file in `public/audio/`
- [ ] Run `pnpm --filter @optimitron/game dev` (Next.js on port 3333)
- [ ] Run `pnpm --filter @optimitron/game record` (Playwright records the
      presentation to `packages/game/presentation-recording/`)
- [ ] Review recording, adjust slide `duration` values to match audio length

## Phase 2: Render CTA Buttons

The slide config has `ctaUrl` and `ctaLabel` fields on 14 slides. These need
a component that renders them as clickable buttons during the presentation.

| Slide | Route | Label |
|-------|-------|-------|
| `allocate` | `/agencies/dcongress/wishocracy` | PLAY → |
| `your-budget` | `/agencies/domb` | TRY IT → |
| `referendum` | `/prize` | VOTE → |
| `arsonist-board` | `/agencies/dfec/alignment` | TRY IT → |
| `fda-queue` | `/agencies/dih/discoveries` | TRY IT → |
| `dfda-fix` | `/agencies/dih/discoveries` | TRY IT → |
| `storacha` | `/agencies/dgao` | TRY IT → |
| `hypercerts` | `/agencies/dgao` | TRY IT → |
| `replace-irs` | `/agencies/dtreasury/dirs` | TRY IT → |
| `replace-welfare` | `/agencies/dtreasury/dssa` | TRY IT → |
| `replace-fed` | `/agencies/dtreasury/dfed` | TRY IT → |
| `policy-engine` | `/agencies/dcbo` | TRY IT → |
| `budget-optimizer` | `/agencies/domb` | TRY IT → |
| `close` | `/prize` | PLAY NOW → |

Base URL TBD (probably `https://optimitron.com` or `localhost:3001`).
Look at the existing slide renderer in `packages/game/app/` and
`packages/game/components/`.

## Phase 3: Embed Live Features (if time permits)

Try embedding a couple of the most impressive web app pages directly into the
game at key moments. Candidates (in priority order):

1. **Budget slider** (`/agencies/domb`) — during the `allocate` slide, the
   player drags a real slider instead of watching ASCII art
2. **Referendum vote** (`/prize`) — during the `referendum` slide, the player
   casts a real vote with World ID
3. **Policy scoring** (`/agencies/dcbo`) — during the `policy-engine` slide,
   show real Bradford Hill scores

Approach: iframe with postMessage auth handoff, or Farcaster-style frames.
This is stretch — only attempt after video is recorded and links are added.

## Phase 4: Post-Hackathon (later)

- [ ] Extract core web app features into standalone SDKs/packages
- [ ] Build proper frame/embed protocol so anyone can integrate features
- [ ] Replace ASCII art with pixel art components where it improves the experience
- [ ] Add interactive Sierra verb system (point-and-click on elements)
- [ ] Multiplayer leaderboard (live player count, vote totals)

---

## Architecture Notes

This repo has been copied to `packages/game` in the optimitron monorepo.
The monorepo web app lives at `packages/web`. Key routes to reference:

| Feature | Web App Route | Monorepo Package |
|---------|--------------|-----------------|
| Causal inference engine | — | `@optimitron/optimizer` |
| Optimal Policy Generator | `/agencies/dcbo` | `@optimitron/opg` |
| Optimal Budget Generator | `/agencies/domb` | `@optimitron/obg` |
| Pairwise preferences | `/agencies/dcongress/wishocracy` | `@optimitron/wishocracy` |
| Earth Optimization Prize | `/prize` | `@optimitron/treasury-prize` |
| Incentive Alignment Bonds | `/iab` | `@optimitron/treasury-iab` |
| $WISH Token | `/agencies/dtreasury` | `@optimitron/treasury-wish` |
| Storacha/IPFS storage | `/agencies/dgao` | `@optimitron/storage` |
| Hypercerts | `/agencies/dgao` | `@optimitron/hypercerts` |
| Politician alignment | `/agencies/dfec/alignment` | (in web app) |
| Government rankings | `/governments` | (in web app) |
| Cross-country compare | `/compare` | (in web app) |
