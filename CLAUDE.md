# CLAUDE.md

**Read `SPRINT 5 - CURRENT/WORKING-GUIDE.md` first.** That is the working guide:
site and business structure, the publish workflow, and the writing/typography
rules. This root file exists only because Claude Code auto-loads `CLAUDE.md`
from the repo root and nowhere else.

Older documentation is archived in `SPRINT 4 - REFERENCES/`.
Sprints 1–3 live in Google Drive, not in this repo.

The three things that most often go wrong, in case nothing else gets read:

1. **Publish with `git push origin HEAD:main`.** Nothing else. `gh` is not
   installed here, so any `gh auth` recipe is a no-op. Never push unapproved
   work; Greg approves in chat first. Pushing to `main` auto-deploys to ooos.ca.
2. **No em dashes, ever.** Spell out an acronym on first use, term first with
   the acronym in brackets, expansion lowercase: `augmented reality (AR)`.
   Greg's supplied copy is used verbatim; flag any new wording for approval.
3. **Prose blocks get a 55–65ch measure and `text-wrap: balance`**, so a
   paragraph reads as one clean shape instead of a ragged edge with a short
   last line.
