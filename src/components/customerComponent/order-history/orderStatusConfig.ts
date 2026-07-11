import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react"

export const ORDER_STATUS = {
    WAITING_PAYMENT: { label: "ລໍຖ້າຊຳລະ",  color: "bg-amber-50 text-amber-700 border-amber-200",       icon: Clock },
    PAID:            { label: "ຊຳລະແລ້ວ",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    SHIPPED:         { label: "ກຳລັງຈັດສົ່ງ", color: "bg-blue-50 text-blue-700 border-blue-200",          icon: Truck },
    COMPLETED:       { label: "ສຳເລັດ",        color: "bg-gray-100 text-gray-600 border-gray-200",         icon: CheckCircle2 },
    CANCELLED:       { label: "ຍົກເລີກ",       color: "bg-rose-50 text-rose-600 border-rose-200",          icon: XCircle },
} as const

export const PAYMENT_STATUS = {
    PENDING:  { label: "ກຳລັງກວດສອບ", color: "bg-amber-50 text-amber-700 border-amber-200" },
    VERIFIED: { label: "ຢືນຢັນແລ້ວ",   color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    REJECTED: { label: "ຖືກປະຕິເສດ",  color: "bg-rose-50 text-rose-600 border-rose-200" },
} as const

export const DELIVERY_STATUS = {
    PENDING:    { label: "ລໍຖ້າຈັດສົ່ງ",  color: "bg-gray-50 text-gray-500 border-gray-200",          icon: Package },
    PROCESSING: { label: "ກຳລັງກຽມສົ່ງ", color: "bg-violet-50 text-violet-700 border-violet-200",    icon: Package },
    SHIPPED:    { label: "ກຳລັງຈັດສົ່ງ",  color: "bg-blue-50 text-blue-700 border-blue-200",          icon: Truck },
    DELIVERED:  { label: "ສົ່ງເຖິງແລ້ວ",  color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    CANCELLED:  { label: "ຍົກເລີກການສົ່ງ", color: "bg-rose-50 text-rose-600 border-rose-200",         icon: XCircle },
} as const

export function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "ຫາກໍ່ນີ້"
    if (m < 60) return `${m} ນາທີກ່ອນ`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} ຊ.ກ່ອນ`
    return `${Math.floor(h / 24)} ວັນກ່ອນ`
}
