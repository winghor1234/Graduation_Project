'use client'

import { useParams } from "next/navigation"
import { useGetSale } from "@/app/features/hooks";
import { formatDate } from "@/utils/FormatDate";
import { formatCurrency } from "@/utils/FormatCurrency";
import { BackButton } from "@/utils/BackButton";

export default function ReceiptPage() {
    const { id } = useParams()
    const { data } = useGetSale(id as string)

    if (!data) return <p className="text-center mt-10">Loading...</p>
    // console.log("data : ", data)

    return (
        <div className="flex justify-center bg-gray-100 min-h-screen p-4">
            <BackButton />
            <div id="receipt" className="bg-white w-[300px] p-3 text-xs font-mono">

                {/* HEADER */}
                <div className="text-center">
                    <p className="font-bold text-sm">MY STORE</p>
                    <p>Tel: 020 XXXXXXXX</p>
                    <p>Vientiane, Laos</p>
                </div>

                <hr className="my-2 border-dashed" />

                {/* INFO */}
                <div>
                    <p>Date: {formatDate(data?.sale_date)}</p>
                    <p>Customer name: {data?.customer?.customer_name}</p>
                    {/* <p>Receipt:  {id}</p> */}
                </div>

                <hr className="my-2 border-dashed" />

                {/* ITEMS */}
                {data.sale_details?.map((i) => (
                    <div key={i.product_id} className="mb-1">

                        <p>{i?.product?.product_name}</p>

                        <div className="flex justify-between">
                            <span>{i.quantity} x {formatCurrency(i.price)}</span>
                            <span>{i.quantity} * {formatCurrency(i.price)}</span>
                        </div>

                    </div>
                ))}

                <hr className="my-2 border-dashed" />

                {/* TOTAL */}
                <div className="space-y-1">
                    {/* <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{data.total}</span>
                    </div> */}

                    <div className="flex justify-between font-bold text-sm">
                        <span>TOTAL</span>
                        <span>{formatCurrency(data.total_amount || 0)}</span>
                    </div>
                </div>

                <hr className="my-2 border-dashed" />

                {/* FOOTER */}
                <div className="text-center">
                    <p>Thank you!</p>
                    <p>Please come again</p>
                </div>

                {/* ACTION */}
                <div className="mt-3 space-y-2 no-print">
                    <button
                        onClick={() => window.print()}
                        className="w-full border py-1 rounded"
                    >
                        Print
                    </button>

                    <button
                        onClick={() => window.open(`/api/export/pdf/${id}`)}
                        className="w-full bg-green-500 text-white py-1 rounded"
                    >
                        Export PDF
                    </button>
                </div>

            </div>
        </div>
    )
}