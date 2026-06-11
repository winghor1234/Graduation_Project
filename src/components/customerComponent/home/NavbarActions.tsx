"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
// import { useGetCustomers } from '@/app/features/hooks/Customer';
import { useCustomer } from '../CustomerContext';
import { useCustomerLogout } from '@/app/features/hooks/Auth';

export default function NavbarActions() {
    const { cart } = useCustomer();
    const router = useRouter(); // ຕົວນຳທາງໜ້າ (Router) ຂອງ Next.js
    const { mutate: logout } = useCustomerLogout()

    // ຄຳນວນຈຳນວນຊິ້ນສິນຄ້າທັງໝົດໃນກະຕ່າຂອງລູກຄ້າ
    const cartItemCount = cart?.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex items-center gap-4">
            {/* ປຸ່ມກະຕ່າສິນຄ້າ */}
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

            {/* ເມນູ Dropdown ໂປຣໄຟລ໌ລູກຄ້າ */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <User className="size-5" />
                    </Button>
                </DropdownMenuTrigger>
                
                {/* ແກ້ໄຂ Bug: ລວມ DropdownMenuItem ໃຫ້ຢູ່ພາຍໃຕ້ Content ດຽວກັນ */}
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push('/order-history')}>
                        ປະຫວັດການສັ່ງຊື້ (My Orders)
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                        onClick={() => {
                            if (confirm('ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ຫຼືບໍ່?')) logout()
                        }}
                    >
                        ອອກຈາກລະບົບ (Logout)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ປຸ່ມເມນູສຳລັບໜ້າຈໍມືຖື */}
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
            </Button>
        </div>
    );
}