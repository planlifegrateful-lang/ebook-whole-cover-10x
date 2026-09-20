# CI/CD for Ebook Whole-Cover + Your Stack

## Status (2026-09-20)

| Layer | Status |
|-------|--------|
| Package + components | Live on GitHub |
| Local validate (`npm run validate`) | Passes |
| GitHub Actions workflow file | Present at `.github/workflows/ci.yml` |
| GitHub Actions **runs** | **Blocked** — account locked due to billing issue |
| Vercel CD for full apps | Available (team already has 3 projects) |

**Fix Actions:** GitHub → Settings → Billing → resolve payment / unlock account. After unlock, re-run the workflow from the Actions tab (or push any commit).

---

## This package (ebook-whole-cover-10x)

| Trigger | What runs |
|---------|-----------|
| Push / PR to `main` | Validate required files + component surface + integration patch |
| Manual `workflow_dispatch` | Same validation |

**Workflow:** `.github/workflows/ci.yml`  
**Local (works now):** `npm run validate` or `node scripts/validate.mjs`

This is a **drop-in component package**. CI proves files are complete. No Vercel deploy needed for the package itself.

---

## Full-app CI/CD (your other projects)

### Pattern A — Vercel (recommended for Next/React)

Your Vercel team (`team_L2XAeBhptlBuRHZH2AiDlHN5`) already has:
- `instantoffer`
- `otto-server-wow`
- `ugc-ad-script-engine`

**Flow:** push to GitHub → Vercel auto-deploys production on `main`, preview on PRs. Env vars stay in Vercel dashboard (never in git).

### Pattern B — GitHub Actions → Vercel CLI

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

Requires GitHub billing unlocked + secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

### Pattern C — Docker (already in your account)

`Planlife-agent0-openmanus` uses:
- `docker-publish.yml` on tags `v*.*.*`
- Keep for agents/services; use Vercel for frontends.

---

## Recommended by product type

| Product type | CI | CD |
|--------------|----|----|
| Component pack (this repo) | `npm run validate` + Actions (after billing) | Copy into app |
| Next/React SaaS | Lint/test | **Vercel** auto on push |
| Python agent / video | Actions + Docker | Tag → image |
| Digital product (Gumroad/Whop) | Asset checks | Manual / script upload |

---

## Immediate actions for you

1. **Unlock GitHub billing** so Actions can run.  
2. Until then, run **local CI**: `node scripts/validate.mjs` (already green).  
3. For app deploys, prefer **Vercel** (no Actions dependency).  
4. After billing is fixed: Actions tab → CI → Re-run jobs.
