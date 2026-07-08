---
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
