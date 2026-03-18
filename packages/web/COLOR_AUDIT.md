# Color Audit — Off-Brand Colors TODO

Generated: 2026-03-18
Total violations: 316

## Summary
- [ ] **11** Opacity modifiers on black/white → Use semantic tokens: `text-muted-foreground`, `text-foreground`, `bg-muted`
- [ ] **147** Hardcoded bg-white / text-white → Use `bg-background` / `text-background` or `text-primary-foreground`
- [ ] **0** Soft shadows (rgba opacity < 1) → Use `rgba(0,0,0,1)` for brutal hard shadows
- [ ] **113** Tailwind color scale classes → Use brutal-* tokens (`brutal-pink`, `brutal-cyan`, `brutal-yellow`, `brutal-red`) or semantic tokens (`primary`, `muted`, `destructive`)
- [ ] **45** Hardcoded hex colors → Use CSS custom property / brutal token instead
- [ ] **0** Hardcoded bg-black / text-black → Use `bg-foreground` / `text-foreground` for dark-mode compatibility

## Suggested Replacements

| Off-brand pattern | Replacement |
|---|---|
| `text-black/50`, `text-black/60` | `text-muted-foreground` |
| `text-black/80`, `text-black/90` | `text-foreground` |
| `bg-white` | `bg-background` |
| `text-white` | `text-primary-foreground` or `text-background` |
| `bg-black` | `bg-foreground` |
| `text-black` | `text-foreground` |
| `rgba(0,0,0,0.3)` | `rgba(0,0,0,1)` (brutal shadow) |
| `bg-gray-*`, `text-gray-*` | `bg-muted` / `text-muted-foreground` |
| `bg-emerald-*`, `bg-green-*` | `bg-brutal-cyan` or semantic token |
| `bg-red-*`, `text-red-*` | `bg-brutal-red` / `text-destructive` |
| `bg-yellow-*`, `bg-amber-*` | `bg-brutal-yellow` |
| `bg-pink-*`, `bg-rose-*` | `bg-brutal-pink` |
| `bg-blue-*`, `bg-cyan-*`, `bg-sky-*` | `bg-brutal-cyan` |
| Hardcoded hex (`#ef4444`, `#666`) | CSS variable / brutal token |

## By File

### app/about/page.tsx
- [ ] Line 28: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 30: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 154: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 238: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 247: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 349: `text-white` — Hardcoded bg-white / text-white

### app/api/og/referral/route.tsx
- [ ] Line 85: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 104: `#666` — Hardcoded hex colors

### app/budget/[slug]/page.tsx
- [ ] Line 293: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 615: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 661: `text-white` — Hardcoded bg-white / text-white

### app/budget/page.tsx
- [ ] Line 155: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 163: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 194: `text-white` — Hardcoded bg-white / text-white

### app/compare/page.tsx
- [ ] Line 113: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 261: `text-white` — Hardcoded bg-white / text-white

### app/department-of-war/page.tsx
- [ ] Line 198: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 232: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 254: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 268: `text-white` — Hardcoded bg-white / text-white

### app/federal-reserve/page.tsx
- [ ] Line 33: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 57: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 200: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 209: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 241: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 290: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 415: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 421: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 466: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 485: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 504: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 523: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 589: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 605: `text-white` — Hardcoded bg-white / text-white

### app/iab/page.tsx
- [ ] Line 63: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 98: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 121: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 142: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 145: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 308: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 333: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 346: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 441: `text-white` — Hardcoded bg-white / text-white

### app/misconceptions/page.tsx
- [ ] Line 36: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 49: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 188: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 219: `text-white` — Hardcoded bg-white / text-white

### app/money/page.tsx
- [ ] Line 23: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 55: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 226: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 241: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 256: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 271: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 345: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 359: `text-white` — Hardcoded bg-white / text-white

### app/policies/[slug]/page.tsx
- [ ] Line 192: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 260: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 315: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 401: `text-white` — Hardcoded bg-white / text-white

### app/policies/page.tsx
- [ ] Line 127: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 195: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 228: `text-white` — Hardcoded bg-white / text-white

