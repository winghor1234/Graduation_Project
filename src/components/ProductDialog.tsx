import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import Image from "next/image"

export function ProductDialog({
    open,
    onOpenChange,
    product,
    onSave
}: any) {

    const [previewImages, setPreviewImages] = useState<string[]>([])

    if (!open) return null

    const handleImageChange = (e: any) => {
        const files = Array.from(e.target.files)
        const previews = files.map((file: any) =>
            URL.createObjectURL(file)
        )
        setPreviewImages(previews)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const form = e.target
        const data = {
            name: form.name.value,
            price: form.price.value,
            stock: form.stock.value,
            description: form.description.value,
            categoryId: form.categoryId.value,
            images: form.images.files
        }
        onSave(data)
        onOpenChange(false)
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <Card className="p-6 w-[420px] bg-white rounded-xl shadow-lg">

                <h2 className="text-lg font-bold mb-4">
                    {product ? "ແກ້ໄຂຂໍ້ມູນສິນຄ້າ" : "ເພີ່ມສິນຄ້າໃໝ່"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <div className="space-y-1">
                        <label className="text-sm font-medium">ຊື່ສິນຄ້າ</label>
                        <Input
                            name="name"
                            placeholder="ປ້ອນຊື່ສິນຄ້າ..."
                            defaultValue={product?.product_name}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">ລາຄາ</label>
                        <Input
                            name="price"
                            type="number"
                            placeholder="ປ້ອນລາຄາສິນຄ້າ..."
                            defaultValue={product?.price}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">ຈຳນວນໃນສາງ</label>
                        <Input
                            name="stock"
                            type="number"
                            placeholder="ປ້ອນຈຳນວນສິນຄ້າ..."
                            defaultValue={product?.stock_qty}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">ລະຫັດໝວດໝູ່</label>
                        <Input
                            name="categoryId"
                            placeholder="ປ້ອນລະຫັດໝວດໝູ່ (Category ID)..."
                            defaultValue={product?.category_id}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">ລາຍລະອຽດ</label>
                        <Input
                            name="description"
                            placeholder="ປ້ອນລາຍລະອຽດສິນຄ້າ..."
                            defaultValue={product?.description}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">ຮູບພາບສິນຄ້າ</label>
                        <Input
                            type="file"
                            name="images"
                            multiple
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Preview Images */}
                    <div className="flex gap-2 flex-wrap mt-2">
                        {previewImages.map((img, i) => (
                            <Image
                                key={i}
                                src={img}
                                className="h-16 w-16 object-cover rounded border"
                                alt="ຮູບຕົວຢ່າງ"
                                width={96}
                                height={96}
                            />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            ຍົກເລີກ
                        </Button>
                        <Button type="submit">
                            ບັນທຶກ
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    )
}