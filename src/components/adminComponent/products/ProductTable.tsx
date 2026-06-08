"use client"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Product } from "@/modules/product/product.types"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    products: Product[]
    isLoading: boolean
    onEdit: (p: Product) => void
    onDelete: (id: string) => void
}

export function ProductTable({ products, isLoading, onEdit, onDelete }: Props) {
    if (isLoading) {
        return <Card className="p-6 text-center">Loading products...</Card>
    }
    if (!products?.length) {
        return <Card className="p-6 text-center">No products found</Card>
    }
    return (
        // <Card>
        //     <Table>
        //         <TableHeader>
        //             <TableRow>
        //                 <TableHead >NO:</TableHead>
        //                 <TableHead >Product</TableHead>
        //                 <TableHead >Product code</TableHead>
        //                 <TableHead>Purchase price</TableHead>
        //                 <TableHead>Sale price</TableHead>
        //                 <TableHead>Stock</TableHead>
        //                 <TableHead className="text-center">Action</TableHead>
        //             </TableRow>
        //         </TableHeader>
        //         <TableBody>
        //             {products.map((product, index) => (
        //                 <TableRow key={product.product_id}>
        //                     <TableCell>
        //                         {index + 1}
        //                     </TableCell>
        //                     <TableCell>
        //                         <div className="flex items-center gap-3 ">
        //                             {product.images?.[0]?.image_url ?
        //                                 <Image
        //                                     src={product.images[0].image_url}
        //                                     alt={product.product_name}
        //                                     width={48}
        //                                     height={48}
        //                                     className="rounded "
        //                                 />
        //                                 :
        //                                 <div className=" w-12 h-12 bg-gray-200 flex items-center justify-center rounded ">
        //                                     No Image
        //                                 </div>
        //                             }
        //                             <span className="font-medium">
        //                                 {product.product_name}
        //                             </span>
        //                         </div>
        //                     </TableCell>
        //                     <TableCell>
        //                         {product.product_code}
        //                     </TableCell>
        //                     <TableCell>
        //                         {formatCurrency(product.purchase_price)}
        //                     </TableCell>
        //                     <TableCell>
        //                         {formatCurrency(product.sale_price)}
        //                     </TableCell>
        //                     <TableCell>
        //                         <Badge>{product.stock_qty}</Badge>
        //                     </TableCell>
        //                     <TableCell className="flex justify-center gap-2">
        //                         <Button
        //                             size="icon"
        //                             variant="ghost"
        //                             className="group hover:bg-blue-50"
        //                             onClick={() => onEdit(product)}
        //                         >
        //                             <Edit className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-all" />
        //                         </Button>

        //                         <Button
        //                             size="icon"
        //                             variant="ghost"
        //                             className="group h-8 w-8 p-0 hover:bg-blue-50 active:scale-95 transition-all duration-150"
        //                             onClick={() => onDelete(product.product_id)}
        //                         >
        //                             <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-all" />
        //                         </Button>
        //                     </TableCell>
        //                 </TableRow>
        //             ))}
        //         </TableBody>
        //     </Table>
        // </Card>


        <Card className="rounded-2xl border shadow-sm">
            <div className="w-full overflow-x-auto">

                <Table className="min-w-[750px]">

                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>#</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="hidden md:table-cell">Code</TableHead>
                            <TableHead className="text-right">Purchase</TableHead>
                            <TableHead className="text-right">Sale</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={product.product_id}>

                                <TableCell>{index + 1}</TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2 min-w-[160px]">
                                        <Image
                                            src={product.images?.[0]?.image_url || ""}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="rounded-md"
                                        />
                                        <span className="truncate">
                                            {product.product_name}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="hidden md:table-cell">
                                    {product.product_code}
                                </TableCell>

                                <TableCell className="text-right">
                                    {formatCurrency(product.purchase_price)}
                                </TableCell>

                                <TableCell className="text-right">
                                    {formatCurrency(product.sale_price)}
                                </TableCell>

                                <TableCell className="text-center">
                                    <Badge>{product.stock_qty}</Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex justify-center gap-1">
                                        <Button size="icon" variant="ghost">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div>
        </Card>
    )
}