"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ----------------------------------------------------------------------
// 1. TypeScript Interfaces
// ----------------------------------------------------------------------
export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface CustomerContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (order: Order) => void;
}

// ----------------------------------------------------------------------
// 2. Create Context
// ----------------------------------------------------------------------
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// ----------------------------------------------------------------------
// 3. Provider Component
// ----------------------------------------------------------------------
export function CustomerProvider({ children }: { children: ReactNode }) {
  // ⚡ Lazy Initialization: ดึงค่าจาก localStorage มาตั้งเป็น Initial State ทันที (Client-side Only)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customer_cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customer_orders");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 🔄 Synchronize: บันทึกข้อมูลลง localStorage เมื่อ State มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('customer_cart', JSON.stringify(cart));
    localStorage.setItem('customer_orders', JSON.stringify(orders));
  }, [cart, orders]);

  // ----------------------------------------------------------------------
  // 4. Cart & Order Logic Functions
  // ----------------------------------------------------------------------
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      return existing
        ? prev.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
  };

  return (
    <CustomerContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, orders, placeOrder }}>
      {children}
    </CustomerContext.Provider>
  );
}

// ----------------------------------------------------------------------
// 5. Custom Hook
// ----------------------------------------------------------------------
export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomer must be used within a CustomerProvider');
  return context;
}