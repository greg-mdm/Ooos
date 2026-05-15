---

name: ooo-refinement-workflow
description: Lightweight refinement conventions for Ooo Digital Media Studio. Use for website polish, design system updates, exhibition pages, and presentation-quality improvements.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Ooo Refinement Workflow

## Overview

This skill guides small, careful improvements to the live Ooo Digital Media Studio website and related creative systems.

The goal is not to rebuild the project. The goal is to improve polish, clarity, accessibility, and perceived maturity while preserving artistic minimalism.

## When to Use This Skill

Use this skill when:

* polishing a live webpage
* refining the design system page
* improving exhibition pages
* adjusting CTA sections
* cleaning spacing, typography, or layout
* improving mobile responsiveness
* reviewing visual hierarchy
* preparing public-facing showcase materials

Do not use this skill for:

* major rebuilds
* unnecessary new features
* complex backend work
* autonomous agent systems
* broad technical experiments
* changes that increase visual clutter

## Core Workflow

1. Understand the current page state and identify the specific polish problem.

2. Make the smallest coherent improvement that supports artistic minimalism.

3. Check the change against:

* accessibility
* spacing
* typography hierarchy
* mobile responsiveness
* CTA visibility
* cognitive load

4. Verify the page still feels:

* calm
* modern
* exploratory
* minimal
* interactive

5. Summarize:

* what changed
* what improved
* what still feels visually weak

## Design Priorities

Prioritize:

* clarity over decoration
* restraint over spectacle
* confidence over clutter
* strong hierarchy over more content
* accessibility before visual effects
* guided exploration over information overload
* polished interaction over excessive animation

## Cross-Tool Workflow

Treat the root project files as the source of truth.

Claude, Codex, Cursor, and any other coding assistant should make real changes in the main project structure first. Do not let tools only update their own instruction folders, drafts, scratch files, or isolated agent surfaces.

After root files are updated, mirror only the necessary guidance into tool-specific folders such as `.codex/`, `.claude/`, `.cursor/`, `.opencode/`, or `.agents/`.

The goal is practical teamwork across tools: one shared project truth, with lightweight tool-specific instructions layered on top.

Ignore any cross-platform sync pattern that adds unnecessary complexity, creates duplicate competing files, or requires maintaining multiple versions of the same feature manually.

## Commit Conventions

Use simple conventional commit messages so changes are easy to track.

Format:

```text
type(area): action
```

Recommended types:

* `feat` for a new visible feature
* `fix` for correcting a problem
* `style` for visual polish
* `docs` for written guidance or documentation
* `refactor` for cleaner structure without changing the user experience

Examples:

```text
style(home): improve hero spacing
```

```text
fix(exhibition): increase CTA contrast on mobile
```

```text
feat(design-system): add interactive colour tokens
```

```text
docs(brand): clarify artistic minimalism principles
```

```text
refactor(components): simplify card layout structure
```

## Message Guidelines

* Keep the first line concise and descriptive.
* Use imperative mood: “add,” “fix,” “improve,” “clarify.”
* Avoid vague messages like “updates” or “changes.”
* Keep each commit focused on one coherent improvement.

## Practical Rule

Do not chase complexity.

For the current studio stage, the best change is usually the smallest change that makes the website feel more polished, trustworthy, accessible, and intentional.

## Typography Conventions

* Em dash (—) is banned in deliverables. Use commas, periods, colons, or parentheses.
* En dash (–) is the approximate length of a capital N. Use it between numbers, dates, or other notations to signify "(up) to and including." Examples: `2026–2027`, `pp. 14–22`, `Monday–Friday`.
* Hyphen (-) is for compound words and joined modifiers. Do not substitute for an en dash in numeric ranges.

## Project Pipeline

* Repo: `greg-mdm/Ooos` on GitHub. Default branch: `main`.
* Local working copy: `C:\Users\grego\.claude\trading_project\site`.
* Live site: `ooos.ca` via GitHub Pages.
* Deploy: GitHub Actions workflow `.github/workflows/deploy.yml` runs on every push to `main`. It runs `npm install --legacy-peer-deps`, `npm run build` (Vite), and publishes the `dist/` artifact. No manual build step required.
* CNAME: `site/public/CNAME` pins the custom domain.
* Verifying a deploy: check the Actions tab for the green run on the latest commit hash, then hard-refresh the live site.

