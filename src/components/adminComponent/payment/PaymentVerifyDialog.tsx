"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Payment } from "@/modules/payment/payment.type"
import { useState } from "react"
import { formatDate } from "@/utils/FormatDate"
import { formatCurrency } from "@/utils/FormatCurrency"
import {  BadgeComponent } from "../StatusComponent"

type Props = {
    open: boolean
    onOpenChange: (v: boolean) => void
    payment?: Payment
    onConfirm: (status: "VERIFIED" | "REJECTED") => void
}

export function PaymentVerifyDialog({
    open,
    onOpenChange,
    payment,
    onConfirm
}: Props) {

    const [selectedStatus, setSelectedStatus] =
        useState<"VERIFIED" | "REJECTED" | null>(null)

    const handleOpenChange = (v: boolean) => {
        if (v) setSelectedStatus(null)
        onOpenChange(v)
    }

    const order = payment?.order
    // console.log("payment : ", payment)

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">

                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        ກວດສອບການຊຳລະເງິນ
                    </DialogTitle>
                </DialogHeader>

                {/* ORDER INFO */}
                <div className="border-b pb-3 space-y-1 text-sm">
                    <p>
                        <span className="text-gray-500">ເລກອໍເດີ້: </span>
                        {order?.order_code ?? "-"}
                    </p>

                    <p>
                        <span className="text-gray-500">ວັນທີ: </span>
                        {order?.order_date
                            ? formatDate(order.order_date)
                            : "-"}
                    </p>

                    <p>
                        <span className="text-gray-500">ລວມຍອດອໍເດີ້: </span>
                        {order?.total_amount
                            ? formatCurrency(order.total_amount)
                            : 0}
                    </p>
                </div>

                {/* CUSTOMER */}
                <div className="border-b py-3 text-sm">
                    <p className="text-gray-500 mb-1">ຂໍ້ມູນລູກຄ້າ</p>
                    <p>
                        {order?.customer?.customer_name ?? "-"}
                    </p>
                </div>

                {/* PRODUCTS */}
                <div className="border-b py-3">
                    <p className="text-gray-500 text-sm mb-2">
                        ລາຍການສິນຄ້າ
                    </p>

                    <div className="space-y-2 text-sm">
                        {order?.order_details?.length ? (
                            order.order_details.map((item) => (
                                <div
                                    key={item.order_detail_id}
                                    className="flex justify-between items-center"
                                >
                                    <span>
                                        {item.product?.product_name} {" "}
                                        <span className="text-gray-500">
                                            {formatCurrency(item.price)} × {item.quantity}
                                        </span>
                                    </span>

                                    <span className="font-medium">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">
                                ບໍ່ມີຂໍ້ມູນສິນຄ້າ
                            </p>
                        )}
                    </div>
                </div>

                {/* PAYMENT INFO */}
                <div className="py-3 space-y-2 text-sm">
                    <p>
                        <span className="text-gray-500">ຈຳນວນເງິນຊຳລະ: </span>
                        {formatCurrency(payment?.amount ?? 0)}
                    </p>

                    <p>
                        <span className="text-gray-500">ສະຖານະ: </span>
                        {/* {payment?.status ?? "-"} */}
                        <BadgeComponent status={payment?.status ?? "-"} />
                    </p>
                </div>

                {/* SLIP */}
                {payment?.slip_url && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-2">
                            ຫຼັກຖານການຊຳລະ
                        </p>

                        <Image
                            src={payment.slip_url}
                            width={400}
                            height={400}
                            alt="slip"
                            className="w-full rounded-lg border"
                        />
                    </div>
                )}

                {/* ACTION */}
                <div className="mt-5 space-y-3">

                    <div className="grid grid-cols-2 gap-2">

                        <button
                            type="button"
                            onClick={() => setSelectedStatus("VERIFIED")}
                            className={`
                                py-2 rounded-md border text-sm font-medium transition
                                ${selectedStatus === "VERIFIED"
                                    ? "bg-green-600 text-white border-green-600"
                                    : "hover:bg-green-50"
                                }
                            `}
                        >
                            ອະນຸມັດ
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedStatus("REJECTED")}
                            className={`
                                py-2 rounded-md border text-sm font-medium transition
                                ${selectedStatus === "REJECTED"
                                    ? "bg-red-600 text-white border-red-600"
                                    : "hover:bg-red-50"
                                }
                            `}
                        >
                            ປະຕິເສດ
                        </button>

                    </div>

                    <Button
                        className="w-full"
                        disabled={!selectedStatus}
                        onClick={() =>
                            selectedStatus && onConfirm(selectedStatus)
                        }
                    >
                        ຢືນຢັນການດຳເນີນການ
                    </Button>

                </div>

            </DialogContent>
        </Dialog>
    )
}