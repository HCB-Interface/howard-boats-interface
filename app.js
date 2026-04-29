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
  daysSinceLastRun: 10,
  engines: [
    { label: "Port",      hours: 188.4, hoursAdded: 4.1,
      coolantF: 76, voltage: 12.7,
      lastRunPeakRpm: 5840, lastRunPeakCoolantF: 162,
      lastRunPeakOilPsi: 71, lastRunFuelGal: 20.3 },
    { label: "Starboard", hours: 187.9, hoursAdded: 4.1,
      coolantF: 78, voltage: 12.6,
      lastRunPeakRpm: 5860, lastRunPeakCoolantF: 164,
      lastRunPeakOilPsi: 70, lastRunFuelGal: 20.7 },
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
  serviceIntervals: [
    { name: "Engine oil & filter — Port",      every: 100, since: 88.4,  unit: "hrs" },
    { name: "Engine oil & filter — Starboard", every: 100, since: 87.9,  unit: "hrs" },
    { name: "Spark plugs",                     every: 300, since: 188.4, unit: "hrs" },
    { name: "Gearcase lube",                   every: 100, since: 88.4,  unit: "hrs" },
    { name: "Drive belt inspection",           every: 200, since: 188.4, unit: "hrs" },
    { name: "Annual cooling-system flush",     every: 365, since: 218,   unit: "days" },
  ],
  rpmTimeInBand: { idle: 24, cruise: 41, mid: 28, wot: 7 }, /* % of last run */
  coolantProfile: [
    72,  88, 104, 118, 132, 144, 152, 156, 158, 159,
    160, 160, 161, 162, 161, 161, 160, 159, 161, 162,
    160, 158, 156, 152, 144, 132, 118, 104,  92,  82,
  ], /* °F sampled across the last run */
  recentTrips: [
    { date: "Apr 19", duration: "4h 10m", distNm: 38.4, gal: 41,  peakRpm: 5860, status: "Clean" },
    { date: "Apr 11", duration: "2h 35m", distNm: 22.6, gal: 24,  peakRpm: 5520, status: "Clean" },
    { date: "Mar 28", duration: "5h 04m", distNm: 47.1, gal: 52,  peakRpm: 6020, status: "Clean" },
    { date: "Mar 14", duration: "1h 48m", distNm: 14.2, gal: 16,  peakRpm: 4980, status: "Clean" },
    { date: "Mar 02", duration: "3h 21m", distNm: 30.0, gal: 33,  peakRpm: 5640, status: "Cleared P0500" },
  ],
  storage: {
    mode: "Storage — battery switch OFF",
    transmitterDraw: "~38 mA average",
    expectedRuntimeDays: 14,
    mainBatteryV: 12.71,
    transmitterReserveV: 12.93,
  },
};

