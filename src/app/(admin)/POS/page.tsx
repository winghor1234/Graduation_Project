
// "use client"

// import { useEffect, useState } from "react"
// import { toast } from "sonner"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Separator } from "@/components/ui/separator"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Trash2, Plus, Minus, CreditCard } from "lucide-react"
// import { useCreateSale, useGetProducts } from "@/app/features/hooks"
// import { Product } from "@/modules/product/product.types"
// import { formatCurrency } from "@/utils/FormatCurrency"

// /* ---------------- TYPES ---------------- */

// type CartItem = {
//   product_id: string
//   name: string
//   price: number
//   quantity: number
//   image?: string
// }

// /* ---------------- PAGE ---------------- */

// export default function POSPage() {
//   const { data: products = [], isLoading } = useGetProducts()
//   const product = products?.data || []
//   const createSale = useCreateSale()

//   const [search, setSearch] = useState("")
//   const [receiptOpen, setReceiptOpen] = useState(false)

//   /* ---------------- LOCAL STORAGE ---------------- */
// const [cart, setCart] = useState<CartItem[]>(() => {
//   if (typeof window === "undefined") return []
//   const saved = localStorage.getItem("pos_cart")
//   return saved ? JSON.parse(saved) : []
// })

//   useEffect(() => {
//     localStorage.setItem("pos_cart", JSON.stringify(cart))
//   }, [cart])

//   /* ---------------- FILTER ---------------- */

//   const filtered = product.filter((p: Product) =>
//     p.product_name.toLowerCase().includes(search.toLowerCase())
//   )

//   /* ---------------- CART ---------------- */

//   const addToCart = (p: Product) => {
//     setCart(prev => {
//       const exist = prev.find(i => i.product_id === p.product_id)
//       if (exist) {
//         return prev.map(i =>
//           i.product_id === p.product_id
//             ? { ...i, quantity: i.quantity + 1 }
//             : i
//         )
//       }
//       return [
//         ...prev,
//         {
//           product_id: p.product_id,
//           name: p.product_name,
//           price: p.sale_price,
//           quantity: 1,
//           image: p.images?.[0]?.image_url || ""
//         }
//       ]
//     })
//   }

//   const updateQty = (id: string, d: number) => {
//     setCart(prev =>
//       prev
//         .map(i =>
//           i.product_id === id
//             ? { ...i, quantity: i.quantity + d }
//             : i
//         )
//         .filter(i => i.quantity > 0)
//     )
//   }

//   const removeItem = (id: string) => {
//     setCart(prev => prev.filter(i => i.product_id !== id))
//   }

//   /* ---------------- TOTAL ---------------- */

//   const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
//   const tax = subtotal * 0.08
//   const total = subtotal + tax

//   /* ---------------- CHECKOUT ---------------- */

//   const checkout = async () => {
//     if (!cart.length) return

//     try {
//       await createSale.mutateAsync({
//         sale_details: cart.map(i => ({
//           product_id: i.product_id,
//           quantity: i.quantity,
//           price: i.price
//         }))
//       })

//       toast.success("Payment successful")
//       setReceiptOpen(true)

//       setCart([])
//       localStorage.removeItem("pos_cart")

//     } catch {
//       toast.error("Payment failed")
//     }
//   }

//   if (isLoading) return <div className="p-6">Loading...</div>

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-12 h-screen bg-gray-100">

//       {/* LEFT - PRODUCTS */}
//       <div className="md:col-span-8 flex flex-col">

//         {/* HEADER */}
//         <div className="p-4 bg-white border-b">
//           <h1 className="text-xl font-semibold">POS System</h1>

//           <Input
//             placeholder="Search product..."
//             className="mt-2"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>

//         {/* PRODUCT GRID */}
//         <ScrollArea className="p-4">
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

//             {filtered.map((p: Product) => (
//               <Card
//                 key={p.product_id}
//                 className="p-2 cursor-pointer hover:shadow-md transition"
//                 onClick={() => addToCart(p)}
//               >
//                 <Image
//                   src={p.images?.[0]?.image_url || ""}
//                   alt={p.product_name}
//                   width={200}
//                   height={200}
//                   className="h-24 w-full object-cover rounded-md"
//                 />

//                 <div className="mt-2">
//                   <p className="text-sm truncate">{p.product_name}</p>
//                   <p className="text-blue-500 font-medium">
//                     {formatCurrency(p.sale_price)}
//                   </p>
//                 </div>
//               </Card>
//             ))}

//           </div>
//         </ScrollArea>
//       </div>

//       {/* RIGHT - CART */}
//       <div className="md:col-span-4 bg-white border-l flex flex-col">

//         {/* HEADER */}
//         <div className="p-4 border-b">
//           <h2 className="font-semibold">Cart ({cart.length})</h2>
//         </div>

