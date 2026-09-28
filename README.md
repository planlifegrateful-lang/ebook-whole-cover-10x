# Ebook Whole-Cover Upgrade – 10/10 Complete Package

![CI](https://github.com/planlifegrateful-lang/ebook-whole-cover-10x/actions/workflows/ci.yml/badge.svg)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**All requested features shipped and live on GitHub.**

1. **3D / tilted / interactive** – perspective tilt on mouse move + click-to-flip  
2. **Print-ready / high-res export** – PNG at 3× scale + browser print  
3. **Home page / book card hover** – `BookCardWithWholeCover` shows the full spread  
4. **Auto-open first time** – opens the whole-book view the first time a user lands on a finished book  
5. **Polished back cover** – refined typography, series branding, visual ISBN-13 barcode  

## Install (60 seconds)

See **[INSTALL.md](INSTALL.md)**.

```bash
npm run validate   # or: node scripts/validate.mjs
```

## Files

```
src/components/BookCoverView.jsx          ← main 3D spread + export
src/components/BookCardWithWholeCover.jsx ← home-page card with hover preview
patches/BookReader-integration.md         ← exact paste instructions
INSTALL.md                                ← 60-second checklist
TROUBLESHOOTING.md                        ← common failures + fixes
docs/BOOK-DATA-SHAPE.md                   ← required book object contract
docs/CI-CD.md                             ← full CI/CD playbook
examples/sample-book.json                 ← example data
.github/workflows/ci.yml                  ← automated validation
scripts/validate.mjs                      ← local + CI checks
package.json
LICENSE
CHANGELOG.md
```

## Book data shape

See **[docs/BOOK-DATA-SHAPE.md](docs/BOOK-DATA-SHAPE.md)**.

## CI

Pushes and PRs to `main` run `node scripts/validate.mjs` automatically.

## Zero-config notes

- Same `book` shape: `title`, `genre`, `synopsis`/`subject`, `cover_image_url`, `id`
- Mobile-safe max width
- Keyboard flip (Enter/Space) + ARIA labels
- Print CSS isolates the spread

## Known limitations

- Drop-in for React + utility CSS apps. Swap `@/components/ui/*` and lucide-react for your stack if needed.
- ISBN is visual/deterministic only (not a real registered number).
- html2canvas optional for PNG export.

## License

MIT – see LICENSE.

---

Want a full page-turn chapter reader, live back-cover editor, or npm publish on tags? Open an issue.
