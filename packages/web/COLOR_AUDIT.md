# Color Audit — Off-Brand Colors TODO

Generated: 2026-03-18
Total violations: 2145

## Summary
- [ ] **856** Opacity modifiers on black/white → Use semantic tokens: `text-muted-foreground`, `text-foreground`, `bg-muted`
- [ ] **396** Hardcoded bg-white / text-white → Use `bg-background` / `text-background` or `text-primary-foreground`
- [ ] **43** Soft shadows (rgba opacity < 1) → Use `rgba(0,0,0,1)` for brutal hard shadows
- [ ] **113** Tailwind color scale classes → Use brutal-* tokens (`brutal-pink`, `brutal-cyan`, `brutal-yellow`, `brutal-red`) or semantic tokens (`primary`, `muted`, `destructive`)
- [ ] **45** Hardcoded hex colors → Use CSS custom property / brutal token instead
- [ ] **692** Hardcoded bg-black / text-black → Use `bg-foreground` / `text-foreground` for dark-mode compatibility

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
- [ ] Line 29: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 30: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 38: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 39: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 40: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 48: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 49: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 50: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 58: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 59: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 60: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 125: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 128: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 135: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 141: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 154: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 161: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 168: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 168: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 205: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 206: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 220: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 221: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 231: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 238: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 239: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 247: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 254: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 255: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 263: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 270: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 271: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 279: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 289: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 296: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 305: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 317: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 320: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 332: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 335: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 349: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 349: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 349: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 350: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 350: `text-black` — Hardcoded bg-black / text-black

### app/alignment/page.tsx
- [ ] Line 25: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 28: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 35: `text-black` — Hardcoded bg-black / text-black

### app/api/og/referral/route.tsx
- [ ] Line 85: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 104: `#666` — Hardcoded hex colors

### app/auth/verify-request/page.tsx
- [ ] Line 4: `bg-white` — Hardcoded bg-white / text-white

### app/budget/[slug]/page.tsx
- [ ] Line 118: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 134: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 135: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 136: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 137: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 138: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 139: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 140: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 141: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 194: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 228: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 234: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 235: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 240: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 241: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 244: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 245: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 247: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 257: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 258: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 261: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 264: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 265: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 266: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 267: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 276: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 277: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 280: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 287: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 288: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 289: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 292: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 293: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 293: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 296: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 300: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 301: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 312: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 313: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 317: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 318: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 329: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 330: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 340: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 347: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 348: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 350: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 351: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 352: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 354: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 355: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 356: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 362: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 363: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 364: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 365: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 391: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 392: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 396: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 400: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 401: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 402: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 404: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 405: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 406: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 407: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 411: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 412: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 417: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 418: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 419: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 424: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 433: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 434: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 447: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 451: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 452: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 453: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 455: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 456: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 457: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 459: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 460: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 461: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 463: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 464: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 465: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 477: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 478: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 483: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 485: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 487: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 496: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 508: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 514: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 520: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 521: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 522: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 524: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 525: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 526: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 530: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 531: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 542: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 543: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 558: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 559: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 561: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 571: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 587: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 588: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 591: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 593: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 599: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 603: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 610: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 615: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 615: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 623: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 628: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 637: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 641: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 661: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 661: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 661: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 665: `text-black/40` — Opacity modifiers on black/white

### app/budget/page.tsx
- [ ] Line 80: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 81: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 82: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 83: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 84: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 85: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 86: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 87: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 88: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 142: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 145: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 155: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 155: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 155: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 163: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 163: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 163: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 176: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 194: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 197: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 215: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 227: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 231: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 234: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 238: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 246: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 253: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 254: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 267: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 281: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 288: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 291: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 298: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 314: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 315: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 316: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 319: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 322: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 323: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 330: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 335: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 338: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 339: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 358: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 363: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 364: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 388: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 403: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 407: `text-black/50` — Opacity modifiers on black/white

### app/civic/page.tsx
- [ ] Line 18: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 21: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 30: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 32: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 35: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 43: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 45: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 48: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 56: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 58: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 61: `text-black/70` — Opacity modifiers on black/white

### app/compare/page.tsx
- [ ] Line 97: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 100: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 113: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 114: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 152: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 153: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 154: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 155: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 166: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 170: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 191: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 192: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 193: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 194: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 201: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 216: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 217: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 218: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 219: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 220: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 221: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 222: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 233: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 234: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 235: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 236: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 237: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 239: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 258: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 259: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 260: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 261: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 267: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 268: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 269: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 271: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 279: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 280: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 281: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 282: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 283: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 284: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 285: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 296: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 298: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 302: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 305: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 306: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 307: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 308: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 327: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 328: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 329: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 330: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 341: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 349: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 353: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 364: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 365: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 366: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 367: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 368: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 369: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 382: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 383: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 384: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 385: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 386: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 406: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 407: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 408: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 409: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 421: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 424: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 428: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 435: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 438: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 445: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 448: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 449: `text-black/70` — Opacity modifiers on black/white

