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

// Quebec and Manitoba in their flag colours (Greg, 2026-11-09). The context
// land is one shape for all of Canada, so each neighbour is drawn as the area
// beyond Ontario's own edge: for every row of the map, everything west of
// Ontario's westernmost point is Manitoba and everything east of its
// easternmost point is Quebec. The shapes run 3 units under Ontario so no seam
// shows, are clipped to the land on the map, and the United States is painted
// over them, so only Canadian land takes the colour.
function edges(ds) {
  const segs = [];
  for (const d of ds) {
    for (const sub of d.split(/(?=M)/)) {
      const n = sub.match(/-?\d+(\.\d+)?/g).map(Number);
      const pts = [];
      for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]);
      for (let i = 0; i < pts.length; i++) segs.push([pts[i], pts[(i + 1) % pts.length]]);
    }
  }
  return segs;
}
function across(segs, y) {
  const xs = [];
  for (const [[x1, y1], [x2, y2]] of segs) {
    if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
  }
  return xs;
}
const allSegs = edges(Object.values(R.ONTARIO_REGION_PATHS));
const STEP = 2, INSET = 3, TOP = -120, BOTTOM = 1180;
const rows = [];
for (let y = TOP; y <= BOTTOM; y += STEP) {
  const xs = across(allSegs, y);
  rows.push({ y, min: xs.length ? Math.min(...xs) : null, max: xs.length ? Math.max(...xs) : null });
}
const firstRow = rows.find((r) => r.min !== null), lastRow = [...rows].reverse().find((r) => r.min !== null);
const f = (n) => n.toFixed(1);
// each shape stops at the Canada-US border (yEnd), so nothing south of it,
// and no stretch of Ontario's own shoreline, can pick up the colour
function side(pick, far, fallbackTop, yEnd, floor) {
  const line = rows.filter((r) => r.y <= yEnd).map((r) => {
    let x = r[pick] !== null ? r[pick] + (pick === "min" ? INSET : -INSET) : fallbackTop;
    if (floor && r.y < floor.below) x = Math.max(x, floor.x);
    return `${f(x)} ${r.y}`;
  });
  return `M${far} ${TOP}L${line.join("L")}L${far} ${yEnd}Z`;
}
// Manitoba: west of the border, down to the 49th parallel at Lake of the Woods
// (the boundary path meets x = 0 at about y 507 to 533); Quebec: east of
// James Bay and Ontario, down to the 45th parallel east of Cornwall (the
// boundary reaches 977, 701 there)
const manitobaD = side("min", -2000, firstRow.min + INSET, 560);
// above the top of Northeastern Ontario, Quebec starts on James Bay's east
// shore (x 640), so the Nunavut islands in James Bay and Hudson Bay (Akimiski,
// the Belchers) stay plain land
const quebecD = side("max", 3000, 650, 702, { below: 330, x: 640 });
const PROVINCES = [
  { id: "manitoba", name: "Manitoba", d: manitobaD },
  { id: "quebec", name: "Quebec", d: quebecD },
];

// everything the map script draws, in the order the homepage draws it
const MAP = {
  provinces: PROVINCES,
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
