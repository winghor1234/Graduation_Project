import React, { ReactNode } from 'react';
import Link from 'next/link';
import NavbarActions from '@/components/customerComponent/home/NavbarActions';

// 1. Import ຕົວ CustomerProvider ຈາກ Path ຂອງທ່ານເຂົ້າມາ
import { CustomerProvider } from '@/components/customerComponent/CustomerContext';

export const metadata = {
  title: 'SPORTPRO',
  description: 'ເຄື່ອງກີລາ ແລະ ເກີບຊັ້ນສູງ ສຳລັບນັກກີລາ.',
};

// ປ່ຽນຊື່ຈາກ RootLayout ເປັນ CustomerLayout ໃຫ້ຖືກຕ້ອງຕາມຕຳແໜ່ງໂຟນເດີຍ່ອຍ
export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    // ✅ ໃຊ້ CustomerProvider ແລະ <div> ຄອບໂຄງສ້າງຫຼັກແທນແທັກ html/body
    <CustomerProvider>
      <div className="min-h-screen flex flex-col bg-white">

        {/* ແຖບນຳທາງດ້ານເທິງ */}
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              SPORTPRO
            </Link>

            {/* ເມນູຕອນກາງ (ສະແດງສະເພາະແທັບເລັດ/ຄອມພິວເຕີ) */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/home" className="text-sm font-medium hover:underline">
                ໜ້າຫຼັກ
              </Link>
              <Link href="/shop" className="text-sm font-medium hover:underline">
                ຮ້ານຄ້າ
              </Link>
              <Link href="/order-history" className="text-sm font-medium hover:underline">
                ປະຫວັດການສັ່ງຊື້
              </Link>
            </nav>

            {/* ສ່ວນຂວາ: ປຸ່ມກະຕ່າ ແລະ ເມນູຜູ້ໃຊ້ */}
            <NavbarActions />
          </div>
        </header>

        {/* ເນື້ອຫາຫຼັກ: ໜ້າ HomePage ແລະ ໜ້າອື່ນໆ ຈະສະແດງຕອນນີ້ */}
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
                  ເຄື່ອງກີລາ ແລະ ເກີບຊັ້ນສູງ ສຳລັບນັກກີລາ.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">ຮ້ານຄ້າ</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/products?category=shoes">ເກີບ</Link></li>
                  <li><Link href="/products?category=clothing">ເຄື່ອງນຸ່ງ</Link></li>
                  <li><Link href="/products?category=accessories">ອຸປະກອນເສີມ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">ການຊ່ວຍເຫຼືອ</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="cursor-pointer hover:underline">ຕິດຕໍ່ພວກເຮົາ</li>
                  <li className="cursor-pointer hover:underline">ຂໍ້ມູນການຈັດສົ່ງ</li>
                  <li className="cursor-pointer hover:underline">ການສົ່ງຄືນສິນຄ້າ</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">ກ່ຽວກັບບໍລິສັດ</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="cursor-pointer hover:underline">ກ່ຽວກັບພວກເຮົາ</li>
                  <li className="cursor-pointer hover:underline">ຮ່ວມງານກັບເຮົາ</li>
                  <li className="cursor-pointer hover:underline">ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              © 2026 SportPro. ສະຫງວນລິຂະສິດທຸກຢ່າງ.
            </div>
          </div>
        </footer>

      </div>
    </CustomerProvider>
  );
}