### app/department-of-war/page.tsx
- [ ] Line 53: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 56: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 59: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 73: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 76: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 82: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 84: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 91: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 97: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 99: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 106: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 112: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 114: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 121: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 128: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 130: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 137: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 151: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 154: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 168: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 171: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 174: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 181: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 194: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 197: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 198: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 201: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 209: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 220: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 223: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 232: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 233: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 238: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 239: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 243: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 244: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 245: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 254: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 257: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 268: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 268: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 268: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 275: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 275: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 282: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 282: `text-black` — Hardcoded bg-black / text-black

### app/discoveries/page.tsx
- [ ] Line 78: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 81: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 90: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 93: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 103: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 106: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 109: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 112: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 115: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 118: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 121: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 132: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 134: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 137: `text-black/70` — Opacity modifiers on black/white

### app/federal-reserve/page.tsx
- [ ] Line 33: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 34: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 41: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 42: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 49: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 50: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 57: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 58: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 109: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 112: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 120: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 132: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 135: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 159: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 160: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 173: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 176: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 183: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 188: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 189: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 192: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 200: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 205: `bg-white/10` — Opacity modifiers on black/white
- [ ] Line 206: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 209: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 218: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 230: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 233: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 241: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 242: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 245: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 252: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 253: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 256: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 262: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 263: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 264: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 267: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 278: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 281: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 290: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 304: `text-white/40` — Opacity modifiers on black/white
- [ ] Line 307: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 315: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 329: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 332: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 341: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 356: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 359: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 366: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 368: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 371: `text-white/40` — Opacity modifiers on black/white
- [ ] Line 376: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 377: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 378: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 381: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 389: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 402: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 405: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 415: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 420: `border-white/20` — Opacity modifiers on black/white
- [ ] Line 421: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 424: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 432: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 437: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 438: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 441: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 453: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 456: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 464: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 466: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 466: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 470: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 473: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 483: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 485: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 485: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 489: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 492: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 502: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 504: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 504: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 508: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 511: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 523: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 523: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 527: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 530: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 546: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 550: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 551: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 554: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 561: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 562: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 565: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 572: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 573: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 576: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 589: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 592: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 605: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 605: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 605: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 612: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 612: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 619: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 619: `text-black` — Hardcoded bg-black / text-black

### app/iab/page.tsx
- [ ] Line 37: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 40: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 45: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 54: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 63: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 71: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 71: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 78: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 87: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 90: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 98: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 98: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 101: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 105: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 111: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 111: `bg-white/50` — Opacity modifiers on black/white
- [ ] Line 112: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 121: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 121: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 124: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 128: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 133: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 133: `bg-white/50` — Opacity modifiers on black/white
- [ ] Line 134: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 142: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 142: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 145: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 149: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 155: `border-white/30` — Opacity modifiers on black/white
- [ ] Line 155: `bg-white/10` — Opacity modifiers on black/white
- [ ] Line 156: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 164: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 165: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 176: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 181: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 184: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 187: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 193: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 196: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 199: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 206: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 207: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 217: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 220: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 229: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 234: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 237: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 240: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 254: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 260: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 267: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 270: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 273: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 287: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 290: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 299: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 302: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 308: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 317: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 322: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 333: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 336: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 341: `border-white/20` — Opacity modifiers on black/white
- [ ] Line 341: `bg-white/10` — Opacity modifiers on black/white
- [ ] Line 343: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 346: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 349: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 356: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 356: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 356: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 367: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 400: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 402: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 405: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 408: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 419: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 428: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 431: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 441: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 441: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 441: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 449: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 449: `text-black` — Hardcoded bg-black / text-black

### app/misconceptions/page.tsx
- [ ] Line 36: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 37: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 38: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 39: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 40: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 41: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 45: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 46: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 47: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 48: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 49: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 146: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 172: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 175: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 179: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 188: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 191: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 196: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 199: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 204: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 207: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 219: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 219: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 220: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 265: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 266: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 272: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 275: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 280: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 289: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 304: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 310: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 320: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 328: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 339: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 340: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 347: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 353: `text-black` — Hardcoded bg-black / text-black

### app/money/page.tsx
- [ ] Line 23: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 24: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 32: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 33: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 41: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 42: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 55: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 56: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 57: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 67: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 68: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 69: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 79: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 80: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 81: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 94: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 97: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 103: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 114: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 139: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 142: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 143: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 149: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 153: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 162: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 163: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 166: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 167: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 170: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 171: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 178: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 181: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 197: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 220: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 224: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 226: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 226: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 230: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 231: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 239: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 241: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 241: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 245: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 246: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 254: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 256: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 256: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 260: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 261: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 271: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 271: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 275: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 276: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 291: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 294: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 300: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 301: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 304: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 311: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 312: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 315: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 322: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 323: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 326: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 345: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 348: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 359: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 359: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 359: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 366: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 366: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 373: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 373: `text-black` — Hardcoded bg-black / text-black

### app/outcomes/[outcomeId]/page.tsx
- [ ] Line 51: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 55: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 58: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 63: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 80: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 81: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 94: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 95: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 96: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 97: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 98: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 102: `bg-white` — Hardcoded bg-white / text-white

### app/outcomes/page.tsx
- [ ] Line 29: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 32: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 46: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 50: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 51: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 60: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 61: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 62: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 73: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 78: `bg-white` — Hardcoded bg-white / text-white

