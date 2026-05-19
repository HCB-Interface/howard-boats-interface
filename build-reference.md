# Howard Boats Telemetry — Build Reference

A working document covering the Mercury data path, hardware bill of materials, and the programming work required to take the interface from web demo to a real installed product.

---

## 1. Mercury Data Access — Technical Detail

### What SmartCraft is, and why it's "locked"
SmartCraft is Mercury's proprietary engine network. Physically it's a CAN bus (the same low-voltage two-wire network used in cars), but the messages riding on top are a mix of public NMEA 2000 messages and Mercury-private messages. The private ones are what people mean when they say "Mercury's coding is proprietary" — those carry deep diagnostic data, advanced calibration parameters, and the unlocks for Mercury's own VesselView displays. Mercury does not license that private layer to anyone. Garmin, Raymarine, Simrad, all in the same boat.

### What is **not** locked
Mercury also publishes a generous subset of engine data using the open NMEA 2000 standard. NMEA 2000 (often shortened to N2K) is the marine equivalent of the OBD-II port on a car — a documented, royalty-free protocol that any manufacturer can read or write. The catch: SmartCraft and NMEA 2000 are not the same physical network. They use the same wiring spec but different connectors and run at different speeds. So to get Mercury data onto an N2K backbone, you need a bridge device.

