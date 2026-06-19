"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateSale } from "@/app/features/hooks/Sale"
import { useGetAllProducts } from "@/app/features/hooks/Product"
import { useGetCustomers }   from "@/app/features/hooks/Customer"
import { useDataTable }      from "@/hooks/useDataTable"
import { useCart }           from "@/components/adminComponent/POS/useCart"
import { Customer }          from "@/modules/customer/customer.type"

import ProductGrid    from "@/components/adminComponent/POS/ProductGrid"
import CartPanel      from "@/components/adminComponent/POS/CartPanel"
import ConfirmModal   from "@/components/adminComponent/POS/ConfirmModal"
import { CustomerSelect } from "@/components/adminComponent/POS/CustomerSelect"

export default function POSPage() {

    const table  = useDataTable()
    const router = useRouter()

    const { data: products = [] }         = useGetAllProducts()
    const { data: customersData }         = useGetCustomers(table.params)
    const customers                       = customersData?.data ?? []

    const createSale = useCreateSale()
    const { cart, add, update, remove, total, clear } = useCart()

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [showConfirm, setShowConfirm]           = useState(false)

    const checkout = async () => {
        if (!cart.length) return
        try {
            const res = await createSale.mutateAsync({
                customer_id:  selectedCustomer?.customer_id,
                sale_details: cart.map(i => ({
                    product_id: i.product_id,
                    variant_id: i.variant_id, // ✅ ຕ້ອງມີ
                    quantity:   i.quantity,
                    price:      i.sale_price,
                }))
            })

            clear()
            setShowConfirm(false)
            router.push(`/POS/receipt/${res.sale_id}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden">
            <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_380px]">

                {/* LEFT: Products */}
                <div className="overflow-y-auto p-4">
                    <ProductGrid
                        products={products}
                        onAdd={add}
                    />
                </div>

                {/* RIGHT: Cart */}
                <div className="border-t lg:border-t-0 lg:border-l bg-white flex flex-col h-full">

                    {/* Customer select */}
                    <div className="p-3 border-b shrink-0">
                        <CustomerSelect
                            customers={customers}
                            selected={selectedCustomer}
                            onSelect={setSelectedCustomer}
                        />
                    </div>

                    <div className="flex-1 min-h-0 overflow-hidden">
                        <CartPanel
                            cart={cart}
                            update={update}
                            remove={remove}
                            subtotal={total}
                            tax={0}
                            total={total}
                            onCheckout={() => setShowConfirm(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Confirm modal */}
            {showConfirm && (
                <ConfirmModal
                    cart={cart}
                    total={total}
                    loading={createSale.isPending}
                    onConfirm={checkout}
                    onClose={() => setShowConfirm(false)}
                />
            )}
        </div>
    )
}