### app/page.tsx
- [ ] Line 133: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 137: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 140: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 146: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 152: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 163: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 170: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 177: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 177: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 182: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 187: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 217: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 220: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 228: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 231: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 238: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 241: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 254: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 257: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 290: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 293: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 296: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 332: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 335: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 346: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 349: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 361: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 371: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 386: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 422: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 425: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 440: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 445: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 457: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 460: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 470: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 470: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 473: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 474: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 480: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 493: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 496: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 502: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 502: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 509: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 509: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 509: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 516: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 516: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 523: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 523: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 530: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 530: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 537: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 537: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 544: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 544: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 554: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 562: `text-black/50` — Opacity modifiers on black/white

### app/policies/[slug]/page.tsx
- [ ] Line 91: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 93: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 95: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 97: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 145: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 167: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 173: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 175: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 186: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 187: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 192: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 197: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 198: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 203: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 204: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 209: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 210: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 218: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 219: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 226: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 227: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 243: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 244: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 247: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 248: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 259: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 260: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 271: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 274: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 286: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 287: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 301: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 302: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 308: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 315: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 328: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 329: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 332: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 334: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 345: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 348: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 357: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 365: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 368: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 369: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 370: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 377: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 381: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 401: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 401: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 401: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 405: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 416: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 417: `text-black` — Hardcoded bg-black / text-black

### app/policies/page.tsx
- [ ] Line 79: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 82: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 90: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 94: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 94: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 104: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 108: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 108: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 127: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 127: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 132: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 135: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 139: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 141: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 152: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 162: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 167: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 169: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 170: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 172: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 173: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 175: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 176: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 179: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 180: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 184: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 185: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 189: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 190: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 195: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 204: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 210: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 217: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 228: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 239: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 279: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 280: `text-black/50` — Opacity modifiers on black/white

### app/prize/page.tsx
- [ ] Line 57: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 58: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 59: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 68: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 69: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 70: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 79: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 80: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 81: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 149: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 156: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 197: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 200: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 207: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 216: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 219: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 222: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 229: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 232: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 235: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 246: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 254: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 254: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 267: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 269: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 272: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 279: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 282: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 290: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 291: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 301: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 310: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 315: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 318: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 321: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 327: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 330: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 333: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 339: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 339: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 342: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 345: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 353: `bg-red-50` — Tailwind color scale classes
- [ ] Line 354: `text-red-600` — Tailwind color scale classes
- [ ] Line 358: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 359: `text-red-700` — Tailwind color scale classes
- [ ] Line 362: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 363: `text-red-700` — Tailwind color scale classes
- [ ] Line 366: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 367: `text-red-700` — Tailwind color scale classes
- [ ] Line 372: `bg-green-50` — Tailwind color scale classes
- [ ] Line 373: `text-green-700` — Tailwind color scale classes
- [ ] Line 377: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 378: `text-green-700` — Tailwind color scale classes
- [ ] Line 381: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 382: `text-green-700` — Tailwind color scale classes
- [ ] Line 385: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 386: `text-green-700` — Tailwind color scale classes
- [ ] Line 389: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 390: `text-green-700` — Tailwind color scale classes
- [ ] Line 396: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 397: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 410: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 423: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 444: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 445: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 450: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 451: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 467: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 470: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 479: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 482: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 485: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 489: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 500: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 506: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 510: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 515: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 518: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 518: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 526: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 528: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 529: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 540: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 544: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 552: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 555: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 555: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 562: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 565: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 576: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 582: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 585: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 592: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 595: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 601: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 602: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 605: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 611: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 621: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 629: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 631: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 634: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 637: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 648: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 660: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 664: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 665: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 672: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 673: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 676: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 677: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 681: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 682: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 685: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 686: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 690: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 691: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 694: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 695: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 701: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 704: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 712: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 712: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 712: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 719: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 719: `text-black` — Hardcoded bg-black / text-black

### app/referendum/[slug]/page.tsx
- [ ] Line 61: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 65: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 74: `bg-green-50` — Tailwind color scale classes
- [ ] Line 75: `text-green-700` — Tailwind color scale classes
- [ ] Line 78: `text-green-700` — Tailwind color scale classes
- [ ] Line 82: `bg-red-50` — Tailwind color scale classes
- [ ] Line 83: `text-red-700` — Tailwind color scale classes
- [ ] Line 86: `text-red-700` — Tailwind color scale classes
- [ ] Line 91: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 94: `text-black/60` — Opacity modifiers on black/white

### app/referendum/[slug]/referendum-vote-client.tsx
- [ ] Line 71: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 72: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 81: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 82: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 90: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 93: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 99: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 99: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 117: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 120: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 125: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 126: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 129: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 146: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 147: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 151: `border-red-600` — Tailwind color scale classes
- [ ] Line 151: `bg-red-50` — Tailwind color scale classes
- [ ] Line 152: `text-red-700` — Tailwind color scale classes
- [ ] Line 161: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 168: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 171: `text-black/40` — Opacity modifiers on black/white

### app/referendum/page.tsx
- [ ] Line 31: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 34: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 42: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 45: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 55: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 59: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 63: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 69: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 72: `text-black/60` — Opacity modifiers on black/white

