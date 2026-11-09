// Builds public/embeds/ontario-regions.html from the site's own region data
// (src/app/components/ontarioRegions.ts): the watchlist's Ontario section as a
// standalone, statistics-free embed for slowstream.ca (Greg, 2026-11-09).
const fs = require("fs");
const root = "C:/Users/ooodi/Projects/Ooos-publish/";
const src = fs.readFileSync(root + "src/app/components/ontarioRegions.ts", "utf8");

const paths = {};
const pi = src.indexOf("export const ONTARIO_REGION_PATHS");
for (const m of src.slice(pi).matchAll(/"(\d{4})"\s*:\s*"([^"]+)"/g)) paths[m[1]] = m[2];

const zi = src.indexOf("export const ONTARIO_ZONES");
const zonesText = src.slice(src.indexOf("= [", zi) + 2, src.indexOf("];", zi) + 1).replace("GTA_MUNICIPALITIES", "[]");
const zones = JSON.parse(zonesText);
const byId = Object.fromEntries(zones.map((z) => [z.id, z]));

// the deck's own map tints, sampled from its image (public/on-webp.webp)
const TINT = { northern: "#81AAB8", eastern: "#775F75", southwestern: "#6A8080", gta: "#905D5E", central: "#6A8798" };
// the deck's card titles, and a line of main centres in place of the statistics
const CARD = {
  gta: { big: "Greater", sub: "Toronto", sub2: "Area (GTA)", centres: "Toronto · Mississauga · Brampton" },
  northern: { big: "Northern", sub: "Ontario", centres: "Sudbury · Thunder Bay · Sault Ste. Marie" },
  eastern: { big: "Eastern", sub: "Ontario", centres: "Ottawa · Kingston · Belleville" },
  southwestern: { big: "Southwestern", sub: "Ontario", centres: "London · Windsor · Sarnia" },
  central: { big: "Central", sub: "Ontario", centres: "Hamilton · Kitchener · Barrie" },
};
// map labels, placed beside each zone on the 1000-wide map
const LABELS = [
  { id: "northern", text: "Northern", x: 300, y: 690, anchor: "middle" },
  { id: "eastern", text: "Eastern", x: 930, y: 636, anchor: "middle" },
  { id: "southwestern", text: "Southwestern", x: 596, y: 905, anchor: "end" },
  { id: "gta", text: "GTA", x: 834, y: 838, anchor: "start" },
  { id: "central", text: "Central", x: 822, y: 948, anchor: "start" },
];
const cardOrder = ["gta", "northern", "eastern", "southwestern", "central"];
const columnOrder = ["northern", "eastern", "southwestern", "central", "gta"];
const COLUMN_HEAD = { northern: "Northern", eastern: "Eastern", southwestern: "Southwestern", central: "Central", gta: "GTA" };

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const mapZones = columnOrder.map((id) => {
  const z = byId[id];
  const p = z.regions.map((r) => `<path data-region="${r.id}" d="${paths[r.id]}"><title>${esc(r.name)}</title></path>`).join("\n        ");
  return `      <g class="zone" data-zone="${id}" style="--tint:${TINT[id]}">\n        ${p}\n      </g>`;
}).join("\n");

const mapLabels = LABELS.map((l) =>
  `      <text class="map-label" data-zone="${l.id}" x="${l.x}" y="${l.y}" text-anchor="${l.anchor}">${l.text}</text>`).join("\n");

const cards = cardOrder.map((id) => {
  const c = CARD[id], z = byId[id];
  return `        <li class="zcard" data-zone="${id}" tabindex="0">
          <span class="zcard__big">${c.big}</span>
          <span class="zcard__sub">${c.sub}</span>${c.sub2 ? `\n          <span class="zcard__sub2">${c.sub2}</span>` : ""}
          <span class="zcard__centres">${c.centres.split(" · ").map((n, i, a) => `<span>${esc(n)}${i < a.length - 1 ? " &middot;" : ""}</span>`).join(" ")}</span>
          <span class="zcard__code">${z.code}</span>
        </li>`;
}).join("\n");

const columns = columnOrder.map((id) => {
  const z = byId[id];
  const items = z.regions.map((r) => `<li data-region="${r.id}" data-zone="${id}" tabindex="0">${esc(r.name)}</li>`).join("");
  return `          <div class="ecol" data-zone="${id}">
            <p class="ecol__head">${COLUMN_HEAD[id]}</p>
            <ul>${items}</ul>
          </div>`;
}).join("\n");

const html = fs.readFileSync(__dirname + "/ontario-embed-template.html", "utf8")
  .replace("%%MAP_ZONES%%", mapZones)
  .replace("%%MAP_LABELS%%", mapLabels)
  .replace("%%CARDS%%", cards)
  .replace("%%COLUMNS%%", columns);
fs.writeFileSync(root + "public/embeds/ontario-regions.html", html);
console.log("ok", html.length);
