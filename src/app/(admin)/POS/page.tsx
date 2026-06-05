

"use client"

import { useState } from "react"
import { useCreateSale } from "@/app/features/hooks/Sale"
import ProductGrid from "@/components/POS/ProductGrid"
import CustomerSelect from "@/components/POS/CustomerSelect"
import CartPanel from "@/components/POS/CartPanel"
import ConfirmModal from "@/components/POS/ConfirmModal"
import ReceiptModal from "@/components/POS/ReceiptModal"
import { useCart } from "@/components/POS/useCart"
import { Customer } from "@/modules/customer/customer.type"
import { useRouter } from "next/navigation"
import { useGetProducts } from "@/app/features/hooks/Product"
import { useGetCustomers } from "@/app/features/hooks/Customer"


export default function POSPage() {
  const router = useRouter()
  const { data: products = [] } = useGetProducts()
  const product = products?.data || []
  const { data: customers = [] } = useGetCustomers()
  const customer = customers?.data || []
  const createSale = useCreateSale()

  const { cart, add, update, remove, subtotal, total, tax, clear } = useCart()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>()
  const [showConfirm, setShowConfirm] = useState(false)
  const [receipt, setReceipt] = useState<any>(null)

  const checkout = async () => {
    if (!cart.length) return

    const res = await createSale.mutateAsync({
      customer_id: selectedCustomer?.customer_id || undefined,
      sale_details: cart.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price: i.sale_price
      }))
    })

    // setReceipt({
    //   items: cart,
    //   total,
    //   customer: selectedCustomer?.customer_name || "Walk-in",
    //   date: new Date().toLocaleString()
    // })

    clear()
    setShowConfirm(false)
    router.push(`/POS/receipt/${res.sale_id}`)

  }
  // console.log("receipt : ",receipt)

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-screen">

      {/* LEFT - PRODUCTS */}
      <div className="md:col-span-8 p-4 overflow-auto">
        <ProductGrid
          products={product || []}
          onAdd={add}
        />
      </div>

      {/* RIGHT - CART */}
      <div className="md:col-span-4 border-l flex flex-col h-screen">

        <div className="p-3 border-b">
          <CustomerSelect
            customers={customer || []}
            selected={selectedCustomer}
            onSelect={setSelectedCustomer || undefined}
          />
        </div>

        <CartPanel
          cart={cart}
          update={update}
          remove={remove}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onCheckout={() => setShowConfirm(true)}
        />
      </div>

      {/* MODALS */}
      {showConfirm && (
        <ConfirmModal
          cart={cart}
          total={total}
          onConfirm={checkout}
          onClose={() => setShowConfirm(false)}
        />
      )}

      {/* {receipt && (
        <ReceiptModal
          data={receipt}
          onClose={() => setReceipt(null)}
        />
      )} */}
    </div>
  )
}