// After `vite build`: give every app route its own page in dist, so GitHub
// Pages answers ooos.ca/exhibition (and the rest) with 200 OK instead of
// the 404 that 404.html's redirect shim rides on (Greg, 2026-10-24: search
// engines, link previews and agents read those pages as missing). Pages
// serves /exhibition from exhibition.html; each copy is the built
// index.html, so the app loads and routes as before. Keep this list in step
// with the <Route>s in src/app/App.tsx.
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const ROUTES = [
  "exhibition",
  "cix",
  "ostara",
  "about",
  "cid",
  "cid/iwatchlist",
  "iwatchlist",
  "mic",
  "mic/twelve-signs",
  "pop-clock-mini",
];

const index = join(dist, "index.html");
for (const route of ROUTES) {
  const page = join(dist, `${route}.html`);
  // never cover a real file of the same name copied in from public/
  if (existsSync(page)) { console.log(`spa-routes: kept existing ${route}.html`); continue; }
  copyFileSync(index, page);
}
console.log(`spa-routes: ${ROUTES.length} route pages written`);
