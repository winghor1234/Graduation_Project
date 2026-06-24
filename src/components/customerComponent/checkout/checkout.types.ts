import * as z from "zod"

export type Province = {
    province_id: string
    province_name: string
    districts: {
        district_id: string
        district_name: string
        branches: {
            branch_id: string
            branch_name: string
        }[]
    }[]
}

export type District = Province["districts"][number]

const MAX_FILE_SIZE = 10 * 1024 * 1024

export const checkoutSchema = z.object({
    province_id: z.string().min(1, "ກະລຸນາເລືອກແຂວງ"),
    district_id: z.string().min(1, "ກະລຸນາເລືອກເມືອງ"),
    branch_id: z.string().min(1, "ກະລຸນາເລືອກສາຂາ"),
    paymentSlip: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= MAX_FILE_SIZE,
            "ໄຟລ໌ຕ້ອງມີຂະໜາດບໍ່ເກີນ 10MB"
        )
        .refine(
            (file) => !file || file.type.startsWith("image/"),
            "ກະລຸນາອັບໂຫຼດໄຟລ໌ຮູບພາບເທົ່ານັ້ນ"
        ),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
