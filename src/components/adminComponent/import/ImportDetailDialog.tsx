"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Import } from "@/modules/import/import.type"
import { formatDate } from "@/utils/FormatDate"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Props = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    data?: Import
}


export function ImportDetail({ open, onOpenChange, data }: Props) {
    console.log(data)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Import Detail
                    </DialogTitle>
                </DialogHeader>

                {/* 🔹 SUMMARY */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Supplier</span>
                        <p className="font-medium">
                            {data?.purchase?.supplier?.supplier_name || "-"}
                        </p>
                    </div>

                    <div>
                        <span className="text-muted-foreground">Employee</span>
                        <p className="font-medium">
                            {data?.employee?.employee_name || "-"}
                        </p>
                    </div>

                    <div className="col-span-2">
                        <span className="text-muted-foreground">Import Date</span>
                        <p className="font-medium">
                            {/* เอาแค่ตัวเดียวพอ (ไม่ต้อง map ซ้ำ) */}
                            {data?.import_details?.[0]?.createdAt
                                ? formatDate(data.import_details[0].createdAt as string)
                                : "-"}
                        </p>
                    </div>
                </div>

                {/* 🔹 TABLE */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Cost</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data?.import_details?.length ? (
                                data.import_details.map((d) => (
                                    <TableRow key={d.import_detail_id}>
                                        <TableCell className="font-medium">
                                            {d.product?.product_name}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            {d.quantity}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {d.cost_price}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {d.quantity * d.cost_price}
                                        </TableCell>
                                    </TableRow>

                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold text-lg">
                                    Total:
                                </TableCell>

                                <TableCell className="text-right font-bold text-lg">
                                    {data?.import_details?.reduce(
                                        (sum, item) => sum + item.quantity * item.cost_price,
                                        0
                                    )} KIP
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}