### app/scoreboard/[jurisdictionCode]/page.tsx
- [ ] Line 25: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 26: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 29: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 31: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 35: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 41: `text-black/50` — Opacity modifiers on black/white

### app/studies/[outcomeId]/[predictorId]/jurisdictions/[jurisdictionId]/page.tsx
- [ ] Line 44: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 48: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 51: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 58: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 59: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 62: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 63: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 66: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 67: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 70: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 71: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 75: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 76: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 77: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 80: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 89: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 90: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 91: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 105: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 106: `text-black/80` — Opacity modifiers on black/white

### app/studies/[outcomeId]/[predictorId]/jurisdictions/page.tsx
- [ ] Line 41: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 45: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 48: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 53: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 70: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 71: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 72: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 73: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 74: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 75: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 80: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 81: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 90: `bg-white` — Hardcoded bg-white / text-white

### app/studies/[outcomeId]/[predictorId]/page.tsx
- [ ] Line 60: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 64: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 67: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 84: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 85: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 88: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 89: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 92: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 93: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 96: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 97: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 102: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 103: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 106: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 107: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 112: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 113: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 118: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 119: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 130: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 133: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 134: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 154: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 155: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 156: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 158: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 169: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 171: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 174: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 186: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 187: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 188: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 189: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 197: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 198: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 202: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 203: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 206: `text-black/60` — Opacity modifiers on black/white

### app/transparency/page.tsx
- [ ] Line 28: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 29: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 40: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 41: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 52: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 53: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 64: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 65: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 76: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 77: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 89: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 92: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 98: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 107: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 118: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 128: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 129: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 132: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 143: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 146: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 152: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 153: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 164: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 167: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 191: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 197: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 205: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 206: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 211: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 212: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 215: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 219: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 235: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 240: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 243: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 251: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 254: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 262: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 265: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 273: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 276: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 289: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 293: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 303: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 304: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 306: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 308: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 309: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 311: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 313: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 314: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 316: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 322: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 322: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 322: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 330: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 334: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 336: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 337: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 343: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 345: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 346: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 352: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 354: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 355: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 365: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 368: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 379: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 379: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 379: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 387: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 387: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 395: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 395: `text-black` — Hardcoded bg-black / text-black

### components/Footer.tsx
- [ ] Line 19: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 22: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 30: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 44: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 58: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 72: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 85: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 85: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 92: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 99: `text-black` — Hardcoded bg-black / text-black

### components/Navbar.tsx
- [ ] Line 77: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 91: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 91: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 91: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 108: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 122: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 123: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 153: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 164: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 164: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 164: `bg-black` — Hardcoded bg-black / text-black

### components/alignment/AlignmentReport.tsx
- [ ] Line 37: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 99: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 102: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 109: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 116: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 117: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 122: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 125: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 128: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 131: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 136: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 139: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 175: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 176: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 182: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 185: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 193: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 201: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 204: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 207: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 211: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 217: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 220: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 228: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 231: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 236: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 239: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 244: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 247: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 256: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 266: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 269: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 283: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 287: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 299: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 300: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 301: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 304: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 308: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 315: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 316: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 317: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 332: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 333: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 342: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 345: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 348: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 351: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 355: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 356: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 359: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 365: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 370: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 386: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 400: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 408: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 422: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 445: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 449: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 455: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 464: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 473: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 484: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 486: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 489: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 511: `text-black/50` — Opacity modifiers on black/white

### components/analysis/provenance-block.tsx
- [ ] Line 17: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 18: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 19: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 25: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 26: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 27: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 33: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 34: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 35: `text-black/70` — Opacity modifiers on black/white

### components/animations/GdpTrajectoryChart.tsx
- [ ] Line 86: `text-black/50` — Opacity modifiers on black/white
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
- [ ] Line 107: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 110: `text-white/25` — Opacity modifiers on black/white

### components/animations/OpportunityCostTicker.tsx
- [ ] Line 45: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 56: `bg-white/80` — Opacity modifiers on black/white
- [ ] Line 60: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 70: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 80: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 85: `text-black/30` — Opacity modifiers on black/white

### components/auth/AuthForm.tsx
- [ ] Line 163: `bg-white` — Hardcoded bg-white / text-white

### components/chat/ChatPage.tsx
- [ ] Line 982: `bg-white` — Hardcoded bg-white / text-white

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

### components/dashboard/ImpactLedgerCard.tsx
- [ ] Line 68: `bg-white` — Hardcoded bg-white / text-white

### components/dashboard/OrganizationEmailSignatureCard.tsx
- [ ] Line 22: `#666` — Hardcoded hex colors
- [ ] Line 24: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 26: `#999` — Hardcoded hex colors

### components/dashboard/PrivacyToggle.tsx
- [ ] Line 15: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 36: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 44: `text-black` — Hardcoded bg-black / text-black

### components/dashboard/ProfileCard.tsx
- [ ] Line 248: `text-red-600` — Tailwind color scale classes

### components/dashboard/StickyShareFooter.tsx
- [ ] Line 23: `rgba(0,0,0,0.1` — Soft shadows (rgba opacity < 1)

