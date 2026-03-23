/**
 * Centralized game messaging — single source of truth for all copy.
 * Change a string here, it updates everywhere.
 */

export const CTA = {
  playTheGame: "Play the Game",
  insertCoin: "Insert Coin",
  viewScoreboard: "View Scoreboard",
  highScores: "High Scores",
  readThePaper: "Read the Full Paper",
  readTheManual: "Read the Manual",
  makeAllocation: "Make Your Allocation",
  expressPreferences: "Express Your Preferences",
  startVoting: "Start Voting",
  checkAlignment: "Check Alignment",
  openChat: "Open Chat",
  browseStudies: "Browse Studies",
  seeTheMmyths: "See the Myths",
  politicianLeaderboard: "Politician Leaderboard",
} as const;

export const TAGLINES = {
  gameObjective:
    "Redirect Earth's resources from the things making you poorest and deadest to the things that make you healthiest and wealthiest.",
  onlyWayToLose: "The only way to lose is to not play.",
  hedgeLine: "Your deposit is a hedge against your own species.",
  arcadeHook:
    "The only arcade game where you get your coins back 11x if you lose.",
  winBothWays:
    "Recruit voters too and you win in both scenarios. The only losing move is not playing.",
} as const;

export const ARCADE_LABELS = {
  gameTitle: "The Earth Optimization Game",
  insertCoin: "Insert Coin to Play",
  gameOverWin: "Game Over — You Win",
  gameOverLose: "Game Over — You Lose",
  selectMode: "Select Mode",
  versusMode: "Versus Mode",
  bossFight: "Boss Fight",
  playerStats: "Player Stats",
  playerProfile: "Player Profile",
  highScores: "High Scores",
  winConditions: "Win Conditions",
  gameStatus: "Game Status",
  howToPlay: "How to Play",
  armory: "The Armory",
  itemShop: "Item Shop",
} as const;

export const ARMORY = {
  pageTitle: "The Armory",
  itemCount: (n: number) => `${n} Items Available`,
  shopkeeperGreeting:
    "Welcome, hero. Everything here is designed to make your species slightly less terrible at governing itself. Browse. Equip. Try not to break anything.",
  shopkeeperFooter:
    "You're still here? Go equip something. The metrics won't move themselves.",
  shelves: {
    weapons: {
      heading: "Weapons",
      subtitle: "Data in. Optimal policy out. No opinions. No committees. Just maths.",
    },
    scrolls: {
      heading: "Scrolls",
      subtitle: "Nobody asked 8 billion people what they actually want. These fix that.",
    },
    gold: {
      heading: "Gold & Loot",
      subtitle: "Diagnosing the problem is step one. These make fixing it profitable.",
    },
    seals: {
      heading: "Seals & Wards",
      subtitle: "Accountability that can't be argued with because it's on-chain.",
    },
    potions: {
      heading: "Potions",
      subtitle: "The same causal inference that works on countries works on you.",
    },
  },
} as const;
