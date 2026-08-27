# Aeonik font files

Aeonik is a commercial typeface from CoType Foundry. It is not bundled with
this repository because it cannot be redistributed without a licence.

Once you hold a webfont licence, drop these three files here:

    Aeonik-Regular.woff2   (weight 400)
    Aeonik-Medium.woff2    (weight 500)
    Aeonik-Bold.woff2      (weight 700)

The @font-face rules in style.css already point at these exact paths, so the
site picks them up on the next build with no code change.

Until they are present the stack falls through to Switzer, a free geometric
grotesque with near-identical proportions, loaded from Fontshare.
