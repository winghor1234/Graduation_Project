

"use client"

import { useState } from "react"
import { useCreateSale } from "@/app/features/hooks/Sale"
import ProductGrid from "@/components/adminComponent/POS/ProductGrid"
import ConfirmModal from "@/components/adminComponent/POS/ConfirmModal"
import { useCart } from "@/components/adminComponent/POS/useCart"
import { Customer } from "@/modules/customer/customer.type"
import { useRouter } from "next/navigation"
import { useGetAllProducts } from "@/app/features/hooks/Product"
import { useGetCustomers } from "@/app/features/hooks/Customer"
import CartPanel from "@/components/adminComponent/POS/CartPanel"
import { useDataTable } from "@/hooks/useDataTable"
import { CartItemType } from "@/components/adminComponent/POS/type"
import { CustomerSelect } from "@/components/adminComponent/POS/CustomerSelect"


export default function POSPage() {
  const table = useDataTable()
  const router = useRouter()
  const { data: products } = useGetAllProducts()
  const { data: customers = [] } = useGetCustomers(table.params)
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

    setReceipt({
      items: cart,
      total,
      customer: selectedCustomer?.customer_name || "Walk-in",
      date: new Date().toLocaleString()
    })

    clear()
    setShowConfirm(false)
    router.push(`/POS/receipt/${res.sale_id}`)

  }
  console.log("product : ", products)

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">

      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_380px]">

        {/* PRODUCTS */}
        <div className="overflow-y-auto p-4">
          <ProductGrid
            products={products?.map(product => ({ ...product, quantity: 0 })) as CartItemType[] || []}
            onAdd={add}
          />
        </div>

        {/* CART */}
        <div
          className=" border-t lg:border-t-0 lg:border-l bg-white flex flex-col h-full "
        >
          <div className="p-3 border-b shrink-0">
            {/* <Input
              placeholder="ຄົ້ນຫາປະເພດສິນຄ້າ..."
              value={table.search}
              onChange={(e) => table.setSearch(e.target.value)}
              className="w-60"
            /> */}
            <CustomerSelect
              customers={customer}
              selected={selectedCustomer as Customer | null}
              onSelect={(customer: Customer | null) => setSelectedCustomer(customer as Customer | undefined)}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
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
        </div>

      </div>

      {showConfirm && (
        <ConfirmModal
          cart={cart}
          total={total}
          onConfirm={checkout}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}