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
