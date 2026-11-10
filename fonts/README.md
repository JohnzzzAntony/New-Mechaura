# Fonts

The site ships **Satoshi** (Indian Type Foundry, via Fontshare) — a geometric
grotesque chosen as the closest freely-licensed match to Aeonik. It is free for
commercial use and loaded from the Fontshare CDN.

Weights used: 400, 500, 600, 700 — all native faces, no synthetic bolding.

## Switching to genuine Aeonik later

Aeonik is a commercial typeface from CoType Foundry and cannot be redistributed
here. If you buy a webfont licence:

1. Drop the files into this folder:

       Aeonik-Regular.woff2   (400)
       Aeonik-Medium.woff2    (500)
       Aeonik-Bold.woff2      (700)

2. Add this to `style.css`:

       @font-face { font-family:'Aeonik'; src:url('/fonts/Aeonik-Regular.woff2') format('woff2'); font-weight:400; font-display:swap; }
       @font-face { font-family:'Aeonik'; src:url('/fonts/Aeonik-Medium.woff2')  format('woff2'); font-weight:500; font-display:swap; }
       @font-face { font-family:'Aeonik'; src:url('/fonts/Aeonik-Bold.woff2')    format('woff2'); font-weight:700; font-display:swap; }

3. Move `'Aeonik'` ahead of `'Satoshi'` in `--font-heading` and `--font-body`.

Aeonik is already listed in the stack after Satoshi, so step 3 is the only edit
needed to make it take priority.