### app/prize/page.tsx
- [ ] Line 57: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 219: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 246: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 279: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 342: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 353: `bg-red-50` — Tailwind color scale classes
- [ ] Line 354: `text-red-600` — Tailwind color scale classes
- [ ] Line 359: `text-red-700` — Tailwind color scale classes
- [ ] Line 363: `text-red-700` — Tailwind color scale classes
- [ ] Line 367: `text-red-700` — Tailwind color scale classes
- [ ] Line 372: `bg-green-50` — Tailwind color scale classes
- [ ] Line 373: `text-green-700` — Tailwind color scale classes
- [ ] Line 378: `text-green-700` — Tailwind color scale classes
- [ ] Line 382: `text-green-700` — Tailwind color scale classes
- [ ] Line 386: `text-green-700` — Tailwind color scale classes
- [ ] Line 390: `text-green-700` — Tailwind color scale classes
- [ ] Line 518: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 555: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 701: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 712: `text-white` — Hardcoded bg-white / text-white

### app/referendum/[slug]/page.tsx
- [ ] Line 74: `bg-green-50` — Tailwind color scale classes
- [ ] Line 75: `text-green-700` — Tailwind color scale classes
- [ ] Line 78: `text-green-700` — Tailwind color scale classes
- [ ] Line 82: `bg-red-50` — Tailwind color scale classes
- [ ] Line 83: `text-red-700` — Tailwind color scale classes
- [ ] Line 86: `text-red-700` — Tailwind color scale classes

### app/referendum/[slug]/referendum-vote-client.tsx
- [ ] Line 99: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 151: `border-red-600` — Tailwind color scale classes
- [ ] Line 151: `bg-red-50` — Tailwind color scale classes
- [ ] Line 152: `text-red-700` — Tailwind color scale classes
- [ ] Line 168: `text-white` — Hardcoded bg-white / text-white

### app/transparency/page.tsx
- [ ] Line 28: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 76: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 191: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 212: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 251: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 322: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 379: `text-white` — Hardcoded bg-white / text-white

### components/Navbar.tsx
- [ ] Line 91: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 164: `text-white` — Hardcoded bg-white / text-white

### components/animations/GdpTrajectoryChart.tsx
- [ ] Line 111: `#e5e7eb` — Hardcoded hex colors
- [ ] Line 119: `#6b7280` — Hardcoded hex colors
- [ ] Line 132: `#e5e7eb` — Hardcoded hex colors
- [ ] Line 140: `#6b7280` — Hardcoded hex colors
- [ ] Line 165: `#dc2626` — Hardcoded hex colors
- [ ] Line 177: `#dc2626` — Hardcoded hex colors
- [ ] Line 189: `#059669` — Hardcoded hex colors
- [ ] Line 206: `#dc2626` — Hardcoded hex colors
- [ ] Line 221: `#059669` — Hardcoded hex colors
- [ ] Line 222: `#059669` — Hardcoded hex colors
- [ ] Line 225: `#dc2626` — Hardcoded hex colors
- [ ] Line 226: `#dc2626` — Hardcoded hex colors
- [ ] Line 237: `#374151` — Hardcoded hex colors
- [ ] Line 246: `#374151` — Hardcoded hex colors

### components/animations/LiveDeathTicker.tsx
- [ ] Line 110: `text-white/25` — Opacity modifiers on black/white

### components/chat/VoiceChatOverlay.tsx
- [ ] Line 117: `#00e5ff` — Hardcoded hex colors
- [ ] Line 117: `#ff4081` — Hardcoded hex colors

### components/dashboard/ConnectedAccountsCard.tsx
- [ ] Line 32: `#1DA1F2` — Hardcoded hex colors
- [ ] Line 38: `#5865F2` — Hardcoded hex colors
- [ ] Line 44: `#0088CC` — Hardcoded hex colors
- [ ] Line 50: `#627EEA` — Hardcoded hex colors
- [ ] Line 56: `#0052FF` — Hardcoded hex colors

### components/dashboard/EmailSignatureCard.tsx
- [ ] Line 33: `#666` — Hardcoded hex colors
- [ ] Line 35: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 37: `#999` — Hardcoded hex colors

### components/dashboard/OrganizationEmailSignatureCard.tsx
- [ ] Line 22: `#666` — Hardcoded hex colors
- [ ] Line 24: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 26: `#999` — Hardcoded hex colors

### components/dashboard/ProfileCard.tsx
- [ ] Line 248: `text-red-600` — Tailwind color scale classes

