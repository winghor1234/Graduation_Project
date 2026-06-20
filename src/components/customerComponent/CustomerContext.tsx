// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// // ----------------------------------------------------------------------
// // 1. TypeScript Interfaces
// // ----------------------------------------------------------------------
// export interface CartItem {
//   productId: string;
//   quantity: number;
// }

// export interface Order {
//   id: string;
//   items: CartItem[];
//   status: 'pending' | 'completed' | 'cancelled';
//   createdAt: string;
// }

// interface CustomerContextType {
//   cart: CartItem[];
//   addToCart: (productId: string, quantity?: number) => void;
//   removeFromCart: (productId: string) => void;
//   updateCartQuantity: (productId: string, quantity: number) => void;
//   clearCart: () => void;
//   orders: Order[];
//   placeOrder: (order: Order) => void;
// }

// // ----------------------------------------------------------------------
// // 2. Create Context
// // ----------------------------------------------------------------------
// const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// // ----------------------------------------------------------------------
// // 3. Provider Component
// // ----------------------------------------------------------------------
// export function CustomerProvider({ children }: { children: ReactNode }) {
//   // ⚡ Lazy Initialization: ดึงค่าจาก localStorage มาตั้งเป็น Initial State ทันที (Client-side Only)
//   const [cart, setCart] = useState<CartItem[]>(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("customer_cart");
//       return saved ? JSON.parse(saved) : [];
//     }
//     return [];
//   });

//   const [orders, setOrders] = useState<Order[]>(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("customer_orders");
//       return saved ? JSON.parse(saved) : [];
//     }
//     return [];
//   });

//   // 🔄 Synchronize: บันทึกข้อมูลลง localStorage เมื่อ State มีการเปลี่ยนแปลง
//   useEffect(() => {
//     localStorage.setItem('customer_cart', JSON.stringify(cart));
//     localStorage.setItem('customer_orders', JSON.stringify(orders));
//   }, [cart, orders]);

//   // ----------------------------------------------------------------------
//   // 4. Cart & Order Logic Functions
//   // ----------------------------------------------------------------------
//   const addToCart = (productId: string, quantity: number = 1) => {
//     setCart((prev) => {
//       const existing = prev.find((item) => item.productId === productId);
//       return existing
//         ? prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
//         : [...prev, { productId, quantity }];
//     });
//   };

//   const removeFromCart = (productId: string) => {
//     setCart((prev) => prev.filter((item) => item.productId !== productId));
//   };

//   const updateCartQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) return removeFromCart(productId);
//     setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity } : item));
//   };

//   const clearCart = () => setCart([]);

//   const placeOrder = (order: Order) => {
//     setOrders((prev) => [order, ...prev]);
//     clearCart();
//   };

//   return (
//     <CustomerContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, orders, placeOrder }}>
//       {children}
//     </CustomerContext.Provider>
//   );
// }

// // ----------------------------------------------------------------------
// // 5. Custom Hook
// // ----------------------------------------------------------------------
// export function useCustomer() {
//   const context = useContext(CustomerContext);
//   if (!context) throw new Error('useCustomer must be used within a CustomerProvider');
//   return context;
// }


"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

// ─── Types ─────────────────────────────────────────────────

export interface CartItem {
  product_id: string
  variant_id: string   // ✅ ຕ້ອງມີ — Schema ຮຽກຮ້ອງ
  product_name: string
  image_url?: string
  color: string
  size: string
  sale_price: number
  stock_qty: number   // ✅ ສຳລັບກວດ limit
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  status: "pending" | "completed" | "cancelled"
  createdAt: string
}

interface CustomerContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (variant_id: string) => void   // ✅ key = variant_id
  updateCartQuantity: (variant_id: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  orders: Order[]
  placeOrder: (order: Order) => void
}

// ─── Context ───────────────────────────────────────────────

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

const CART_KEY = "customer_cart"
const ORDERS_KEY = "customer_orders"

export function CustomerProvider({ children }: { children: ReactNode }) {

  // ✅ lazy init — ບໍ່ hydration mismatch
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [hydrated, setHydrated] = useState(false)

  // ✅ load ຫຼັງ mount ເທົ່ານັ້ນ — ປ້ອງກັນ SSR/CSR mismatch
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY)
      const savedOrders = localStorage.getItem(ORDERS_KEY)
      if (savedCart) setCart(JSON.parse(savedCart))
      if (savedOrders) setOrders(JSON.parse(savedOrders))
    } catch (e) {
      console.error("Failed to load cart from storage", e)
    } finally {
      setHydrated(true)
    }
  }, [])

  // ✅ ບັນທຶກສະເພາະຫຼັງ hydrated ແລ້ວ
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders, hydrated])

  // ─── Cart actions ──────────────────────────────────────

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart(prev => {
      // ✅ key = variant_id — variant ດຽວກັນລວມ, variant ຕ່າງກັນແຍກ row
      const existing = prev.find(i => i.variant_id === item.variant_id)

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, item.stock_qty)
        return prev.map(i =>
          i.variant_id === item.variant_id ? { ...i, quantity: newQty } : i
        )
      }

      return [...prev, { ...item, quantity: Math.min(quantity, item.stock_qty) }]
    })
  }

  const removeFromCart = (variant_id: string) => {
    setCart(prev => prev.filter(i => i.variant_id !== variant_id))
  }

  const updateCartQuantity = (variant_id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(variant_id)
    setCart(prev => prev.map(i =>
      i.variant_id === variant_id
        ? { ...i, quantity: Math.min(quantity, i.stock_qty) }
        : i
    ))
  }

  const clearCart = () => setCart([])

  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev])
    clearCart()
  }

  // ─── Derived values ────────────────────────────────────

  const cartTotal = cart.reduce((sum, i) => sum + i.sale_price * i.quantity, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CustomerContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
        cartTotal, cartCount, orders, placeOrder,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────

export function useCustomer() {
  const context = useContext(CustomerContext)
  if (!context) throw new Error("useCustomer must be used within a CustomerProvider")
  return context
}