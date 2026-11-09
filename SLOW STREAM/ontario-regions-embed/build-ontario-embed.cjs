// Builds public/embeds/ontario-regions.html: the Ontario section of
// ooos.ca/cid/iwatchlist as a standalone, statistics-free embed for
// slowstream.ca (Greg, 2026-11-09), with the interactive provincial map from
// the ooos.ca homepage on top and the zone cards and economic regions below.
//
// Run from the repo root:  node "SLOW STREAM/ontario-regions-embed/build-ontario-embed.cjs"
// The map data comes from the site's own modules (ontarioRegions.ts and
// ontarioContext.ts), bundled with the repo's esbuild so nothing is copied by hand.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "../..");
const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "ontario-embed-"));
const entry = path.join(tmp, "entry.ts");
const comp = path.join(root, "src/app/components").replace(/\\/g, "/");
fs.writeFileSync(entry, `import * as R from "${comp}/ontarioRegions.ts";
import * as C from "${comp}/ontarioContext.ts";
import { writeFileSync } from "fs";
writeFileSync(process.argv[2], JSON.stringify({ R, C }));
`);
const bundle = path.join(tmp, "dump.cjs");
const esbuild = path.join(root, "node_modules/esbuild/bin/esbuild");
execFileSync(process.execPath, [esbuild, entry, "--bundle", "--platform=node", "--format=cjs", "--log-level=warning", `--outfile=${bundle}`]);
const dataFile = path.join(tmp, "data.json");
execFileSync(process.execPath, [bundle, dataFile]);
const { R, C } = JSON.parse(fs.readFileSync(dataFile, "utf8"));

// Map colours chosen for reading the map, not the brand (Greg, 2026-11-09):
// Northern rock grey, Eastern deep red (Ottawa, the capital), Southwestern
// forest green (London, the Forest City), Central Blue Light, the GTA Slow
// Stream's indigo, and Toronto itself marked in gold inside it.
const TINT = {
  northern: "#868C94",
  eastern: "#9E1B32",
  central: "#4DAEFF",
  southwestern: "#2E7D32",
  gta: "#19007D",
};
const TORONTO_GOLD = "#F0C040";
// the deck's card titles, and a line of main centres in place of the statistics
const CARD = {
  gta: { big: "Greater", sub: "Toronto", sub2: "Area (GTA)", centres: "Toronto · Mississauga · Brampton" },
  northern: { big: "Northern", sub: "Ontario", centres: "Sudbury · Thunder Bay · Sault Ste. Marie" },
  eastern: { big: "Eastern", sub: "Ontario", centres: "Ottawa · Kingston · Belleville" },
  southwestern: { big: "Southwestern", sub: "Ontario", centres: "London · Windsor · Sarnia" },
  central: { big: "Central", sub: "Ontario", centres: "Hamilton · Kitchener · Barrie" },
};
const cardOrder = ["gta", "northern", "eastern", "southwestern", "central"];
const columnOrder = ["northern", "eastern", "southwestern", "central", "gta"];
const COLUMN_HEAD = { northern: "Northern", eastern: "Eastern", southwestern: "Southwestern", central: "Central", gta: "GTA" };

const byId = Object.fromEntries(R.ONTARIO_ZONES.map((z) => [z.id, z]));
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const cards = cardOrder.map((id) => {
  const c = CARD[id], z = byId[id];
  const centres = c.centres.split(" · ").map((n, i, a) => `<span>${esc(n)}${i < a.length - 1 ? " &middot;" : ""}</span>`).join(" ");
  return `        <li class="zcard" data-zone="${id}" tabindex="0" style="--tint:${TINT[id]}">
          <span class="zcard__big">${c.big}</span>
          <span class="zcard__sub">${c.sub}</span>${c.sub2 ? `\n          <span class="zcard__sub2">${c.sub2}</span>` : ""}
          <span class="zcard__centres">${centres}</span>
          <span class="zcard__code">${z.code}</span>
        </li>`;
}).join("\n");

// every GTA municipality by name, grouped by its region, from the official
// Region of Peel GTA map the dashboard already uses (R.GTA_MUNICIPALITIES);
// listed in the GTA column under Toronto (Greg, 2026-11-09)
const gtaCount = R.GTA_MUNICIPALITIES.reduce((n, g) => n + g.places.length, 0);
const gtaPlaces = `
            <div class="gta">
              <p class="gta__head">${gtaCount} municipalities</p>
              <ul class="gta__list">
${R.GTA_MUNICIPALITIES.map((g) => `                <li><span class="gta__group">${esc(g.group)}</span><span class="gta__names">${g.places.map(esc).join(", ")}</span></li>`).join("\n")}
              </ul>
              <p class="gta__source">Source: Region of Peel, Peel Data Centre GTA map (2022)</p>
            </div>`;

const columns = columnOrder.map((id) => {
  const z = byId[id];
  const items = z.regions.map((r) => `<li data-region="${r.id}" data-zone="${id}" tabindex="0">${esc(r.name)}</li>`).join("");
  return `          <div class="ecol" data-zone="${id}" style="--tint:${TINT[id]}">
            <p class="ecol__head">${COLUMN_HEAD[id]}</p>
            <ul>${items}</ul>${id === "gta" ? gtaPlaces : ""}
          </div>`;
}).join("\n");

// everything the map script draws, in the order the homepage draws it
const MAP = {
  views: {
    ontario: { viewBox: C.ONTARIO_CONTEXT_VIEWBOX, land: C.CONTEXT_PATHS.ontario.land, lakes: C.CONTEXT_PATHS.ontario.lakes, labels: C.ONTARIO_LABELS },
    gta: { viewBox: C.GTA_VIEWBOX, land: C.CONTEXT_PATHS.gta.land, lakes: C.CONTEXT_PATHS.gta.lakes, labels: C.GTA_LABELS },
  },
  usa: C.USA_PATH,
  border: C.CANADA_US_BORDER,
  cities: C.GTA_CITIES,
  toronto: C.GTA_CITIES.find((c) => c.name === "Toronto"),
  simcoe: { d: C.SIMCOE_PATH, x: C.SIMCOE_CENTRE.x, y: C.SIMCOE_CENTRE.y },
  zones: columnOrder.map((id) => ({
    id,
    name: byId[id].name,
    tint: TINT[id],
    regions: byId[id].regions.map((r) => ({ id: r.id, name: r.name, d: R.ONTARIO_REGION_PATHS[r.id] })),
  })),
};

const html = fs.readFileSync(path.join(__dirname, "ontario-embed-template.html"), "utf8")
  .replace("%%CARDS%%", cards)
  .replace("%%COLUMNS%%", columns)
  .replace(/%%GOLD%%/g, TORONTO_GOLD)
  .replace("%%MAP_DATA%%", JSON.stringify(MAP));
fs.writeFileSync(path.join(root, "public/embeds/ontario-regions.html"), html);
fs.rmSync(tmp, { recursive: true, force: true });
console.log("ok", html.length);
