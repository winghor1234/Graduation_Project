// ✅ ຄ່າ color ໃນ DB ເປັນ free-text (ພາສາລາວ/ອັງກິດ, ພິມມືອດ) — ບໍ່ມີ hex ຈິງ
// ນີ້ຄືການຄາດເດົາ swatch ທີ່ດີທີ່ສຸດເທົ່າທີ່ຈະເຮັດໄດ້, ໃຊ້ຮ່ວມກັນລະຫວ່າງ ProductCard ແລະ FilterPanel

const COLOR_HEX: Record<string, string> = {
    red: "#EF4444", ແດງ: "#EF4444",
    blue: "#3B82F6", ຟ້າ: "#3B82F6",
    green: "#22C55E", ຂຽວ: "#22C55E",
    black: "#111111", ດຳ: "#111111",
    white: "#E5E7EB", ຂາວ: "#E5E7EB",
    yellow: "#EAB308", ເຫຼືອງ: "#EAB308",
    orange: "#FF6B00", ສົ້ມ: "#FF6B00",
    purple: "#A855F7", ມ່ວງ: "#A855F7",
    pink: "#EC4899", ບົວ: "#EC4899",
    gray: "#6B7280", ເທົາ: "#6B7280",
    brown: "#92400E", ນ້ຳຕານ: "#92400E",
    navy: "#1E3A5F", ກ່ຳ: "#1E3A5F",
    beige: "#D4B896", ຄີມ: "#D4B896",
}

export function getColorHex(name: string) {
    return COLOR_HEX[name.toLowerCase()] ?? COLOR_HEX[name] ?? "#6B7280"
}
