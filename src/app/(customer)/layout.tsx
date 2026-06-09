import React, { ReactNode } from 'react';
import Link from 'next/link';
import NavbarActions from '@/components/customerComponent/home/NavbarActions';

// 1. Import ตัว CustomerProvider จาก Path ของคุณเข้ามา
import { CustomerProvider } from '@/components/customerComponent/CustomerContext';

export const metadata = {
  title: 'SPORTPRO',
  description: 'Premium athletic wear and footwear for champions.',
};

// เปลี่ยนชื่อจาก RootLayout เป็น CustomerLayout ให้ถูกต้องตามตำแหน่งโฟลเดอร์ย่อย
export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    // ✅ ใช้ CustomerProvider และ <div> ครอบโครงสร้างหลักแทนแท็ก html/body
    <CustomerProvider>
      <div className="min-h-screen flex flex-col bg-white">

        {/* Top Navigation */}
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              SPORTPRO
            </Link>

            {/* เมนูตรงกลาง (แสดงเฉพาะแท็บเล็ต/คอมพิวเตอร์) */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:underline">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium hover:underline">
                Shop
              </Link>
              <Link href="/my-orders" className="text-sm font-medium hover:underline">
                Orders
              </Link>
            </nav>

            {/* ส่วนขวา: ปุ่มตะกร้าและเมนูผู้ใช้ */}
            <NavbarActions />
          </div>
        </header>

        {/* Main Content: หน้า HomePage และหน้าอื่นๆ จะแสดงตรงนี้ */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-black text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">SPORTPRO</h3>
                <p className="text-sm text-gray-400">
                  Premium athletic wear and footwear for champions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/products?category=shoes">Shoes</Link></li>
                  <li><Link href="/products?category=clothing">Clothing</Link></li>
                  <li><Link href="/products?category=accessories">Accessories</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="cursor-pointer hover:underline">Contact Us</li>
                  <li className="cursor-pointer hover:underline">Shipping Info</li>
                  <li className="cursor-pointer hover:underline">Returns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="cursor-pointer hover:underline">About Us</li>
                  <li className="cursor-pointer hover:underline">Careers</li>
                  <li className="cursor-pointer hover:underline">Privacy Policy</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              © 2026 SportPro. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </CustomerProvider>
  );
}