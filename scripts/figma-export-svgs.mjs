#!/usr/bin/env node
// Export every vector node on chosen pages of a Figma file as SVG, using the
// plain REST API. Needs VIEW access only: no editor seat, no Dev Mode MCP.
//
//   FIGMA_TOKEN=... node scripts/figma-export-svgs.mjs <fileKey> [out-dir] [page name ...]
//
// The token comes from the environment and nowhere else. Make one at
// figma.com -> Settings -> Security -> Personal access tokens, with the
// scopes "File content: read" and "File content images: read". Set it in the
// shell that runs this script; never paste it into chat or commit it.
//
// With no page names every page is exported. Names are matched exactly.
// Output: <out-dir>/<page>/<layer-name>.svg, and a manifest.json beside them.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const token = process.env.FIGMA_TOKEN;
const [fileKey, outDir = "figma-export", ...pages] = process.argv.slice(2);

if (!token) {
  console.error("FIGMA_TOKEN is not set in the environment. Set it in the shell and run again.");
  process.exit(2);
}
if (!fileKey) {
  console.error("usage: FIGMA_TOKEN=... node scripts/figma-export-svgs.mjs <fileKey> [out-dir] [page name ...]");
  process.exit(2);
}

const api = async (path) => {
  const r = await fetch(`https://api.figma.com/v1${path}`, { headers: { "X-Figma-Token": token } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} for ${path}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
};

// Exportable leaf types. Anything that draws. Frames and groups on an icon
// page are usually the icon's own wrapper, so they export too; nested
// children are skipped once a parent has been taken.
const EXPORTABLE = new Set(["COMPONENT", "INSTANCE", "FRAME", "GROUP", "VECTOR", "BOOLEAN_OPERATION", "STAR", "LINE", "ELLIPSE", "POLYGON", "RECTANGLE"]);

const safe = (s) => s.replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").trim().slice(0, 120);

const doc = await api(`/files/${fileKey}?depth=2`);
const wanted = doc.document.children.filter((p) => pages.length === 0 || pages.includes(p.name));
if (wanted.length === 0) {
  console.error(`No pages matched. Pages in this file: ${doc.document.children.map((p) => JSON.stringify(p.name)).join(", ")}`);
  process.exit(1);
}

const manifest = [];
for (const page of wanted) {
  // depth=2 gives page children only; top-level children of a page are the
  // icons themselves on a saved-icons page.
  const nodes = (page.children ?? []).filter((n) => EXPORTABLE.has(n.type));
  if (nodes.length === 0) { console.log(`[${page.name}] nothing exportable at the top level`); continue; }
  const dir = join(outDir, safe(page.name));
  await mkdir(dir, { recursive: true });
  console.log(`[${page.name}] ${nodes.length} node(s)`);

  // /images renders up to a few hundred ids per call; batch to stay polite.
  for (let i = 0; i < nodes.length; i += 50) {
    const batch = nodes.slice(i, i + 50);
    const ids = batch.map((n) => n.id).join(",");
    const { images, err } = await api(`/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=svg&svg_include_id=false&svg_simplify_stroke=true`);
    if (err) throw new Error(err);
    for (const n of batch) {
      const url = images[n.id];
      if (!url) { console.warn(`  ! no render for ${n.name} (${n.id})`); continue; }
      const svg = await (await fetch(url)).text();
      const file = join(dir, `${safe(n.name)}.svg`);
      await writeFile(file, svg);
      manifest.push({ page: page.name, id: n.id, name: n.name, type: n.type, file });
      console.log(`  ${n.name}`);
    }
  }
}
await writeFile(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} SVG(s) written under ${outDir}/`);
