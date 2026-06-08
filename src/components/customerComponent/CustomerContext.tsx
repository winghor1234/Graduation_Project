"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ----------------------------------------------------------------------
// 1. กำหนดโครงสร้างข้อมูล (TypeScript Interfaces)
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

// กำหนดว่าหน้าเพจอื่นๆ สามารถดึงค่าหรือฟังก์ชันอะไรไปใช้ได้บ้าง
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
// 2. สร้าง Context เริ่มต้น
// ----------------------------------------------------------------------
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// ----------------------------------------------------------------------
// 3. ตัวโอบอุ้มระบบ (Provider Component)
// ----------------------------------------------------------------------
export function CustomerProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isInitialized, setIsInitialized] = useState(false); // ตัวเช็คการโหลดข้อมูลรอบแรก

  // ดึงข้อมูลเก่าจาก localStorage หลังจากเปิดหน้าเว็บบน Browser แล้ว (กัน SSR Error)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('customer_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedOrders = localStorage.getItem('customer_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      
      setIsInitialized(true); // เปลี่ยนสถานะว่าพร้อมใช้งานแล้ว
    }
  }, []);

  // บันทึกข้อมูลลง localStorage อัตโนมัติเมื่อข้อมูลในตะกร้าเปลี่ยน
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('customer_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // บันทึกข้อมูลลง localStorage อัตโนมัติเมื่อประวัติสั่งซื้อเปลี่ยน
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('customer_orders', JSON.stringify(orders));
    }
  }, [orders, isInitialized]);

  // ----------------------------------------------------------------------
  // 4. ฟังก์ชันจัดการระบบตะกร้าและออเดอร์ (Logic Functions)
  // ----------------------------------------------------------------------

  // ฟังก์ชัน: เพิ่มสินค้าลงตะกร้า
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart((prev) => {
      // เช็คว่าเคยมีสินค้านี้ในตะกร้าหรือยัง
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        // ถ้ามีแล้ว ให้บวกจำนวนเพิ่มเข้าไป
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // ถ้ายังไม่มี ให้เพิ่มสินค้าชิ้นใหม่เข้าไปในอาเรย์
      return [...prev, { productId, quantity }];
    });
  };

  // ฟังก์ชัน: ลบสินค้าออกจากตะกร้า
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // ฟังก์ชัน: อัปเดตจำนวนสินค้าในตะกร้า (เช่น กดปุ่ม + หรือ -)
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId); // ถ้าปรับจนเหลือ 0 ให้ลบสินค้าทิ้งทันที
      return;
    }
    setCart((prev) =>
      prev.map((item) => item.productId === productId ? { ...item, quantity } : item)
    );
  };

  // ฟังก์ชัน: ล้างตระกร้าสินค้าทั้งหมด
  const clearCart = () => setCart([]);

  // ฟังก์ชัน: กดส่งใบสั่งซื้อ (Checkout)
  const placeOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]); // เอาออเดอร์ใหม่ไปต่อข้างหน้าออเดอร์เก่า
    clearCart(); // สั่งซื้อเสร็จล้างตะกร้าทันทีให้พร้อมสำหรับการช้อปครั้งต่อไป
  };

  return (
    <CustomerContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateCartQuantity, 
        clearCart, 
        orders, 
        placeOrder 
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

// ----------------------------------------------------------------------
// 5. Custom Hook สำหรับนำไป Import ใช้ในหน้าอื่นๆ
// ----------------------------------------------------------------------
export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}