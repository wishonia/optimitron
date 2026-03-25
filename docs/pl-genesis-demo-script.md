# PL Genesis Hackathon — Demo Video Script

**Target length**: 3–4 minutes
**Tone**: Wishonia narrating (deadpan, data-first, dry, alien observer)
**Aesthetic**: Sierra Online adventure game (Space Quest IV–VI era) — pixel art scenes, narrator text boxes, point-and-click verbs, death screens, score counter
**Slides**: 29 (one concept per slide)
**Implementation**: `packages/web/src/lib/demo-script.ts` → `hackathon` playlist

---

## The Sierra Framing

The entire demo is presented as a Sierra-style point-and-click adventure game. Wishonia is the narrator — same role as the Space Quest narrator who mocks Roger Wilco for dying in increasingly stupid ways. Except here, the dying is real and the stupid decisions are made by 8 billion people.

### Persistent UI Chrome (every slide)

```
┌──────────────────────────────────────────────────────────────┐
│  SCORE: 0 of 8,000,000,000    ◄ ►    ☠ 150,000/day          │
│──────────────────────────────────────────────────────────────│
│                                                              │
│                    [ PIXEL ART SCENE ]                       │
│                                                              │
│──────────────────────────────────────────────────────────────│
│  ┌──────────────────────────────────────────────────┐        │
│  │                                                  │        │
│  │  HALE    ████░░░░░░  63.3 → 69.8 yrs            │        │
│  │  INCOME  ██░░░░░░░░  $18.7K → $149K             │        │
│  │                                                  │        │
│  └──────────────────────────────────────────────────┘        │
│──────────────────────────────────────────────────────────────│
│ ┌──────┐                                                     │
│ │WISHON│  "Your government is a misaligned                   │
│ │  IA  │   superintelligence."                               │
│ │portrait                                                    │
│ └──────┘                                                     │
│  👁 LOOK   ✋ USE   🚶 WALK   💬 TALK   📦 INVENTORY        │
│  [ ][ ][ ][ ][ ][ ][ ][ ]  ← inventory slots               │
└──────────────────────────────────────────────────────────────┘
```

**Persistent HUD elements:**

- **Score counter** (top-left): `0 of 8,000,000,000`. Ticks up as the game progresses. Represents "lives aligned."
- **Death ticker** (top-right): `☠ 150,000/day` — always counting, always visible, relentless. Red digits.
- **Quest meters** (mid-bar): Two progress bars showing current → target for HALE and Median Income. These are the *win conditions*. Hidden in Act I. Appear at The Turn (slide 7). Fill through Act II. Hit 100% on completion screen.
- **Narrator text box** (bottom): Blue gradient box. Wishonia's pixel portrait on the left (48×48, slightly animated — blinking, occasional eyebrow raise). Narration text typewriter-animates character by character (~30 chars/sec).
- **Verb bar + Inventory** (bottom edge): Look / Use / Walk / Talk icons. 8 inventory slots that fill as the player collects items. Decorative in auto-play, functional in interactive mode.
- **Cursor**: Sierra-style crosshair, changes contextually (eye, hand, boots, speech bubble). Tracks mouse to prove it's not a video.

### Score Progression

| Slide | Score | Why |
|-------|-------|-----|
| 1–8 (Act I) | 0 | Nothing has been done yet. Counter mocks the viewer. |
| 9 (Moronia) | `GAME OVER` | Score resets to 0. Death screen. |
| 10 (Wishonia) | `RESTORE GAME` | Score reappears. Quest meters appear. |
| 11 (The Fix) | 100,000 | First hint of progress. |
| 12 (Acceleration) | 1,000,000 | Momentum building. |
| 14 (Scoreboard) | 5,000,000 | Win conditions defined. Quest meters pulse. |
| 15 (Allocate) | 10,000,000 | Player engagement starts. |
| 16 (Vote) | 100,000,000 | Critical mass approaching. |
| 17 ($0.06) | 200,000,000 | The asymmetry clicks. |
| 18 (Get Friends to Play) | 500,000,000 | Network effect. |
| 19 (Prize Investment) | 650,000,000 | Better than your retirement fund. |
| 20 (Prize Mechanism) | 800,000,000 | Two paths, both green. |
| 21 ($194K/point) | 1,000,000,000 | NOW the value makes sense. |
| 22 (You Cannot Lose) | 1,500,000,000 | All three scenarios laid out. |
| 23 (Leaderboard) | 3,000,000,000 | Accountability layer active. |
| 24 (Metric) | 4,000,000,000 | System reprogrammed. |
| 25 ($15.7M) | 6,000,000,000 | Act II climax. Personal upside lands. |
| 28 (Title Drop) | 8,000,000,000 of 8,000,000,000 | Full alignment. "YOU HAVE WON." |

### Inventory Items (collected as you progress)

| Slot | Acquired | Icon | Item | Tooltip |
|------|----------|------|------|---------|
| 1 | Slide 11 | 📜 scroll | `1% TREATY` | "Redirect 1% of military spending to clinical trials." |
| 2 | Slide 15 | 🗳 ballot | `ALLOCATION` | "Your preferred budget split." |
| 3 | Slide 16 | ✊ fist | `VOTE` | "Yes on the 1% Treaty." |
| 4 | Slide 18 | 🔗 chain | `REFERRAL LINK` | "Share with 2 friends. They share with 2 more." |
| 5 | Slide 20 | 🪙 gold coin | `PRIZE DEPOSIT` | "$100 deposited. Earning 17%/yr. Grows 11× even if targets missed." |
| 6 | Slide 21 | 🥈🥈 silver pair | `VOTE POINTS ×2` | "$194K each if targets are hit. Earned by getting friends to play." |
| 7 | Slide 25 | 📋 deed | `$15.7M CLAIM` | "Your lifetime income gain if the Treaty passes." |
| 8 | Slide 23 | 🔍 magnifier | `ALIGNMENT SCORE` | "See how your leaders rank vs your preferences." |

**Visual distinction between PRIZE and VOTE:**
- `PRIZE DEPOSIT` = **gold coin** (slot 5). You earn this by *depositing money*. Invested in innovative startups at 17%/yr. Payoff if targets missed: 11× back.
- `VOTE POINTS` = **silver tokens** (slot 6). You earn these by *getting friends to play*. Payoff if targets hit: $194K/point. The more friends who play, the bigger the prize pool, the more everyone is incentivized to make sure humanity wins.
- A player can hold *both*. The worked example (slide 19) shows $100 deposited + 2 friends playing = both items in inventory.

---

## Pacing & Trailer Structure

**Act I — The Horror (slides 1–9, ~80s)**
Dark pixel art scenes. EGA 16-color palette. Ominous chiptune. Score stays at 0. Quest meters hidden. Each slide is 8–10s. Fast cuts. Escalating dread: deaths → misalignment → absurd ratio → collapse clock → what collapse looks like → AI accelerating it → it's already happening to your paycheck → Moronia (GAME OVER).