## Code Layout (the parts touched most often)

* `site/src/app/components/Home.tsx` — homepage sections, hero, featured assets, creative offerings, Find Your Path, pool widgets.
* `site/src/app/components/Layout.tsx` — top nav and footer.
* `site/src/app/components/PathwayModal.tsx` — studio inquiry form modal.
* `site/src/app/components/SupportModal.tsx` — support / token interest modal.
* `site/src/styles/site.css` — single global stylesheet. All component classes live here.
* `site/src/app/App.tsx` — routes and modal state.

## Design Tokens (defined as CSS variables in `site.css`)

* `--electric` `#5B04DE` — Electric Indigo. Studio accent.
* `--portal` `#4B00B6` — Portal Indigo.
* `--dark-indigo` `#19007D` — Dark Indigo. Footer band, nav, dark backgrounds.
* `--resolution` `#312583` — Resolution Blue.
* `--gold` `#F0C040` — Studio CTAs, "Find Your Path" eyebrow, accents on indigo.
* `--ruby` `#822F00` — Canadian Interactive Exhibition signature color.
* `--teal` `#008080` — Used in chips. **Fails contrast on indigo, do not use as text on dark backgrounds.**
* `--serif` — display serif used for h1/h2 and large numeric values.

## Contrast Rules

Always check text against background before shipping. Recurring traps:

* Teal `#008080` on dark indigo: ~2:1, fails. Replace with gold or white.
* Gold `#F0C040` on dark indigo: ~9.4:1, passes AAA.
* Ruby `#822F00` on white: ~8.4:1, passes AAA.
* White on ruby: ~8.4:1, passes AAA.
* Dark indigo on white: ~14:1, passes AAA.

## Component Patterns

* Reuse existing classes before inventing new ones. Most layout shapes have a class already (`.section`, `.section-header`, `.dual`, `.pane`, `.support`, `.path-grid`, `.path-card`, `.path-feature`, `.pool-widget`, `.studio-ad`).
* Modals use `.modal-backdrop` + `.modal`, with `useEffect` to lock body scroll and handle Escape. Pattern is identical in `SupportModal` and `PathwayModal` — copy from there.
* Progressive disclosure pattern: see `PathCard` in `Home.tsx`. Uses `useState` for open/closed, a real `<button>` with `aria-expanded` and `aria-controls`, and the `hidden` attribute on the detail container.
* Animated number / progress widgets: see `PoolWidget`. Intersection Observer triggers animation once on scroll-in, respects `prefers-reduced-motion`. Format CAD values with `toLocaleString("en-CA", { style: "currency", currency: "CAD" })`.
* Card hover convention: `transform: translateY(-2px)` plus a border/shadow change. Consistent across the site.

## Shipping Workflow

1. Confirm the change is small and coherent. If it is not, split it.
2. Edit files in `site/src/` directly. Never edit `dist/`.
3. Run `get_errors` on touched files before committing.
4. Stage only the files relevant to the commit. Leave unrelated modified files for the user to review.
5. Commit with the conventional format (see Commit Conventions above). One commit per coherent change.
6. Push to `origin main`. The Actions deploy runs automatically.
7. Confirm the commit hash in chat so the user can verify the Pages run.

## Forms and Lead Capture

* Current state: `PathwayModal` and `SupportModal` are demo-only. Submit handlers call `preventDefault()` and set `submitted = true` without sending anywhere.
* Recommended wiring when ready: Formspree free tier, one form ID per modal, endpoints in `site/.env.local` as `VITE_FORMSPREE_*`, with `name=` attributes on all inputs and a hidden `_gotcha` honeypot. Formspree's Google Sheets plugin appends a row per submission and emails `greg@ooos.ca`.

## Things to Flag, Not Assume

* Anything destructive: branch deletion, force pushes, file deletion, dependency removal.
* Brand-affecting copy changes outside a specific instruction.
* New routes or new top-level sections.
* Adding dependencies. Check existing imports first; the project already has React, react-router-dom, Vite.
* Cross-page changes when the request was about one page.

## Memory Anchor

This file is the entry point for refining the Ooo site. When starting a new chat, the user will attach it again. Read top to bottom before making the first edit.