### components/iab/IABDeposit.tsx
- [ ] Line 283: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 284: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 290: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 300: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 310: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 316: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 329: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 332: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 347: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 357: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 367: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 380: `bg-green-50` — Tailwind color scale classes
- [ ] Line 381: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 389: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 404: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 405: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 411: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 414: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 423: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 434: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 446: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 468: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 480: `bg-green-100` — Tailwind color scale classes
- [ ] Line 481: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 484: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 490: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 493: `text-green-700` — Tailwind color scale classes
- [ ] Line 502: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 502: `bg-green-600` — Tailwind color scale classes
- [ ] Line 502: `bg-green-700` — Tailwind color scale classes
- [ ] Line 508: `text-green-700` — Tailwind color scale classes
- [ ] Line 518: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 522: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 523: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 532: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 533: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 544: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 545: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 554: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 555: `text-black/50` — Opacity modifiers on black/white

### components/landing/AlignmentTeaser.tsx
- [ ] Line 14: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 17: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 27: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 30: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 34: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 42: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 42: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 42: `bg-black` — Hardcoded bg-black / text-black

### components/landing/BudgetGapChart.tsx
- [ ] Line 68: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 71: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 89: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 94: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 107: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 119: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 119: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 122: `border-black/30` — Opacity modifiers on black/white
- [ ] Line 139: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 150: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 153: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 170: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 177: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 177: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 179: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 183: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 192: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 211: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 213: `border-black/30` — Opacity modifiers on black/white
- [ ] Line 236: `text-black` — Hardcoded bg-black / text-black

### components/landing/DecentralizedFDASection.tsx
- [ ] Line 59: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 62: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 82: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 93: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 96: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 96: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 106: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 109: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 109: `rgba(0,0,0,0.5` — Soft shadows (rgba opacity < 1)
- [ ] Line 118: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 121: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 121: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 131: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 134: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 156: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 156: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 161: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 173: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 173: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 178: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 192: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 199: `text-black` — Hardcoded bg-black / text-black

### components/landing/EarthOptimizationPrizeSection.tsx
- [ ] Line 12: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 19: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 26: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 32: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 33: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 65: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 68: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 85: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 85: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 94: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 95: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 104: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 107: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 121: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 129: `text-black/40` — Opacity modifiers on black/white

### components/landing/IABCalculator.tsx
- [ ] Line 65: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 70: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 77: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 77: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 87: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 87: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 88: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 88: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 103: `bg-black/20` — Opacity modifiers on black/white
- [ ] Line 117: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 120: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 123: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 126: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 134: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 148: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 151: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 154: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 157: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 162: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 167: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 175: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 177: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 180: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 188: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 190: `text-black/60` — Opacity modifiers on black/white

### components/landing/ImplementationPlanSection.tsx
- [ ] Line 48: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 51: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 63: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 66: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 70: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 73: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 91: `text-black` — Hardcoded bg-black / text-black

### components/landing/IncentiveAlignmentBondsSection.tsx
- [ ] Line 33: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 36: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 47: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 47: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 50: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 53: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 57: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 57: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 58: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 67: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 67: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 70: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 73: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 77: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 77: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 78: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 93: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 95: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 111: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 118: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 133: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 138: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 146: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 147: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 150: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 160: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 161: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 164: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 179: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 180: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 183: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 190: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 190: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 190: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 201: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 209: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 216: `text-black/40` — Opacity modifiers on black/white

### components/landing/IncentiveFeedbackLoop.tsx
- [ ] Line 38: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 88: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 99: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 110: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 121: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 138: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 141: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 144: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 144: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 147: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 162: `bg-black/30` — Opacity modifiers on black/white
- [ ] Line 171: `bg-black/40` — Opacity modifiers on black/white
- [ ] Line 179: `bg-black/30` — Opacity modifiers on black/white
- [ ] Line 189: `bg-emerald-100` — Tailwind color scale classes
- [ ] Line 192: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 195: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 199: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 213: `bg-black/40` — Opacity modifiers on black/white
- [ ] Line 226: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 229: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 233: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 254: `border-black/30` — Opacity modifiers on black/white
- [ ] Line 254: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 255: `#8634` — Hardcoded hex colors
- [ ] Line 256: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 264: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 265: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 272: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 273: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 275: `text-black/40` — Opacity modifiers on black/white

### components/landing/InvisibleGraveyardSection.tsx
- [ ] Line 49: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 52: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 55: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 69: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 72: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 82: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 85: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 95: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 103: `text-black/60` — Opacity modifiers on black/white

### components/landing/MythVsDataTeaser.tsx
- [ ] Line 24: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 27: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 38: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 41: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 44: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 48: `text-black/60` — Opacity modifiers on black/white

### components/landing/NaturalExperimentsChart.tsx
- [ ] Line 61: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 64: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 86: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 91: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 91: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 98: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 108: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 116: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 119: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 119: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 132: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 149: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 160: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 162: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 174: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 186: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 190: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 221: `text-black` — Hardcoded bg-black / text-black

### components/landing/OnePercentTreatySection.tsx
- [ ] Line 59: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 62: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 72: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 75: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 84: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 84: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 87: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 99: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 100: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 102: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 110: `text-black/60` — Opacity modifiers on black/white

