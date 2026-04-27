/* Howard Custom Boats — Owner App (prototype)
   Shared mock data + UI helpers. Safe on any page: every DOM write is
   guarded with an element lookup so missing elements are ignored. */

window.HCB = window.HCB || {};

HCB.owner = {
  name: "Jake Brunsell",
  initials: "JB",
  boat: {
    hull: "042",
    nickname: "Outta Control",
    model: "28\u2032 Howard Custom",
    location: "Valencia, CA",
    fuelPct: 78,
    hullHours: 412.6,
    engineHours: 398.1,
    ambientF: 68,
  },
  serviceLog: [
    { date: "Apr 02, 2026", work: "Oil & filter change, spark plugs",
      shop: "Howard Service — Valencia", hours: 380.4, cost: "$645",
      status: { label: "Complete", tone: "good" } },
    { date: "Feb 14, 2026", work: "Annual winterization + hull inspection",
      shop: "Howard Service — Valencia", hours: 362.0, cost: "$980",
      status: { label: "Complete", tone: "good" } },
    { date: "Dec 08, 2025", work: "Impeller replacement",
      shop: "Lake Castaic Marine", hours: 341.7, cost: "$220",
      status: { label: "Complete", tone: "good" } },
    { date: "Aug 21, 2025", work: "Prop repair + alignment",
      shop: "Lake Castaic Marine", hours: 298.1, cost: "$310",
      status: { label: "Complete", tone: "good" } },
    { date: "May 04, 2026", work: "100-hr engine inspection",
      shop: "Howard Service — Valencia", hours: "—", cost: "Est. $425",
      status: { label: "Scheduled", tone: "warn" } },
  ],
  serviceIntervals: [
    { name: "Engine service (100-hr)", current: 88.1, total: 100, unit: "hrs", tone: "warn" },
    { name: "Lower unit oil (600-hr)", current: 398.1, total: 600, unit: "hrs", tone: "good" },
    { name: "Hull wax & detail (6-mo)", current: 52, total: 180, unit: "days", tone: "good" },
    { name: "Annual winterization", current: 68, total: 365, unit: "days", tone: "good" },
  ],
  expenses: {
    total: "4,820",
    service: "2,145",
    fuel: "1,680",
    storage: "995",
  },
  transactions: [
    { date: "Apr 19, 2026", type: "Fuel",    vendor: "Castaic Fuel Dock",       amount: "$285" },
    { date: "Apr 02, 2026", type: "Service", vendor: "Howard Service — Valencia", amount: "$645" },
    { date: "Mar 28, 2026", type: "Fuel",    vendor: "Castaic Fuel Dock",       amount: "$240" },
    { date: "Mar 15, 2026", type: "Storage", vendor: "Howard Yard",              amount: "$350" },
    { date: "Feb 14, 2026", type: "Service", vendor: "Howard Service — Valencia", amount: "$980" },
    { date: "Feb 05, 2026", type: "Fuel",    vendor: "Ventura Harbor Fuel",     amount: "$310" },
    { date: "Jan 28, 2026", type: "Storage", vendor: "Howard Yard",              amount: "$350" },
    { date: "Jan 12, 2026", type: "Fuel",    vendor: "Castaic Fuel Dock",       amount: "$260" },
    { date: "Jan 04, 2026", type: "Service", vendor: "Lake Castaic Marine",     amount: "$520" },
    { date: "Dec 28, 2025", type: "Storage", vendor: "Howard Yard",              amount: "$295" },
    { date: "Dec 15, 2025", type: "Fuel",    vendor: "Castaic Fuel Dock",       amount: "$280" },
    { date: "Dec 08, 2025", type: "Service", vendor: "Lake Castaic Marine",     amount: "$220" },
  ],
  locationHistory: [
    { label: "Howard Yard (storage)",    time: "Now",                       duration: "3 days" },
    { label: "Castaic Lake — East Ramp", time: "Apr 19, 2026 — 14:22",     duration: "4h 10m" },
    { label: "Howard Yard (storage)",    time: "Apr 14, 2026 — 18:05",     duration: "5 days" },
    { label: "Castaic Lake — East Ramp", time: "Apr 14, 2026 — 10:18",     duration: "7h 42m" },
    { label: "Howard Yard (storage)",    time: "Apr 07, 2026 — 19:40",     duration: "6 days" },
  ],
};