### components/iab/IABDeposit.tsx
- [ ] Line 300: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 380: `bg-green-50` — Tailwind color scale classes
- [ ] Line 446: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 480: `bg-green-100` — Tailwind color scale classes
- [ ] Line 493: `text-green-700` — Tailwind color scale classes
- [ ] Line 502: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 502: `bg-green-600` — Tailwind color scale classes
- [ ] Line 502: `bg-green-700` — Tailwind color scale classes
- [ ] Line 508: `text-green-700` — Tailwind color scale classes

### components/landing/AlignmentTeaser.tsx
- [ ] Line 27: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 42: `text-white` — Hardcoded bg-white / text-white

### components/landing/DecentralizedFDASection.tsx
- [ ] Line 109: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 156: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 173: `text-white` — Hardcoded bg-white / text-white

### components/landing/EarthOptimizationPrizeSection.tsx
- [ ] Line 12: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 85: `text-white` — Hardcoded bg-white / text-white

### components/landing/IABCalculator.tsx
- [ ] Line 87: `text-white` — Hardcoded bg-white / text-white

### components/landing/ImplementationPlanSection.tsx
- [ ] Line 66: `text-white` — Hardcoded bg-white / text-white

### components/landing/IncentiveAlignmentBondsSection.tsx
- [ ] Line 47: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 67: `text-white` — Hardcoded bg-white / text-white

### components/landing/IncentiveFeedbackLoop.tsx
- [ ] Line 38: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 110: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 171: `bg-black/40` — Opacity modifiers on black/white
- [ ] Line 189: `bg-emerald-100` — Tailwind color scale classes
- [ ] Line 213: `bg-black/40` — Opacity modifiers on black/white
- [ ] Line 255: `#8634` — Hardcoded hex colors

### components/landing/InvisibleGraveyardSection.tsx
- [ ] Line 52: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 69: `text-white` — Hardcoded bg-white / text-white

### components/landing/MythVsDataTeaser.tsx
- [ ] Line 41: `text-white` — Hardcoded bg-white / text-white

### components/landing/NaturalExperimentsChart.tsx
- [ ] Line 91: `text-white` — Hardcoded bg-white / text-white

### components/landing/OnePercentTreatySection.tsx
- [ ] Line 84: `text-white` — Hardcoded bg-white / text-white

### components/landing/PersonalIncomeChart.tsx
- [ ] Line 24: `#00c8c8` — Hardcoded hex colors
- [ ] Line 32: `#f472b6` — Hardcoded hex colors
- [ ] Line 185: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 216: `#0001` — Hardcoded hex colors
- [ ] Line 257: `#ef4444` — Hardcoded hex colors
- [ ] Line 288: `#ef4444` — Hardcoded hex colors
- [ ] Line 304: `#ef4444` — Hardcoded hex colors

### components/landing/PoliticalDysfunctionTaxSection.tsx
- [ ] Line 69: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 84: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 85: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 95: `text-white` — Hardcoded bg-white / text-white

### components/landing/TwoFuturesSection.tsx
- [ ] Line 180: `text-white` — Hardcoded bg-white / text-white

### components/landing/WarVsCuresChart.tsx
- [ ] Line 75: `text-white` — Hardcoded bg-white / text-white

### components/notifications/PushNotificationPrompt.tsx
- [ ] Line 96: `text-white` — Hardcoded bg-white / text-white

### components/organizations/OrganizationForm.tsx
- [ ] Line 105: `bg-red-100` — Tailwind color scale classes
- [ ] Line 105: `border-red-500` — Tailwind color scale classes
- [ ] Line 105: `text-red-700` — Tailwind color scale classes

### components/prize/CitizenDashboard.tsx
- [ ] Line 149: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 197: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 219: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 241: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 380: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 415: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 495: `text-white` — Hardcoded bg-white / text-white

### components/prize/PrizeCTA.tsx
- [ ] Line 9: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 11: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 13: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 13: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 22: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 22: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 31: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 31: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 36: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 38: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 40: `text-white` — Hardcoded bg-white / text-white

### components/prize/ShareTemplatesCard.tsx
- [ ] Line 47: `text-green-700` — Tailwind color scale classes
- [ ] Line 95: `text-white` — Hardcoded bg-white / text-white

### components/prize/VoteTokenBalanceCard.tsx
- [ ] Line 33: `bg-green-100` — Tailwind color scale classes
- [ ] Line 33: `text-green-800` — Tailwind color scale classes
- [ ] Line 36: `bg-red-100` — Tailwind color scale classes
- [ ] Line 36: `text-red-700` — Tailwind color scale classes
- [ ] Line 87: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 97: `bg-red-50` — Tailwind color scale classes
- [ ] Line 98: `text-red-700` — Tailwind color scale classes

