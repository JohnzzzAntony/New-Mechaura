# Migration & Historical Scripts Archive

This directory contains one-off migration and batch update scripts that were executed during earlier architectural migrations and SEO restructuring phases. They are kept for historical reference and auditability.

### Archived Scripts:

1. **`apply-fonts.mjs`**: Replaced Google Fonts references with Satoshi (Fontshare) and local font face fallback configs.
2. **`apply-seo-fixes.mjs`**: Applied initial audit recommendations across legacy HTML templates (lazy loading attributes, meta tags, heading hierarchies).
3. **`relink-products.mjs`**: Rewrote legacy query-string product links (`/product-detail?id=...`) to point directly to clean canonical paths (`/products/...`).
4. **`rewrite-urls.mjs`**: Rewrote internal `.html` link targets to extensionless clean URLs and adjusted asset path prefixes for nested route resolution.

> [!NOTE]
> Active generation and build workflows are driven directly by the scripts in the parent `tools/` directory.
