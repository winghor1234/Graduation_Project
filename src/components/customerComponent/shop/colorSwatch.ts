// ✅ ຄ່າ color ໃນ DB ເປັນ free-text (ພາສາລາວ/ອັງກິດ, ພິມມືອດ) — ບໍ່ມີ hex ຈິງ
// ນີ້ຄືການຄາດເດົາ swatch ທີ່ດີທີ່ສຸດເທົ່າທີ່ຈະເຮັດໄດ້ ໂດຍ match ຄຳສັບທົ່ວໄປ, fallback ເປັນ gray

const COLOR_MAP: Record<string, string> = {
    // ພາສາລາວ
    "ແດງ":    "#dc2626",
    "ດຳ":     "#171717",
    "ຂາວ":    "#f5f5f5",
    "ຟ້າ":    "#3b82f6",
    "ຂຽວ":    "#16a34a",
    "ເຫຼືອງ":  "#eab308",
    "ມ່ວງ":   "#9333ea",
    "ບົວ":    "#ec4899",
    "ນ້ຳຕານ": "#92400e",
    "ເທົາ":   "#6b7280",
    "ສົ້ມ":   "#f97316",
    "ຄີມ":    "#fef3c7",
    "ກົມ":    "#1e293b",

    // English
    red:      "#dc2626",
    black:    "#171717",
    white:    "#f5f5f5",
    blue:     "#3b82f6",
    navy:     "#1e3a5f",
    green:    "#16a34a",
    yellow:   "#eab308",
    purple:   "#9333ea",
    pink:     "#ec4899",
    brown:    "#92400e",
    gray:     "#6b7280",
    grey:     "#6b7280",
    orange:   "#f97316",
    cream:    "#fef3c7",
    beige:    "#e7dcc8",
    silver:   "#c0c0c0",
    gold:     "#d4af37",
}

/** ຄາດເດົາສີສຳລັບສະແດງ swatch — return null ຖ້າບໍ່ຮູ້ຈັກ (ໃຫ້ caller ສະແດງ text ແທນ) */
export function getSwatchColor(name: string): string | null {
    const key = name.trim().toLowerCase()
    if (COLOR_MAP[key]) return COLOR_MAP[key]

    for (const [word, hex] of Object.entries(COLOR_MAP)) {
        if (key.includes(word.toLowerCase())) return hex
    }
    return null
}
