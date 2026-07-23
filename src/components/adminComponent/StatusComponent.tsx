// status label
export const translateStatus = (status?: string) => {
    switch (status) {
        case "PENDING":
            return "ລໍຖ້າດຳເນີນການ"
        case "PROCESSING":
            return "ກຳລັງດຳເນີນການ"
        case "SHIPPED":
            return "ກຳລັງຈັດສົ່ງ"
        case "ARRIVED":
            return "ຮອດປາຍທາງແລ້ວ"
        case "DELIVERED":
            return "ສົ່ງສຳເລັດ"
        case "CANCELLED":
            return "ຍົກເລີກ"
        case "WAITING_PAYMENT":
            return "ລໍຖ້າກວດສອບຊຳລະ"
        case "PAID":
            return "ຊຳລະແລ້ວ"
        case "COMPLETED":
            return "ສຳເລັດ"
        case "VERIFIED":
            return "ກວດສອບສຳເລັດ"
        case "REJECTED":
            return "ປະຕິເສດການກວດສອບ"
        case "TRANSFER":
            return "ໂອນເງິນ"
        case "CASH":
            return "ເງິນສົດ (COD)"
        default:
            return status ?? "ບໍ່ຮູ້ສະຖານະ"
    }
}

// simple badge style (no library needed)
export const statusColor = (status?: string) => {
    switch (status) {
        case "PENDING":
        case "WAITING_PAYMENT":
            return "bg-yellow-100 text-yellow-700"
        case "PROCESSING":
            return "bg-blue-100 text-blue-700"
        case "SHIPPED":
            return "bg-indigo-100 text-indigo-700"
        case "ARRIVED":
            return "bg-violet-100 text-violet-700"
        case "DELIVERED":
            return "bg-green-100 text-green-700"
        case "COMPLETED":
            return "bg-green-100 text-green-700"
        case "CANCELLED":
            return "bg-red-100 text-red-700"
        case "PAID":
            return "bg-emerald-100 text-emerald-700"
        case "VERIFIED":
            return "bg-green-100 text-green-700"
        case "REJECTED":
            return "bg-red-100 text-red-700"
        case "TRANSFER":
            return "bg-purple-100 text-purple-700"
        case "CASH":
            return "bg-orange-100 text-orange-700"
        default:
            return "bg-gray-100 text-admin-text"
    }
}


export const BadgeComponent = ({ status }: { status?: string }) => (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(status)}`}>
        {translateStatus(status)}
    </span>
)