### components/prize/VoterPrizeTreasuryDeposit.tsx
- [ ] Line 364: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 453: `bg-green-50` — Tailwind color scale classes
- [ ] Line 519: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 578: `text-green-700` — Tailwind color scale classes
- [ ] Line 588: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 588: `bg-green-600` — Tailwind color scale classes
- [ ] Line 588: `bg-green-700` — Tailwind color scale classes
- [ ] Line 596: `text-green-700` — Tailwind color scale classes
- [ ] Line 608: `bg-green-100` — Tailwind color scale classes
- [ ] Line 621: `text-green-700` — Tailwind color scale classes
- [ ] Line 631: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 631: `bg-green-600` — Tailwind color scale classes
- [ ] Line 631: `bg-green-700` — Tailwind color scale classes
- [ ] Line 639: `text-green-700` — Tailwind color scale classes

### components/profile/ProfileHub.tsx
- [ ] Line 59: `bg-green-200` — Tailwind color scale classes

### components/referendum/ReferendumVoteSection.tsx
- [ ] Line 104: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 117: `bg-green-50` — Tailwind color scale classes
- [ ] Line 192: `border-red-600` — Tailwind color scale classes
- [ ] Line 192: `bg-red-50` — Tailwind color scale classes
- [ ] Line 192: `text-red-700` — Tailwind color scale classes
- [ ] Line 200: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 200: `bg-green-500` — Tailwind color scale classes
- [ ] Line 207: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 207: `bg-red-500` — Tailwind color scale classes

### components/scoreboard/CitizenPrioritiesChart.tsx
- [ ] Line 20: `bg-green-400` — Tailwind color scale classes
- [ ] Line 21: `bg-purple-400` — Tailwind color scale classes
- [ ] Line 22: `bg-orange-400` — Tailwind color scale classes
- [ ] Line 23: `bg-blue-400` — Tailwind color scale classes
- [ ] Line 24: `bg-rose-400` — Tailwind color scale classes
- [ ] Line 25: `bg-emerald-400` — Tailwind color scale classes
- [ ] Line 26: `bg-amber-400` — Tailwind color scale classes
- [ ] Line 27: `bg-violet-400` — Tailwind color scale classes
- [ ] Line 28: `bg-teal-400` — Tailwind color scale classes
- [ ] Line 29: `bg-indigo-400` — Tailwind color scale classes
- [ ] Line 30: `bg-lime-400` — Tailwind color scale classes
- [ ] Line 31: `bg-fuchsia-400` — Tailwind color scale classes

### components/scoreboard/ScoreboardTable.tsx
- [ ] Line 28: `bg-green-500` — Tailwind color scale classes
- [ ] Line 28: `text-green-900` — Tailwind color scale classes
- [ ] Line 28: `border-green-600` — Tailwind color scale classes
- [ ] Line 29: `bg-yellow-400` — Tailwind color scale classes
- [ ] Line 29: `text-yellow-900` — Tailwind color scale classes
- [ ] Line 29: `border-yellow-600` — Tailwind color scale classes
- [ ] Line 30: `bg-red-500` — Tailwind color scale classes
- [ ] Line 30: `text-red-900` — Tailwind color scale classes
- [ ] Line 30: `border-red-600` — Tailwind color scale classes
- [ ] Line 34: `bg-green-500` — Tailwind color scale classes
- [ ] Line 35: `bg-yellow-500` — Tailwind color scale classes
- [ ] Line 36: `bg-red-500` — Tailwind color scale classes

### components/shared/ResourcePromoCard.tsx
- [ ] Line 27: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 27: `#1DB954` — Hardcoded hex colors
- [ ] Line 36: `#FF9900` — Hardcoded hex colors

### components/shared/SearchableList.tsx
- [ ] Line 68: `border-red-500` — Tailwind color scale classes
- [ ] Line 68: `bg-red-100` — Tailwind color scale classes
- [ ] Line 69: `text-red-700` — Tailwind color scale classes

### components/sharing/social-share-buttons.tsx
- [ ] Line 22: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 22: `text-white` — Hardcoded bg-white / text-white

### components/treasury/DistributeUBICard.tsx
- [ ] Line 104: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 104: `text-white` — Hardcoded bg-white / text-white

