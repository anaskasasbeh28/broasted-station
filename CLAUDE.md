# Broasted Station — project brief for Claude Code

Arabic RTL marketing site for بروستد ستيشن, a real fried-chicken shop in
Irbid, Jordan. This is a spec/pitch build: it will be shown to the owner to
win the job. Nothing here is a generic template — every visual decision comes
from the brand's own printed menu, packaging and social posts.

## Stack — do not change without asking
- Plain HTML + CSS + vanilla JS. **No frameworks, no build step, no bundler,
  no npm dependencies at runtime.** `index.html` must open directly from disk.
- Deployment target is GitHub Pages / Netlify (static only).
- Fonts are **self-hosted** in `assets/fonts/`. Do not swap them back to a
  Google Fonts `<link>` — that adds a third-party request and breaks offline.
- Do not add `<link rel=preload>` for fonts: preload needs `crossorigin`,
  which throws CORS errors when the file is opened via `file://`.

## Files
```
index.html        the landing page: all content and Arabic copy; icon sprite inlined
menu.html         the digital menu (QR / tablet-at-the-table). GENERATED — see below
css/tokens.css    every colour, font, space, radius. Rebrand happens HERE ONLY
css/fonts.css     @font-face for the four local faces
css/style.css     the landing page (imports fonts.css + tokens.css at the top)
css/menu.css      the digital menu page. Standalone — never pulls in style.css
js/hours.js       OPENING HOURS LIVE HERE, ONE PLACE. Both pages read it
js/script.js      landing page: nav, tabs, ticker sizing, reveal, sticky bar
js/menu.js        digital menu: chip scroll-spy + instant search
tools/make-qr.py  regenerates assets/img/qr.svg — edit the URL at the top
assets/img/       p-*.png = menu product cut-outs; others = real photos
assets/fonts/     Lalezar, Anton, Caveat, Cairo (woff2)
```

## Brand rules — these are sampled from real artwork, not invented
| Token | Value | Where it came from |
|---|---|---|
| `--red` | `#E82028` | sampled; 50–62% of every brand poster |
| `--oxblood` | `#8F0000` | "بروستد شهي" poster background |
| `--gold` | `#F8B000` | that poster's display type + the notification bell |
| `--ink` | `#141414` | used as a full brand colour, not just text |

Display face is **Lalezar** as a stand-in for the brand's real cut-stencil
Arabic face (paid/custom, not obtained yet). What actually sells the poster
look is the **hard offset shadow** in `.poster`, not the face itself.

Recurring brand devices already built — reuse these instead of inventing new ones:
- `.ticket` — perforated scalloped panel (their printed menu boxes)
- `.stamp` — postage-stamp perforation (their packaging)
- `.wave-rule` — distressed triple wave, cut from the real menu
- `.speckle` — seamless newsprint fleck tile
- `.bell` — gold notification badge ("new item" motif)
- `.postmark` — dashed ink circle
- `.poster` — hard-offset display type

## Hard constraints — breaking these is a regression
1. **Never `overflow-x: hidden` on `html` or `body`.** Use `overflow-x: clip`.
   `hidden` makes them scroll containers and kills the sticky header.
   Rotated cards previously pushed the page to 461px wide on a 390px phone.
2. **Any light-background element inside `.sec--ink` / `.sec--red` must set its
   own `color`.** It otherwise inherits the section's light text and renders
   white-on-white (this hit the talabat/mythings chips).
3. **No `::first-letter` drop caps on Arabic.** Arabic letters join; it splits
   the first letter off the word. Use a heavier lead paragraph instead.
4. **Scroll-reveal must never be able to permanently hide content.**
   `[data-rv]` is visible by default; `.js` opts in, and a `load` + 2.2s
   timeout force-reveals everything as a safety net. Keep that net.
5. Menu tabs follow the WAI-ARIA tabs pattern, and **arrow keys are mirrored
   for RTL** (ArrowLeft advances). Don't "fix" that to LTR.
6. Every `<img>` needs a real Arabic `alt`. One `<h1>` only; no heading skips.
7. `prefers-reduced-motion` is respected everywhere. Keep it that way.
8. **No images of women anywhere on the site.** This is the client's own
   requirement, not a stylistic one. Before adding any photo, check it for
   faces, hair, and hands with painted nails — several of the brand's own
   promo shots have them and were cropped or swapped out for that reason.
   The offset also rules out 🔥-style emoji in tags: they fall back to tofu
   boxes on some Android builds. Use the word (`.item__tag--hot`).
9. **Phone numbers use U+00A0 between the digit groups**, never a normal
   space. Arabic-Indic digits are bidi class AN, and a plain space between
   two AN groups resolves RTL — ٠٧٩٢ ٢٢٨ ٢٩٩ then renders back-to-front.
   `dir="ltr"` and `<bdi>` do NOT fix it; the no-break space does.
10. **The ticker must never show a gap.** It is built from identical
   `.ticker__seg` blocks and shifts by exactly one segment. In RTL the
   track hangs off the LEFT, so it travels **right** (`+`). `js/script.js`
   measures a segment and clones more until the strip is wider than the
   viewport. Don't "simplify" it back to `translateX(-50%)`.
11. **`menu.html` is generated from `index.html`'s menu markup.** If you
   change an item, a price or a description, change it in `index.html` and
   regenerate, or change both. They must never disagree.

## Content rules
- Prices come from the **shop's official printed menu**, not Talabat. They
  differ (crunchy roll is 2.25 in-store vs 3.30 on Talabat) — in-store wins.
- Real data in use: phone ٠٧٩٢ ٢٢٨ ٢٩٩, Irbid 21110, @broastedstation.jor,
  founded 20 Oct 2024, delivery via talabat + mythings + Maestro.
- Opening hours are **10:00–02:00** (the owner's own account). Change them in
  `js/hours.js`; the printed strings sit in `index.html` and `menu.html`.
- The shop's real slogan is **«الطعم للعظم»** — it appears in six of their
  own posts. Use it; it is theirs.
- **Never use fry words** (مقلي / بنقلي / ينقلي / يُقلى). They never use them,
  and their own copy sells hygiene and technique. Say «بيتحضّر على الطلب».
- Broasted and tender meals come with **بطاطا أو رز — one, not both**, at the
  same price. Rice is not a separate menu item.
- **Do not invent customer reviews or testimonials.** There is deliberately no
  reviews section until real ones are supplied.
- Placeholders waiting on real photography, all flagged in README:
  `p-soon.png` (both wraps), `branch2.webp` (دوار الدرّة).

## Working style
- Prefer editing `css/tokens.css` over hard-coding values anywhere else.
- After visual changes, check at **390px** width, not just desktop.
- Copy is Jordanian colloquial Arabic, playful and street — match the existing
  tone ("الطعم اللي بيفصلك عن كل اللي حواليك"), never formal MSA.