/* ---------- Shared helpers ---------- */

function $(sel) { return document.querySelector(sel); }
function set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function html(id, val) { const el = document.getElementById(id); if (el) el.innerHTML = val; }

/* ---------- Populate common things ---------- */

(function hydrateCommon() {
  const o = HCB.owner;
  set("user-name", o.name);
  set("avatar-initials", o.initials);
  html("boat-name", `Hull No. ${o.boat.hull} &mdash; &ldquo;${o.boat.nickname}&rdquo;`);
  set("boat-sub", `${o.boat.model} \u00B7 ${o.boat.location}`);

  // Fuel gauge (dashboard only — element may not exist on sub-pages)
  const fuelPctEl = document.getElementById("fuel-pct");
  const fuelFillEl = document.getElementById("fuel-fill");
  if (fuelPctEl && fuelFillEl) {
    const fuel = Math.max(0, Math.min(100, o.boat.fuelPct));
    fuelPctEl.textContent = fuel;
    requestAnimationFrame(() => { fuelFillEl.style.width = fuel + "%"; });
  }

  set("hull-hours",   o.boat.hullHours.toFixed(1));
  set("engine-hours", o.boat.engineHours.toFixed(1));
  set("ambient-temp", o.boat.ambientF);

  // Expenses tiles (may appear on dashboard or expenses page)
  set("exp-total",   o.expenses.total);
  set("exp-service", o.expenses.service);
  set("exp-fuel",    o.expenses.fuel);
  set("exp-storage", o.expenses.storage);
})();

/* ---------- Toast helper (used anywhere) ---------- */

HCB.toast = function ({ title, body, tone = "warn" }) {
  const stack = document.getElementById("toast-stack");
  if (!stack) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.borderLeftColor =
    tone === "good" ? "var(--good)" :
    tone === "bad"  ? "var(--bad)"  :
                      "var(--warn)";
  toast.innerHTML = `
    <div style="flex:1">
      <strong>${title}</strong>
      <small>${body}</small>
    </div>
  `;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 0.4s, transform 0.4s";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    setTimeout(() => toast.remove(), 450);
  }, 5200);
};

/* ---------- Dashboard-only startup reminder ---------- */

if (document.getElementById("fuel-fill")) {
  setTimeout(() => {
    HCB.toast({
      title: "Upcoming: 100-hr Engine Service",
      body: "Due in 11.9 engine hours. Head to Service to book it.",
      tone: "warn",
    });
  }, 900);
}

/* ---------- Page-specific render hooks ---------- */

// Service page
(function renderService() {
  const tbody = document.getElementById("service-log-body");
  if (tbody) {
    tbody.innerHTML = HCB.owner.serviceLog.map(r => `
      <tr>
        <td data-label="Date">${r.date}</td>
        <td data-label="Work">${r.work}</td>
        <td data-label="Shop">${r.shop}</td>
        <td data-label="Hours">${r.hours}</td>
        <td data-label="Cost">${r.cost}</td>
        <td data-label="Status"><span class="pill ${r.status.tone}"><span class="dot"></span> ${r.status.label}</span></td>
      </tr>`).join("");
  }
  const intervals = document.getElementById("service-intervals");
  if (intervals) {
    intervals.innerHTML = HCB.owner.serviceIntervals.map(i => {
      const pct = Math.min(100, Math.round((i.current / i.total) * 100));
      const color = i.tone === "warn" ? "var(--warn)" :
                    i.tone === "bad"  ? "var(--bad)"  : "var(--good)";
      return `
        <div class="interval">
          <div class="interval-head">
            <div class="label">${i.name}</div>
            <div class="meta">${i.current} / ${i.total} ${i.unit}</div>
          </div>
          <div class="gauge"><div class="gauge-fill" style="width:${pct}%;background:${color};"></div></div>
        </div>
      `;
    }).join("");
  }
})();