### components/landing/OutcomeExplorerTeaser.tsx
- [ ] Line 18: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 21: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 37: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 40: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 44: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 45: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 48: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 61: `text-black/60` — Opacity modifiers on black/white

### components/landing/PersonalIncomeChart.tsx
- [ ] Line 24: `#00c8c8` — Hardcoded hex colors
- [ ] Line 32: `#f472b6` — Hardcoded hex colors
- [ ] Line 130: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 133: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 151: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 167: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 171: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 185: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 185: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 186: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 186: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 200: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 216: `#0001` — Hardcoded hex colors
- [ ] Line 257: `#ef4444` — Hardcoded hex colors
- [ ] Line 288: `#ef4444` — Hardcoded hex colors
- [ ] Line 304: `#ef4444` — Hardcoded hex colors
- [ ] Line 322: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 323: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 330: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 331: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 339: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 342: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 352: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 359: `text-black/50` — Opacity modifiers on black/white

### components/landing/PoliticalDysfunctionTaxSection.tsx
- [ ] Line 54: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 57: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 69: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 69: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 72: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 74: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 84: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 85: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 87: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 95: `text-white/60` — Opacity modifiers on black/white

### components/landing/TwoFuturesSection.tsx
- [ ] Line 69: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 83: `bg-black/20` — Opacity modifiers on black/white
- [ ] Line 103: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 116: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 122: `bg-black/30` — Opacity modifiers on black/white
- [ ] Line 123: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 123: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 124: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 142: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 145: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 157: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 159: `text-black/30` — Opacity modifiers on black/white
- [ ] Line 174: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 180: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 180: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 180: `bg-black` — Hardcoded bg-black / text-black

### components/landing/WarVsCuresChart.tsx
- [ ] Line 75: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 124: `text-black/50` — Opacity modifiers on black/white

### components/navigation/NavItemLink.tsx
- [ ] Line 15: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 15: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 16: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 16: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 21: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 22: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 27: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 28: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 31: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 54: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 54: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 57: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 57: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 76: `text-black/50` — Opacity modifiers on black/white

### components/notifications/PushNotificationPrompt.tsx
- [ ] Line 96: `text-white` — Hardcoded bg-white / text-white

### components/organizations/OrganizationForm.tsx
- [ ] Line 105: `bg-red-100` — Tailwind color scale classes
- [ ] Line 105: `border-red-500` — Tailwind color scale classes
- [ ] Line 105: `text-red-700` — Tailwind color scale classes

### components/personhood/PersonhoodStatusBadge.tsx
- [ ] Line 29: `text-black` — Hardcoded bg-black / text-black

### components/personhood/WorldIdVerificationCard.tsx
- [ ] Line 130: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 134: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 177: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 179: `text-black` — Hardcoded bg-black / text-black

### components/prize/CitizenDashboard.tsx
- [ ] Line 121: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 123: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 126: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 138: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 141: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 149: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 149: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 149: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 183: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 189: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 197: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 200: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 205: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 206: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 219: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 222: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 227: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 228: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 241: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 244: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 249: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 250: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 289: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 295: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 298: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 330: `bg-white/30` — Opacity modifiers on black/white
- [ ] Line 344: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 350: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 351: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 365: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 366: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 373: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 380: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 380: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 394: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 409: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 415: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 415: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 419: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 420: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 433: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 446: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 448: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 490: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 490: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 495: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 495: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 500: `text-white/40` — Opacity modifiers on black/white
- [ ] Line 500: `text-black/40` — Opacity modifiers on black/white

### components/prize/PrizeCTA.tsx
- [ ] Line 9: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 10: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 11: `border-white/30` — Opacity modifiers on black/white
- [ ] Line 11: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 12: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 13: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 13: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 14: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 18: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 19: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 20: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 20: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 21: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 22: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 22: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 23: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 27: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 28: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 29: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 29: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 30: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 31: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 31: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 32: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 35: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 36: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 37: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 38: `border-white/20` — Opacity modifiers on black/white
- [ ] Line 38: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 39: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 40: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 41: `text-white/50` — Opacity modifiers on black/white
- [ ] Line 84: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)

### components/prize/ShareTemplatesCard.tsx
- [ ] Line 47: `text-green-700` — Tailwind color scale classes
- [ ] Line 53: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 73: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 74: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 77: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 95: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 100: `text-black/70` — Opacity modifiers on black/white

### components/prize/VoteTokenBalanceCard.tsx
- [ ] Line 33: `bg-green-100` — Tailwind color scale classes
- [ ] Line 33: `text-green-800` — Tailwind color scale classes
- [ ] Line 34: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 35: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 36: `bg-red-100` — Tailwind color scale classes
- [ ] Line 36: `text-red-700` — Tailwind color scale classes
- [ ] Line 66: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 68: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 69: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 78: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 81: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 87: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 87: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 87: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 97: `bg-red-50` — Tailwind color scale classes
- [ ] Line 98: `text-red-700` — Tailwind color scale classes
- [ ] Line 108: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 109: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 114: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 117: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 122: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 125: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 133: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 137: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 149: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 150: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 164: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 168: `text-black/40` — Opacity modifiers on black/white

