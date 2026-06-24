"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { UseMutationResult } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { NumericFormat } from "react-number-format"
import { toast } from "sonner"
import { Promotion, CreatePromotionInput, UpdatePromotionInput } from "@/modules/promotion/promotion.types"
import { Tag, X } from "lucide-react"
import { Product } from "../products/ProductType"

const schema = z.object({
    promotion_name: z.string().min(1, "ກະລຸນາໃສ່ຊື່ໂປໂມຊັນ"),
    discount_value: z.number().min(1, "ຄ່າສ່ວນຫຼຸດຕ້ອງຢ່າງໜ້ອຍ 1"),
    start_date: z.string().min(1, "ກະລຸນາເລືອກວັນເລີ່ມ"),
    end_date: z.string().min(1, "ກະລຸນາເລືອກວັນສິ້ນສຸດ"),
    description: z.string().optional(),
    product_ids: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof schema>

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    promotion?: Promotion
    products: Product[]
    create: UseMutationResult<Promotion, Error, CreatePromotionInput>
    update: UseMutationResult<Promotion, Error, { id: string; data: UpdatePromotionInput }>
}

export function PromotionFormDialog({ open, onOpenChange, promotion, products, create, update }: Props) {

    const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { product_ids: [] },
    })

    const selectedProductIds = watch("product_ids") ?? []

    useEffect(() => {
        if (open) {
            reset(promotion ? {
                promotion_name: promotion.promotion_name,
                discount_value: promotion.discount_value,
                start_date: promotion.start_date.slice(0, 10),
                end_date: promotion.end_date.slice(0, 10),
                description: promotion.description ?? "",
                product_ids: promotion.promotion_products?.map(p => p.product_id) ?? [],
            } : { product_ids: [] })
        }
    }, [open, promotion, reset])

    const toggleProduct = (productId: string) => {
        const current = selectedProductIds
        if (current.includes(productId)) {
            setValue("product_ids", current.filter(id => id !== productId))
        } else {
            setValue("product_ids", [...current, productId])
        }
    }

    const onSubmit = async (values: FormValues) => {
        try {
            if (promotion) {
                await update.mutateAsync({ id: promotion.promotion_id, data: values })
                toast.success("ອັບເດດສຳເລັດ")
            } else {
                await create.mutateAsync(values)
                toast.success("ສ້າງໂປໂມຊັນສຳເລັດ")
            }
            onOpenChange(false)
        } catch (error) {
            toast.error("ເກີດຂໍ້ຜິດພາດ")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{promotion ? "ແກ້ໄຂໂປໂມຊັນ" : "ສ້າງໂປໂມຊັນ"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>ຊື່ໂປໂມຊັນ *</Label>
                            <Input {...register("promotion_name")} placeholder="ຊື່ໂປໂມຊັນ" className="mt-1" />
                            <p className="text-xs text-red-500 mt-1">{errors.promotion_name?.message}</p>
                        </div>
                        <div>
                            <Label>ສ່ວນຫຼຸດ (ກີບ) *</Label>
                            <Controller
                                name="discount_value"
                                control={control}
                                render={({ field }) => (
                                    <NumericFormat
                                        customInput={Input}
                                        thousandSeparator
                                        value={field.value}
                                        placeholder="ຈຳນວນສ່ວນຫຼຸດ"
                                        className="mt-1"
                                        onValueChange={v => field.onChange(Number(v.value))}
                                    />
                                )}
                            />
                            <p className="text-xs text-red-500 mt-1">{errors.discount_value?.message}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>ວັນທີເລີ່ມ *</Label>
                            <Input type="date" {...register("start_date")} className="mt-1" />
                            <p className="text-xs text-red-500 mt-1">{errors.start_date?.message}</p>
                        </div>
                        <div>
                            <Label>ວັນທີສິ້ນສຸດ *</Label>
                            <Input type="date" {...register("end_date")} className="mt-1" />
                            <p className="text-xs text-red-500 mt-1">{errors.end_date?.message}</p>
                        </div>
                    </div>

                    <div>
                        <Label>ລາຍລະອຽດ</Label>
                        <Textarea {...register("description")} placeholder="ລາຍລະອຽດໂປໂມຊັນ" className="mt-1" />
                    </div>

                    {/* Product selection */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            ເລືອກສິນຄ້າທີ່ຮ່ວມໂປໂມຊັນ
                            <span className="text-xs text-muted-foreground font-normal">
                                ({selectedProductIds.length} ລາຍການ)
                            </span>
                        </Label>
                        <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                            {products.map(product => {
                                const isSelected = selectedProductIds.includes(product.product_id)
                                return (
                                    <button
                                        key={product.product_id}
                                        type="button"
                                        onClick={() => toggleProduct(product.product_id)}
                                        className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-colors ${isSelected
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        {isSelected && <X className="w-3 h-3 flex-shrink-0" />}
                                        <span className="truncate">{product.product_name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={create.isPending || update.isPending}>
                        {create.isPending || update.isPending ? "ກຳລັງບັນທຶກ..." : promotion ? "ອັບເດດ" : "ສ້າງໂປໂມຊັນ"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}