HCB.teague = {
  package: "Teague Custom Marine 1050",
  rigging: "Howard Sensor Package — NMEA 2000 + analog",
  status: "Stored — engine cold",
  daysSinceLastRun: 17,
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
  serviceIntervals: [
    { name: "Engine oil & filter",       every: 50,  since: 12.3,  unit: "hrs" },
    { name: "Plugs & wires",             every: 100, since: 62.3,  unit: "hrs" },
    { name: "Drive belts inspection",    every: 75,  since: 62.3,  unit: "hrs" },
    { name: "Risers & exhaust manifolds",every: 200, since: 162.3, unit: "hrs" },
    { name: "Annual cooling-system flush", every: 365, since: 92,  unit: "days" },
  ],
  startBatteryHistory:  [12.78, 12.76, 12.75, 12.74, 12.73, 12.72, 12.71], /* last 7 days */
  houseBatteryHistory:  [12.62, 12.60, 12.58, 12.56, 12.54, 12.52, 12.50],
  recentTrips: [
    { date: "Apr 12", duration: "2h 28m", distNm: 22.8, gal: 36, peakRpm: 5240, status: "Clean" },
    { date: "Apr 03", duration: "1h 52m", distNm: 17.4, gal: 28, peakRpm: 5040, status: "Clean" },
    { date: "Mar 21", duration: "3h 06m", distNm: 28.0, gal: 47, peakRpm: 5380, status: "Clean" },
    { date: "Mar 09", duration: "0h 48m", distNm:  6.2, gal: 11, peakRpm: 4720, status: "Idle test" },
    { date: "Feb 24", duration: "2h 14m", distNm: 19.8, gal: 32, peakRpm: 5180, status: "Clean" },
  ],
  storage: {
    mode: "Storage — battery switch OFF",
    transmitterDraw: "~42 mA average",
    expectedRuntimeDays: 12,
    mainBatteryV: 12.71,
    transmitterReserveV: 12.88,
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

  // Engine cards — between/after runs framing (no live tach)
  const grid = document.getElementById("mercury-engine-grid");
  if (grid) {
    grid.innerHTML = m.engines.map((e, i) => `
      <div class="engine-card col-6">
        <div class="engine-card-head">
          <div class="name">${i === 0 ? "PORT" : "STARBOARD"} · <strong>Mercury Racing 400R</strong></div>
          <span class="pill good"><span class="dot"></span> Engine cool · last run ${m.daysSinceLastRun}d ago</span>
        </div>
        <div class="card-section-label">Resting state</div>
        <div class="sub-tiles">
          <div class="sub-tile"><div class="lbl">Engine Hours</div><div class="val">${e.hours.toFixed(1)}<span class="unit">hrs</span></div><div class="meta">+${e.hoursAdded.toFixed(1)} hrs last run</div></div>
          <div class="sub-tile"><div class="lbl">Coolant</div><div class="val">${e.coolantF}<span class="unit">°F</span></div><div class="meta">Ambient — engine off</div></div>
          <div class="sub-tile"><div class="lbl">Battery</div><div class="val">${e.voltage.toFixed(1)}<span class="unit">V</span></div><div class="meta">SmartCraft start bus</div></div>
          <div class="sub-tile"><div class="lbl">Days Since Run</div><div class="val">${m.daysSinceLastRun}<span class="unit">d</span></div><div class="meta">Apr 19 → today</div></div>
        </div>
        <div class="card-section-label" style="margin-top:18px;">Last run peaks</div>
        <div class="sub-tiles">
          <div class="sub-tile"><div class="lbl">Peak RPM</div><div class="val">${e.lastRunPeakRpm.toLocaleString()}</div><div class="meta">of 7,000 redline</div></div>
          <div class="sub-tile"><div class="lbl">Max Coolant</div><div class="val">${e.lastRunPeakCoolantF}<span class="unit">°F</span></div><div class="meta">Within normal band</div></div>
          <div class="sub-tile"><div class="lbl">Peak Oil Psi</div><div class="val">${e.lastRunPeakOilPsi}<span class="unit">psi</span></div><div class="meta">Healthy at WOT</div></div>
          <div class="sub-tile"><div class="lbl">Fuel Burned</div><div class="val">${e.lastRunFuelGal.toFixed(1)}<span class="unit">gal</span></div><div class="meta">Trip share</div></div>
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
        <div class="lbl">Last Run Oil Psi</div>
        <div class="val">${t.lastRun.peakOilPsi}<span class="unit">psi</span></div>
        <div class="meta">Idle baseline 64 psi · trend 30d steady</div>
      </div>
      <div class="sensor">
        <div class="lbl">Coolant Temp</div>
        <div class="val">${t.coolantF}<span class="unit">°F</span></div>
        <div class="meta">Ambient — engine off</div>
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
        <div class="lbl">Days Since Run</div>
        <div class="val">${t.daysSinceLastRun}<span class="unit">d</span></div>
        <div class="meta">Apr 12 → today</div>
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

/* ---------- Helpers used by the new widgets ---------- */
HCB.serviceRow = function (s, currentHrs) {
  /* For hour-based items, "since" is the engine-hour reading at last service.
     We need elapsed-since-service = currentHrs - since. For day-based, "since" is days. */
  const elapsed = s.unit === "hrs" ? Math.max(0, currentHrs - s.since) : s.since;
  const remaining = Math.max(0, s.every - elapsed);
  const pct = Math.min(100, Math.round((elapsed / s.every) * 100));
  const tone = pct >= 95 ? "bad" : pct >= 80 ? "warn" : "good";
  return `
    <div class="service-row">
      <div class="label">
        <span class="name">${s.name}</span>
        <span class="meta">Every ${s.every} ${s.unit}</span>
      </div>
      <div class="bar ${tone === "good" ? "" : tone}"><span style="width:${pct}%"></span></div>
      <div class="right">
        ${remaining.toFixed(s.unit === "hrs" ? 1 : 0)}<span class="unit"> ${s.unit} left</span>
        <span class="small">${pct}% used</span>
      </div>
    </div>`;
};

HCB.tibBar = function (tib) {
  const total = tib.idle + tib.cruise + tib.mid + tib.wot || 1;
  const seg = (cls, label, v) => {
    const pct = (v / total) * 100;
    const txt = pct >= 9 ? `${label} ${Math.round(pct)}%` : "";
    return `<div class="tib-seg ${cls}" style="flex:${pct} 0 0;" title="${label} ${Math.round(pct)}%">${txt}</div>`;
  };
  return `
    <div class="tib-wrap">
      <div class="tib-bar">
        ${seg("idle",   "Idle",   tib.idle)}
        ${seg("cruise", "Cruise", tib.cruise)}
        ${seg("mid",    "Mid",    tib.mid)}
        ${seg("wot",    "WOT",    tib.wot)}
      </div>
      <div class="tib-legend">
        <span><span class="swatch" style="background:#4a6b86"></span>Idle &lt; 1500 rpm</span>
        <span><span class="swatch" style="background:#67c990"></span>Cruise 1500–4000</span>
        <span><span class="swatch" style="background:#f0c14b"></span>Mid 4000–5500</span>
        <span><span class="swatch" style="background:#e16464"></span>WOT 5500+</span>
      </div>
    </div>`;
};

HCB.profileSvg = function (points) {
  /* Lightweight inline SVG line chart for a single run-profile sweep (no axes,
     just a clean curve with a soft area fill). */
  if (!points || !points.length) return "";
  const W = 500, H = 90, PAD = 4;
  const lo = Math.min(...points), hi = Math.max(...points);
  const span = hi - lo || 1;
  const step = (W - PAD * 2) / (points.length - 1);
  const coords = points.map((v, i) => [
    PAD + i * step,
    PAD + (1 - (v - lo) / span) * (H - PAD * 2),
  ]);
  const path = "M " + coords.map(c => `${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" L ");
  const area = path + ` L ${W - PAD} ${H - PAD} L ${PAD} ${H - PAD} Z`;
  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cf" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgba(103,201,144,.45)"/>
          <stop offset="100%" stop-color="rgba(103,201,144,0)"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#cf)" stroke="none"/>
      <path d="${path}" fill="none" stroke="#67c990" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${coords[coords.length-1][0]}" cy="${coords[coords.length-1][1]}" r="3" fill="#67c990"/>
    </svg>`;
};

HCB.miniLineSvg = function (points, color) {
  if (!points || !points.length) return "";
  const W = 240, H = 56, PAD = 3;
  const lo = Math.min(...points) - .04, hi = Math.max(...points) + .04;
  const span = hi - lo || 1;
  const step = (W - PAD * 2) / (points.length - 1);
  const coords = points.map((v, i) => [
    PAD + i * step,
    PAD + (1 - (v - lo) / span) * (H - PAD * 2),
  ]);
  const path = "M " + coords.map(c => `${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(" L ");
  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${coords[coords.length-1][0]}" cy="${coords[coords.length-1][1]}" r="2.5" fill="${color}"/>
    </svg>`;
};

HCB.tripsTable = function (trips) {
  return `
    <table class="trips-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Duration</th>
          <th class="num">Distance</th>
          <th class="num hide-sm">Fuel</th>
          <th class="num hide-sm">Peak RPM</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${trips.map(t => `
          <tr>
            <td>${t.date}</td>
            <td>${t.duration}</td>
            <td class="num">${t.distNm.toFixed(1)} nm</td>
            <td class="num hide-sm">${t.gal} gal</td>
            <td class="num hide-sm">${t.peakRpm.toLocaleString()}</td>
            <td><span class="pill ${t.status === "Clean" || t.status === "Idle test" ? "good" : "warn"}"><span class="dot"></span> ${t.status}</span></td>
          </tr>`).join("")}
      </tbody>
    </table>`;
};

HCB.storageCard = function (s) {
  return `
    <div class="card">
      <h3>Storage Mode &middot; Transmitter Power</h3>
      <div class="big" style="margin-top:6px;">${s.mainBatteryV.toFixed(2)}<span class="unit">V main</span></div>
      <div class="foot" style="margin-top:6px;">${s.mode}</div>
      <div class="sub-tiles" style="margin-top:14px;">
        <div class="sub-tile"><div class="lbl">Transmitter Reserve</div><div class="val">${s.transmitterReserveV.toFixed(2)}<span class="unit">V</span></div><div class="meta">Always-on power feed</div></div>
        <div class="sub-tile"><div class="lbl">Average Draw</div><div class="val">${s.transmitterDraw}</div><div class="meta">Cellular + sensors</div></div>
        <div class="sub-tile"><div class="lbl">Reserve Runtime</div><div class="val">${s.expectedRuntimeDays}<span class="unit">days</span></div><div class="meta">Off tender, switch off</div></div>
      </div>
    </div>`;
};

/* ---------- Mercury page — extra widgets ---------- */
(function renderMercuryExtras() {
  if (!document.getElementById("mercury-root")) return;
  const m = HCB.mercury;

  // Service intervals — mount on #mercury-service if present
  const sv = document.getElementById("mercury-service");
  if (sv && m.serviceIntervals) {
    const portHrs = m.engines[0].hours, stbdHrs = m.engines[1].hours;
    sv.innerHTML = `
      <div class="service-list">
        ${m.serviceIntervals.map(s => HCB.serviceRow(
          s,
          /Starboard/.test(s.name) ? stbdHrs : portHrs
        )).join("")}
      </div>`;
  }

  // RPM time-in-band
  const tib = document.getElementById("mercury-tib");
  if (tib) tib.innerHTML = HCB.tibBar(m.rpmTimeInBand);

  // Coolant profile
  const cp = document.getElementById("mercury-coolant-profile");
  if (cp && m.coolantProfile) {
    cp.innerHTML = HCB.profileSvg(m.coolantProfile);
  }

  // Trips
  const tr = document.getElementById("mercury-trips");
  if (tr && m.recentTrips) tr.innerHTML = HCB.tripsTable(m.recentTrips);

  // Storage card
  const st = document.getElementById("mercury-storage");
  if (st && m.storage) st.innerHTML = HCB.storageCard(m.storage);
})();

/* ---------- Teague page — extra widgets ---------- */
(function renderTeagueExtras() {
  if (!document.getElementById("teague-root")) return;
  const t = HCB.teague;

  const sv = document.getElementById("teague-service");
  if (sv && t.serviceIntervals) {
    sv.innerHTML = `
      <div class="service-list">
        ${t.serviceIntervals.map(s => HCB.serviceRow(s, t.hours)).join("")}
      </div>`;
  }

  // Battery history
  const bh = document.getElementById("teague-batt-history");
  if (bh && t.startBatteryHistory) {
    bh.innerHTML = `
      <div class="batt-history">
        <div class="one">
          <h4>Start Battery · 7 day</h4>
          <div class="v">${t.startBatteryHistory[t.startBatteryHistory.length-1].toFixed(2)}<span class="unit">V</span></div>
          <div class="mini">${HCB.miniLineSvg(t.startBatteryHistory, "#67c990")}</div>
        </div>
        <div class="one">
          <h4>House Battery · 7 day</h4>
          <div class="v">${t.houseBatteryHistory[t.houseBatteryHistory.length-1].toFixed(2)}<span class="unit">V</span></div>
          <div class="mini">${HCB.miniLineSvg(t.houseBatteryHistory, "#f0c14b")}</div>
        </div>
      </div>`;
  }

  const tr = document.getElementById("teague-trips");
  if (tr && t.recentTrips) tr.innerHTML = HCB.tripsTable(t.recentTrips);

  const st = document.getElementById("teague-storage");
  if (st && t.storage) st.innerHTML = HCB.storageCard(t.storage);
})();

/* ============================================================
   FLEET VIEW (Howard Staff demo) + SETTINGS (Connectivity)
   Data is mocked in-memory; backend swap will replace these objects.
   ============================================================ */

HCB.fleet = [
  { hull: "0046", name: "Showtime",        owner: "Adam Reilly",      year: 2026, package: "Twin 500R",  hours:    4, lastSync: "22 min ago", lastSyncMin:    22, status: "Stored",     faults: 0, serviceInHrs: 96,  location: "Newport Beach, CA" },
  { hull: "0045", name: "Beauty Mark",     owner: "Lila Greenfield",  year: 2025, package: "Twin 500R",  hours:   22, lastSync: "Just now",   lastSyncMin:     1, status: "Trailered",  faults: 0, serviceInHrs: 78,  location: "I-15 N, Barstow"   },
  { hull: "0044", name: "Last Call",       owner: "Wesley Tran",      year: 2025, package: "Twin 500R",  hours:   38, lastSync: "18 min ago", lastSyncMin:    18, status: "Stored",     faults: 0, serviceInHrs: 62,  location: "Lake Havasu, AZ"   },
  { hull: "0042", name: "Outta Control",   owner: "Jake Brunsell",    year: 2024, package: "Twin 400R",  hours:  188, lastSync: "4 min ago",  lastSyncMin:     4, status: "Stored",     faults: 0, serviceInHrs: 12,  location: "Valencia, CA"      },
  { hull: "0041", name: "Sea Witch",       owner: "Marisol Aguilar",  year: 2024, package: "Twin 400R",  hours:   96, lastSync: "Just now",   lastSyncMin:     0, status: "Running",    faults: 0, serviceInHrs: 4,   location: "Lake Mohave, NV"   },
  { hull: "0040", name: "Velvet Hammer",   owner: "Joshua Park",      year: 2023, package: "Teague 1050",hours:  162, lastSync: "6 min ago",  lastSyncMin:     6, status: "Stored",     faults: 0, serviceInHrs: 38,  location: "Long Beach, CA"    },
  { hull: "0039", name: "Salt Therapy",    owner: "Karina Petrov",    year: 2023, package: "Twin 400R",  hours:  218, lastSync: "1 hr ago",   lastSyncMin:    62, status: "Stored",     faults: 0, serviceInHrs: 82,  location: "Marina del Rey, CA"},
  { hull: "0038", name: "Reel Therapy",    owner: "Daniel Kasper",    year: 2023, package: "600 SCI",    hours:  412, lastSync: "2 hr ago",   lastSyncMin:   124, status: "Stored",     faults: 0, serviceInHrs: 88,  location: "Dana Point, CA"    },
  { hull: "0037", name: "Quick Six",       owner: "Audrey Naval",     year: 2022, package: "Twin 400R",  hours:  298, lastSync: "4 hr ago",   lastSyncMin:   240, status: "Stored",     faults: 0, serviceInHrs: 2,   location: "San Diego, CA"     },
  { hull: "0036", name: "Tres Hermanos",   owner: "Hector Vega",      year: 2022, package: "600 SCI",    hours:  488, lastSync: "11 min ago", lastSyncMin:    11, status: "Stored",     faults: 1, serviceInHrs: 24,  location: "Lake Pleasant, AZ" },
  { hull: "0035", name: "Holy Diver",      owner: "Sarah Lin",        year: 2022, package: "Teague 1050",hours:  248, lastSync: "3 hr ago",   lastSyncMin:   180, status: "Stored",     faults: 0, serviceInHrs: 56,  location: "Lake Mead, NV"     },
  { hull: "0034", name: "Reel Estate",     owner: "Patrick Yi",       year: 2021, package: "600 SCI",    hours:  712, lastSync: "2 hr ago",   lastSyncMin:   124, status: "Stored",     faults: 0, serviceInHrs: 14,  location: "Lake Tahoe, CA"    },
  { hull: "0033", name: "Big Wake",        owner: "Jorge Mendoza",    year: 2021, package: "600 SCI",    hours:  612, lastSync: "6 days ago", lastSyncMin: 8640,  status: "Offline",    faults: 0, serviceInHrs: 32,  location: "Last: Phoenix, AZ" },
  { hull: "0031", name: "Rumrunner",       owner: "Caleb Wexler",     year: 2021, package: "Teague 1050",hours:  524, lastSync: "1 day ago",  lastSyncMin: 1440,  status: "Stored",     faults: 1, serviceInHrs: 18,  location: "Newport Beach, CA" },
  { hull: "0030", name: "Free Lunch",      owner: "Greg Stovall",     year: 2020, package: "600 SCI",    hours: 1042, lastSync: "1 week ago", lastSyncMin: 10080, status: "In Service", faults: 0, serviceInHrs: 0,   location: "Howard Yard"       },
  { hull: "0029", name: "Pier Pressure",   owner: "Ben Cleary",       year: 2020, package: "600 SCI",    hours:  884, lastSync: "38 min ago", lastSyncMin:    38, status: "Stored",     faults: 2, serviceInHrs: 8,   location: "Catalina Mooring"  },
];

HCB.statusPill = function (st) {
  const map = {
    "Running":    "good",
    "Stored":     "good",
    "Trailered":  "warn",
    "In Service": "warn",
    "Offline":    "bad",
  };
  return `<span class="pill ${map[st] || "warn"}"><span class="dot"></span> ${st}</span>`;
};

HCB.syncDot = function (mins) {
  if (mins <= 30)   return `<span class="sync-dot good"></span>`;
  if (mins <= 240)  return `<span class="sync-dot good"></span>`;
  if (mins <= 1440) return `<span class="sync-dot warn"></span>`;
  return `<span class="sync-dot bad"></span>`;
};

HCB.serviceCell = function (hrs) {
  if (hrs <= 5)  return `<span class="pill bad"><span class="dot"></span> ${hrs} hrs</span>`;
  if (hrs <= 25) return `<span class="pill warn"><span class="dot"></span> ${hrs} hrs</span>`;
  return `<span style="color:var(--text-mute);">${hrs} hrs</span>`;
};

HCB.faultCell = function (n) {
  if (n === 0) return `<span style="color:var(--text-mute);">—</span>`;
  return `<span class="pill ${n >= 2 ? "bad" : "warn"}"><span class="dot"></span> ${n} active</span>`;
};

HCB.initials = function (name) {
  return name.split(/\s+/).slice(0,2).map(s => s[0]).join("").toUpperCase();
};

HCB.fleetState = { search: "", engine: "All", status: "All", sortKey: "lastSyncMin", sortDir: 1 };

HCB.renderFleet = function () {
  if (!document.getElementById("fleet-root")) return;
  const fl = HCB.fleet;

  // --- KPI tiles ---
  const kpis = document.getElementById("fleet-kpis");
  if (kpis) {
    const total   = fl.length;
    const online  = fl.filter(b => b.lastSyncMin <= 60).length;
    const stored  = fl.filter(b => b.status === "Stored").length;
    const faults  = fl.reduce((a,b) => a + b.faults, 0);
    const dueSoon = fl.filter(b => b.serviceInHrs > 0 && b.serviceInHrs <= 25).length;
    const offline = fl.filter(b => b.status === "Offline").length;
    kpis.innerHTML = `
      <div class="kpi"><div class="lbl">Total Hulls</div><div class="val">${total}</div><div class="meta">connected fleet</div></div>
      <div class="kpi"><div class="lbl">Online &lt; 1 hr</div><div class="val good">${online}</div><div class="meta">recently synced</div></div>
      <div class="kpi"><div class="lbl">In Storage</div><div class="val">${stored}</div><div class="meta">battery off, on tender</div></div>
      <div class="kpi"><div class="lbl">Active Faults</div><div class="val ${faults ? "warn" : ""}">${faults}</div><div class="meta">across all hulls</div></div>
      <div class="kpi"><div class="lbl">Service Due &le; 25 hrs</div><div class="val ${dueSoon ? "warn" : ""}">${dueSoon}</div><div class="meta">proactive outreach</div></div>
      <div class="kpi"><div class="lbl">Offline &gt; 24 hrs</div><div class="val ${offline ? "bad" : ""}">${offline}</div><div class="meta">last contact stale</div></div>`;
  }

  // --- Filter + sort ---
  const st = HCB.fleetState;
  const filtered = fl.filter(b => {
    if (st.engine !== "All" && !b.package.toLowerCase().includes(st.engine.toLowerCase())) return false;
    if (st.status !== "All" && b.status !== st.status) return false;
    if (st.search) {
      const q = st.search.toLowerCase();
      if (!(b.hull + " " + b.name + " " + b.owner + " " + b.location).toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a,b) => {
    const x = a[st.sortKey], y = b[st.sortKey];
    if (x === y) return 0;
    return (x > y ? 1 : -1) * st.sortDir;
  });

  const tbody = document.getElementById("fleet-tbody");
  if (tbody) {
    tbody.innerHTML = filtered.map(b => `
      <tr>
        <td><strong>${b.hull}</strong></td>
        <td>
          <div class="hull-cell">
            <div class="avatar small">${HCB.initials(b.owner)}</div>
            <div>
              <div class="name">${b.name}</div>
              <div class="sub">${b.owner}</div>
            </div>
          </div>
        </td>
        <td>${b.year}</td>
        <td><span class="pkg-tag">${b.package}</span></td>
        <td class="num">${b.hours.toLocaleString()}</td>
        <td>${HCB.syncDot(b.lastSyncMin)}<span style="margin-left:6px;">${b.lastSync}</span></td>
        <td>${HCB.statusPill(b.status)}</td>
        <td>${HCB.faultCell(b.faults)}</td>
        <td>${b.serviceInHrs === 0 ? '<span style="color:var(--text-mute);">In shop</span>' : HCB.serviceCell(b.serviceInHrs)}</td>
        <td class="hide-sm" style="color:var(--text-mute);font-size:12px;">${b.location}</td>
        <td><a href="${b.package.includes("Teague") ? "teague.html" : "mercury.html"}" class="row-link">Open &rsaquo;</a></td>
      </tr>`).join("");
  }

  const count = document.getElementById("fleet-count");
  if (count) count.textContent = `${filtered.length} of ${fl.length} hulls`;
};

(function bindFleet() {
  if (!document.getElementById("fleet-root")) return;
  HCB.renderFleet();
  const search = document.getElementById("fleet-search");
  if (search) search.addEventListener("input", e => { HCB.fleetState.search = e.target.value; HCB.renderFleet(); });
  document.querySelectorAll("[data-fleet-engine]").forEach(b => b.addEventListener("click", () => {
    HCB.fleetState.engine = b.dataset.fleetEngine;
    document.querySelectorAll("[data-fleet-engine]").forEach(x => x.classList.toggle("active", x === b));
    HCB.renderFleet();
  }));
  document.querySelectorAll("[data-fleet-status]").forEach(b => b.addEventListener("click", () => {
    HCB.fleetState.status = b.dataset.fleetStatus;
    document.querySelectorAll("[data-fleet-status]").forEach(x => x.classList.toggle("active", x === b));
    HCB.renderFleet();
  }));
  document.querySelectorAll("[data-fleet-sort]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.fleetSort;
    if (HCB.fleetState.sortKey === k) HCB.fleetState.sortDir = -HCB.fleetState.sortDir;
    else { HCB.fleetState.sortKey = k; HCB.fleetState.sortDir = 1; }
    HCB.renderFleet();
  }));
})();

/* ---------- Settings · Connectivity ---------- */
HCB.settings = {
  uplink: {
    mode: "wifi-preferred",
    currentLink: "WiFi · Howard Yard",
    currentSignal: "-52 dBm · 5 GHz",
    cellularSignal: "LTE-M · -78 dBm · Verizon",
    cellularUsedMb: 12.4,
    cellularPlanMb: 100,
  },
  networks: [
    { ssid: "Howard Yard",       label: "Office / Yard",     lastSeen: "Connected now", state: "active",  signal: "-52 dBm" },
    { ssid: "Brunsell Garage",   label: "Home garage",       lastSeen: "3 days ago",    state: "saved",   signal: "-61 dBm last" },
    { ssid: "Hidden Reef Marina",label: "Slip · Newport",    lastSeen: "22 days ago",   state: "saved",   signal: "-68 dBm last" },
    { ssid: "Tahoe Cabin",       label: "Vacation home",     lastSeen: "92 days ago",   state: "saved",   signal: "-71 dBm last" },
  ],
};

HCB.renderSettings = function () {
  if (!document.getElementById("settings-root")) return;
  const s = HCB.settings;

  // Current connection
  const cc = document.getElementById("conn-current");
  if (cc) {
    cc.innerHTML = `
      <div class="conn-current-row">
        <span class="conn-pip ${s.uplink.mode.startsWith("wifi") ? "good" : "warn"}"></span>
        <div>
          <div class="lbl">Current uplink</div>
          <div class="val">${s.uplink.currentLink}</div>
          <div class="meta">${s.uplink.currentSignal} · sending every 4 hrs (heartbeat)</div>
        </div>
        <div class="cell-stats">
          <div class="lbl">Cellular standby</div>
          <div class="val">${s.uplink.cellularSignal}</div>
          <div class="meta">${s.uplink.cellularUsedMb} MB / ${s.uplink.cellularPlanMb} MB this month</div>
        </div>
      </div>`;
  }

  // Saved networks
  const nets = document.getElementById("conn-networks");
  if (nets) {
    nets.innerHTML = s.networks.map(n => `
      <div class="net-row ${n.state}">
        <div class="net-icon">
          <svg viewBox="0 0 24 24"><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/></svg>
        </div>
        <div class="net-text">
          <div class="ssid">${n.ssid}${n.state === "active" ? ' <span class="active-pill">Connected</span>' : ""}</div>
          <div class="meta">${n.label} · ${n.lastSeen} · ${n.signal}</div>
        </div>
        <div class="net-actions">
          <button class="btn-mini" data-net-edit="${n.ssid}">Edit</button>
          <button class="btn-mini ghost" data-net-forget="${n.ssid}">Forget</button>
        </div>
      </div>`).join("");
  }

  // Mode radios
  document.querySelectorAll("[data-uplink-mode]").forEach(r => {
    r.checked = (r.dataset.uplinkMode === s.uplink.mode);
  });

  // Bind add-network form
  const form = document.getElementById("net-add-form");
  if (form && !form.dataset.bound) {
    form.dataset.bound = "1";
    form.addEventListener("submit", e => {
      e.preventDefault();
      const ssid  = form.elements.ssid.value.trim();
      const label = form.elements.label.value.trim() || "Saved network";
      if (!ssid) return;
      s.networks.unshift({ ssid, label, lastSeen: "Just added", state: "saved", signal: "—" });
      form.reset();
      HCB.renderSettings();
      HCB.toast({ title: "Network saved", body: `${ssid} will be used when in range.`, tone: "good" });
    });
  }

  // Bind forget buttons
  document.querySelectorAll("[data-net-forget]").forEach(b => b.addEventListener("click", () => {
    const ssid = b.dataset.netForget;
    s.networks = s.networks.filter(n => n.ssid !== ssid);
    HCB.renderSettings();
    HCB.toast({ title: "Network forgotten", body: `${ssid} removed from saved list.`, tone: "warn" });
  }));

  // Bind mode change
  document.querySelectorAll("[data-uplink-mode]").forEach(r => r.addEventListener("change", () => {
    if (r.checked) {
      s.uplink.mode = r.dataset.uplinkMode;
      HCB.toast({ title: "Uplink behavior updated", body: `Now: ${r.parentElement.querySelector(".rd-title").textContent}.`, tone: "good" });
    }
  }));
};

(function bindSettings() {
  if (!document.getElementById("settings-root")) return;
  HCB.renderSettings();
})();

