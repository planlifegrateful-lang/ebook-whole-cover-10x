# CI/CD for Ebook Whole-Cover + Your Stack

## This package (ebook-whole-cover-10x)

| Trigger | What runs |
|---------|-----------|
| Push / PR to `main` | Validate required files, component surface, integration patch, secret scan |
| Manual `workflow_dispatch` | Same validation |

**Workflow:** `.github/workflows/ci.yml`  
**Local:** `npm run validate` or `node scripts/validate.mjs`

This is a **drop-in component package**, not a full app. CI proves the files are complete and safe to copy into Base44 / your React app. No build/deploy to Vercel is required for the package itself.

---

## Full-app CI/CD (your other projects)

### Pattern A — Vercel (recommended for Next/React apps)

1. Push code to GitHub.
2. In Vercel: **Add New Project** → import the repo → set framework preset.
3. Every push to `main` = production deploy; every PR = preview URL.
4. Env vars: Project Settings → Environment Variables (never commit secrets).

**Already on your Vercel team (`team_L2XAeBhptlBuRHZH2AiDlHN5`):**
- `instantoffer`
- `otto-server-wow`
- `ugc-ad-script-engine`

### Pattern B — GitHub Actions → Vercel CLI (when you need custom steps)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci && npm run build
      - name: Deploy to Vercel
        run: npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

Secrets to add in GitHub → Settings → Secrets:
- `VERCEL_TOKEN` (from Vercel account tokens)
- `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` (from project settings)

### Pattern C — Docker (you already use this)

Seen in `Planlife-agent0-openmanus`:
- `docker-publish.yml` — build on version tags `v*.*.*`
- Keep that for services that need containers; use Vercel for frontend.

---

## Recommended pipeline per product type

| Product type | CI | CD |
|--------------|----|----|
| Component pack (this repo) | GitHub Actions validate | Copy into app (or npm publish later) |
| Next/React SaaS | GitHub Actions lint/test | Vercel auto on push |
| Python agent / video pipeline | GitHub Actions + Docker | Tag → Docker image / server pull |
| Digital product (Gumroad/Whop) | Validate assets | Manual or scripted upload |

---

## Next upgrades (optional)

1. **npm publish** workflow on `v*` tags for this package.
2. **Vercel project** linked to a demo app that imports `BookCoverView`.
3. **Status badge** in README (already present).

Badge:

```markdown
![CI](https://github.com/planlifegrateful-lang/ebook-whole-cover-10x/actions/workflows/ci.yml/badge.svg)
```