**GAME OVER / RESTORE (slides 9–10)**
Moronia = death screen. Wishonia = restore from alternate save. EGA→VGA palette shift. Quest meters appear.

**Act II — The Quest (slides 11–25, ~150s)**
VGA palette. Upbeat chiptune. Score climbs. Inventory fills. Narrative arc:

```
THE SOLUTION     THE GAME           THE MONEY              THE ACCOUNTABILITY  THE CLIMAX
Fix              Allocate           Prize Investment (17%)  Leaderboard         $15.7M
→ Acceleration   → Vote             → Prize Mechanism       → Changed Metric    (Act II peak)
→ Plur.Ignorance → $0.06 asymmetry  → $194K/point
→ Scoreboard     → Get Friends      → Can't Lose
```

**Key rules:**
- Never introduce a *value* before the *mechanism that creates it* (Prize pool → VOTE point value)
- One concept per slide — if a slide explains two things, split it
- Personal upside ($15.7M) is the LAST thing before Act III — it's the gut punch that sends us into the close

**Act III — The Endgame (slides 26–29, ~35s)**
Score approaching max. Architecture (credibility) → 10.7B lives (emotional scale) → Close → Title → Easter egg.

**Sound design:**
- Act I: Minor-key chiptune. Ticking clock undertone. Death ticker has a faint heartbeat pulse.
- Game Over: Sierra death jingle (dun-dun-dun-duuuun).
- Restore: Save-game "bwoing", then immediate bright major-key shift.
- Act II: Upbeat quest music. "Cha-ching" on inventory pickups. Quest meter fill has a rising pitch.
- Act III: Full heroic chiptune theme building to resolution. Final chord sustains, then silence.

---

## ACT I — THE HORROR

### Slide 1 — Cold Open: Death Ticker (10s)

*Segment*: `script-0-cold-open` · *Component*: `death-count` · *BG*: foreground

**[3 seconds of black screen. Just the death counter ticking up. No narration. No Sierra chrome yet — just red numbers on black, counting. Then the UI fades in around it.]**

> "150,000 humans die every day from diseases that are theoretically curable. That is fifty-nine September 11ths. But nobody invades anybody about it because cancer does not have oil."

*Visual*: Pixel art planet from space. Continents rendered in dark EGA reds and greys — no green, no blue ocean. Tiny pixel crosses dot the land masses. The death counter dominates the center in large red pixel font, ticking relentlessly. Sierra narrator box fades in below with Wishonia's portrait (neutral expression).

*Sierra verb*: `> LOOK AT planet` → "A Class-M planet experiencing a preventable extinction event. The inhabitants appear to be aware of this. They have chosen to do nothing."

---

### Slide 2 — Misaligned Superintelligence (10s)

*Segment*: `script-1a-misaligned` · *Component*: `terminal` · *BG*: foreground

> "Your government is a misaligned superintelligence. It controls trillions of dollars, billions of lives, and the allocation of your civilisation's entire productive capacity. And it is optimising for the wrong objective function."

*Visual*: Pixel art command bridge (SQ1 Sarien ship). Five CRT monitors in a semicircle showing: military contracts scrolling, pharma stock tickers, healthcare waitlist numbers climbing, a "CITIZEN REQUESTS" inbox with 0 read / 4,294,967,296 unread. Central monitor displays "OBJECTIVE FUNCTION: RE-ELECTION" in blinking green text. "MISALIGNED SUPERINTELLIGENCE" overwrites it character by character. Scan lines roll.

*Sierra verb*: `> TALK TO computer` → "It does not respond. It has not responded to citizen input in approximately forty years."
`> USE keyboard` → "ACCESS DENIED. You are not a lobbyist."

---

### Slide 3 — The Earth Optimization Game (12s)

*Segment*: `script-1b-objective` · *Component*: `game-title` · *BG*: foreground

> "The objective of the Earth Optimisation Game is to optimally allocate Earth's finite resources. Move the budget from things that make you poorer and deader — like explosions — to the things that would make you vastly healthier and wealthier — like pragmatic clinical trials. That is the entire game. Reallocate. Everything else follows."

*Visual*: Full Sierra title screen with the game's core mechanic visible from the start. Black background, twinkling pixel stars. "THE EARTH OPTIMIZATION GAME" in gold-embossed Sierra bitmap font, centered. Below the title, an animated pixel-art allocation slider — a horizontal bar with a pixel explosion icon (💥) on the left end and a pixel test tube icon (🧪) on the right. The slider handle sits almost entirely on the left (current: 99% explosions). As the narration says "move the budget," an animated hand drags the slider one notch rightward (to 98%). A tiny "+$27B → CURES" label pops up. The bar barely moves — but the test tube icon pulses brighter.

Below the slider: "A Point-and-Click Adventure in Civilisational Reallocation." Blinking "PRESS START" at the bottom.

*Sierra verb*: `> USE common sense ON government` → "I don't think that works here."
`> DRAG slider` → "You have just reallocated $27 billion from explosions to cures. The military did not notice. The sick did."

---

### Slide 4 — 604:1 (8s)

*Segment*: `script-2b-ratio` · *Component*: `military-pie` · *BG*: foreground

> "Your governments currently spend $604 on the capacity for mass murder for every $1 they spend testing which medicines work. Your chance of dying from terrorism: 1 in 30 million. Your chance of dying from disease: 100%."

*Visual*: Pixel art — a Sierra-style scale/balance. Left pan: overflowing with pixel missiles, tanks, jets, bombs — crashed to the floor, bending the scale. Right pan: a single tiny pixel test tube floating near the ceiling. Above the scale: "$2,720,000,000,000" (left) vs "$4,500,000,000" (right). Below, a pixel-art pie chart where the clinical trials slice is literally one pixel wide. Legend: "MILITARY: 99.83%" / "CLINICAL TRIALS: 0.17%."

*Sierra verb*: `> LOOK AT tiny pile` → "That is the entire global clinical trials budget. Try not to blink or you'll miss it."
`> USE test tube` → "You cannot. It is being crushed by $2.72 trillion of military hardware."

---

### Slide 5 — The Clock (10s)

*Segment*: `script-2c-clock` · *Component*: `collapse-clock` · *BG*: foreground

> "The parasitic economy — cybercrime, rent-seeking, military spending — grows at 15% per year. The productive economy grows at 3%. In 15 years, it becomes more rational to steal than to produce. This is the clock."

