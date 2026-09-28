# Changelog

## [1.0.0] – 2026-09-28

### Shipped
- BookCoverView: 3D tilt, click-to-flip, high-res PNG export (html2canvas), print CSS, ISBN visual barcode, series branding
- BookCardWithWholeCover: hover preview on desktop
- Integration patch for BookReader (auto-open via localStorage)
- INSTALL.md 60-second checklist
- Zero-dep validate.mjs + GitHub Actions CI
- LICENSE (MIT), TROUBLESHOOTING.md, book data contract, example book JSON

### Known limitations
- Requires a React app with Tailwind-style utility classes and (optionally) your own `@/components/ui/image` + `button` + lucide-react
- html2canvas is optional (dynamic import); without it export falls back to window.print()
- ISBN is deterministic visual only (not a real registered ISBN)
- No full page-turn chapter reader in this package (cover system only)
