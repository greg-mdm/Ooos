---
name: direct-to-main
description: Publish an approved change to ooos.ca by pushing straight to `main` (which auto-deploys via GitHub Pages), skipping pull requests and merge screens. Use whenever Greg has approved a change in chat and wants it live now. This is Greg's preferred publish workflow for the greg-mdm/Ooos repo.
---

# Direct to main

Greg's standing preference (2026-07-16): approve in chat, then Claude pushes
**straight to `main`**. Pushing `main` triggers `.github/workflows/deploy.yml`,
which builds and publishes to ooos.ca. No pull request, no merge clicks. This
replaces the older branch-and-PR flow for this repo.

## The loop

1. **Make the change.** Edit the files. Keep to Greg's copy verbatim; flag any
   new user-facing text (button labels included) for approval before it ships.
2. **Build clean.** `npm run build` must succeed (it's `vite build`, so it does
   NOT type-check — be deliberate). A clean build is the bar before every push.
3. **Show Greg.** A screenshot or a tight summary of what changed. Wait for his
   go-ahead ("ship it", "push it", "go", or similar). Never push unapproved
   work to `main`.
4. **Push to `main`.**
   ```bash
   git fetch origin main
   git rebase origin/main        # only if main moved; keeps history linear
   git push origin HEAD:main     # fast-forward → auto-deploys
   ```
   If the ambient token is stale, use gh as the credential helper:
   ```bash
   git -c credential.helper='!gh auth git-credential' push origin HEAD:main
   ```
5. **Confirm the deploy.** Check the latest `deploy.yml` run on `main` is green,
   then tell Greg it's live. GitHub Pages caches briefly, so a hard refresh may
   be needed.

## Rules

- **Never force-push `main`.** If `main` has moved, rebase your commit onto it
  and fast-forward. Don't rewrite published history (including Greg's own
  upload/merge commits — leave those alone even if a stop-hook flags them as
  Unverified; that's cosmetic and unfixable without a signing key).
- **Approval gate stays.** Direct-to-main removes the PR friction, not the
  review. Show every change and push only on Greg's word. Small, clearly
  reversible edits (typos, a colour tweak) can be treated as pre-approved only
  if Greg has said so for that class of change.
- **Cache-busters.** The homepage embeds `public/jellybean-journeys/index.html`
  and `public/Innovation Watchlist.dc.html` in iframes that re-fetch their own
  HTML at runtime. Bump the `?v=N` query in `Home.tsx` / `CID.tsx` on every edit
  to those files, or clients keep the cached copy. Same idea for the OEA
  explorer iframes (`?v=N` in the watchlist pages).
- **Committer identity.** `git config user.email noreply@anthropic.com` and
  `git config user.name Claude` so new commits carry the right author.
- **Fallback.** Only if a direct push is blocked (permissions, protected
  branch), open a PR into `main` and ask Greg to merge — then note why the
  direct path failed.

## Invoke

`/direct-to-main` after Greg approves, or just follow this loop whenever the
task is "make this change and put it live on ooos.ca."
