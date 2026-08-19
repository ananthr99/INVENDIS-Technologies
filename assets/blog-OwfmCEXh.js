import{i as e}from"./index-BolbG4P7.js";var t=e(`calendar`,[[`path`,{d:`M8 2v4`,key:`1cmpym`}],[`path`,{d:`M16 2v4`,key:`4m81vk`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`,key:`1hopcy`}],[`path`,{d:`M3 10h18`,key:`8toen8`}]]),n=Object.assign({"../content/blog/choosing-industrial-router-remote-sites.md":`---
title: "How to Choose the Right Industrial Router for Remote Site Connectivity"
date: "2025-09-05"
category: "Industry Insight"
excerpt: "A practical framework for selecting industrial LTE/5G routers based on environment, bandwidth requirements, redundancy needs, and fleet manageability."
author: "Invendis Team"
tags:
- industrial router
- connectivity
- 5G
- LTE
- SILBO
- remote sites
---

## Not All Routers Are Equal

Consumer-grade and even enterprise office routers are built for controlled environments with stable power and predictable traffic patterns. Remote industrial sites present a very different challenge: temperature extremes, vibration, power fluctuations, intermittent cellular coverage, and the need for multi-year unattended operation.

Getting the router selection wrong costs more than the hardware — it costs field dispatch trips, SLA penalties, and downtime.

## Key Criteria for Industrial Router Selection

### 1. Operating Temperature Range

A standard commercial router is typically rated 0-40 degrees C. An industrial site — whether a telecom tower in Rajasthan, a substation in the Sahara, or a wind turbine nacelle — routinely exceeds this.

Look for:
- Extended operating range: **-40 to +70 degrees C** for outdoor or harsh environments
- **-20 to +60 degrees C** for indoor-industrial (RTU cabinets, switchrooms)
- Industrial-grade components, not consumer chipsets running overclocked

### 2. Cellular Generation and Band Support

LTE (4G) remains the workhorse for most deployments, offering 20-100 Mbps at reasonable latency. 5G is compelling for video surveillance or high-throughput SCADA but coverage outside metro areas remains limited.

**Band support matters more than the generation label.** Verify the router supports:
- Your operator's specific LTE bands (Band 40 and Band 3 dominate India)
- Fallback to 3G/2G for deep rural coverage
- SIM card failover between operators

### 3. SIM Redundancy

Single-SIM routers are a single point of failure. For critical infrastructure, dual-SIM with automatic failover is a minimum. Look for:
- Automatic failover on signal loss or data-path failure (not just SIM insertion detection)
- Configurable failback policy (time-based, or on primary restoration)
- MVNO support for multi-operator SIM pools

### 4. WAN Redundancy

For highest-availability sites, combine cellular with a wired WAN (fibre, VSAT, or leased line). True WAN redundancy means the router can:
- Bond multiple links for aggregated bandwidth
- Fail over transparently without session drops
- Report per-interface link quality to your NMS

### 5. Manageability and Remote Access

A router that cannot be managed remotely costs a truck roll every time a configuration change is needed. Essential management capabilities:
- **Secure VPN access** (IPSec, OpenVPN, WireGuard)
- **Remote CLI and GUI** over an encrypted tunnel
- **OTA firmware updates** with rollback on failure
- **SNMP / Netconf / REST API** for NMS integration
- **Zero-touch provisioning** for fleet deployments of 50+ units

### 6. Interface Richness

Match the router's interface complement to your site's needs:

| Interface | Use Case |
|---|---|
| Gigabit Ethernet WAN | Fibre or DSL connection |
| Gigabit Ethernet LAN | Local switches, PLCs |
| RS232 / RS485 | Legacy equipment, energy meters |
| Digital I/O | Alarms, relay control |
| USB | Modem failover, local log backup |

## The SILBO Router Range from Invendis

The SILBO router range is designed and manufactured by Invendis under the Make in India initiative. It covers entry-level 4G CPE through to 5G multi-WAN industrial platforms:

| Model | Cellular | Temperature | Highlights |
|---|---|---|---|
| SILBO RN50 | 4G Cat-4 | -20 to 60 C | DIN-rail, compact footprint |
| SILBO RT65 | 4G Cat-6 | -40 to 70 C | Dual-SIM, 4x GbE LAN |
| SILBO XA / XB | 5G NSA/SA | -40 to 70 C | Dual-SIM, SD-WAN capable |
| SILBO XF / XG | 5G + Wi-Fi 6 | -20 to 60 C | Campus and outdoor deployments |

All SILBO routers are managed via the NMS platform, support IPSec VPN, and carry CE, FCC, and BIS certifications.

## Making the Right Choice

Match your requirements to the appropriate model:

- **Remote telemetry (IoT data only)**: SILBO RN50 — low cost, sufficient bandwidth for IIoT payloads
- **Video surveillance and remote access**: Cat-6 or Cat-12 device with dual-SIM
- **Primary branch WAN with SLA**: Dual-WAN (cellular + fibre) with SD-WAN failover
- **Outdoor harsh environment**: IP67-rated enclosure with -40 C rating

[Contact the Invendis sales team](/contact) for a router recommendation based on your specific site requirements and deployment volume.
`,"../content/blog/energy-metering-remote-solar-sites.md":`---
title: "Energy Metering for Remote Solar and Hybrid Power Sites"
date: "2025-10-20"
category: "Application Note"
excerpt: "A technical guide to deploying Invendis energy meters at off-grid solar hybrid sites for accurate generation, consumption, and export measurement."
author: "Invendis Team"
tags:
- solar
- energy metering
- hybrid power
- off-grid
- renewables
---

## Why Accurate Energy Measurement Matters

For off-grid and hybrid solar sites — whether a telecom tower, a rural substation, or an industrial facility — accurate energy measurement underpins everything from performance guarantees to regulatory compliance. Without it, you are estimating fuel consumption, missing grid export credits, and flying blind on battery degradation.

## The Measurement Points

A complete hybrid energy accounting system requires meters at three or more points:

1. **Solar generation** — total PV output from the array
2. **Grid import/export** — net metering or time-of-use billing
3. **Load consumption** — actual site load in kWh
4. **DG generation** — diesel generator contribution

## Invendis Multi-Function Energy Meters

The Invendis multi-function energy meter range supports:

- Class 0.5S / 1.0S accuracy for revenue-grade measurement
- Single-phase and three-phase variants (up to 100A direct, CT/PT for higher currents)
- RS485 Modbus RTU at configurable baud rates (9600 to 115200)
- Pulse output (SO) for integration with legacy SCADA
- Bidirectional metering for import and export
- True RMS measurement for harmonic-rich solar inverter outputs

## Integration with iSense RMS

Pairing energy meters with the iSense RMS controller creates an end-to-end monitoring solution. The iSense RMS polls each meter via Modbus RTU every 15 minutes, stores readings locally, and uploads to PizGloria where energy dashboards and monthly reports are auto-generated.

## Installation Considerations

**Enclosure**: Panel-mount meters suit switchboard installations; DIN-rail variants are available for compact RTU enclosures.

**CT sizing**: For loads above 100A, specify the correct current transformer ratio at order time — Invendis ships pre-programmed with the customer's CT ratio to eliminate site configuration.

**Wiring**: Maintain at least 500mm separation between RS485 signal cables and power cables to avoid interference. Use twisted-pair shielded cable for RS485 runs longer than 10m.

## Case Study: 50-Site Solar Monitoring Roll-Out

A renewable energy developer deployed Invendis meters across 50 captive solar sites in Maharashtra. Each site now sends daily energy generation reports to their EMS, enabling:

- Automated GHG reporting for ESG compliance
- Per-site performance ratio calculation
- Immediate alerting on generation shortfall (inverter fault, soiling)

[Contact us](/contact) for a bill-of-materials and wiring diagram tailored to your site configuration.
`,"../content/blog/iiot-in-telecom-tower-monitoring.md":`---
title: "IIoT in Telecom: Real-Time Monitoring of Tower Infrastructure"
date: "2025-11-10"
category: "Technical Article"
excerpt: "Discover how Industrial IoT hardware enables remote visibility, predictive maintenance, and energy efficiency across distributed telecom tower sites."
author: "Invendis Team"
tags:
- telecom
- iiot
- remote monitoring
- tower infrastructure
---

## The Challenge of Distributed Tower Sites

Telecom operators manage thousands of tower sites spread across remote and urban locations. Each site houses critical infrastructure: base stations, rectifiers, batteries, DG sets, and precision air conditioning. Traditionally, monitoring these sites meant dispatching field teams — costly, slow, and often reactive.

Industrial IoT (IIoT) changes this equation fundamentally. With edge-connected controllers and cellular gateways, every parameter on every site can be monitored, logged, and acted upon from a central NOC.

## What Parameters Matter

A comprehensive tower monitoring system should track:

- **Power**: AC mains availability, DG run hours and fuel level, battery voltage and SoH
- **Environment**: Cabinet temperature, door open/close events, humidity
- **Equipment**: Rectifier status, BTS alarms, cooling unit health
- **Energy**: kWh consumption per site, power factor, peak demand

## The iSense RMS Controller

The iSense RMS (Remote Monitoring System) controller from Invendis is purpose-built for tower site telemetry. Key capabilities include:

- 4G/LTE multi-operator connectivity with SIM failover
- Local data logging for 30+ days with offline buffering
- RS485 Modbus support for energy meters and rectifiers
- Digital and analog I/O for DG signals and sensors
- OTA firmware updates via the PizGloria cloud platform

## Connectivity Architecture

A typical deployment connects the iSense RMS to the site's energy meters via RS485 Modbus, reads DG signals through digital I/O, and sends all telemetry upstream via LTE to PizGloria. Alerts are delivered to NOC dashboards within 30 seconds of threshold breaches.

| Parameter | Protocol | Update Interval |
|---|---|---|
| Energy (kWh) | Modbus RTU | 15 minutes |
| DG status | Digital I/O | Real-time |
| Battery voltage | Analog 0-10V | 5 minutes |
| Temperature | RS485 sensor | 5 minutes |

## Impact: Results from the Field

Deployments across Nokia's passive infrastructure portfolio have demonstrated measurable outcomes:

- **40% reduction** in unplanned site visits through proactive alerting
- **15% lower** energy consumption from DG optimisation
- **99.2% uptime** on monitoring data delivery across 500+ sites

## Getting Started

Invendis provides end-to-end support from site survey and hardware supply to cloud onboarding and NOC integration. Our team has deployed IIoT monitoring across 26 countries for OEMs, towercos, and utilities.

[Contact our team](/contact) to discuss your monitoring requirements.
`});function r(e){return e.split(`/`).pop().replace(/\.md$/,``)}function i(e){let t=e.trim().split(/\s+/).length;return Math.max(1,Math.ceil(t/200))}function a(e){let t=e.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)/);if(!t)return{data:{},content:e.trim()};let n=t[2].trim(),r={},i=null;for(let e of t[1].split(/\r?\n/)){if(!e.trim())continue;let t=e.match(/^-\s+(.+)$/);if(t&&i){Array.isArray(r[i])||(r[i]=[]),r[i].push(t[1].replace(/^["'](.*)["']$/,`$1`));continue}let n=e.match(/^([\w]+):\s*(.*)$/);if(n){i=n[1];let e=n[2].trim();r[i]=e===``?[]:e.replace(/^["'](.*)["']$/,`$1`)}}return{data:r,content:n}}function o(){return Object.entries(n).map(([e,t])=>{let n=r(e),{data:o,content:s}=a(t);return{slug:n,content:s,readTime:i(s),...o}}).sort((e,t)=>new Date(t.date)-new Date(e.date))}function s(e){let t=Object.entries(n).find(([t])=>r(t)===e);if(!t)return null;let[,o]=t,{data:s,content:c}=a(o);return{slug:e,content:c,readTime:i(c),...s}}export{s as n,t as r,o as t};