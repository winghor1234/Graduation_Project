// 'use client'
// import { useEffect, useState } from "react"
// import { CartItemType } from "./type"

// export const useCart = () => {
//     const [cart, setCart] = useState<CartItemType[]>(() => {
//         if (typeof window === "undefined") return []

//         try {
//             const saved = localStorage.getItem("pos_cart")
//             return saved ? JSON.parse(saved) as CartItemType[] : []
//         } catch {
//             return []
//         }
//     })

//     useEffect(() => {
//         localStorage.setItem("pos_cart", JSON.stringify(cart))
//     }, [cart])

//     // ✅ ADD
//     const add = (product: CartItemType) => {
//         setCart(prev => {
//             const exist = prev.find(i => i.product_id === product.product_id)

//             // ✅ ถ้ามีแล้ว → ไม่ทำอะไร
//             if (exist) {
//                 return prev
//             }

//             // ✅ ถ้ายังไม่มี → เพิ่มเข้า cart
//             return [
//                 ...prev,
//                 {
//                     ...product,
//                     quantity: 1
//                 }
//             ]
//         })
//     }

//     // ✅ UPDATE QTY
//     const update = (id: string, delta: number) => {
//         setCart(prev =>
//             prev.map(i => {
//                 if (i.product_id === id) {
//                     const newQty = i.quantity + delta

//                     return {
//                         ...i,
//                         quantity: newQty < 1 ? 1 : newQty   // ✅ กันต่ำกว่า 1
//                     }
//                 }
//                 return i
//             })
//         )
//     }

//     // ✅ REMOVE
//     const remove = (id: string) => {
//         setCart(prev => prev.filter(i => i.product_id !== id))
//     }

//     // ✅ CLEAR
//     const clear = () => {
//         setCart([])
//         localStorage.removeItem("pos_cart")
//     }

//     // ✅ CALCULATION
// const subtotal = cart.reduce((s, i) => {
//     const price = Number(i.sale_price) || 0
//     const qty = Number(i.quantity) || 0

//     return s + price * qty
// }, 0)

//     const tax = subtotal * 0.08
//     const total = subtotal 

//     return {
//         cart,
//         add,
//         update,
//         remove,
//         clear,
//         subtotal,
//         tax,
//         total
//     }
// }



import { useState, useCallback } from "react"
import { CartItemType } from "./type"

export function useCart() {
    const [cart, setCart] = useState<CartItemType[]>([])

    // ✅ key = variant_id (ບໍ່ແມ່ນ product_id)
    const add = useCallback((item: CartItemType) => {
        setCart(prev => {
            const existing = prev.find(i => i.variant_id === item.variant_id)
            if (existing) {
                // ✅ ກວດ stock ກ່ອນເພີ່ມ
                if (existing.quantity >= existing.stock_qty) return prev
                return prev.map(i =>
                    i.variant_id === item.variant_id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }, [])

    const update = useCallback((variant_id: string, delta: number) => {
        setCart(prev => prev
            .map(i => i.variant_id === variant_id
                ? { ...i, quantity: Math.min(i.quantity + delta, i.stock_qty) }
                : i
            )
            .filter(i => i.quantity > 0)
        )
    }, [])

    const remove = useCallback((variant_id: string) => {
        setCart(prev => prev.filter(i => i.variant_id !== variant_id))
    }, [])

    const clear = useCallback(() => setCart([]), [])

    const subtotal = cart.reduce((sum, i) => sum + i.sale_price * i.quantity, 0)
    const tax      = Math.round(subtotal * 0.08)
    const total    = subtotal

    return { cart, add, update, remove, subtotal, tax, total, clear }
}