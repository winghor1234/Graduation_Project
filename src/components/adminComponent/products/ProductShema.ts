import { z } from "zod"

export const variantSchema = z.object({
  variant_id:     z.string().optional(), // ✅ ມີ = variant ເກົ່າ, ບໍ່ມີ = variant ໃໝ່
  sku:            z.string().min(1, "ກະລຸນາໃສ່ SKU"),
  color:          z.string().min(1, "ກະລຸນາໃສ່ສີ"),
  size:           z.string().min(1, "ກະລຸນາໃສ່ຂະໜາດ"),
  purchase_price: z.number().min(0),
  sale_price:     z.number().min(0),
  stock_qty:      z.number().min(0),
})

export const productSchema = z.object({
  product_name:   z.string().min(1, "ກະລຸນາໃສ່ຊື່ສິນຄ້າ"),
  purchase_price: z.number().min(0).optional(),
  description:    z.string().optional(),
  category_id:    z.string().min(1, "ກະລຸນາເລືອກໝວດໝູ່"),
  variants:       z.array(variantSchema).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>