### components/prize/VoterPrizeTreasuryDeposit.tsx
- [ ] Line 346: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 347: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 353: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 364: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 374: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 380: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 392: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 395: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 410: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 420: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 430: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 440: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 453: `bg-green-50` — Tailwind color scale classes
- [ ] Line 454: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 462: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 477: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 478: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 484: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 487: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 496: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 507: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 519: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 533: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 544: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 557: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 560: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 567: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 575: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 578: `text-green-700` — Tailwind color scale classes
- [ ] Line 588: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 588: `bg-green-600` — Tailwind color scale classes
- [ ] Line 588: `bg-green-700` — Tailwind color scale classes
- [ ] Line 596: `text-green-700` — Tailwind color scale classes
- [ ] Line 598: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 608: `bg-green-100` — Tailwind color scale classes
- [ ] Line 609: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 612: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 618: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 621: `text-green-700` — Tailwind color scale classes
- [ ] Line 631: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 631: `bg-green-600` — Tailwind color scale classes
- [ ] Line 631: `bg-green-700` — Tailwind color scale classes
- [ ] Line 639: `text-green-700` — Tailwind color scale classes
- [ ] Line 641: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 652: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 656: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 657: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 666: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 667: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 676: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 677: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 686: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 687: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 702: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 703: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 710: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 715: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 716: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 723: `text-black/40` — Opacity modifiers on black/white

### components/profile/CheckInHistoryCard.tsx
- [ ] Line 10: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 15: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 18: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 27: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 29: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 35: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 46: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 50: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 54: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 60: `text-black/60` — Opacity modifiers on black/white

### components/profile/DailyCheckInCard.tsx
- [ ] Line 80: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 83: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 87: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 98: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 107: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 113: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 122: `text-black/50` — Opacity modifiers on black/white

### components/profile/ProfileHub.tsx
- [ ] Line 26: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 29: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 59: `bg-green-200` — Tailwind color scale classes
- [ ] Line 93: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 94: `text-black/70` — Opacity modifiers on black/white

### components/profile/ProfileSnapshotForm.tsx
- [ ] Line 146: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 148: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 151: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 155: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 345: `text-black/50` — Opacity modifiers on black/white

### components/referendum/ReferendumVoteSection.tsx
- [ ] Line 80: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 81: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 95: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 98: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 104: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 104: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 104: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 117: `bg-green-50` — Tailwind color scale classes
- [ ] Line 118: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 121: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 130: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 133: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 138: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 146: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 149: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 154: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 166: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 167: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 170: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 187: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 188: `text-black` — Hardcoded bg-black / text-black
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
- [ ] Line 39: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 58: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 61: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 63: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 63: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 65: `border-black/20` — Opacity modifiers on black/white

### components/scoreboard/ScoreboardDashboard.tsx
- [ ] Line 20: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 23: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 34: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 37: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 42: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 45: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 50: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 53: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 57: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 58: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 61: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 70: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 71: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 74: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 84: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 85: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 88: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 99: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 100: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 106: `text-black/40` — Opacity modifiers on black/white

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
- [ ] Line 77: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 100: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 112: `border-black/10` — Opacity modifiers on black/white
- [ ] Line 112: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 114: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 118: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 120: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 126: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 131: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 131: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 144: `text-black/60` — Opacity modifiers on black/white

### components/shared/ResourcePromoCard.tsx
- [ ] Line 27: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 27: `#1DB954` — Hardcoded hex colors
- [ ] Line 36: `#FF9900` — Hardcoded hex colors
- [ ] Line 36: `text-black` — Hardcoded bg-black / text-black

### components/shared/SearchableList.tsx
- [ ] Line 68: `border-red-500` — Tailwind color scale classes
- [ ] Line 68: `bg-red-100` — Tailwind color scale classes
- [ ] Line 69: `text-red-700` — Tailwind color scale classes

### components/sharing/social-share-buttons.tsx
- [ ] Line 22: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 22: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 28: `bg-white` — Hardcoded bg-white / text-white

### components/treasury/DistributeUBICard.tsx
- [ ] Line 57: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 60: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 68: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 69: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 76: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 77: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 82: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 83: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 94: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 104: `bg-black/80` — Opacity modifiers on black/white
- [ ] Line 104: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 104: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 115: `text-black` — Hardcoded bg-black / text-black

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
- [ ] Line 47: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 51: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 55: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 58: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 61: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 71: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 74: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 77: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 87: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 87: `text-white/70` — Opacity modifiers on black/white
- [ ] Line 90: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 93: `text-white/60` — Opacity modifiers on black/white
- [ ] Line 102: `bg-black/5` — Opacity modifiers on black/white
- [ ] Line 103: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 115: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 118: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 122: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 122: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 124: `border-black/20` — Opacity modifiers on black/white
- [ ] Line 132: `text-black/40` — Opacity modifiers on black/white
- [ ] Line 140: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 143: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 154: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 157: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 167: `text-black/40` — Opacity modifiers on black/white

### components/treasury/TreasuryHero.tsx
- [ ] Line 13: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 16: `text-black/80` — Opacity modifiers on black/white
- [ ] Line 22: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 31: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 38: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 38: `text-black` — Hardcoded bg-black / text-black

