/*!
 * Ooo! Pop Clock Mini — Automated Predictive Model
 * Standalone, dependency-free embed of the Ooo population clock widget.
 *
 * A simplified mini model adapted from Statistics Canada's Canada population
 * clock concept. It uses public aggregate Statistics Canada tables through
 * the Web Data Service (WDS). It is not the official Statistics Canada
 * population clock and does not imply endorsement by Statistics Canada.
 *
 * Usage:
 *   <div id="ooo-pop-clock"></div>
 *   <script src="ooo-pop-clock.js"></script>
 *
 * Optional (custom mount point / options):
 *   <script>
 *     window.OooPopClock.mount(document.querySelector("#my-el"), { detailed: true });
 *   </script>
 *
 * See README.md for how the model works, data sources, and configuration.
 * (c) Ooo Digital Media Studio — ooos.ca. Data: Statistics Canada (open data).
 */
(function () {
  "use strict";

  // ------------------------------------------------------------- configuration
  var scriptBase = (function () {
    var src = (document.currentScript && document.currentScript.src) || "";
    return src ? src.slice(0, src.lastIndexOf("/") + 1) : "";
  })();

  var CONFIG = {
    wdsBase: "https://www150.statcan.gc.ca/t1/wds/rest",
    products: {
      population: 17100009,            // 17-10-0009-01 Population estimates, quarterly
      naturalIncrease: 17100059,       // 17-10-0059-01 Components of natural increase
      internationalMigration: 17100040 // 17-10-0040-01 Components of international migration
      // 17-10-0045-01 (interprovincial) intentionally unused: nets to ~0 nationally.
    },
    // Once exact vector IDs are confirmed, fill ALL of these to skip the
    // metadata round-trip (getDataFromVectorsAndLatestNPeriods fast path).
    vectorOverrides: {
      population: null, births: null, deaths: null, immigrants: null,
      emigrants: null, returningEmigrants: null,
      netTemporaryEmigration: null, netNonPermanentResidents: null
    },
    cacheKey: "ooo-pop-clock-v1",
    cacheTtlMs: 24 * 60 * 60 * 1000,      // refetch at most daily (quarterly data)
    cacheMaxAgeMs: 7 * 24 * 60 * 60 * 1000, // refuse stale cache older than this
    requestTimeoutMs: 15000,
    wordmarkUrl: scriptBase + "ooo-wordmark-portal-transparent.png",
    officialClockUrl: "https://www150.statcan.gc.ca/n1/pub/71-607-x/71-607-x2018005-eng.htm"
  };

  var SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;
  var SOURCE_LINE =
    "Source: Statistics Canada, Canada’s population clock (real-time model), and " +
    "related public data tables. Adapted using Statistics Canada Web Data Service. " +
    "This does not imply endorsement by Statistics Canada.";

  var MEMBER_NAMES = {
    geography: "canada",
    naturalIncrease: { births: "births", deaths: "deaths" },
    migration: {
      immigrants: "immigrants",
      emigrants: "emigrants",
      returningEmigrants: "returning emigrants",
      netTemporaryEmigration: "net temporary emigration",
      netNonPermanentResidents: "net non-permanent residents"
    }
  };
  var COMPONENT_KEYS = ["births", "deaths", "immigrants", "emigrants",
    "returningEmigrants", "netTemporaryEmigration", "netNonPermanentResidents"];

  // ------------------------------------------------------------------ WDS I/O
  function wdsPost(method, body) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, CONFIG.requestTimeoutMs);
    return fetch(CONFIG.wdsBase + "/" + method, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    }).then(function (res) {
      if (!res.ok) throw new Error("WDS " + method + " responded " + res.status);
      return res.json();
    }).then(function (json) {
      if (!Array.isArray(json)) throw new Error("WDS " + method + " returned a non-array payload");
      return json;
    }).finally(function () { clearTimeout(timer); });
  }

  function successObject(env, what) {
    if (!env || env.status !== "SUCCESS" || !env.object) throw new Error("WDS did not return " + what);
    return env.object;
  }

  function points(env, what) {
    return successObject(env, what).vectorDataPoint || [];
  }

  // -------------------------------------------------------- coordinate lookup
  function findMemberId(dims, dimMatch, memberName) {
    for (var i = 0; i < dims.length; i++) {
      if (!dimMatch.test(dims[i].dimensionNameEn)) continue;
      var members = dims[i].member || [];
      for (var j = 0; j < members.length; j++) {
        if (members[j].memberNameEn.trim().toLowerCase() === memberName.toLowerCase()) {
          return { positionId: dims[i].dimensionPositionId, memberId: members[j].memberId };
        }
      }
      return null;
    }
    return null;
  }

  /** WDS coordinates: 10 dot-separated member IDs, zero-padded. */
  function buildCoordinate(meta, componentDimMatch, componentName) {
    var geo = findMemberId(meta.dimension, /geograph/i, MEMBER_NAMES.geography);
    if (!geo) return null;
    var slots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    slots[geo.positionId - 1] = geo.memberId;
    if (componentDimMatch && componentName) {
      var comp = findMemberId(meta.dimension, componentDimMatch, componentName);
      if (!comp) return null;
      slots[comp.positionId - 1] = comp.memberId;
    }
    return slots.join(".");
  }

  function sumLatest(pts, n) {
    var usable = pts.filter(function (p) { return p.value != null; }).slice(-n);
    if (usable.length < n) return null;
    return usable.reduce(function (acc, p) { return acc + p.value; }, 0);
  }

  // -------------------------------------------------------------- data fetch
  function fetchFromWds() {
    var v = CONFIG.vectorOverrides;
    var allVectors = v.population != null && COMPONENT_KEYS.every(function (k) { return v[k] != null; });

    var seriesPromise;
    if (allVectors) {
      var vecReqs = [{ vectorId: v.population, latestN: 6 }].concat(
        COMPONENT_KEYS.map(function (k) { return { vectorId: v[k], latestN: 4 }; }));
      seriesPromise = wdsPost("getDataFromVectorsAndLatestNPeriods", vecReqs).then(function (res) {
        return { keys: ["population"].concat(COMPONENT_KEYS), series: res.map(function (e, i) { return points(e, "vector #" + i); }) };
      });
    } else {
      seriesPromise = wdsPost("getCubeMetadata", [
        { productId: CONFIG.products.population },
        { productId: CONFIG.products.naturalIncrease },
        { productId: CONFIG.products.internationalMigration }
      ]).then(function (metaRes) {
        var meta = {};
        metaRes.forEach(function (env) {
          if (env.status === "SUCCESS" && env.object) meta[Number(env.object.productId)] = env.object;
        });
        var popMeta = meta[CONFIG.products.population];
        if (!popMeta) throw new Error("Population cube metadata unavailable");
        var popCoord = buildCoordinate(popMeta, null, null);
        if (!popCoord) throw new Error("Could not resolve the Canada population coordinate");

        var compDim = /component|estimate/i;
        var requests = [{ productId: CONFIG.products.population, coordinate: popCoord, latestN: 6 }];
        var keys = ["population"];
        var natMeta = meta[CONFIG.products.naturalIncrease];
        var migMeta = meta[CONFIG.products.internationalMigration];
        if (natMeta) Object.keys(MEMBER_NAMES.naturalIncrease).forEach(function (key) {
          var coord = buildCoordinate(natMeta, compDim, MEMBER_NAMES.naturalIncrease[key]);
          if (coord) { requests.push({ productId: CONFIG.products.naturalIncrease, coordinate: coord, latestN: 4 }); keys.push(key); }
        });
        if (migMeta) Object.keys(MEMBER_NAMES.migration).forEach(function (key) {
          var coord = buildCoordinate(migMeta, compDim, MEMBER_NAMES.migration[key]);
          if (coord) { requests.push({ productId: CONFIG.products.internationalMigration, coordinate: coord, latestN: 4 }); keys.push(key); }
        });
        return wdsPost("getDataFromCubePidCoordAndLatestNPeriods", requests).then(function (res) {
          return { keys: keys, series: res.map(function (e, i) { return points(e, "cube series #" + i); }) };
        });
      });
    }

    return seriesPromise.then(function (result) {
      var byKey = {};
      result.keys.forEach(function (k, i) { byKey[k] = result.series[i]; });

      var popPts = (byKey.population || []).filter(function (p) { return p.value != null; });
      if (!popPts.length) throw new Error("No population estimate values returned");
      var latest = popPts[popPts.length - 1];

      // tier 2 rate: year-over-year change in the estimate itself
      var yoy = popPts.length >= 5 ? latest.value - popPts[popPts.length - 5].value : null;

      // tier 1 rate: sum of components over the latest four quarters
      var sums = {}, haveAll = COMPONENT_KEYS.every(function (k) {
        var s = byKey[k]; if (!s) return false;
        var total = sumLatest(s, 4); if (total == null) return false;
        sums[k] = total; return true;
      });
      var componentChange = haveAll
        ? sums.births - sums.deaths + sums.immigrants - sums.emigrants +
          sums.returningEmigrants - sums.netTemporaryEmigration + sums.netNonPermanentResidents
        : null;

      // prefer components, sanity-checked against year-over-year
      var sane = componentChange != null && (yoy == null ||
        Math.abs(componentChange - yoy) <= Math.max(Math.abs(yoy) * 0.5, 100000));
      var annualNetChange, rateBasis;
      if (componentChange != null && sane) { annualNetChange = componentChange; rateBasis = "components"; }
      else if (yoy != null) { annualNetChange = yoy; rateBasis = "year-over-year"; }
      else throw new Error("Could not derive an annual net change from StatCan data");

      return {
        basePopulation: latest.value,
        baseReferenceDate: latest.refPer,
        annualNetChange: annualNetChange,
        netChangePerSecond: annualNetChange / SECONDS_PER_YEAR,
        rateBasis: rateBasis,
        sourceTables: rateBasis === "components"
          ? ["17-10-0009-01", "17-10-0059-01", "17-10-0040-01"]
          : ["17-10-0009-01"],
        fetchedAt: new Date().toISOString()
      };
    });
  }

  // ------------------------------------------------------------------ caching
  function readCache() {
    try {
      var raw = localStorage.getItem(CONFIG.cacheKey);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.data || typeof parsed.cachedAt !== "number") return null;
      if (typeof parsed.data.basePopulation !== "number" || !isFinite(parsed.data.netChangePerSecond)) return null;
      return parsed;
    } catch (e) { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(CONFIG.cacheKey, JSON.stringify({ data: data, cachedAt: Date.now() })); } catch (e) { /* best effort */ }
  }

  function loadData() {
    var cached = readCache();
    if (cached && Date.now() - cached.cachedAt < CONFIG.cacheTtlMs) return Promise.resolve(cached.data);
    return fetchFromWds().then(function (fresh) {
      writeCache(fresh);
      return fresh;
    }).catch(function (err) {
      // a not-too-stale cache (its refresh date stays visible) beats an error card
      if (cached && Date.now() - cached.cachedAt < CONFIG.cacheMaxAgeMs) return cached.data;
      throw err;
    });
  }

  // -------------------------------------------------------------------- model
  var fmt = new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 });
  function signed(n) { return (n > 0 ? "+" : n < 0 ? "−" : "") + fmt.format(Math.abs(n)); }
  function readModel(data, now) {
    now = now || Date.now();
    var baseT = Date.parse(data.baseReferenceDate + "T00:00:00Z");
    if (isNaN(baseT)) baseT = Date.parse(data.fetchedAt);
    var midnight = new Date(now); midnight.setHours(0, 0, 0, 0);
    return {
      currentPopulation: Math.round(data.basePopulation + Math.max(0, (now - baseT) / 1000) * data.netChangePerSecond),
      changeSinceMidnight: Math.round(Math.max(0, (now - midnight.getTime()) / 1000) * data.netChangePerSecond)
    };
  }
  function formatRefDate(iso) {
    var t = Date.parse(iso + "T00:00:00Z");
    if (isNaN(t)) return iso;
    return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(t);
  }

  // ------------------------------------------------------------------- styles
  var CSS = [
    ".opc-card{--opc-ink:#1f2a2e;--opc-mut:#5c6c70;--opc-line:rgba(31,42,46,.14);--opc-up:#0a6847;",
    "--opc-down:#8f1d1d;--opc-link:#26547c;--opc-portal:#4B00B6;--opc-indigo:#2B0561;",
    "box-sizing:border-box;width:100%;max-width:420px;padding:16px 20px 14px;background:#fff;",
    "border:1px solid var(--opc-line);border-radius:14px;box-shadow:0 10px 30px rgba(8,16,38,.1);",
    "color:var(--opc-ink);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;",
    "font-size:16px;line-height:1.5;text-align:left}",
    ".opc-card *{box-sizing:border-box;margin:0}",
    ".opc-kicker{margin-bottom:6px;font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--opc-mut)}",
    ".opc-h2{display:flex;align-items:center;gap:10px;margin-bottom:2px;line-height:1}",
    ".opc-wordmark{height:26px;width:auto;display:block}",
    ".opc-h2-text{font-weight:800;font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:var(--opc-portal)}",
    ".opc-h3{margin-bottom:10px;font-size:9.5px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--opc-indigo)}",
    ".opc-status{margin-bottom:8px;padding:8px 0;font-size:13px;color:var(--opc-mut)}",
    ".opc-status--error{color:var(--opc-down);font-weight:600}",
    ".opc-figure{margin-bottom:8px;padding-top:8px;border-top:1px solid var(--opc-line)}",
    ".opc-label{font-size:11px;font-weight:600;letter-spacing:.02em;color:var(--opc-mut);margin-bottom:2px}",
    ".opc-value{font-size:34px;font-weight:700;line-height:1.1;font-variant-numeric:tabular-nums;color:var(--opc-ink)}",
    ".opc-delta{margin-top:4px;font-size:12px;color:var(--opc-mut)}",
    ".opc-delta-num{font-weight:700;font-variant-numeric:tabular-nums;color:var(--opc-up)}",
    ".opc-delta-num.is-down{color:var(--opc-down)}",
    ".opc-meta{margin-bottom:8px;font-size:10.5px;color:var(--opc-mut)}",
    ".opc-about{margin-bottom:8px;font-size:11.5px;line-height:1.45;color:var(--opc-ink)}",
    ".opc-about--example{color:var(--opc-indigo);font-weight:600}",
    ".opc-srcline{margin-bottom:8px;font-size:10px;line-height:1.45;color:var(--opc-mut)}",
    ".opc-link{display:inline-block;font-size:12px;font-weight:700;color:var(--opc-link);text-decoration:underline;text-underline-offset:2px}",
    ".opc-link:hover{filter:brightness(1.2)}",
    ".opc-link:focus-visible{outline:2px solid var(--opc-portal);outline-offset:2px}"
  ].join("");

  function injectStyles() {
    if (document.getElementById("opc-styles")) return;
    var style = document.createElement("style");
    style.id = "opc-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ------------------------------------------------------------------- render
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function mount(target, options) {
    options = options || {};
    var detailed = options.detailed !== false; // detailed by default
    injectStyles();

    var card = el("aside", "opc-card");
    card.setAttribute("aria-label", "Ooo! Pop Clock Mini — automated predictive model");
    card.appendChild(el("p", "opc-kicker", "Humans of Canada"));

    var h2 = el("h2", "opc-h2");
    var mark = document.createElement("img");
    mark.className = "opc-wordmark";
    mark.src = options.wordmarkUrl || CONFIG.wordmarkUrl;
    mark.alt = "Ooo!";
    h2.appendChild(mark);
    h2.appendChild(el("span", "opc-h2-text", "Pop Clock Mini"));
    card.appendChild(h2);
    card.appendChild(el("h3", "opc-h3", "Automated Predictive Model"));

    var status = el("p", "opc-status", "Loading the latest Statistics Canada estimates…");
    status.setAttribute("role", "status");
    card.appendChild(status);

    target.appendChild(card);

    loadData().then(function (data) {
      status.remove();

      var figure = el("div", "opc-figure");
      figure.appendChild(el("div", "opc-label", "Estimated population"));
      // Recomputed every second — intentionally NOT an aria-live region, so
      // screen readers aren't spammed; the value reads out on focus/pass.
      var value = el("div", "opc-value", "—");
      figure.appendChild(value);
      var delta = el("div", "opc-delta");
      delta.appendChild(document.createTextNode("(a change of "));
      var deltaNum = el("span", "opc-delta-num", "—");
      delta.appendChild(deltaNum);
      delta.appendChild(document.createTextNode(" since midnight)"));
      figure.appendChild(delta);
      card.appendChild(figure);

      if (detailed) {
        card.appendChild(el("p", "opc-meta",
          "Base estimate: " + formatRefDate(data.baseReferenceDate) +
          " · Data refreshed: " + new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(data.fetchedAt)) +
          " · Rate basis: " + (data.rateBasis === "components"
            ? "births, deaths and international migration, latest four quarters"
            : "year-over-year change in the quarterly estimate") +
          " · " + data.sourceTables.join(", ")));
        card.appendChild(el("p", "opc-about",
          "This widget tracks quarterly population estimates using publicly available data tables, " +
          "which are updated every three months to reflect natural growth and migration patterns. " +
          "Disclaimer: This is an experimental tool and is not endorsed by Statistics Canada."));
        card.appendChild(el("p", "opc-about opc-about--example",
          "A custom widget example — the kind of innovative media you can create with Canada’s open data sources."));
      }
      card.appendChild(el("p", "opc-srcline", SOURCE_LINE));
      var link = el("a", "opc-link", "View Canada’s official population clock");
      link.href = CONFIG.officialClockUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(link);

      function tick() {
        var r = readModel(data);
        value.textContent = fmt.format(r.currentPopulation);
        deltaNum.textContent = signed(r.changeSinceMidnight);
        deltaNum.classList.toggle("is-down", r.changeSinceMidnight < 0);
      }
      tick();
      setInterval(tick, 1000);
    }).catch(function () {
      status.textContent = "Latest Statistics Canada data could not be loaded.";
      status.className = "opc-status opc-status--error";
      var link = el("a", "opc-link", "View Canada’s official population clock");
      link.href = CONFIG.officialClockUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(el("p", "opc-srcline", SOURCE_LINE));
      card.appendChild(link);
    });
  }

  // ----------------------------------------------------------------- bootstrap
  window.OooPopClock = { mount: mount, config: CONFIG };

  function autoMount() {
    var auto = document.getElementById("ooo-pop-clock");
    if (auto && !auto.hasChildNodes()) mount(auto);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
})();
