// Developer-maintained. Variant tables are free-form (different products use
// different column sets) and aren't exposed in the CMS — add/edit new variant
// tables here by hand, keyed by product id.
const productVariants = {
  "inv-ce-xx": {
    "note": "Part number format: INV-CX-x7425e-[Type][Display]-[eMMC]-[SSD]-[RAM]-[Modem]. RAM: 1=4 GB … 5=64 GB DDR5 | eMMC: 1=8 GB … 5=128 GB | SSD: 1=128 GB … 4=1 TB | Modem: 0=None, 4=4G, 5=5G | Wi-Fi: 0=None, 6=Wi-Fi 6",
    "headers": [
      "Type",
      "Code",
      "Description",
      "Example Part No."
    ],
    "rows": [
      [
        "Mini-PC / NUC",
        "D",
        "Compact form-factor desktop/NUC",
        "INV-CD60-214-H"
      ],
      [
        "SDWAN Router",
        "E",
        "Software-defined WAN router",
        "INV-CE65-214-C"
      ],
      [
        "Industrial PC",
        "Ea",
        "RS485, RS232, 4× DIO",
        "—"
      ],
      [
        "6-Port SDWAN",
        "Eb",
        "6× GbE, dual 5G modem support",
        "—"
      ]
    ]
  },
  "inv-cea-xx": {
    "note": "Part number format: INV-CX-x7425e-[Type][Display]-[eMMC]-[SSD]-[RAM]-[Modem]. RAM: 1=4 GB … 5=64 GB DDR5 | eMMC: 1=8 GB … 5=128 GB | SSD: 1=128 GB … 4=1 TB | Modem: 0=None, 4=4G, 5=5G | Wi-Fi: 0=None, 6=Wi-Fi 6",
    "headers": [
      "Type",
      "Code",
      "Description",
      "Example Part No."
    ],
    "rows": [
      [
        "Mini-PC / NUC",
        "D",
        "Compact form-factor desktop/NUC",
        "INV-CD60-214-H"
      ],
      [
        "SDWAN Router",
        "E",
        "Software-defined WAN router",
        "INV-CE65-214-C"
      ],
      [
        "Industrial PC",
        "Ea",
        "RS485, RS232, 4× DIO",
        "—"
      ],
      [
        "6-Port SDWAN",
        "Eb",
        "6× GbE, dual 5G modem support",
        "—"
      ]
    ]
  },
  "inv-ceb-xx": {
    "note": "Part number format: INV-CX-x7425e-[Type][Display]-[eMMC]-[SSD]-[RAM]-[Modem]. RAM: 1=4 GB … 5=64 GB DDR5 | eMMC: 1=8 GB … 5=128 GB | SSD: 1=128 GB … 4=1 TB | Modem: 0=None, 4=4G, 5=5G | Wi-Fi: 0=None, 6=Wi-Fi 6",
    "headers": [
      "Type",
      "Code",
      "Description",
      "Example Part No."
    ],
    "rows": [
      [
        "Mini-PC / NUC",
        "D",
        "Compact form-factor desktop/NUC",
        "INV-CD60-214-H"
      ],
      [
        "SDWAN Router",
        "E",
        "Software-defined WAN router",
        "INV-CE65-214-C"
      ],
      [
        "Industrial PC",
        "Ea",
        "RS485, RS232, 4× DIO",
        "—"
      ],
      [
        "6-Port SDWAN",
        "Eb",
        "6× GbE, dual 5G modem support",
        "—"
      ]
    ]
  },
  "inv-cd-xx": {
    "note": "Part number format: INV-CX-x7425e-[Type][Display]-[eMMC]-[SSD]-[RAM]-[Modem]. RAM: 1=4 GB … 5=64 GB DDR5 | eMMC: 1=8 GB … 5=128 GB | SSD: 1=128 GB … 4=1 TB | Modem: 0=None, 4=4G, 5=5G | Wi-Fi: 0=None, 6=Wi-Fi 6",
    "headers": [
      "Type",
      "Code",
      "Description",
      "Example Part No."
    ],
    "rows": [
      [
        "Mini-PC / NUC",
        "D",
        "Compact form-factor desktop/NUC",
        "INV-CD60-214-H"
      ],
      [
        "SDWAN Router",
        "E",
        "Software-defined WAN router",
        "INV-CE65-214-C"
      ],
      [
        "Industrial PC",
        "Ea",
        "RS485, RS232, 4× DIO",
        "—"
      ],
      [
        "6-Port SDWAN",
        "Eb",
        "6× GbE, dual 5G modem support",
        "—"
      ]
    ]
  },
  "rtsxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "—",
        "—",
        "RTS00"
      ],
      [
        "✓",
        "—",
        "4G",
        "Single",
        "RTS04-1"
      ],
      [
        "✓",
        "—",
        "4G",
        "Dual",
        "RTS04-2"
      ],
      [
        "✓",
        "—",
        "5G",
        "Single",
        "RTS05-1"
      ],
      [
        "✓",
        "—",
        "5G",
        "Dual",
        "RTS05-2"
      ],
      [
        "—",
        "Wi-Fi 6",
        "—",
        "—",
        "RTS-60"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "4G",
        "Single",
        "RTS64-1"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "4G",
        "Dual",
        "RTS64-2"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "5G",
        "Single",
        "RTS65-1"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "5G",
        "Dual",
        "RTS65-2"
      ]
    ]
  },
  "ru60": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "Wi-Fi 6",
        "—",
        "—",
        "RU60"
      ]
    ]
  },
  "roxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 6",
        "5G",
        "Dual",
        "RO65-2"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "5G",
        "Single",
        "RO65-1"
      ],
      [
        "—",
        "Wi-Fi 6",
        "—",
        "—",
        "RO60"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "4G",
        "Dual",
        "RO64-2"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "4G",
        "Single",
        "RO64-1"
      ]
    ]
  },
  "rtxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "—",
        "—",
        "RT00"
      ],
      [
        "✓",
        "—",
        "4G",
        "Single",
        "RT04-1"
      ],
      [
        "✓",
        "—",
        "4G",
        "Dual",
        "RT04-2"
      ],
      [
        "✓",
        "—",
        "5G",
        "Single",
        "RT05-1"
      ],
      [
        "✓",
        "—",
        "5G",
        "Dual",
        "RT05-2"
      ],
      [
        "—",
        "Wi-Fi 6",
        "—",
        "—",
        "RT-60"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "4G",
        "Single",
        "RT64-1"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "4G",
        "Dual",
        "RT64-2"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "5G",
        "Single",
        "RT65-1"
      ],
      [
        "✓",
        "Wi-Fi 6",
        "5G",
        "Dual",
        "RT65-2"
      ]
    ]
  },
  "rvxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 5",
        "4G",
        "Single",
        "RV54-1"
      ],
      [
        "✓",
        "Wi-Fi 5",
        "4G",
        "Dual",
        "RV54-2"
      ],
      [
        "✓",
        "—",
        "4G",
        "Single",
        "RV04-1"
      ],
      [
        "✓",
        "—",
        "4G",
        "Dual",
        "RV04-2"
      ],
      [
        "—",
        "Wi-Fi 5",
        "—",
        "—",
        "RV50"
      ]
    ]
  },
  "rv00": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "—",
        "—",
        "RV00"
      ]
    ]
  },
  "rdxx": {
    "headers": [
      "Wi-Fi",
      "Cellular",
      "4G/5G",
      "RS485",
      "RS232",
      "Gateway SW",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "✓",
        "4G",
        "—",
        "—",
        "—",
        "RD44-A"
      ],
      [
        "—",
        "✓",
        "4G",
        "—",
        "—",
        "—",
        "RD04-A"
      ],
      [
        "—",
        "✓",
        "4G",
        "—",
        "—",
        "✓",
        "RD44-B"
      ],
      [
        "—",
        "✓",
        "4G",
        "✓",
        "—",
        "✓",
        "RD04-B"
      ],
      [
        "✓",
        "✓",
        "4G",
        "—",
        "✓",
        "✓",
        "RD44-C"
      ],
      [
        "—",
        "✓",
        "4G",
        "✓",
        "✓",
        "✓",
        "RD04-C"
      ],
      [
        "—",
        "—",
        "—",
        "—",
        "—",
        "—",
        "RDS00"
      ],
      [
        "✓",
        "✓",
        "4G",
        "✓",
        "✓",
        "✓",
        "RDS44"
      ]
    ]
  },
  "rexx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "Dual",
        "RE44"
      ],
      [
        "✓",
        "—",
        "4G",
        "Dual",
        "RE04"
      ]
    ]
  },
  "ri44": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "RS485",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "✓",
        "Single",
        "RI44"
      ]
    ]
  },
  "mt7621odu": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "—",
        "4G",
        "Single",
        "MT7621-01 ODU"
      ]
    ]
  },
  "rt65odu": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 6",
        "5G",
        "Single",
        "RT65-ODU"
      ]
    ]
  },
  "idfxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "-",
        "4G",
        "Single",
        "IDF04"
      ],
      [
        "✓",
        "Wi-Fi 5",
        "4G",
        "Single",
        "IDF54"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "Single",
        "IDF44"
      ],
      [
        "✓",
        "-",
        "5G",
        "Single",
        "IDF05"
      ],
      [
        "✓",
        "Wi-Fi 5",
        "5G",
        "Single",
        "IDF55"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "5G",
        "Single",
        "IDF45"
      ]
    ]
  },
  "iexx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "RS485",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi",
        "4G",
        "✓",
        "Single",
        "IE44-A"
      ],
      [
        "✓",
        "Wi-Fi",
        "4G",
        "✓",
        "Single",
        "IE44-C"
      ],
      [
        "✓",
        "Wi-Fi",
        "4G",
        "✓",
        "Single",
        "IE44-A-EX1 (e-SIM)"
      ]
    ]
  },
  "iaxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "RS485",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "✓",
        "Single",
        "IA44-C"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "✓",
        "Single",
        "IA44-B (4 GB eMMC)"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "—",
        "Single",
        "IA44-A"
      ],
      [
        "—",
        "Wi-Fi 4",
        "—",
        "✓",
        "—",
        "IA40-C"
      ]
    ]
  },
  "rfnxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "RS485",
      "DIO",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 4",
        "—",
        "—",
        "4G",
        "Single",
        "RFN44-A"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "✓",
        "—",
        "4G",
        "Single",
        "RFN44-B (RS485)"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "—",
        "✓",
        "4G",
        "Single",
        "RFN44-C (1× DI, 1× DO)"
      ]
    ]
  },
  "iabxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "RS485",
      "RS232",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 4",
        "✓",
        "✓",
        "4G",
        "Single",
        "IAB44-C"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "✓",
        "✓",
        "4G",
        "Single",
        "IAB44-B (4 GB eMMC)"
      ],
      [
        "✓",
        "—",
        "✓",
        "✓",
        "4G",
        "Single",
        "IAB04-B (4 GB eMMC)"
      ],
      [
        "✓",
        "—",
        "✓",
        "✓",
        "4G",
        "Single",
        "IAB04-C"
      ]
    ]
  },
  "iacxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "RS485",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 4",
        "✓",
        "4G",
        "Single",
        "IAC44-C"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "—",
        "4G",
        "Single",
        "IAC44-A"
      ],
      [
        "✓",
        "—",
        "—",
        "4G",
        "Single",
        "IAC04-A"
      ],
      [
        "✓",
        "—",
        "✓",
        "4G",
        "Single",
        "IAC04-C"
      ]
    ]
  },
  "iafxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "RS485",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "—",
        "Single",
        "IAF44-C1"
      ],
      [
        "✓",
        "Wi-Fi 4",
        "4G",
        "✓",
        "Single",
        "IAF44-C2"
      ],
      [
        "✓",
        "—",
        "4G",
        "✓",
        "Single",
        "IAF04-C2"
      ],
      [
        "—",
        "—",
        "4G",
        "—",
        "Single",
        "IAF04-C1"
      ]
    ]
  },
  "idxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "RS485",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 5",
        "4G",
        "✓",
        "Single",
        "ID55-B (4 GB eMMC)"
      ],
      [
        "✓",
        "—",
        "4G",
        "—",
        "Single",
        "ID55"
      ],
      [
        "✓",
        "Wi-Fi 5",
        "4G",
        "✓",
        "Single",
        "ID54-B (4 GB eMMC)"
      ],
      [
        "✓",
        "—",
        "4G",
        "—",
        "Single",
        "ID54"
      ]
    ]
  },
  "idbxx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "RS485",
      "RS232",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "Wi-Fi 5",
        "5G",
        "✓",
        "✓",
        "Single",
        "IDB55-B"
      ],
      [
        "✓",
        "Wi-Fi 5",
        "5G",
        "—",
        "—",
        "Single",
        "IDB55"
      ],
      [
        "✓",
        "Wi-Fi 5",
        "4G",
        "✓",
        "✓",
        "Single",
        "IDB54-B"
      ],
      [
        "✓",
        "Wi-Fi 5",
        "4G",
        "—",
        "—",
        "Single",
        "IDB54"
      ]
    ]
  },
  "isense": {
    "headers": [
      "Wi-Fi",
      "Cellular",
      "4G/5G",
      "RS485",
      "RS232",
      "DIO Count",
      "Part Number"
    ],
    "rows": [
      [
        "✓",
        "✓",
        "4G",
        "✓",
        "✓",
        "24",
        "iSense Violet Plus Pro"
      ],
      [
        "✓",
        "✓",
        "4G",
        "✓",
        "✓",
        "12",
        "iSense Green Plus Pro"
      ],
      [
        "✓",
        "✓",
        "4G",
        "✓",
        "✓",
        "6",
        "iSense Blue Plus Pro"
      ]
    ]
  },
  "xa82": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "PoE Out",
      "PoE Budget",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "✓",
        "240W, 30W/port",
        "XA82-2 Unmanaged PoE Switch"
      ]
    ]
  },
  "xb82": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "PoE Out",
      "PoE Budget",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "✓",
        "240W, 30W/port",
        "XB82-2 Unmanaged PoE Switch"
      ]
    ]
  },
  "xc80": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "PoE Out",
      "PoE Budget",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "✓",
        "240W, 30W/port",
        "XC-80-1 Unmanaged PoE Switch"
      ]
    ]
  },
  "xd50": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "PoE Out",
      "PoE Budget",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "✓",
        "240W, 30W/port",
        "XD50-1 Unmanaged PoE Switch"
      ]
    ]
  },
  "xf100": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "PoE Out",
      "PoE Budget",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "✓",
        "240W, 30W/port",
        "XF-100-1 Unmanaged PoE Switch"
      ]
    ]
  },
  "xg82": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "PoE Out",
      "PoE Budget",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "✓",
        "240W",
        "XG82-2L Gigabit Ethernet Managed Switch"
      ]
    ]
  },
  "pc3xx": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "RS485",
      "No. of RS485 Ports",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "—",
        "✓",
        "1",
        "PC310"
      ],
      [
        "—",
        "—",
        "✓",
        "2",
        "PC311"
      ],
      [
        "—",
        "Wi-Fi 4",
        "✓",
        "1",
        "PC312"
      ]
    ]
  },
  "et0076": {
    "headers": [
      "Current Range",
      "Part Number"
    ],
    "rows": [
      [
        "32A",
        "ET0076 32A"
      ],
      [
        "63A",
        "ET0076 63A"
      ]
    ]
  },
  "et3061": {
    "headers": [
      "Model",
      "Part Number"
    ],
    "rows": [
      [
        "ET3061",
        "ET3061"
      ],
      [
        "ET3062",
        "ET3062"
      ]
    ]
  },
  "et4001": {
    "headers": [
      "Type",
      "Part Number"
    ],
    "rows": [
      [
        "Standard",
        "ET4001"
      ],
      [
        "Surge protected",
        "ET4001S"
      ]
    ]
  },
  "et7021": {
    "headers": [
      "Phase Type",
      "Part Number"
    ],
    "rows": [
      [
        "Single phase",
        "ET7021"
      ],
      [
        "Three phase",
        "ET7023"
      ]
    ]
  },
  "mcx": {
    "headers": [
      "Interface",
      "Mode",
      "Max Distance",
      "Part Number"
    ],
    "rows": [
      [
        "1× RJ45 + 1× Fiber SC",
        "Single-mode",
        "5 km",
        "ISMC1-SD851G-S5"
      ],
      [
        "1× RJ45 + 1× Fiber SC",
        "Single-mode",
        "10 km",
        "ISMC1-SD311G-10"
      ],
      [
        "1× RJ45 + 1× Fiber SC",
        "Single-mode",
        "20 km",
        "SMC1-SD311G-20"
      ]
    ]
  },
  "rn50pcba": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "Wi-Fi 5",
        "—",
        "Single",
        "RN 50 PCB-A"
      ]
    ]
  },
  "rvw50": {
    "headers": [
      "Cellular",
      "Wi-Fi",
      "4G/5G",
      "No. of Modems",
      "Part Number"
    ],
    "rows": [
      [
        "—",
        "Wi-Fi 5",
        "—",
        "Single",
        "RVW 50"
      ]
    ]
  },
  "miniups": {
    "headers": [
      "Battery",
      "Capacity",
      "Backup Time",
      "Part Number"
    ],
    "rows": [
      [
        "18650 cells",
        "19 Whr",
        "3–5 hours",
        "Mini UPS 19W"
      ],
      [
        "26650 cells",
        "38 Whr",
        "9–10 hours",
        "Mini UPS 38W"
      ]
    ]
  }
}

export default productVariants
