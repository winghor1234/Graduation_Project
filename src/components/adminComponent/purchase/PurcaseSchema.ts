import { z } from "zod"

export const purchaseDetailSchema = z.object({
    product_id: z.string().min(1, "ກະລຸນາເລືອກສິນຄ້າ"),
    variant_id: z.string().min(1, "ກະລຸນາເລືອກ variant"),  // ✅
    quantity:   z.number().min(1, "ຈຳນວນຕ້ອງຢ່າງໜ້ອຍ 1"),
    price:      z.number().min(0),
})

export const purchaseSchema = z.object({
    supplier_id:      z.string().min(1, "ກະລຸນາເລືອກຜູ້ສະໜອງ"),
    purchase_details: z.array(purchaseDetailSchema).min(1, "ຕ້ອງມີຢ່າງໜ້ອຍ 1 ລາຍການ"),
})

export type PurchaseFormValues = z.infer<typeof purchaseSchema>