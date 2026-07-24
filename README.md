
# Portfolio

React + Vite single-page site, deployed on Vercel.

## Admin panel

Log in from the site (there's a hidden trigger — ask Rohit) with `rohit` /
the admin password. From there you can edit Hero, About, Experience,
Projects, and Research entirely from the UI: add, edit, or remove any
project or work-experience card, change bios, tech tags, bullet points,
etc.

Edits are a **private draft** stored in your browser until you hit
**Publish Changes Live**. Publishing commits the updated content straight
to this repo (`src/data/content.json`) via the GitHub API, which triggers
Vercel to redeploy — so it goes live for every visitor, not just your
browser. Until you publish, nobody else sees your changes.

### One-time setup for Publish to work

The publish button calls a small serverless function at `/api/publish`,
which needs a GitHub token to commit on your behalf. This token lives
**only** as a Vercel environment variable — it's never shipped to the
browser.

1. Create a GitHub **fine-grained personal access token**:
   [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new)
   - Repository access: only this repo (`RohitThanvi/portfolio`)
   - Permissions: **Contents → Read and write**
2. In the Vercel dashboard: this project → **Settings → Environment
   Variables** → add `GITHUB_TOKEN` = the token from step 1 → apply to
   Production (and Preview if you want drafts publishable from preview
   deploys too).
3. Redeploy once so the function picks up the new env var.

That's it — after that, "Publish Changes Live" in the admin panel works
end to end.

### Gallery

The Gallery page (`/gallery`) is separate from the draft/publish flow
above — as admin, uploading or deleting a photo there commits directly
to the repo immediately (both the image file under `public/gallery/`
and the entry in `content.json`), the same way a blog's "publish" button
would. There's no draft step for gallery photos: what you upload is what
visitors see, once Vercel finishes redeploying (usually under a minute).

Uses the same `GITHUB_TOKEN` env var as the main publish flow — no extra
setup needed beyond what's above.

### Changing the admin password

The password isn't stored in plaintext anywhere — only its SHA-256 hash,
in two places that need to stay in sync:
- `src/data/portfolio.js` → `ADMIN_PASSWORD_HASH`
- `api/publish.js` → `ADMIN_PASSWORD_HASH`

To change it: compute `sha256("your-new-password")` and paste the hex
digest into both files.