### The bridge: Mercury VesselView Link
Mercury sells this bridge themselves. The product is called **VesselView Link** (single-engine part #8M0136544, multi-engine part #8M0136545, retail ~$400–500). It has a SmartCraft connector on one side and an NMEA 2000 connector on the other. Its job is to translate the public subset of engine data into standard N2K messages and republish them. Mercury built this product specifically so customers could put engine data on Garmin/Raymarine/Simrad chartplotters — which is exactly the use case we're piggybacking on.

### What we read once the bridge is in place
Standard NMEA 2000 messages are addressed by "PGN" numbers (Parameter Group Number). The engine-related PGNs we'd be parsing:

- **PGN 127488** — Engine Parameters Rapid: RPM, boost pressure, tilt/trim position
- **PGN 127489** — Engine Parameters Dynamic: oil pressure, oil temp, coolant temp, alternator voltage, fuel rate, engine hours, status/alarm flags
- **PGN 127493** — Transmission Parameters Dynamic
- **PGN 127497** — Trip Fuel Consumption
- **PGN 127505** — Fluid Level (fuel tank %)
- **PGN 127508** — Battery Status (voltage, current, temperature)
- **PGN 129025 / 129026** — GPS position and speed/course (if a GPS is on the backbone)
- **PGN 130310 / 130311 / 130312** — Environmental (water temp, air temp, atmospheric pressure)

That covers everything currently shown on the Mercury dashboard tile in the interface mock.

### What stays locked behind Mercury's wall
The deeper diagnostic layer — individual sensor traces, ECU fault context, calibration tables, factory diagnostic commands — stays inside SmartCraft and is only accessible from Mercury's VesselView displays or dealer-tier diagnostic tools (G3 / CDS). We do not need any of that for the MVP and probably never will. If a fault triggers, we get the alarm flag from PGN 127489 plus the SAE J1939 fault code if Mercury published it; the owner takes the boat to the dealer for the deep dive, same as today.

### The legal / commercial picture
We do not reverse engineer SmartCraft. We do not crack anything. We do not need a Mercury business relationship. We use a Mercury product, installed on the boat, working as Mercury intended, publishing data Mercury chose to publish on a public industry standard. Every legitimate third-party marine telemetry company (Siren Marine, Boat Command, GOST, Yacht Devices) operates this way. The owner's concern about Mercury's lockdown is real and well-known in the industry, but the workaround is so standard it's not even a workaround — it's just how the marine electronics ecosystem is designed.

### The one caveat for Howard
Some older Mercury engines don't speak SmartCraft (pre-2008 carbureted models). The 400R, 500R, and 600 SCI all do. Teague 1050 is not Mercury at all — different conversation, falls into the Tier 3 Howard Sensor Package.

---

## 2. Hardware Parts List

### Per-boat module (Tier 2 — Mercury SmartCraft boats)

**Brain & connectivity**
- ESP32 dev board (WiFi + BLE built in) — ~$15 prototype; production board ~$25–40
- Optional: Particle Boron LTE module for cellular fallback — ~$60
- MicroSD card module + 32GB industrial-grade card for run log buffer — ~$20

**NMEA 2000 interface**
- CAN transceiver: SN65HVD230 or MCP2515 module — ~$5
- Alternatively, an all-in-one N2K interface board (Yacht Devices YDEN-02 for prototyping) — ~$200
- NMEA 2000 T-connector (Garmin/Ancor/Maretron, all standardized) — ~$15
- NMEA 2000 drop cable, 2 ft (micro-C male-male) — ~$20
- 120Ω terminator if the backbone needs one — ~$15

**Power**
- 12V → 3.3V buck converter (Pololu D24V25F3 or similar) — ~$10
- Reverse polarity protection diode or P-channel MOSFET — ~$3
- 1A blade fuse + marine-grade ATC holder — ~$8

**Wiring & mounting**
- 14 AWG marine-grade tinned wire, red + black, 10 ft each — ~$15
- Ring terminals (#10 or 1/4") for battery posts — ~$5
- Marine-grade heat-shrink butt connectors — ~$10
- IP67 marine-rated enclosure (~3"×2"×1") — ~$15
- Adhesive cable clamps / strain relief — ~$5

**Subtotal per boat (parts only):** ~$100–150 for new builds where VesselView Link is already in the SmartCraft layout, plus the cost of the Mercury bridge on retrofits.

### Mercury gateway (one per boat, only if not already installed)
- Mercury VesselView Link — single engine: P/N 8M0136544 — ~$400
- Mercury VesselView Link — Multi (twin engines): P/N 8M0136545 — ~$500

### Tier 3 boats (Teague 1050) — to scope separately
Teague does not put engine data on NMEA 2000, so the Howard Sensor Package needs its own analog/digital inputs. Rough shopping list to lock down once we commit to the demo build: 8-channel ADC, oil pressure transducer, coolant temp probe, RPM inductive pickup, fuel flow sensor, GPS module. Plan to quote this separately once the Tier 2 install is proven.

---

## 3. Programming Checklist

### Firmware (on the boat module)
- [ ] CAN bus / NMEA 2000 transceiver driver (init, filters, error handling)
- [ ] PGN parser for the engine PGNs listed in Section 1
- [ ] Local run-log buffer (SD card, rotating segments, crash-safe writes)
- [ ] Sampling and aggregation (raw at 10 Hz, downsampled for cloud upload)
- [ ] WiFi station mode with multi-network credential storage
- [ ] Garage WiFi auto-detect and sync trigger
- [ ] BLE peripheral mode with custom GATT service for phone sync
- [ ] Sync state machine (idle → upload → ack → purge buffer)
- [ ] Deep sleep with wake-on-CAN-traffic and wake-on-WiFi-beacon
- [ ] OTA firmware update receiver (signed images only)
- [ ] First-boot pairing / provisioning flow
- [ ] Health heartbeat (battery voltage, signal strength, last sync timestamp)

### Mobile app (iOS + Android)
- [ ] User authentication (sign up, log in, password reset, single-owner model)
- [ ] Boat registration & module pairing flow
- [ ] BLE central scanner / auto-connect on proximity
- [ ] BLE → cloud relay logic (queue, retry, integrity check)
- [ ] WiFi credential provisioning UI (hand garage WiFi to module)
- [ ] Push notification registration (APNs + FCM)
- [ ] Run summary view (mirror of web dashboard cards)
- [ ] Service alerts / health snapshot view
- [ ] Settings / boat management
- [ ] Temporary guest share (read-only, time-bound)
- [ ] Ownership transfer flow

### Backend
- [ ] REST API:
  - POST `/runs` (accept run uploads from phone relay or direct WiFi sync)
  - GET `/runs`, `/boats/:id/health`, `/boats/:id/service-status`
  - POST `/alerts/ack`, `/service-records`
  - Auth endpoints (signup, login, refresh)
- [ ] Authentication service (JWT or session-based)
- [ ] Database schema: users, boats (model/year/engine), runs (metadata), run_samples (time series), service_records, alerts
- [ ] Time-series storage (Postgres + TimescaleDB or InfluxDB)
- [ ] Raw log archive (S3-compatible blob storage)
- [ ] Push notification dispatcher (APNs + FCM)
- [ ] WiFi credential provisioning channel
- [ ] OTA firmware signing & delivery service
- [ ] Howard staff fleet view (service + health only — **no location data per policy**)
- [ ] Owner web dashboard (already prototyped — needs to be wired to real data)
- [ ] Service-alert rules engine (oil pressure low, temp high, hours since last service, etc.)

### Cross-cutting
- [ ] Pairing security (BLE bonding, certificate pinning, signed firmware)
- [ ] Privacy: location data encrypted at rest, never surfaced to Howard staff
- [ ] Monitoring & error reporting (Sentry-style + uptime checks)
- [ ] Demo data seeder for the pitch and future development
- [ ] Onboarding flow (boat registration → VVL detection → first sync)

---

## 4. Open questions / next decisions
- ESP32 vs. Particle Boron — does the owner want cellular fallback included for an upcharge, or stick with WiFi + BLE for the base SKU?
- Battery tender compatibility (yes — see chat) but worth specifying a recommended tender SKU so installation instructions can name it.
- Tier 3 sensor package — when do we commit to the demo build for a Teague 1050?
- Per-boat retail pricing model (new build vs. retrofit cohort, per project memory).
