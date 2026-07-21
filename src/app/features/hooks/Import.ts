"use client"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { importApi } from "../api/Import"
import { CreateImportInput, ConfirmImportInput } from "@/modules/import/import.type"
import { UseGetParams } from "../types"


export const useGetImports = (params?: UseGetParams) => {
    return useQuery({
        queryKey: ["imports", params],
        queryFn: () => importApi.getAll(params),
        placeholderData: keepPreviousData,
    })
}

export const useCreateImport = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateImportInput) =>
            importApi.create(data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
            qc.invalidateQueries({ queryKey: ["products"] })
            // ✅ createImport ຝັ່ງ backend ຕັ້ງ PurchaseOrder.status = COMPLETED ໄປພ້ອມ —
            // ຕ້ອງ refetch ລາຍການໃບສັ່ງຊື້ ບໍ່ດັ່ງນັ້ນ "ລໍຖ້ານຳເຂົ້າ" ຈະຄ້າງລາຍການເກົ່າ
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}

export const useCancelImport = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => importApi.cancel(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
            // ✅ cancelImport ຝັ່ງ backend ຕັ້ງ PurchaseOrder.status ກັບ PENDING ຄືນ —
            // ຕ້ອງ refetch ໃຫ້ໃບສັ່ງຊື້ນັ້ນກັບຄືນມາໃນລາຍການ "ລໍຖ້ານຳເຂົ້າ"
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}

export const useConfirmImport = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data?: ConfirmImportInput }) =>
            importApi.confirm(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
            qc.invalidateQueries({ queryKey: ["products"] })
            // ✅ ຈຳນວນທີ່ຢືນຢັນອາດຖືກແກ້ໄຂ — ຜົນຕໍ່ PurchaseDetail.received_qty ແລະການຄິດຄ່າຈ່າຍໃຫ້ supplier
            qc.invalidateQueries({ queryKey: ["purchase"] })
        }
    })
}


export const useDeleteImport = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => importApi.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["imports"] })
        }
    })
}