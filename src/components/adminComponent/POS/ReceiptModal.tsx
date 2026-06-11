'use client'
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { CartItemType } from "./type"


type Props = {
    data: {
        customer: string
        date: string
        items: CartItemType[]
        total: number
    }
    onClose: () => void
}


export default function ReceiptModal({ data, onClose }: Props) {
    const exportPDF = async () => {
        const element = document.getElementById("receipt")
        if (!element) return

        const canvas = await html2canvas(element)
        const img = canvas.toDataURL("image/png")

        const pdf = new jsPDF()
        pdf.addImage(img, "PNG", 0, 0)
        pdf.save("receipt.pdf")
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

            <div className="bg-white p-5 rounded-xl w-[350px]">

                <div id="receipt" className="space-y-2 text-sm">

                    <h2 className="text-center font-bold">ໃບບິນຮັບເງິນ (Receipt)</h2>

                    <p>ລູກຄ້າ: {data.customer}</p>
                    <p>ວັນທີ: {data.date}</p>

                    <hr />

                    {data.items.map((i) => (
                        <div key={i.product_id} className="flex justify-between">
                            <span>{i.product_name} x {i.quantity}</span>
                            <span>{i.sale_price * i.quantity}</span>
                        </div>
                    ))}

                    <hr />

                    <div className="flex justify-between font-bold">
                        <span>ລວມທັງໝົດ (Total)</span>
                        <span>{data.total}</span>
                    </div>

                </div>

                <div className="flex gap-2 mt-4">
                    <button onClick={onClose} className="flex-1 border py-2 rounded hover:bg-gray-50">
                        ປິດ
                    </button>
                    <button onClick={exportPDF} className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
                        ສົ່ງອອກເປັນ PDF
                    </button>
                </div>

            </div>
        </div>
    )
}