### components/treasury/TreasuryStatusCard.tsx
- [ ] Line 34: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 40: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 45: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 51: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 58: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 73: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 76: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 80: `text-black/40` — Opacity modifiers on black/white

### components/treasury/UBIRegistrationCard.tsx
- [ ] Line 58: `bg-green-50` — Tailwind color scale classes
- [ ] Line 60: `text-green-600` — Tailwind color scale classes
- [ ] Line 61: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 65: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 77: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 78: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 81: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 90: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 93: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 102: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 112: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 115: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 125: `text-green-600` — Tailwind color scale classes
- [ ] Line 126: `text-green-600` — Tailwind color scale classes
- [ ] Line 130: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 138: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 141: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 152: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 163: `text-red-600` — Tailwind color scale classes
- [ ] Line 166: `text-green-600` — Tailwind color scale classes

### components/treasury/WalletCard.tsx
- [ ] Line 23: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 24: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 30: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 41: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 51: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 57: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 69: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 72: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 87: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 96: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 106: `text-black/50` — Opacity modifiers on black/white

### components/treasury/WishocracyLinkCard.tsx
- [ ] Line 10: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 13: `text-white/80` — Opacity modifiers on black/white
- [ ] Line 24: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 24: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 31: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 31: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 31: `bg-black` — Hardcoded bg-black / text-black

### components/ui/alert-card.tsx
- [ ] Line 18: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 24: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 30: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 36: `text-black` — Hardcoded bg-black / text-black

### components/ui/alert-dialog.tsx
- [ ] Line 21: `bg-black/80` — Opacity modifiers on black/white

### components/ui/amount-selector.tsx
- [ ] Line 24: `text-white` — Hardcoded bg-white / text-white

### components/ui/badge.tsx
- [ ] Line 17: `text-white` — Hardcoded bg-white / text-white

### components/ui/button.tsx
- [ ] Line 15: `text-white` — Hardcoded bg-white / text-white

### components/ui/cta-section.tsx
- [ ] Line 28: `bg-black` — Hardcoded bg-black / text-black

### components/ui/dialog.tsx
- [ ] Line 24: `bg-black/80` — Opacity modifiers on black/white

### components/ui/neobrutalist-loader.tsx
- [ ] Line 33: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 103: `bg-white` — Hardcoded bg-white / text-white
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
- [ ] Line 62: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 62: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 62: `bg-black` — Hardcoded bg-black / text-black

### components/ui/stat-card.tsx
- [ ] Line 23: `text-white` — Hardcoded bg-white / text-white

### components/ui/stat.tsx
- [ ] Line 60: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 60: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 62: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 67: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 71: `text-black/40` — Opacity modifiers on black/white
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

### components/wishocracy/BudgetAllocationBars.tsx
- [ ] Line 61: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 65: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 214: `bg-black` — Hardcoded bg-black / text-black

### components/wishocracy/WishocracyAuthPromptCard.tsx
- [ ] Line 38: `bg-white` — Hardcoded bg-white / text-white

### components/wishocracy/WishocracyCompletionCard.tsx
- [ ] Line 36: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 36: `#00D9FF` — Hardcoded hex colors
- [ ] Line 36: `#FFE66D` — Hardcoded hex colors
- [ ] Line 89: `bg-white` — Hardcoded bg-white / text-white

### components/wishocracy/WishocracyEditSection.tsx
- [ ] Line 197: `border-black/30` — Opacity modifiers on black/white
- [ ] Line 271: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 271: `#00D9FF` — Hardcoded hex colors

### components/wishocracy/WishocracyLandingSection.tsx
- [ ] Line 92: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 92: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 95: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 98: `text-black/70` — Opacity modifiers on black/white
- [ ] Line 103: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 104: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 107: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 111: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 112: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 115: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 119: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 120: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 123: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 133: `text-white` — Hardcoded bg-white / text-white
- [ ] Line 139: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 139: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 146: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 153: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 156: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 157: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 161: `text-black/50` — Opacity modifiers on black/white
- [ ] Line 172: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 176: `text-black/60` — Opacity modifiers on black/white
- [ ] Line 181: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 187: `bg-black/10` — Opacity modifiers on black/white
- [ ] Line 189: `bg-black` — Hardcoded bg-black / text-black
- [ ] Line 198: `text-black/60` — Opacity modifiers on black/white

### components/wishocracy/WishocracyReferralCard.tsx
- [ ] Line 21: `bg-white` — Hardcoded bg-white / text-white
- [ ] Line 22: `text-black` — Hardcoded bg-black / text-black
- [ ] Line 25: `text-black/60` — Opacity modifiers on black/white

### components/wishocracy/WishocracyStatusBar.tsx
- [ ] Line 34: `bg-white` — Hardcoded bg-white / text-white

### components/wishocracy/budget-pair-slider.tsx
- [ ] Line 187: `rgba(0,0,0,0.3` — Soft shadows (rgba opacity < 1)
- [ ] Line 205: `#FF6B9D` — Hardcoded hex colors
- [ ] Line 205: `#00D9FF` — Hardcoded hex colors

---
_Generated by `packages/web/scripts/audit-colors.ts`_
