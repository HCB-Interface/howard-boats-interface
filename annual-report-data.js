
// ----- Annual report data + renderer (mock — would come from backend) -----
(function () {
  var reports = {
    "2025": {
      year: 2025, partial: false,
      deliveryNote: "First full year on the water with the new 400Rs.",
      totals: { hoursRun: 142.6, fuelGallons: 1480, fuelCost: 5390, services: 4, faults: 1, peakSpeed: 83.4, longestRun: 6.2, tripsCount: 31 },
      services: [
        { date: "Dec 08, 2025", desc: "Impeller replacement",                shop: "Absolute Speed and Marine", cost: 220 },
        { date: "Aug 21, 2025", desc: "Prop repair + alignment",             shop: "Teague Custom Marine",      cost: 310 },
        { date: "Jun 04, 2025", desc: "100-hr engine inspection",            shop: "Howard Custom Boats",       cost: 425 },
        { date: "Mar 18, 2025", desc: "Spring commissioning + plug change",  shop: "Howard Custom Boats",       cost: 540 }
      ],
      expensesByCat: [
        { cat: "Fuel",    amount: 5390, color: "#3ddc97" },
        { cat: "Service", amount: 1495, color: "#3fb6ff" },
        { cat: "Storage", amount: 4200, color: "#ffb648" },
        { cat: "Other",   amount:  610, color: "#9aa5b1" }
      ],
      faultsList: [
        { date: "Aug 19, 2025", code: "P0301", desc: "Cylinder 1 misfire — resolved with plug replacement" }
      ],
      topRuns: [
        { date: "Aug 14, 2025", venue: "Castaic Lake — East Ramp",  peak: 83.4, hours: 5.8 },
        { date: "Jul 04, 2025", venue: "Lake Havasu — Pirate Cove", peak: 81.7, hours: 6.2 },
        { date: "Sep 22, 2025", venue: "Castaic Lake — East Ramp",  peak: 80.9, hours: 4.4 }
      ]
    },
    "2026": {
      year: 2026, partial: true,
      deliveryNote: "Year-to-date as of Apr 30, 2026.",
      totals: { hoursRun: 36.8, fuelGallons: 380, fuelCost: 1395, services: 2, faults: 0, peakSpeed: 82.1, longestRun: 4.2, tripsCount: 9 },
      services: [
        { date: "Apr 02, 2026", desc: "Oil & filter change, spark plugs",       shop: "Howard Custom Boats", cost: 645 },
        { date: "Feb 14, 2026", desc: "Annual winterization + hull inspection", shop: "Howard Custom Boats", cost: 980 }
      ],
      expensesByCat: [
        { cat: "Fuel",    amount: 1395, color: "#3ddc97" },
        { cat: "Service", amount: 1625, color: "#3fb6ff" },
        { cat: "Storage", amount: 1400, color: "#ffb648" },
        { cat: "Other",   amount:  400, color: "#9aa5b1" }
      ],
      faultsList: [],
      topRuns: [
        { date: "Apr 19, 2026", venue: "Castaic Lake — East Ramp", peak: 82.1, hours: 4.2 },
        { date: "Apr 14, 2026", venue: "Castaic Lake — East Ramp", peak: 80.4, hours: 7.7 }
      ]
    }
  };

  function fmtMoney(v) { return "$" + (v || 0).toLocaleString(); }

  function renderReport(year) {
    var r = reports[year];
    if (!r) return;
    var owner = HCB.owner;
    var totalExpenses = r.expensesByCat.reduce(function (a, x) { return a + x.amount; }, 0);
    var maxExp = Math.max.apply(null, r.expensesByCat.map(function (x) { return x.amount; }));

    var servicesHtml;
    if (r.services.length === 0) {
      servicesHtml = '<li><span class="ar-desc" style="color:var(--text-mute);">No services this year.</span></li>';
    } else {
      servicesHtml = r.services.map(function (s) {
        return '<li>' +
          '<span class="ar-date">' + s.date + '</span>' +
          '<span class="ar-desc">' + s.desc + '<div class="ar-shop">' + s.shop + '</div></span>' +
          '<span></span>' +
          '<span class="ar-cost">' + fmtMoney(s.cost) + '</span>' +
        '</li>';
      }).join("");
    }

    var expensesHtml = r.expensesByCat.map(function (e) {
      var pct = Math.round((e.amount / maxExp) * 100);
      return '<div class="ar-bar-row">' +
        '<div class="lbl">' + e.cat + '</div>' +
        '<div class="bar"><span style="width:' + pct + '%;background:' + e.color + ';"></span></div>' +
        '<div class="amt">' + fmtMoney(e.amount) + '</div>' +
      '</div>';
    }).join("");

    var faultsHtml;
    if (r.faultsList.length === 0) {
      faultsHtml = '<div style="color:var(--text-mute);font-size:13px;">Zero active faults captured this year. Clean year.</div>';
    } else {
      faultsHtml = '<ul class="ar-list">' + r.faultsList.map(function (f) {
        return '<li>' +
          '<span class="ar-date">' + f.date + '</span>' +
          '<span class="ar-desc"><strong>' + f.code + '</strong> — ' + f.desc + '</span>' +
          '<span></span><span></span>' +
        '</li>';
      }).join("") + '</ul>';
    }

    var topRunsHtml = r.topRuns.map(function (t) {
      return '<li>' +
        '<span class="ar-date">' + t.date + '</span>' +
        '<span class="ar-desc">' + t.venue + '<div class="ar-shop">' + t.hours + ' hrs on the water</div></span>' +
        '<span style="color:var(--text-mute);font-size:12px;text-align:right;">peak</span>' +
        '<span class="ar-cost">' + t.peak.toFixed(1) + ' mph</span>' +
      '</li>';
    }).join("");

    var titleSuffix = r.partial ? '<span style="color:var(--text-mute);font-weight:500;font-size:14px;"> &middot; year-to-date</span>' : '';
    var calloutLine = r.partial
      ? "This is a year-to-date snapshot &mdash; the full report will be auto-generated December 31."
      : "Compare against next year&rsquo;s report to see how your boat is aging. Howard service uses the same data when you bring the boat in &mdash; nothing for you to look up or print.";

    var dollarsPerHour = (totalExpenses / Math.max(r.totals.hoursRun, 1)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    document.getElementById("ar-paper").innerHTML =
      '<div class="ar-header">' +
        '<div>' +
          '<div class="ar-brand">Howard Custom Boats &middot; Annual Report</div>' +
          '<h1>Hull No. ' + owner.boat.hull + ' &mdash; &ldquo;' + owner.boat.nickname + '&rdquo;' + titleSuffix + '</h1>' +
          '<div class="ar-sub">' + owner.boat.model + ' &middot; ' + owner.name + ' &middot; ' + r.deliveryNote + '</div>' +
        '</div>' +
        '<div class="ar-year">' + r.year + '</div>' +
      '</div>' +
      '<div class="ar-stat-grid">' +
        '<div class="ar-stat"><div class="lbl">Hours run</div><div class="val">' + r.totals.hoursRun.toFixed(1) + '<small>hrs</small></div><div class="meta">' + r.totals.tripsCount + ' trips logged</div></div>' +
        '<div class="ar-stat"><div class="lbl">Fuel burned</div><div class="val">' + r.totals.fuelGallons.toLocaleString() + '<small>gal</small></div><div class="meta">' + fmtMoney(r.totals.fuelCost) + ' at the pump</div></div>' +
        '<div class="ar-stat"><div class="lbl">Peak speed</div><div class="val">' + r.totals.peakSpeed.toFixed(1) + '<small>mph</small></div><div class="meta">on the longest ' + r.totals.longestRun + '-hr run</div></div>' +
        '<div class="ar-stat"><div class="lbl">Service events</div><div class="val">' + r.totals.services + '</div><div class="meta">' + r.totals.faults + ' fault' + (r.totals.faults === 1 ? "" : "s") + ' captured</div></div>' +
      '</div>' +
      '<div class="ar-section"><h2>Service log</h2><ul class="ar-list">' + servicesHtml + '</ul></div>' +
      '<div class="ar-section"><h2>Expenses by category</h2>' +
        '<div class="ar-split"><div>' + expensesHtml + '</div>' +
        '<div style="text-align:right;">' +
          '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-mute);font-weight:700;">Year total</div>' +
          '<div style="font-size:28px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums;">' + fmtMoney(totalExpenses) + '</div>' +
          '<div style="font-size:11px;color:var(--text-mute);margin-top:4px;">$' + dollarsPerHour + ' / hr on the water</div>' +
        '</div></div>' +
      '</div>' +
      '<div class="ar-section"><h2>Faults captured</h2>' + faultsHtml + '</div>' +
      '<div class="ar-section"><h2>Notable runs</h2><ul class="ar-list">' + topRunsHtml + '</ul></div>' +
      '<div class="ar-callout"><strong>Howard Connect &middot; ' + r.year + ' review.</strong> ' +
        'Numbers above were captured continuously by your gateway and aggregated at year-end. ' + calloutLine + '</div>' +
      '<div class="ar-footer">' +
        '<span>Howard Custom Boats &middot; Connect Platform</span>' +
        '<span>Generated Apr 30, 2026 &middot; Hull ' + owner.boat.hull + '</span>' +
      '</div>';
  }

  document.getElementById("ar-year").addEventListener("change", function (e) { renderReport(e.target.value); });

  var urlYear = new URLSearchParams(location.search).get("year");
  if (urlYear && reports[urlYear]) {
    document.getElementById("ar-year").value = urlYear;
    renderReport(urlYear);
  } else {
    renderReport("2025");
  }
})();
