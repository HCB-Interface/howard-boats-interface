# Howard Custom Boats — Owner Interface

**Live demo:** https://hcb-interface.github.io/howard-boats-interface/

Prototype of a boat-owner dashboard for Howard Custom Boats of Valencia, CA.
Inspired by the myChevrolet / Tesla owner apps — shows fuel level, engine & hull
hours, ambient temperature, GPS location, service reminders and receipts at a
glance for high-end boat owners who store their boats away from home. 

This is a static front-end demo (HTML / CSS / vanilla JS). Data is mocked in
`app.js`; future revisions would hook into the boat's Garmin / Simrad / Mercury
electronics for live telemetry.

## Pages

- `index.html` — owner dashboard (landing)
- `service.html` — service intervals, service log, receipts
- `expenses.html` — year-to-date expense breakdown + transactions
- `location.html` — live GPS, geofence, movement history

## Running locally

Just open `index.html` in a browser. No build step.

## Hosting

Served as a static site on GitHub Pages from the `main` branch root.