### components/treasury/TreasuryAllocationViz.tsx
- [ ] Line 10: `bg-green-400` — Tailwind color scale classes
- [ ] Line 11: `bg-purple-400` — Tailwind color scale classes
- [ ] Line 12: `bg-orange-400` — Tailwind color scale classes
- [ ] Line 13: `bg-blue-400` — Tailwind color scale classes
- [ ] Line 14: `bg-rose-400` — Tailwind color scale classes
- [ ] Line 15: `bg-emerald-400` — Tailwind color scale classes
- [ ] Line 16: `bg-amber-400` — Tailwind color scale classes
- [ ] Line 17: `bg-violet-400` — Tailwind color scale classes
- [ ] Line 18: `bg-teal-400` — Tailwind color scale classes
- [ ] Line 90: `text-white` — Hardcoded bg-white / text-white

### components/treasury/UBIRegistrationCard.tsx
- [ ] Line 58: `bg-green-50` — Tailwind color scale classes
- [ ] Line 60: `text-green-600` — Tailwind color scale classes
- [ ] Line 125: `text-green-600` — Tailwind color scale classes
- [ ] Line 126: `text-green-600` — Tailwind color scale classes
- [ ] Line 163: `text-red-600` — Tailwind color scale classes
- [ ] Line 166: `text-green-600` — Tailwind color scale classes

### components/treasury/WishocracyLinkCard.tsx
- [ ] Line 10: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 31: `text-white` — Hardcoded bg-white / text-white

### components/ui/alert-dialog.tsx
- [ ] Line 21: `bg-black/80` — Opacity modifiers on black/white

### components/ui/amount-selector.tsx
- [ ] Line 24: `text-white` — Hardcoded bg-white / text-white

### components/ui/badge.tsx
- [ ] Line 17: `text-white` — Hardcoded bg-white / text-white

### components/ui/button.tsx
- [ ] Line 15: `text-white` — Hardcoded bg-white / text-white

### components/ui/dialog.tsx
- [ ] Line 24: `bg-black/80` — Opacity modifiers on black/white

### components/ui/neobrutalist-loader.tsx
- [ ] Line 106: `from-gray-50` — Tailwind color scale classes
- [ ] Line 106: `to-gray-100` — Tailwind color scale classes
- [ ] Line 108: `bg-gray-300` — Tailwind color scale classes
- [ ] Line 109: `bg-gray-300` — Tailwind color scale classes
- [ ] Line 111: `bg-gray-200` — Tailwind color scale classes
- [ ] Line 117: `bg-gray-200` — Tailwind color scale classes
- [ ] Line 129: `bg-yellow-100` — Tailwind color scale classes
- [ ] Line 140: `bg-blue-100` — Tailwind color scale classes

### components/ui/sheet.tsx
- [ ] Line 24: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 62: `text-white` — Hardcoded bg-white / text-white

### components/ui/stat-card.tsx
- [ ] Line 23: `text-white` — Hardcoded bg-white / text-white

### components/ui/stat.tsx
- [ ] Line 75: `bg-green-100` — Tailwind color scale classes
- [ ] Line 75: `text-green-700` — Tailwind color scale classes
- [ ] Line 77: `bg-yellow-100` — Tailwind color scale classes
- [ ] Line 77: `text-yellow-700` — Tailwind color scale classes
- [ ] Line 78: `bg-red-100` — Tailwind color scale classes
- [ ] Line 78: `text-red-700` — Tailwind color scale classes
- [ ] Line 84: `bg-blue-100` — Tailwind color scale classes
- [ ] Line 84: `text-blue-700` — Tailwind color scale classes

### components/ui/toggle-button-group.tsx
- [ ] Line 25: `text-white` — Hardcoded bg-white / text-white

### components/wishocracy/WishocracyCompletionCard.tsx
- [ ] Line 36: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 36: `#00D9FF` — Hardcoded hex colors
- [ ] Line 36: `#FFE66D` — Hardcoded hex colors

### components/wishocracy/WishocracyEditSection.tsx
- [ ] Line 271: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 271: `#00D9FF` — Hardcoded hex colors

### components/wishocracy/WishocracyLandingSection.tsx
- [ ] Line 92: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 133: `text-white` — Hardcoded bg-white / text-white

### components/wishocracy/budget-pair-slider.tsx
- [ ] Line 205: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 205: `#00D9FF` — Hardcoded hex colors

---
_Generated by `packages/web/scripts/audit-colors.ts`_
