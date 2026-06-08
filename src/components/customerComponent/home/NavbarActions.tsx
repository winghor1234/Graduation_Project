"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '@/components/ui/dropdown-menu';
import { useGetCustomers } from '@/app/features/hooks/Customer';

export default function NavbarActions() {
    const { cart } = useGetCustomers();
    const router = useRouter(); // เปลี่ยนมาใช้ตัวนำทางหน้าของ Next.js

    // คำนวณจำนวนชิ้นสินค้าทั้งหมดในตะกร้าลูกค้า
    const cartItemCount = cart?.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex items-center gap-4">
            {/* ปุ่มตะกร้าสินค้า */}
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push('/cart')}
            >
                <ShoppingCart className="size-5" />
                {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                        {cartItemCount}
                    </Badge>
                )}
            </Button>

            {/* เมนู Dropdown โปรไฟล์ลูกค้า */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <User className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/my-orders')}>
                        My Orders
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ปุ่มเมนูสำหรับหน้าจอมือถือ */}
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
            </Button>
        </div>
    );
}