*Visual*: Pixel art — stone castle wall (King's Quest aesthetic) with a massive clock face. Two hands racing: red "PARASITIC (15%/yr)" spinning fast, green "PRODUCTIVE (3%/yr)" crawling behind. Below, a pixel-art line chart shows the two trajectories crossing — red overtaking green — with a flashing "X" at "2040: COLLAPSE THRESHOLD." Digital countdown ticks: "YEARS REMAINING: 14 yrs 247 days 8 hrs..."

*Sierra verb*: `> USE time machine` → "You don't have one. That's rather the point."
`> LOOK AT clock` → "Every civilisation that reached this threshold collapsed. Soviet Union. Yugoslavia. Argentina. Zimbabwe. You are next unless you change the trajectory."

---

### Slide 6 — Global Failed State (10s)

*Segment*: `script-2d-failed-state` · *Component*: `failed-state` · *BG*: foreground

> "When stealing becomes more rational than producing, people stop producing. This is not a theory. Somalia. Venezuela. Lebanon. The productive people leave or die. The ones who remain have nothing left to steal. So they steal from each other. The entire economy becomes extraction. Nothing gets built. Nothing gets maintained. Nothing gets cured. That is where the clock ends. Not in one country. Everywhere."

*Visual*: Pixel art — a Sierra city scene, but decaying in real-time. The scene starts as a functioning pixel town (shops, roads, people walking). As the narration progresses, pixel-art decay spreads: storefronts board up, pixel thieves appear on rooftops, roads crack, a hospital's red cross sign flickers and dies, pixel people flee offscreen or huddle in corners. The palette desaturates toward the Moronia greys. In the corner, a world map shows red spreading from a few countries to all continents — the same color as the parasitic economy line from slide 5. Text overlay: "WHEN DESTRUCTION > PRODUCTION: GLOBAL FAILED STATE."

*Sierra verb*: `> LOOK AT city` → "Somalia but everywhere. Venezuela but permanent. Lebanon but with no neighbouring country to flee to. When the whole planet crosses the threshold, there is nowhere left to go."
`> HELP` → "There is no help command in a failed state. That is what makes it a failed state."

---

### Slide 7 — The AI Hacker Spiral (10s)

*Segment*: `script-2e-ai-hackers` · *Component*: `ai-spiral` · *BG*: foreground

> "It gets worse. North Korea, Russia, and criminal syndicates are already using AI to generate autonomous hacking agents. Millions of them. They steal to fund more compute. More compute creates more hackers. More hackers steal more. This is a recursive exponential loop. Your species built the tools for its own extraction. And every dollar stolen funds the next generation of thieves."

*Visual*: Pixel art — a dark server room (SQ-style villain lair). A single pixel-art robot hacker sits at a terminal. It splits into two. Those two split into four. The screen fills with multiplying hacker bots — a visual echo of the doubling model from slide 15, but evil. A counter ticks: "AI HACKERS: 1... 2... 4... 1,024... 1,048,576... ∞." Below, a loop diagram animates:

```
  ┌──→ STEAL $$$  ──→ BUY COMPUTE ──→ TRAIN MORE HACKERS ──┐
  │                                                          │
  └──────────────────────────────────────────────────────────┘
  RECURSIVE EXPONENTIAL THEFT
```

The loop spins faster and faster. The stolen amount counter ticks up. The productive economy bar from slide 5 shrinks visibly in the HUD.

*Sierra verb*: `> LOOK AT hackers` → "Each one creates two more. The doubling model, but for destruction. Twenty-eight rounds of this does not create a movement. It creates an extinction."
`> UNPLUG server` → "You cannot unplug a distributed botnet. That is rather the point of distributed systems. Your species built this too."

---

### Slide 8 — Your Paycheck Already Got Stolen (8s)

*Segment*: `script-2f-paycheck-theft` · *Component*: `paycheck-theft` · *BG*: foreground

> "You do not have to wait for the collapse. It already started. Your central bank has destroyed 97% of the dollar's purchasing power since 1913. If wages had kept pace, the median family would earn $528,000 a year. The actual number is $77,500. The difference went to fund endless war and bail out the banks that lost your money. Your paycheck is being stolen every year. They just call it monetary policy so you do not notice."

*Visual*: Pixel art — a Sierra pay window / merchant's counter. A pixel worker receives a stack of gold coins ("YOUR PAYCHECK: $77,500"). But as the coins land, they shrink — each one dissolving by ~3% as a tiny pixel vacuum labeled "CENTRAL BANK" siphons off value. Above the worker, a ghost-image shows what the paycheck SHOULD be: a massive gold pile labeled "$528,000 — IF WAGES KEPT PACE." The gap between the real pile and the ghost pile is enormous. Pixel arrows show where the difference went: "→ ENDLESS WAR" "→ BANK BAILOUTS" "→ MILITARY CONTRACTORS." The worker doesn't react — they can't see the ghost pile. They think the small pile is normal.

*Sierra verb*: `> LOOK AT paycheck` → "$77,500. Your species calls this a 'good salary.' It is 15% of what it would be if your central bank had not spent a century funding wars with your purchasing power."
`> LOOK AT ghost pile` → "$528,000. That is what the median family would earn if productivity gains had been passed to workers instead of printed away. The theft is invisible because it happens at 2% per year. Compound interest works for thieves too."

---

### Slide 9 — Moronia: GAME OVER (10s)

*Segment*: `script-3a-moronia` · *Component*: `moronia` · *BG*: foreground

> "Moronia was a planet that spent 604 times more on weapons than on curing disease. It no longer exists. Their allocation ratio correlates with yours at 94.7%."

*Visual*: Pixel art — barren, cracked planet surface. Red-black sky. Shattered buildings. Leafless pixel trees. Craters. Ash drifting. After narration, screen FREEZES. Sierra death jingle plays. Image desaturates to greyscale. Death dialog drops in:

```
┌─────────────────────────────────────┐
│          G A M E   O V E R          │
│                                     │
│  Moronia allocated 604× more to     │
│  weapons than curing disease.       │
│                                     │
│  Correlation with Earth: 94.7%.     │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌──────┐  │
│  │ RESTORE │ │ RESTART │ │ QUIT │  │
│  └─────────┘ └─────────┘ └──────┘  │
└─────────────────────────────────────┘
```

Score resets to `0`. Death counter *keeps ticking*.

---

## THE TURN — RESTORE GAME

### Slide 10 — Wishonia: RESTORE FROM ALTERNATE SAVE (10s)

*Segment*: `script-3b-wishonia` · *Component*: `wishonia-slide` · *BG*: cyan

**[Cursor moves to "RESTORE" and clicks. Death dialog dissolves. Save-game file browser slides in:]**

```
┌─────────────────────────────────────┐
│  R E S T O R E   G A M E           │
│                                     │
│  ▸ earth_2026.sav      (current)   │
│  ▸ moronia_final.sav    ☠ (dead)   │
│  ▸ wishonia_year_0.sav  ★ ◄◄◄     │
│                                     │
│  ┌──────────┐ ┌────────┐           │
│  └──────────┘ └────────┘           │
└─────────────────────────────────────┘
```

**[Clicks "wishonia_year_0.sav". "Bwoing" restore sound.]**

> "Wishonia redirected 1% of its murder budget to clinical trials 4,297 years ago. That is where I am from. It is considerably nicer."

*Visual*: INSTANTANEOUS hard cut. Palette explodes from EGA 16-color to VGA 256. Bright cyan sky, fluffy pixel clouds, green rolling hills, gleaming pixel cities with parks and hospitals (no military bases). Pixel birds fly. Rivers flow. Health/happiness meters maxed. Quest meters (HALE / Income) appear for the FIRST TIME, empty, pulsing gently.

Score reappears. Inventory is empty. The quest begins.

---

## ACT II — THE QUEST

### Part 1: The Solution

### Slide 11 — The Fix (10s)

*Segment*: `script-4a-fix` · *Component*: `one-percent-shift` · *BG*: yellow

> "The fix is not complicated. Redirect 1% of global military spending — $27 billion a year — to clinical trials. That is going from spending 99% on bombs to 98% on bombs. Radical, I know."

*Visual*: Pixel art — Wishonia's control room. Massive wall-mounted lever with display: "MILITARY: 99%" / "CURES: 1%". Animated pixel hand nudges it one notch. Display updates: "MILITARY: 98%" / "CURES: 2%." The slot is one pixel different. Comic "that's it?" pause. Pixel-art scroll "1% TREATY" drops into inventory slot 1 with "cha-ching." Quest meter for INCOME nudges slightly.

*Sierra verb*: `> USE lever` → "You nudge it 1%. The military-industrial complex does not notice. Twenty-seven billion dollars just got redirected and nobody felt a thing."

**Score**: `100,000` · **Inventory**: +`1% TREATY` (slot 1)

---

### Slide 12 — 12.3× Acceleration (10s)

*Segment*: `script-4b-acceleration` · *Component*: `trial-acceleration` · *BG*: cyan

> "This would increase clinical trial capacity by 12.3 times. It would compress the time to cure all diseases from 443 years to 36 years. The maths is not in dispute."

*Visual*: Pixel art — two hourglasses on a workshop bench. Left: enormous, "STATUS QUO", plaque "443 YEARS", tiny sand trickle. Right: compact, "1% TREATY", plaque "36 YEARS", sand pouring 12× faster. Pixel scientist between them, pointing at right one, shrugging. Multiplier badge: "×12.3 CAPACITY." HALE quest meter fills slightly.

*Sierra verb*: `> LOOK AT left hourglass` → "443 years. Your grandchildren's grandchildren's grandchildren would still be waiting."
`> LOOK AT right hourglass` → "36 years. Most of you would live to see it. If you started today."

**Score**: `1,000,000`

---

### Slide 13 — Pluralistic Ignorance (10s)

*Segment*: `script-4c-ignorance` · *Component*: `pluralistic-ignorance` · *BG*: background

> "The problem is not that nobody wants this. The problem is that everybody wants it but thinks nobody else will agree to it. This is called pluralistic ignorance, and it is your civilisation's most expensive bug."

*Visual*: Pixel art — town square (King's Quest village). Thirty pixel villagers, each with a green ✓ thought bubble. But each is turned away, arms crossed, looking at the ground — can't see anyone else's bubble. One villager in center has yellow `!` quest marker (the player). Sierra info box: "BUG REPORT: pluralistic_ignorance.exe — Status: ACTIVE — Cost: $101T/year."

*Sierra verb*: `> TALK TO crowd` → "They all want the same thing. They just don't know they all want the same thing. Your job is to make the demand visible."

---

### Slide 14 — The Scoreboard: Quest Objectives (10s)

*Segment*: `script-4d-scoreboard` · *Component*: `quest-objectives` · *BG*: background

**[Quest notification: "QUEST OBJECTIVES REVEALED"]**

> "The entire game comes down to two numbers. Healthy life expectancy: currently 63.3 years, target 69.8. Median income: currently $18,700, target $149,000. Move these two numbers and everything else follows. That is the scoreboard. Everything on this site exists to move it."

*Visual*: Pixel art — large Sierra quest log/journal open on a wooden desk:

```
┌──────────────────────────────────────────────┐
│  📖 QUEST LOG — EARTH OPTIMIZATION           │
│                                              │
│  OBJECTIVE 1: HEALTHY LIFE EXPECTANCY        │
│  ─────────────────────────────────────       │
│  Current:  63.3 years                        │
│  Target:   69.8 years (+6.5)                 │
│  Progress: ████████░░░░░░░░░░░░  0%          │
│                                              │
│  OBJECTIVE 2: GLOBAL MEDIAN INCOME           │
│  ─────────────────────────────────────       │
│  Current:  $18,700 / year                    │
│  Target:   $149,000 / year (8×)              │
│  Progress: ██░░░░░░░░░░░░░░░░░░  0%          │
│                                              │
│  DEADLINE: 2040 (14 years)                   │
│  REWARD:   8,000,000,000 lives aligned       │
│                                              │
│  "Move these two numbers. Everything else    │
│   follows." — Wishonia                       │
└──────────────────────────────────────────────┘
```

Quest meters in HUD pulse and glow — the viewer now understands what they're tracking.

*Sierra verb*: `> READ quest log` → "Two numbers. That is all. Your species has made this extraordinarily complicated. It is not."

**Score**: `5,000,000`

---

### Part 2: The Game

### Slide 15 — Level 1: Allocate (15s)

*Segment*: `script-5a-allocate` · *Component*: `level-allocate` · *BG*: yellow

**[Quest notification: "⚔ LEVEL 1 — Allocate your civilisation's resources."]**

> "Step one: allocate. You see two budget categories. Drag the slider toward the one you'd spend more on. Explosions or pragmatic clinical trials. Ten comparisons. Your choices build a complete budget allocation using eigenvector decomposition — the same maths your species invented in 1977 and mostly uses to rank American football teams."

*Visual*: Pixel art — Sierra "duel" layout. RPG battle, but combatants are budget categories:

**TOP HALF — The Matchup (animated, 3 rounds):**

Round 1:
```
┌─────────────────┐    VS    ┌─────────────────┐
│  💥 EXPLOSIONS   │          │  🧪 CLINICAL     │
│                 │          │     TRIALS       │
│  $2.72T / year  │          │  $4.5B / year    │
│  604× more than │  ◄━━━━►  │  Cures diseases  │
│  the other one  │  [SLIDER] │  $929 per patient │
│                 │          │                  │
│  ROI: negative  │          │  ROI: 12.3× more │
│  (more death)   │          │  trial capacity  │
└─────────────────┘          └─────────────────┘
```

Cursor grabs slider, drags firmly toward CLINICAL TRIALS. Green burst. "COMPARISON 1 of 10 ✓."
Round 2 snaps in: "MILITARY BASES vs DISEASE RESEARCH" — slider right.
Round 3: "FIGHTER JETS vs HOSPITAL BEDS" — slider right.
Each round ~1 second. Speed sells "this is fast."

**BOTTOM HALF — Your Allocation Builds:**

Pixel-art horizontal bar chart grows. Each comparison adjusts a bar. After 3 rounds: "Clinical Trials: 31% · Education: 22% · Infrastructure: 18% · Military: 4%..." Bars in different pixel colors. Final text: "10 comparisons. 2 minutes. You just designed a coherent national budget."

Ballot drops into inventory slot 2.

*Sierra verb*: `> DRAG slider` → "Interesting. You'd rather cure cancer than build a ninth aircraft carrier. Your politicians may want to take notes."
`> LOOK AT allocation chart` → "Eigenvector decomposition. Stable preference weights from ten comparisons. Your species invented this in 1977. Used it for football. We use it for civilisation."

**Score**: `10,000,000` · **Inventory**: +`ALLOCATION` (slot 2)

---

### Slide 16 — Level 2: Vote on the Treaty (12s)

*Segment*: `script-5b-vote` · *Component*: `level-vote` · *BG*: pink

> "Step two: the 1% Treaty Referendum. Should all governments redirect 1% of military spending to pragmatic clinical trials? Yes or no. One click. Thirty seconds. This is the question that changes the allocation."

*Visual*: Screen dims to spotlight. Single oversized Sierra dialog box:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   📜 THE 1% TREATY REFERENDUM                    │
│                                                  │
│   Should all governments redirect 1% of          │
│   military spending to pragmatic clinical trials? │
│                                                  │
│   Current allocation: 💥 99% → 🧪 1%             │
│   Proposed:           💥 98% → 🧪 2%             │
│                                                  │
│       ┌──────────┐         ┌──────────┐          │
│       │   YES    │         │    NO    │          │
│       └──────────┘         └──────────┘          │
└──────────────────────────────────────────────────┘
```

Cursor hovers YES. 1.5 seconds silence. Clicks.

**CELEBRATION (2s):** Dialog explodes with pixel confetti. Fanfare. Score jumps 10M → 100M. Banner: "VOTE RECORDED ✓". The allocation slider from slide 3 nudges one tick rightward — the global slider moved because *you* voted.

Raised-fist drops into inventory slot 3.

New dialog slides in from right:

```
┌────────────────────────────────────────┐
│  🎉 YOU'RE IN THE GAME!               │
│                                        │
│  Player #4,847 of 268M needed          │
│  Get your friends to play:             │
│                                        │
│  ┌─────────────────────────────────┐   │
│  │ optimitron.com/r/player1        │   │
│  └─────────────────────────────────┘   │
│                                        │
│  Every friend who plays through your   │
│  link = 1 VOTE point ($194K if we win) │
│                                        │
│  ┌────────────────┐  ┌──────────────┐  │
│  │  📋 COPY LINK  │  │  📱 SHARE    │  │
│  └────────────────┘  └──────────────┘  │
└────────────────────────────────────────┘
```

*Sierra verb*: `> CLICK yes` → "Congratulations. You have just done more for civilisation than most parliaments manage in a decade."
`> CLICK no` → "Interesting. You prefer the current ratio of 604 dollars on explosions per dollar on cures. The narrator judges you silently."

**Score**: `100,000,000` · **Inventory**: +`VOTE` (slot 3)

---

### Slide 17 — $0.06 (8s)

*Segment*: `script-5b2-asymmetry` · *Component*: `asymmetry` · *BG*: foreground

> "That vote took thirty seconds. At the global average hourly income, your time cost six cents. The upside if the Treaty passes: fifteen point seven million dollars. Per person. That is a ratio of two hundred and forty-five million to one. On my planet we just call it arithmetic."

*Visual*: Pixel art — Sierra merchant's shop. Wishonia behind counter in merchant robes. Left side: tiny copper pixel coin on velvet pad, "$0.06 — 30 seconds of your time." Right side: comically enormous gold pile extending off-screen, "$15,700,000 — lifetime income gain." Trade arrow between them. Flashing pixel text: "EXCHANGE RATE: 245,000,000 : 1." Wishonia's portrait: one eyebrow raised.

*Sierra verb*: `> TRADE 30 seconds FOR $15.7 million` → "The merchant stares at you. 'This is the most lopsided trade in the history of commerce. And I have been trading for 4,297 years.'"
`> HAGGLE` → "There is nothing to haggle. The trade is already infinitely in your favour."

**Score**: `200,000,000`

---

### Slide 18 — Level 3: Get All Your Friends to Play (15s)

*Segment*: `script-5c-share` · *Component*: `level-share` · *BG*: yellow

**[Quest notification: "⚔ LEVEL 3 — Get your friends to play. Tell two people."]**

> "Step three: get all your friends to play. Send them your link. When they play through your link, you earn one VOTE point. They get their own link and do the same. Tell two friends. They each tell two more. Twenty-eight rounds of this reaches 268 million players — the 3.5% tipping point. No campaign in history that reached this threshold has ever failed. And every new player who deposits grows the prize pool — which makes everyone more incentivized to make sure humanity actually wins."

*Visual*: Split into two halves.

**LEFT — The Concrete Action:**
Pixel-art phone screen. Player's message: "Play this → optimitron.com/r/player1". Friends "Sarah" and "Mike" reply: "🎮 I'm playing! My link: .../r/sarah" and "🎮 I'm playing! My link: .../r/mike." Notifications: "+1 VOTE POINT" "+1 VOTE POINT." Three platform icons below (text, WhatsApp, Twitter).

**RIGHT — The Exponential Effect:**
Doubling tree grows from the phone. 1→2→4→8→16. Accelerates. "Round 5: 32... Round 10: 1,024... Round 20: 1,048,576..." Threshold line "TIPPING POINT: 268M PLAYERS (3.5%)" flashes when hit. Prize pool counter grows in lockstep: "$10K... $1M... $100M... $10B..." Text: "The more people play, the bigger the prize pool, the more everyone has at stake."

Chain-link drops into inventory slot 4.

*Sierra verb*: `> TEXT sarah` → "'Play this game.' Sarah opens the link. Plays. Gets her own link. Sends it to two more friends. The prize pool just grew. Your VOTE points just got more valuable."
`> LOOK AT prize pool` → "Every new player who deposits makes the pool bigger. A bigger pool means more incentive for everyone to make sure the targets are hit. This is called a virtuous cycle. Your species usually creates the other kind."

**Score**: `500,000,000` · **Inventory**: +`REFERRAL LINK` (slot 4)

---

### Part 3: The Money

### Slide 19 — Better Than Your Retirement Fund (10s)

*Segment*: `script-6a-investment` · *Component*: `prize-investment` · *BG*: pink

> "Step four: deposit into the Earth Optimization Prize Pool. The pool is not sitting in a savings account. It is invested across the most innovative startup companies on Earth — achieving 17% annual growth. Your retirement fund is parked in sclerotic rent-seeking corporations earning 8%. The prize pool outperforms it by double. You were going to invest that money anyway. Invest it here, where the returns are better AND the side effect is curing all disease."

*Visual*: Pixel art — Sierra merchant's investment counter. Two options side by side:

```
┌──────────────────────────────────────────────────────┐
│  💰 INVESTMENT COMPARISON                            │
│                                                      │
│  ┌────────────────────────┐  ┌────────────────────┐  │
│  │  YOUR RETIREMENT FUND  │  │  PRIZE POOL        │  │
│  │                        │  │                    │  │
│  │  Old corporations      │  │  Innovative startups│  │
│  │  Rent-seeking, slow    │  │  High-growth, new   │  │
│  │  Return: 8% / year     │  │  Return: 17% / year │  │
│  │                        │  │                    │  │
│  │  $100 → $317 (15 yrs)  │  │  $100 → $1,110     │  │
│  │                        │  │  (15 yrs)          │  │
│  │  Side effect: nothing  │  │  Side effect:       │  │
│  │                        │  │  curing all disease │  │
│  └────────────────────────┘  └────────────────────┘  │
│                                                      │
│  The goal: build the biggest prize pool in history.  │
│  So every player on Earth is incentivized to win.    │
└──────────────────────────────────────────────────────┘
```

Right option glows green. Left looks grey and dull.

*Sierra verb*: `> COMPARE returns` → "8% in a retirement fund versus 17% in the prize pool. Your financial advisor will not tell you about this because your financial advisor works for the 8% companies."
`> DEPOSIT gold coin` → "Your money is now invested in companies building the future, instead of companies extracting rent from the past. Also, the side effect is saving civilisation."

**Score**: `650,000,000`

---

### Slide 20 — How the Prize Works (10s)

*Segment*: `script-6b-mechanism` · *Component*: `prize-mechanism` · *BG*: cyan

> "Deposit $100. Two things can happen. If Earth hits its targets by 2040, the pool unlocks and VOTE point holders split it — every friend you got to play is now worth $194,000 to you. If Earth misses, depositors get their money back plus all the yield that accrued — $100 becomes $1,110. Both paths pay. There is no path where you lose."

*Visual*: Pixel art — branching path (Sierra maze fork). Player's avatar at crossroads holding gold coin. Treasure chest at fork: "PRIZE POOL SMART CONTRACT." Two paths:

```
                         ┌─ 🌍 TARGETS HIT ──→ [pixel utopia]
                         │   Pool unlocks.
  YOU ($100) → [CHEST] ──┤   VOTE holders split it.
                         │
                         └─ ❌ TARGETS MISSED ─→ [pile of 11× gold]
                             Your $100 → $1,110 back.
                             (11× over 15 years at 17%)
```

BOTH paths glow green. No red path. No skull. Gold coin drops into inventory slot 5.

*Sierra verb*: `> LOOK AT paths` → "Both are green. In one path, your friends who played get paid. In the other, you get eleven times your money back. Your species has a word for this: 'free option.'"
`> LOOK AT chest` → "A dominant assurance contract. It multiplies your gold whether you win or lose. The only losing move is to not put anything in."

**Score**: `800,000,000` · **Inventory**: +`PRIZE DEPOSIT` (slot 5)

---

### Slide 21 — $194K Per Point (10s)

*Segment*: `script-6c-vote-value` · *Component*: `vote-point-value` · *BG*: yellow

> "Now for the VOTE points. Every friend you got to play earned you one point. Each point is worth $194,000 if the targets are hit. Two friends playing: $387,000. Ten friends: $1.9 million. Points cannot be bought. They can only be earned by getting real people to play the game. The more friends you bring in, the bigger the prize pool gets, the more valuable everyone's points become."

*Visual*: Pixel art — Sierra character stats screen:

```
┌────────────────────────────────────────────┐
│  ⚔️ CHARACTER — VOTE POINT LEDGER          │
│                                            │
│  POINTS EARNED:    2 (from friends playing)│
│  VALUE PER POINT:  $194,000                │
│  TOTAL IF HIT:     $387,000                │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  FRIENDS PLAYING TABLE              │  │
│  │  ───────────────────────────        │  │
│  │  2 friends   →  $387,000            │  │
│  │  5 friends   →  $970,000            │  │
│  │  10 friends  →  $1,940,000          │  │
│  │  50 friends  →  $9,700,000          │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ⚠ Points are NON-TRADABLE.               │
│  ⚠ Cannot be purchased. Ever.             │
│  ⚠ Earned ONLY by getting friends to play.│
│                                            │
│  More players → bigger pool → bigger prize │
│  → more incentive to make sure Earth wins  │
└────────────────────────────────────────────┘
```

Two silver tokens drop into inventory slot 6. Flywheel line at bottom rendered as pixel-art cycle arrow.

*Sierra verb*: `> LOOK AT points` → "Non-transferable. Non-purchasable. Earned by getting friends to play. The game gets more valuable the more people are in it. That is not a bug. It is the design."
`> SELL points` → "They cannot be sold. If they could be bought, the rich would own the game. The only way to earn them is to get another human being to care."

**Score**: `1,000,000,000` · **Inventory**: +`VOTE POINTS ×2` (slot 6)

---

### Slide 22 — You Cannot Lose (10s)

*Segment*: `script-6d-free-option` · *Component*: `prize-free-option` · *BG*: pink

> "But wait — if humanity wins, doesn't my deposit go to VOTE holders instead of back to me? Yes. And here is why that is fine. First: get even two friends to play and you have VOTE points worth $387,000 — far more than your deposit. Second: if humanity wins, everyone is 10× richer. Your $100 deposit vanishes into a world where your lifetime income just increased by $15.7 million. You do not mourn the $100. The break-even probability is one in fifteen thousand. The only way to lose is not to play."

*Visual*: Sierra summary/stats screen — three outcomes:

```
┌───────────────────────────────────────────────────────┐
│  📊 WORKED EXAMPLE — $100 DEPOSIT + 2 FRIENDS PLAYING │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ✅ HUMANITY WINS                                │  │
│  │     Your deposit: goes to VOTE holders (not you) │  │
│  │     Your VOTE points: 2 × $194K = $387,000      │  │
│  │     Your lifetime income: +$15.7 MILLION         │  │
│  │     Everyone is 10× richer. You don't miss $100. │  │
│  │     NET: +$16,087,000                            │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ✅ HUMANITY MISSES (targets not hit)            │  │
│  │     VOTE points: expire ($0)                     │  │
│  │     Your deposit: $100 → $1,110 (11× yield)     │  │
│  │     Still outperforms your retirement fund (3.5×)│  │
│  │     NET: +$1,010                                 │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ❌ DID NOT PLAY                                 │  │
│  │     $0 returned. $0 earned.                      │  │
│  │     Still paying $12,600/yr dysfunction tax.     │  │
│  │     Missed $15.7M in lifetime income.            │  │
│  │     NET: -$15,700,000 (opportunity cost)         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  Break-even probability: 0.007% (1 in 15,000)        │
│  Lottery odds: 1 in 300,000,000                       │
│  This is 20,000× better with no downside.             │
└───────────────────────────────────────────────────────┘
```

First ✅ box glows brightest — BEST outcome. "+$15.7 MILLION" overwhelms "deposit goes to VOTE holders." ❌ box dim red — the real loss is the opportunity cost.

*Sierra verb*: `> CALCULATE odds` → "One in fifteen thousand. Your species buys lottery tickets at one in three hundred million. This is twenty thousand times better odds. And the downside is still 11× your money."
`> WORRY ABOUT deposit` → "Your deposit goes to VOTE holders if humanity wins. You also got $15.7 million richer. On my planet we call this a good trade."

**Score**: `1,500,000,000`

---

### Part 4: The Accountability

### Slide 23 — The Leaderboard (10s)

*Segment*: `script-8-leaderboard` · *Component*: `government-leaderboard` · *BG*: background

> "Every politician ranked by the ratio of spending they have voted for: mass murder capacity versus clinical trial funding. A single number. Public. Immutable. On-chain."

*Visual*: Pixel art — Sierra high-score table on ornate wooden frame (inn's notice board, King's Quest). Title: "ALIGNMENT HIGH SCORES." Each row: pixel country flag, politician name, alignment score as pixel bar graph. Top rows green (high alignment). Bottom rows red (low). Table scrolls upward. Column headers: "RANK / NATION / LEADER / ALIGNMENT SCORE / MILITARY:TRIALS RATIO."

Magnifying glass drops into inventory slot 8.

*Sierra verb*: `> LOOK AT leaderboard` → "Some of these scores are impressively low. It takes real commitment to be this misaligned."
`> SORT BY worst` → "Sorting by worst score. The competition for last place is fierce."

**Score**: `3,000,000,000` · **Inventory**: +`ALIGNMENT SCORE` (slot 8). Inventory is now FULL.

---

### Slide 24 — We Changed the Metric (8s)

*Segment*: `script-8b-metric` · *Component*: `metric-changed` · *BG*: foreground

> "Your leaders are not evil. They are just optimising for the wrong metric. We changed the metric."

*Visual*: Pixel art — close-up of high-score table. Header "RE-ELECTION PROBABILITY" visible. Pixel red X slashes through it. New header typewriters in: "CITIZEN ALIGNMENT SCORE." Numbers scramble and resettle. Rankings shuffle. Top entry blinks green.

Single devastating line in narrator box. Maximum whitespace. Typewriter slower than usual — each word lands.

**Score**: `4,000,000,000`

---

### Part 5: The Climax

### Slide 25 — Your $15.7 Million (10s)

*Segment*: `script-7-personal-upside` · *Component*: `personal-upside` · *BG*: yellow

> "If the 1% Treaty passes, your lifetime income gains are $15.7 million. Per person. Not per country. Per person. You currently lose $12,600 a year to political dysfunction — that is your share of the $101 trillion bug. This is not philanthropy. This is the largest investment opportunity in the history of your species. And the cost of not playing is $15.7 million."

*Visual*: Pixel art — three Sierra save-game slots, each with tiny pixel scene and stats:

```
┌────────────────────────────────────────────────────┐
│  💾 SAVE SLOTS — CHOOSE YOUR TIMELINE              │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │ SLOT 1: STATUS QUO                  [LOADED] │  │
│  │ [grey city, smog, tiny people]               │  │
│  │ Lifetime income:  $1.34M                     │  │
│  │ HALE gain:        +0 years                   │  │
│  │ Dysfunction tax:  -$12,600/yr                │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ SLOT 2: 1% TREATY                    ◄◄◄    │  │
│  │ [bright city, parks, hospitals]              │  │
│  │ Lifetime income:  $15.7M  (12×)              │  │
│  │ HALE gain:        +6.5 years                 │  │
│  │ Dysfunction tax:  eliminated                 │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ SLOT 3: WISHONIA TRAJECTORY                  │  │
│  │ [pixel utopia, gleaming towers, forests]     │  │
│  │ Lifetime income:  $54.3M  (40×)              │  │
│  │ HALE gain:        +15.7 years                │  │
│  │ Dysfunction tax:  what is that               │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  You are currently on Slot 1.                      │
│  You chose it by not choosing.                     │
└────────────────────────────────────────────────────┘
```

Each slot has pixel-art scene matching its trajectory. Glowing deed drops into inventory slot 7.

*Sierra verb*: `> LOOK AT slot 1` → "Status quo. $1.34 million lifetime income. You are losing $12,600 a year to a system bug."
`> LOOK AT slot 3` → "$54.3 million. My planet chose this 4,297 years ago. We have not regretted it."
`> LOAD slot 2` → "You cannot load it from here. You have to earn it. That is rather the point of the game."

**Score**: `6,000,000,000` · **Inventory**: +`$15.7M CLAIM` (slot 7)

---

## ACT III — THE ENDGAME

### Slide 26 — Under the Hood (8s)

*Segment*: `script-10-architecture` · *Component*: `architecture-stats` · *BG*: background

> "Under the hood: 15 packages, 2,600+ tests, domain-agnostic causal inference, full TypeScript monorepo. Storacha for immutable content-addressed storage. Hypercerts for verifiable attestations. Solidity for enforceable incentives. Everything is auditable. Nothing relies on trusting us."

*Visual*: Pixel art — Wishonia's engineering bay / space station engine room. Five pixel monitors: (1) code scrolling — "15 PACKAGES", (2) green checkmarks cascading — "2,600+ TESTS", (3) blockchain viz — "SOLIDITY", (4) content-addressed blocks — "STORACHA", (5) hypercert badges — "HYPERCERTS." Wishonia in center with clipboard.

*Sierra verb*: `> LOOK AT source code` → "Open source. Auditable. Unlike your government's budget. Or their promises."
`> LOOK AT tests` → "2,600 tests. All passing. On my planet this is the bare minimum. Here it appears to be remarkable."

---

### Slide 27 — 10.7 Billion Lives (10s)

*Segment*: `script-10b-lives` · *Component*: `lives-saved` · *BG*: cyan

> "10.7 billion lives saved over the acceleration window. 5.65 billion disability-adjusted life years per percentage point you shift the probability. Every share, every vote, every conversation moves that number. The question is not whether your effort matters. It is how many hundred million lives it is worth."

*Visual*: Pixel art — planet from slide 1 returns, but transforming. Cemetery crosses being replaced one by one — each morphs into a tiny pixel person standing up, grey to green. Counter ticks: "LIVES SAVED: 10,700,000,000." Planet's palette shifts from EGA dark to VGA bright. Quest meters nearly full. Death ticker slowing.

*Sierra verb*: `> COUNT lives` → "More than the total number of humans who have ever lived. That is what is at stake. No pressure."

**Score**: `7,500,000,000`

---

### Slide 28 — The Close (12s)

*Segment*: `script-11-close` · *Component*: `close` · *BG*: pink

> "Your governments are the most powerful artificial intelligences your species has ever built. They process more information, control more resources, and make more consequential decisions than any LLM. And they are misaligned."

*Visual*: Full planet view from space. Halfway transformed — bright continents where pixel people stand, dark where crosses remain. Death counter still ticking but slower. Stars twinkling. Wishonia's portrait shifts from sardonic to something approaching sincerity — the only time in the entire demo. Dramatic pause after "misaligned." Two seconds of just the image breathing.

**[Beat. Then:]**

> "The Earth Optimization Game. Alignment software for the most powerful AIs on your planet — the ones made of people."

*Visual*: Sierra title screen returns from slide 3 — same gold font, same starfield. Score: `8,000,000,000 of 8,000,000,000`. Quest meters: 100%. All 8 inventory slots full and glowing. Final dialog:

```
┌─────────────────────────────────────────┐
│  C O N G R A T U L A T I O N S !       │
│                                         │
│  You have completed                     │
│  THE EARTH OPTIMIZATION GAME            │
│                                         │
│  Final score:  8,000,000,000            │
│  Lives saved:  all of them              │
│  HALE:         69.8 years ✓             │
│  Income:       $149,000 ✓              │
│  Time played:  3 minutes                │
│  Inventory:    8/8                       │
│                                         │
│  ┌────────────────────┐                 │
│  │    PLAY NOW →      │                 │
│  └────────────────────┘                 │
│                                         │
│  optimitron.com       github.com/...    │
└─────────────────────────────────────────┘
```

Music resolves to a single held chord. "PLAY NOW" pulses. Silence.

**Score**: `8,000,000,000`

---

### Slide 29 — Post-Credits Easter Egg (5s)

*Segment*: `script-easter-egg` · *Component*: `easter-egg` · *BG*: foreground

**[2 seconds of black. UI chrome disappears. Total darkness. Then just the narrator box fades in:]**

> "Oh, and if you're wondering — yes, this is the actual game. You're playing it right now. The demo was level one."

*Visual*: Narrator text box on pure black. Wishonia's portrait: faintest smirk — one pixel of mouth moved upward. Cursor blinks. Nothing else. Hold 3 seconds, then fade.

---

## Extended Slides (5-min version)

Slot in after slide 21 for a longer cut.

### Slide E1 — 50,300× More Cost-Effective (10s)

*Segment*: `ext-cost-effectiveness` · *BG*: background

> "The cost per disability-adjusted life year for this campaign is $0.00177. Bed nets — the gold standard — cost $89 per DALY. This is 50,300 times more cost-effective. Even risk-adjusted at 1% success probability, it is still 503 times more cost-effective. The maths is not ambiguous."

*Visual*: Sierra shop comparison:

```
┌────────────────────────────────────────────────┐
│  COST-EFFECTIVENESS SHOP                       │
│                                                │
│  ┌──────────────────┐  ┌────────────────────┐  │
│  │ 🪰 BED NETS      │  │ 📜 1% TREATY       │  │
│  │ $89 / DALY       │  │ $0.00177 / DALY    │  │
│  │ ★★★★★ (gold std) │  │ ★ × 50,300         │  │
│  └──────────────────┘  └────────────────────┘  │
│                                                │
│  Risk-adjusted (1% prob): still 503×.          │
└────────────────────────────────────────────────┘
```

*Sierra verb*: `> BUY bed nets` → "Excellent choice. Now buy 50,300 of them. Or just fund one treaty campaign."

---

### Slide E2 — Incentive Alignment Bonds (15s)

*Segment*: `ext-iab` · *BG*: cyan

> "Incentive Alignment Bonds. Sell one billion dollars of these. Use the proceeds to fund the 1% Treaty campaign. Treaty inflows — $27 billion annually — split 80/10/10: clinical trials, bond holders, SuperPAC."

*Visual*: Sierra merchant. "IAB TRADER" NPC. Crafting recipe: `BONDS ($1B)` + `TREATY PASSED` → `80% TRIALS ($21.6B)` + `10% RETURNS ($2.7B)` + `10% SUPERPAC ($2.7B)`.

*Sierra verb*: `> BUY bonds` → "The campaign costs one billion. The treaty generates twenty-seven billion per year. Indefinitely."

---

### Slide E3 — The SuperPAC (10s)

*Segment*: `ext-superpac` · *BG*: pink

> "The SuperPAC funds politicians algorithmically — based on their Citizen Alignment Score. Politicians earn campaign funding by voting for the treaty. Not by attending donor dinners."

*Visual*: Leaderboard from slide 20, but gold coins rain to highest-ranked politicians. Lowest get nothing. Pixel gear/brain icon "SMART CONTRACT" replaces lobbyist. Crossed-out lobbyist in corner holding empty dinner invitation.

*Sierra verb*: `> TALK TO lobbyist` → "The lobbyist has been replaced by a smart contract. It does not accept dinner invitations. Or bribes. Or phone calls."

---

### Slide E4 — Optimal Policy Tools (12s)

*Segment*: `ext-policy-tools` · *BG*: yellow

> "For the politicians who want to align: the Optimal Budget Generator and Optimal Policy Generator. Time-series data across hundreds of jurisdictions — which policies actually increased median income and healthy life years. Not which were popular. Which worked. All free. All open."

*Visual*: KQ6 puzzle room. Three machines: "POLICY GENERATOR", "BUDGET OPTIMIZER", "OUTCOME COMPARATOR." Wishonia with wrench.

*Sierra verb*: `> USE policy generator` → "It analyses what actually worked. A novel concept for your species."

---

## Sections Cut from All Versions

| Section | Why Cut | Available In |
|---------|---------|--------------|
| Agency report cards | YouTube series | `youtube-agency-grades` |
| Historical waste (War on Terror, War on Drugs) | Too detailed for pitch | `full-demo` |
| Viral doubling model (detailed) | Own video | `youtube-prize` |
| $WISH token / UBI mechanics | Separate instrument | `youtube-treasury` |
| FDA invisible graveyard | Too heavy for pitch | `full-demo` |
| Government lies (Tuskegee, MK-Ultra, etc.) | Off-topic for hackathon | `youtube-government-lies` |

---

## Technical Notes

### Sierra Implementation
- **Resolution**: 320×200 upscaled to 1920×1080 with nearest-neighbor (no smoothing)
- **Color palette**: EGA 16-color for Act I, VGA 256 for Acts II–III (palette upgrade IS the tonal shift at slide 7)
- **Font**: Sierra bitmap for narrator box. Arcade font for headers/score/quest meters.
- **Text speed**: ~30 chars/sec typewriter. Click to skip.
- **Cursor**: Custom CSS — eye (look), hand (use), boots (walk), speech bubble (talk)
- **Sound**: Chiptune soundtrack. Death jingle for Game Over. "Cha-ching" for items. Rising pitch on quest meters.
- **Portrait**: Wishonia 48×48 pixel art, slightly animated (blinking, eyebrow, one smirk in post-credits)
- **Quest meters**: HALE + Income progress bars. Hidden Act I. Appear at slide 7. Fill through Act II. 100% at completion.

### General
- Each slide is a full-viewport component — no scrolling, no page navigation
- `/demo?playlist=hackathon` plays all slides with auto-advance
- **Cold open**: Slide 1 death ticker starts 3s before Sierra chrome appears
- **The Turn**: Slide 6→7 — death jingle → restore sound → EGA→VGA → quest meters appear
- **Title bookend**: "THE EARTH OPTIMIZATION GAME" in slide 3 (intro) and slide 25 (close)
- **Narrative ordering**: Never introduce a value before its mechanism. Prize pool → VOTE point value.
- **One concept per slide**: If a slide explains two things, split it.
- **Act II climax**: $15.7M personal upside is the LAST slide before Act III — it's the gut punch.
- **Post-credits**: Slide 26 plays after 2s black gap
- TTS narration via `packages/web/src/lib/demo-tts.ts`
- Politician leaderboard uses real data — the numbers are the joke
