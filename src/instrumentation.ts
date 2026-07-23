// ✅ ເອີ້ນຄັ້ງດຽວຕອນ server process ເລີ່ມ — ໃຊ້ເລີ່ມ background job ທີ່ຕ້ອງ run ຕະຫຼອດ
// (ໃຊ້ໄດ້ຕໍ່ເມື່ອ deploy ແບບ persistent server — `next start` — ບໍ່ໃຊ້ໄດ້ໃນ serverless)
export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { startOverdueArrivedOrderChecker } = await import("@/modules/order/orderReminder.service")
        startOverdueArrivedOrderChecker()
    }
}