//         {/* CART ITEMS */}
//         <ScrollArea className="flex-1 p-3">
//           {cart.map(i => (
//             <div
//               key={i.product_id}
//               className="flex items-center justify-between gap-2 py-2 border-b"
//             >

//               {/* LEFT */}
//               <div className="flex items-center gap-2 min-w-0">
//                 <Image
//                   src={i.image || ""}
//                   alt={i.name}
//                   width={40}
//                   height={40}
//                   className="rounded-md object-cover"
//                 />

//                 <div className="flex flex-col min-w-0">
//                   <span className="text-sm truncate">{i.name}</span>
//                   <span className="text-xs text-gray-500">
//                     {formatCurrency(i.price)}
//                   </span>
//                 </div>
//               </div>

//               {/* RIGHT */}
//               <div className="flex items-center gap-1">

//                 <Button size="icon" variant="ghost" onClick={() => updateQty(i.product_id, -1)}>
//                   <Minus className="w-4 h-4" />
//                 </Button>

//                 <span className="w-6 text-center text-sm">
//                   {i.quantity}
//                 </span>

//                 <Button size="icon" variant="ghost" onClick={() => updateQty(i.product_id, 1)}>
//                   <Plus className="w-4 h-4" />
//                 </Button>

//                 <Button size="icon" variant="ghost" onClick={() => removeItem(i.product_id)}>
//                   <Trash2 className="w-4 h-4 text-red-500" />
//                 </Button>

//               </div>
//             </div>
//           ))}
//         </ScrollArea>

//         <Separator />

//         {/* SUMMARY */}
//         <div className="p-4 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>{formatCurrency(subtotal)}</span>
//           </div>

//           <div className="flex justify-between">
//             <span>Tax</span>
//             <span>{formatCurrency(tax)}</span>
//           </div>

//           <div className="flex justify-between text-lg font-semibold">
//             <span>Total</span>
//             <span>{formatCurrency(total)}</span>
//           </div>

//           <Button className="w-full mt-2" onClick={checkout}>
//             <CreditCard className="w-4 h-4 mr-2" />
//             Checkout
//           </Button>
//         </div>
//       </div>

//       {/* RECEIPT */}
//       <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Receipt</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-2 text-sm">
//             {cart.map(i => (
//               <div key={i.product_id} className="flex justify-between">
//                 <span>{i.name} x{i.quantity}</span>
//                 <span>{formatCurrency(i.price * i.quantity)}</span>
//               </div>
//             ))}
//           </div>

//           <Separator />

//           <p className="font-bold text-right">
//             Total: {formatCurrency(total)}
//           </p>
//         </DialogContent>
//       </Dialog>

//     </div>
//   )
// }


// "use client"


// import { useGetProducts, useCreateSale } from "@/app/features/hooks"
// import CartPanel from "@/components/sale/CartPanel"
// import ProductGrid from "@/components/sale/ProductGrid"
// import { useCart } from "@/components/sale/useCart"
// import { Product } from "@/modules/product/product.types"

// export default function POSPage() {
//   const { data: products = [] } = useGetProducts()
//   const product = products?.data || []
//   const createSale = useCreateSale()

//   const { cart, add, update, remove, total, clear } = useCart()

//   const checkout = async () => {
//     if (!cart.length) return

//     await createSale.mutateAsync({
//       sale_details: cart.map(i => ({
//         product_id: i.product_id,
//         quantity: i.quantity,
//         price: i.price
//       }))
//     })

//     clear()
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-12 h-screen">

//       <div className="md:col-span-8 p-4">
//         <ProductGrid
//           products={product}
//           onAdd={(p: Product) =>
//             add({
//               product_id: p.product_id,
//               name: p.product_name,
//               price: p.sale_price,
//               quantity: 1,
//               image: p.images?.[0]?.image_url
//             })
//           }
//         />
//       </div>

//       <div className="md:col-span-4 border-l">
//         <CartPanel
//           cart={cart}
//           update={update}
//           remove={remove}
//           total={total}
//           checkout={checkout}
//         />
//       </div>

//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { useGetProducts, useCreateSale, useGetCustomers } from "@/app/features/hooks"
import ProductGrid from "@/components/POS/ProductGrid"
import CustomerSelect from "@/components/POS/CustomerSelect"
import CartPanel from "@/components/POS/CartPanel"
import ConfirmModal from "@/components/POS/ConfirmModal"
import ReceiptModal from "@/components/POS/ReceiptModal"
import { useCart } from "@/components/POS/useCart"
import { Customer } from "@/modules/customer/customer.type"
import { Product } from "@/modules/product/product.types"

export default function POSPage() {
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

    setReceipt({
      items: cart,
      total,
      customer: selectedCustomer?.customer_name || "Walk-in",
      date: new Date().toLocaleString()
    })

    clear()
    setShowConfirm(false)
  }

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

      {receipt && (
        <ReceiptModal
          data={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  )
}