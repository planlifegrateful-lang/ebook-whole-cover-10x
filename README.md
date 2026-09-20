# Ebook Whole-Cover Upgrade – 10/10 Complete Package

![CI](https://github.com/planlifegrateful-lang/ebook-whole-cover-10x/actions/workflows/ci.yml/badge.svg)

**All requested features shipped and live on GitHub.**

1. **3D / tilted / interactive** – perspective tilt on mouse move + click-to-flip  
2. **Print-ready / high-res export** – PNG at 3× scale + browser print  
3. **Home page / book card hover** – `BookCardWithWholeCover` shows the full spread  
4. **Auto-open first time** – opens the whole-book view the first time a user lands on a finished book  
5. **Polished back cover** – refined typography, series branding, visual ISBN-13 barcode  

## Repo

https://github.com/planlifegrateful-lang/ebook-whole-cover-10x

## Files

```
src/components/BookCoverView.jsx          ← main 3D spread + export
src/components/BookCardWithWholeCover.jsx ← home-page card with hover preview
patches/BookReader-integration.md         ← exact paste instructions
INSTALL.md                                ← 60-second checklist
docs/CI-CD.md                             ← full CI/CD playbook
.github/workflows/ci.yml                  ← automated validation
scripts/validate.mjs                      ← local + CI checks
package.json
```

## Install (60 seconds)

See `INSTALL.md`.

## CI

```bash
npm run validate   # or: node scripts/validate.mjs
```

Pushes and PRs to `main` run the same checks automatically.

## Zero-config notes

- Same `book` shape: `title`, `genre`, `synopsis`/`subject`, `cover_image_url`, `id`
- Mobile-safe max width
- Keyboard flip (Enter/Space) + ARIA labels
- Print CSS isolates the spread

## CI/CD

See **[docs/CI-CD.md](docs/CI-CD.md)** for:
- This package’s GitHub Actions pipeline  
- Vercel deploy pattern for full apps  
- Docker patterns you already use  
- Recommended pipeline by product type  

## Go beyond

Want a **3D open-book page-turn** for chapters, a **live back-cover editor**, or **npm publish on tags**? Open an issue or say the word.