// Expenses page
(function renderExpenses() {
  const tx = document.getElementById("tx-body");
  if (tx) {
    tx.innerHTML = HCB.owner.transactions.map(t => `
      <tr>
        <td data-label="Date">${t.date}</td>
        <td data-label="Type"><span class="pill ${t.type === 'Service' ? 'warn' : t.type === 'Fuel' ? 'good' : 'good'}"><span class="dot"></span> ${t.type}</span></td>
        <td data-label="Vendor">${t.vendor}</td>
        <td data-label="Amount" class="num">${t.amount}</td>
      </tr>`).join("");
  }
  // Pie/donut chart
  const chart = document.getElementById("exp-chart");
  if (chart) {
    const slices = [
      { label: "Service", value: 2145, color: "#3fb6ff" },
      { label: "Fuel",    value: 1680, color: "#3ddc97" },
      { label: "Storage", value:  995, color: "#ffb648" },
    ];
    const total = slices.reduce((s, x) => s + x.value, 0);
    const R = 80, C = 100;
    let a0 = -Math.PI / 2;
    const arcs = slices.map(s => {
      const frac = s.value / total;
      const a1 = a0 + frac * Math.PI * 2;
      const x0 = C + R * Math.cos(a0), y0 = C + R * Math.sin(a0);
      const x1 = C + R * Math.cos(a1), y1 = C + R * Math.sin(a1);
      const large = frac > 0.5 ? 1 : 0;
      const d = `M ${C} ${C} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
      a0 = a1;
      return `<path d="${d}" fill="${s.color}" stroke="#0a0d10" stroke-width="2"/>`;
    }).join("");
    chart.innerHTML = `
      <svg viewBox="0 0 200 200" width="200" height="200">
        ${arcs}
        <circle cx="100" cy="100" r="48" fill="#0e1318" stroke="#1b232b"/>
        <text x="100" y="96"  text-anchor="middle" fill="#ecf0f3" font-size="12" font-weight="600" font-family="Inter, sans-serif">Total YTD</text>
        <text x="100" y="116" text-anchor="middle" fill="#9aa5b1" font-size="16" font-weight="600" font-family="Inter, sans-serif">$${total.toLocaleString()}</text>
      </svg>
      <div class="legend">
        ${slices.map(s => `
          <div class="legend-row">
            <span class="swatch" style="background:${s.color}"></span>
            <span class="label">${s.label}</span>
            <span class="value">$${s.value.toLocaleString()}</span>
          </div>`).join("")}
      </div>
    `;
  }
})();

// Location page
(function renderLocation() {
  const hist = document.getElementById("loc-history");
  if (hist) {
    hist.innerHTML = HCB.owner.locationHistory.map((l, i) => `
      <li>
        <div>
          <div class="label">${l.label}</div>
          <div class="meta">${l.time}</div>
        </div>
        <span class="meta">${l.duration}</span>
      </li>`).join("");
  }
})();

/* ======================================================================
   Engine telemetry — Mercury (Tier 2: SmartCraft) & Teague (Tier 3: Howard
   Sensor Package). Mock data only; in production these would be the JSON
   payloads coming back from the on-boat gateway.
   ====================================================================== */

HCB.mercury = {
  package: "Twin Mercury Racing 400R",
  rigging: "SmartCraft via NMEA 2000",
  status: "Engines secured",
  cellular: "LTE — -78 dBm",
  wifi: "Howard Yard",
  lastSync: "4 min ago",
  fuelLevelPct: 78,
  fuelGal: 91,
  engines: [
    { label: "Port",      hours: 188.4, lastRunHours: 4.1,
      coolantF: 76, oilPsi: 0, voltage: 12.7, trim: 0,
      throttlePct: 0, rpm: 0, maxRpm: 7000 },
    { label: "Starboard", hours: 187.9, lastRunHours: 4.1,
      coolantF: 78, oilPsi: 0, voltage: 12.6, trim: 0,
      throttlePct: 0, rpm: 0, maxRpm: 7000 },
  ],
  lastRun: {
    date: "Apr 19, 2026",
    duration: "4h 10m",
    distanceNm: 38.4,
    timeOnPlane: "2h 50m",
    fuelBurnedGal: 41,
    avgGph: 9.8,
    peakRpmPort: 5840,
    peakRpmStbd: 5860,
    peakCoolantPortF: 162,
    peakCoolantStbdF: 164,
    waterTempF: 71,
  },
  diagnostics: [
    { code: "OK",    desc: "No active fault codes — Port",      tone: "good" },
    { code: "OK",    desc: "No active fault codes — Starboard", tone: "good" },
    { code: "P0500", desc: "Historic · cleared Mar 02 — VSS dropout while trailering", tone: "good" },
  ],
};

HCB.teague = {
  package: "Teague Custom Marine 1050",
  rigging: "Howard Sensor Package — NMEA 2000 + analog",
  status: "Stored — engine cold",
  cellular: "LTE — -82 dBm",
  wifi: "Howard Yard",
  lastSync: "6 min ago",
  hours: 162.3,
  fuelLevelPct: 64,
  rpm: 0,
  oilPsi: 0,
  coolantF: 74,
  exhaustPortF: 96,
  exhaustStbdF: 94,
  startV: 12.7,
  houseV: 12.5,
  bilge: "Dry",
  ambientF: 68,
  /* 30 most-recent idle oil-pressure readings (psi) used for the trend chart.
     A drift here is the leading indicator of bearing or pump trouble. */
  oilPsiIdleHistory: [
    66, 65, 66, 65, 64, 65, 66, 65, 65, 64,
    65, 65, 64, 65, 65, 64, 64, 65, 65, 64,
    64, 65, 64, 64, 65, 64, 65, 64, 64, 65,
  ],
  lastRun: {
    date: "Apr 12, 2026",
    duration: "2h 28m",
    distanceNm: 22.8,
    peakRpm: 5240,
    peakOilPsi: 71,
    peakCoolantF: 178,
    peakExhaustPortF: 612,
    peakExhaustStbdF: 608,
    fuelBurnedGal: 36,
  },
};

/* ---------- Tachometer SVG helper ----------
   Returns markup for a 220-degree sweep gauge with green/amber/red bands
   and a needle at the supplied rpm. */
HCB.tachSvg = function (rpm, maxRpm) {
  const cx = 100, cy = 100, r = 78;
  const startDeg = 150, endDeg = 390; // sweep 240deg
  const toXY = (deg, rad = r) => {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };
  const arcPath = (a, b, rr = r) => {
    const [x0, y0] = toXY(a, rr), [x1, y1] = toXY(b, rr);
    const large = (b - a) > 180 ? 1 : 0;
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${rr} ${rr} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const greenEnd = startDeg + (5500 / maxRpm) * (endDeg - startDeg);
  const amberEnd = startDeg + (6500 / maxRpm) * (endDeg - startDeg);
  // Tick marks every 1000 rpm
  let ticks = "";
  for (let v = 0; v <= maxRpm; v += 1000) {
    const deg = startDeg + (v / maxRpm) * (endDeg - startDeg);
    const [x0, y0] = toXY(deg, r - 4);
    const [x1, y1] = toXY(deg, r - (v % 2000 === 0 ? 14 : 9));
    ticks += `<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" stroke="#3b4753" stroke-width="${v % 2000 === 0 ? 2 : 1.2}"/>`;
    if (v % 2000 === 0) {
      const [tx, ty] = toXY(deg, r - 24);
      ticks += `<text x="${tx.toFixed(2)}" y="${(ty + 4).toFixed(2)}" text-anchor="middle" fill="#6b7785" font-size="10" font-family="Inter, sans-serif">${v / 1000}</text>`;
    }
  }
  // Needle
  const needleDeg = startDeg + (Math.min(rpm, maxRpm) / maxRpm) * (endDeg - startDeg);
  const [nx, ny] = toXY(needleDeg, r - 8);
  const needle = rpm > 0
    ? `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(2)}" y2="${ny.toFixed(2)}" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>`
    : "";
  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="${arcPath(startDeg, endDeg)}" stroke="#1b232b" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="${arcPath(startDeg, greenEnd)}" stroke="#3ddc97" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="${arcPath(greenEnd,  amberEnd)}" stroke="#ffb648" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="${arcPath(amberEnd,  endDeg)}"  stroke="#ff5a5f" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.85"/>
      ${ticks}
      ${needle}
      <circle cx="${cx}" cy="${cy}" r="6" fill="#0e1318" stroke="#3b4753" stroke-width="2"/>
    </svg>`;
};

/* ---------- Tiny line/area trend chart ---------- */
HCB.trendSvg = function (points, opts = {}) {
  const w = 600, h = 160, pad = 14;
  const min = Math.min.apply(null, points) - 4;
  const max = Math.max.apply(null, points) + 4;
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (points.length - 1);
  const xy = points.map((p, i) => [
    pad + i * stepX,
    h - pad - ((p - min) / span) * (h - pad * 2),
  ]);
  const linePath = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L ${xy[xy.length - 1][0].toFixed(1)} ${h - pad} L ${pad} ${h - pad} Z`;
  // y-axis baseline labels
  const baseline = ((opts.baseline ?? null));
  const baselineY = baseline != null
    ? (h - pad - ((baseline - min) / span) * (h - pad * 2)).toFixed(1)
    : null;
  // Acceptable band shading
  const okLo = opts.okLo, okHi = opts.okHi;
  let band = "";
  if (okLo != null && okHi != null) {
    const yLo = (h - pad - ((okLo - min) / span) * (h - pad * 2)).toFixed(1);
    const yHi = (h - pad - ((okHi - min) / span) * (h - pad * 2)).toFixed(1);
    band = `<rect x="${pad}" y="${yHi}" width="${w - pad * 2}" height="${(yLo - yHi).toFixed(1)}" fill="#3ddc97" opacity="0.06"/>`;
  }
  return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${band}
      ${baselineY ? `<line x1="${pad}" y1="${baselineY}" x2="${w - pad}" y2="${baselineY}" stroke="#3ddc97" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>` : ""}
      <path d="${areaPath}" fill="var(--accent)" opacity="0.12"/>
      <path d="${linePath}"  fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${xy.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="var(--accent)"/>`).join("")}
      <text x="${pad}" y="${pad + 2}" fill="#6b7785" font-size="10" font-family="Inter, sans-serif">${max.toFixed(0)} ${opts.unit || ""}</text>
      <text x="${pad}" y="${h - pad + 11}" fill="#6b7785" font-size="10" font-family="Inter, sans-serif">${min.toFixed(0)} ${opts.unit || ""}</text>
    </svg>`;
};

/* ---------- Mercury page render ---------- */
(function renderMercury() {
  const root = document.getElementById("mercury-root");
  if (!root) return;
  const m = HCB.mercury;

  // Status strip
  const strip = document.getElementById("mercury-status-strip");
  if (strip) {
    strip.innerHTML = `
      <div class="pip"><span class="lbl">Engines</span><span class="val good">${m.status}</span></div>
      <div class="pip"><span class="lbl">Last Sync</span><span class="val">${m.lastSync}</span></div>
      <div class="pip"><span class="lbl">Cellular</span><span class="val">${m.cellular}</span></div>
      <div class="pip"><span class="lbl">Wi-Fi</span><span class="val good">${m.wifi}</span></div>`;
  }

  // Engine cards
  const grid = document.getElementById("mercury-engine-grid");
  if (grid) {
    grid.innerHTML = m.engines.map((e, i) => `
      <div class="engine-card col-6">
        <div class="engine-card-head">
          <div class="name">${i === 0 ? "PORT" : "STARBOARD"} · <strong>Mercury Racing 400R</strong></div>
          <span class="pill good"><span class="dot"></span> ${e.rpm > 0 ? "Running" : "Standby"}</span>
        </div>
        <div class="tach">
          ${HCB.tachSvg(e.rpm, e.maxRpm)}
          <div class="tach-readout">
            <span class="num">${e.rpm.toLocaleString()}</span>
            <span class="unit">RPM</span>
          </div>
        </div>
        <div class="sub-tiles">
          <div class="sub-tile"><div class="lbl">Engine Hours</div><div class="val">${e.hours.toFixed(1)}<span class="unit">hrs</span></div><div class="meta">+${e.lastRunHours.toFixed(1)} hrs last trip</div></div>
          <div class="sub-tile"><div class="lbl">Coolant</div><div class="val">${e.coolantF}<span class="unit">°F</span></div><div class="meta">Cold start ready</div></div>
          <div class="sub-tile"><div class="lbl">Oil Pressure</div><div class="val">${e.oilPsi}<span class="unit">psi</span></div><div class="meta">Normal at idle: 60–75 psi</div></div>
          <div class="sub-tile"><div class="lbl">Battery</div><div class="val">${e.voltage.toFixed(1)}<span class="unit">V</span></div><div class="meta">Trim ${e.trim}° · throttle ${e.throttlePct}%</div></div>
        </div>
      </div>`).join("");
  }

  // Last run summary
  const lr = document.getElementById("mercury-last-run");
  if (lr) {
    const r = m.lastRun;
    lr.innerHTML = `
      <div class="run-stat"><div class="lbl">Date</div><div class="val">${r.date.replace(", 2026", "")}</div></div>
      <div class="run-stat"><div class="lbl">Duration</div><div class="val">${r.duration}</div></div>
      <div class="run-stat"><div class="lbl">Distance</div><div class="val">${r.distanceNm}<span class="unit">nm</span></div></div>
      <div class="run-stat"><div class="lbl">Time On Plane</div><div class="val">${r.timeOnPlane}</div></div>
      <div class="run-stat"><div class="lbl">Fuel Burned</div><div class="val">${r.fuelBurnedGal}<span class="unit">gal</span></div></div>
      <div class="run-stat"><div class="lbl">Avg Burn</div><div class="val">${r.avgGph}<span class="unit">gph</span></div></div>
      <div class="run-stat"><div class="lbl">Peak RPM · P</div><div class="val">${r.peakRpmPort.toLocaleString()}</div></div>
      <div class="run-stat"><div class="lbl">Peak RPM · S</div><div class="val">${r.peakRpmStbd.toLocaleString()}</div></div>
      <div class="run-stat"><div class="lbl">Max Coolant · P</div><div class="val">${r.peakCoolantPortF}<span class="unit">°F</span></div></div>
      <div class="run-stat"><div class="lbl">Max Coolant · S</div><div class="val">${r.peakCoolantStbdF}<span class="unit">°F</span></div></div>
      <div class="run-stat"><div class="lbl">Water Temp</div><div class="val">${r.waterTempF}<span class="unit">°F</span></div></div>
      <div class="run-stat"><div class="lbl">Tank After</div><div class="val">${m.fuelLevelPct}<span class="unit">%</span></div></div>`;
  }

  // Fuel card
  const fuelPct = document.getElementById("mercury-fuel-pct");
  const fuelFill = document.getElementById("mercury-fuel-fill");
  if (fuelPct && fuelFill) {
    fuelPct.textContent = m.fuelLevelPct;
    requestAnimationFrame(() => { fuelFill.style.width = m.fuelLevelPct + "%"; });
  }

  // DTC list
  const dtc = document.getElementById("mercury-dtc");
  if (dtc) {
    dtc.innerHTML = m.diagnostics.map(d => `
      <li>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="code">${d.code}</span>
          <span>${d.desc}</span>
        </div>
        <span class="pill ${d.tone}"><span class="dot"></span> ${d.tone === "good" ? "Clear" : "Active"}</span>
      </li>`).join("");
  }
})();

/* ---------- Teague page render ---------- */
(function renderTeague() {
  const root = document.getElementById("teague-root");
  if (!root) return;
  const t = HCB.teague;

  // Status strip
  const strip = document.getElementById("teague-status-strip");
  if (strip) {
    strip.innerHTML = `
      <div class="pip"><span class="lbl">Engine</span><span class="val good">${t.status}</span></div>
      <div class="pip"><span class="lbl">Last Sync</span><span class="val">${t.lastSync}</span></div>
      <div class="pip"><span class="lbl">Cellular</span><span class="val">${t.cellular}</span></div>
      <div class="pip"><span class="lbl">Wi-Fi</span><span class="val good">${t.wifi}</span></div>`;
  }

  // Sensor grid
  const grid = document.getElementById("teague-sensors");
  if (grid) {
    grid.innerHTML = `
      <div class="sensor">
        <span class="trend down">↓ stable</span>
        <div class="lbl">Oil Pressure</div>
        <div class="val">${t.oilPsi}<span class="unit">psi</span></div>
        <div class="meta">Idle baseline 64 psi · trend 30d steady</div>
      </div>
      <div class="sensor">
        <div class="lbl">Coolant Temp</div>
        <div class="val">${t.coolantF}<span class="unit">°F</span></div>
        <div class="meta">Cold start ready</div>
      </div>
      <div class="sensor">
        <div class="lbl">Exhaust · Port</div>
        <div class="val">${t.exhaustPortF}<span class="unit">°F</span></div>
        <div class="meta">Resting · last peak 612°F</div>
      </div>
      <div class="sensor">
        <div class="lbl">Exhaust · Stbd</div>
        <div class="val">${t.exhaustStbdF}<span class="unit">°F</span></div>
        <div class="meta">Resting · last peak 608°F</div>
      </div>
      <div class="sensor">
        <div class="lbl">Engine RPM</div>
        <div class="val">${t.rpm}<span class="unit">rpm</span></div>
        <div class="meta">Read off tach signal</div>
      </div>
      <div class="sensor">
        <div class="lbl">Fuel Level</div>
        <div class="val">${t.fuelLevelPct}<span class="unit">%</span></div>
        <div class="gauge" style="margin-top:10px;"><div class="gauge-fill" id="teague-fuel-fill" style="width:0%"></div></div>
      </div>
      <div class="sensor">
        <div class="lbl">Battery Bank</div>
        <div class="batt-bank" style="margin-top:8px;">
          <div class="batt-cell"><span class="role">Start</span><span class="v">${t.startV.toFixed(1)} V</span></div>
          <div class="batt-cell"><span class="role">House</span><span class="v">${t.houseV.toFixed(1)} V</span></div>
        </div>
      </div>
      <div class="sensor">
        <div class="lbl">Bilge · Ambient</div>
        <div class="val">${t.bilge}</div>
        <div class="meta">Bilge dry · ${t.ambientF}°F cabin</div>
      </div>`;
    requestAnimationFrame(() => {
      const fuel = document.getElementById("teague-fuel-fill");
      if (fuel) fuel.style.width = t.fuelLevelPct + "%";
    });
  }

  // Engine hours card
  const hrs = document.getElementById("teague-hours");
  if (hrs) hrs.textContent = t.hours.toFixed(1);

  // Trend chart — idle oil pressure over the last 30 entries
  const tc = document.getElementById("teague-trend");
  if (tc) {
    tc.innerHTML = HCB.trendSvg(t.oilPsiIdleHistory, {
      okLo: 60, okHi: 75, baseline: 64, unit: "psi",
    });
  }

  // Last run summary
  const lr = document.getElementById("teague-last-run");
  if (lr) {
    const r = t.lastRun;
    lr.innerHTML = `
      <div class="run-stat"><div class="lbl">Date</div><div class="val">${r.date.replace(", 2026", "")}</div></div>
      <div class="run-stat"><div class="lbl">Duration</div><div class="val">${r.duration}</div></div>
      <div class="run-stat"><div class="lbl">Distance</div><div class="val">${r.distanceNm}<span class="unit">nm</span></div></div>
      <div class="run-stat"><div class="lbl">Peak RPM</div><div class="val">${r.peakRpm.toLocaleString()}</div></div>
      <div class="run-stat"><div class="lbl">Peak Oil</div><div class="val">${r.peakOilPsi}<span class="unit">psi</span></div></div>
      <div class="run-stat"><div class="lbl">Max Coolant</div><div class="val">${r.peakCoolantF}<span class="unit">°F</span></div></div>
      <div class="run-stat"><div class="lbl">Exhaust · P</div><div class="val">${r.peakExhaustPortF}<span class="unit">°F</span></div></div>
      <div class="run-stat"><div class="lbl">Exhaust · S</div><div class="val">${r.peakExhaustStbdF}<span class="unit">°F</span></div></div>
      <div class="run-stat"><div class="lbl">Fuel Burned</div><div class="val">${r.fuelBurnedGal}<span class="unit">gal</span></div></div>`;
  }
})();
