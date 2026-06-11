'use client'

import { useParams } from "next/navigation"
import { useGetSale } from "@/app/features/hooks/Sale";
import { formatDate } from "@/utils/FormatDate";
import { formatCurrency } from "@/utils/FormatCurrency";
import { BackButton } from "@/utils/BackButton";

export default function ReceiptPage() {
    const { id } = useParams()
    const { data } = useGetSale(id as string)

    if (!data) return <p className="text-center mt-10">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
    // console.log("data : ", data)

    return (
        <div className="flex justify-center bg-gray-100 min-h-screen p-4">
            <BackButton />
            <div id="receipt" className="bg-white w-[300px] p-3 text-xs font-mono">

                {/* HEADER */}
                <div className="text-center">
                    <p className="font-bold text-sm">ຮ້ານຂອງຂ້ອຍ (MY STORE)</p>
                    <p>ໂທ: 020 XXXXXXXX</p>
                    <p>ນະຄອນຫຼວງວຽງຈັນ, ລາວ</p>
                </div>
                <hr className="my-2 border-dashed" />
                
                {/* INFO */}
                <div>
                    <p>ວັນທີ: {formatDate(data?.sale_date)}</p>
                    <p>ຊື່ລູກຄ້າ: {data?.customer?.customer_name}</p>
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
                        <span>ລວມທັງໝົດ (TOTAL)</span>
                        <span>{formatCurrency(data.total_amount || 0)}</span>
                    </div>
                </div>

                <hr className="my-2 border-dashed" />

                {/* FOOTER */}
                <div className="text-center">
                    <p>ຂໍຂອບໃຈ!</p>
                    <p>ໂອກາດໜ້າເຊີນໃໝ່</p>
                </div>

                {/* ACTION */}
                <div className="mt-3 space-y-2 no-print">
                    <button
                        onClick={() => window.print()}
                        className="w-full border py-1 rounded"
                    >
                        ພິມໃບບິນ
                    </button>

                    <button
                        onClick={() => window.open(`/api/export/pdf/${id}`)}
                        className="w-full bg-green-500 text-white py-1 rounded"
                    >
                        ສົ່ງອອກເປັນ PDF
                    </button>
                </div>

            </div>
        </div>
    )
}