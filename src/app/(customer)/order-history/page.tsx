"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Package, Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';

// Import UI Components & Hooks
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetAllOrders } from '@/app/features/hooks/Order'; // 🌟 ເອີ້ນນຳໃຊ້ Hook ໂຕໃໝ່ຂອງທ່ານ
import { useCreateOrder } from '@/app/features/hooks/Order'; // ໃຊ້ສຳລັບການອັບໂຫລດ/ສົ່ງສະລິບໂອນເງິນໃໝ່
import { Order } from '@/modules/order/order.types';

const statusColors: Record<string, string> = {
    WAITING_PAYMENT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PENDING_VERIFICATION: 'bg-blue-100 text-blue-800 border-blue-300',
    PAID: 'bg-green-100 text-green-800 border-green-300',
    SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
    COMPLETED: 'bg-gray-100 text-gray-800 border-gray-300',
};

const paymentStatusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    VERIFIED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
};

export default function OrderHistoryPage() {
    // ⚡ ເອີ້ນນຳໃຊ້ຂໍ້ມູນອໍເດີ້ທັງໝົດຈາກຖານຂໍ້ມູນລະບົບຫຼັງບ້ານ
    const { data: apiOrders, isLoading } = useGetAllOrders();
    const { mutate: uploadSlip } = useCreateOrder(); // ສຳລັບສົ່ງໄຟລ໌ FormData ສະລິບໃໝ່ຂຶ້ນ Server

    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    console.log("data: ", apiOrders)

    // ສະກັດອາເຣລາຍການອໍເດື່ອອກມາຮອງຮັບໂຄງສ້າງ Object ຢ່າງປອດໄພ
    const orders = React.useMemo(() => {
        if (!apiOrders) return [];
        return (apiOrders?.data || []) as Order[];
    }, [apiOrders]);

    const handleFileUpload = (orderId: string, file: File) => {
        const bodyFormData = new FormData();
        bodyFormData.append("order_id", orderId);
        bodyFormData.append("file", file);

        // ຍິງ API ອັບເດດໄຟລ໌ສະລິບຫຼັກຖານໂອນເງິນຜ່ານລະບົບ React Query
        uploadSlip(bodyFormData, {
            onSuccess: () => {
                setUploadDialogOpen(false);
                toast.success('ອັບໂຫລດຫຼັກຖານການໂอนເງິນຮຽບຮ້ອຍແລ້ວ! 🎉');
            },
            onError: (error) => {
                toast.error(error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫລດຫຼັກຖານ ❌');
            }
        });
    };

    const openUploadDialog = (orderId: string) => {
        setSelectedOrder(orderId);
        setUploadDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center text-md font-medium text-gray-500 animate-pulse">
                ກຳລັງໂຫລດປະຫວັດການສັ່ງຊື້ຂອງທ່ານ... 📦
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Package className="size-20 mx-auto mb-6 text-gray-400" />
                <h1 className="text-3xl font-bold mb-4 text-gray-900">No orders yet</h1>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light">
                    You haven&apos;t placed any orders. Start shopping to see your order history here.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">Order History</h1>

                <div className="space-y-6">
                    {orders.map((order) => {
                        // ແມັບຂໍ້ມູນສິນຄ້າໃນບິນໃຫ້ກົງຕາມໂຄງສ້າງ Prisma (orderDetail)
                        const orderItems = order.orderDetail || [];
                        // ດຶງສະລິບຈາກກ້ອນຂໍ້ມູນ payment ທຳອິດ (ຖ້າມີ)
                        const currentPayment = order.payment?.[0] || order.payment || {};

                        return (
                            <Card key={order.order_id} className="border shadow-sm bg-white overflow-hidden">
                                <CardHeader className="bg-gray-50/50 border-b">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-lg text-gray-900">
                                                Order Code: <span className="font-mono text-blue-600">{order.order_code || `#${order.order_id}`}</span>
                                            </CardTitle>
                                            <p className="text-xs text-gray-400 font-light mt-1">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                            <Badge className={`${statusColors[order.status] || 'bg-gray-100'} border text-xs shadow-none`}>
                                                {order.status ? order.status.replace(/_/g, ' ') : 'UNKNOWN'}
                                            </Badge>
                                            <p className="text-xs text-gray-500">
                                                Payment:{' '}
                                                <Badge variant="secondary" className={`${paymentStatusColors[currentPayment.status] || 'bg-gray-100'} text-[10px] px-1.5 py-0 shadow-none`}>
                                                    {currentPayment.status || 'PENDING'}
                                                </Badge>
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6 space-y-4">
                                    {/* ລາຍການສິນຄ້າພາຍໃນອໍເດື່ອນີ້ */}
                                    <div className="divide-y divide-gray-100">
                                        {orderItems.map((item: any, idx: number) => {
                                            const productInfo = item.product || {};
                                            return (
                                                <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-lg border overflow-hidden flex-shrink-0 relative">
                                                        <Image
                                                            src={productInfo.images?.[0]?.image_url || '/placeholder.png'}
                                                            alt={productInfo.product_name || "Product"}
                                                            fill
                                                            sizes="64px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                                            {productInfo.product_name || "Unknown Product"}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            Quantity: {item.quantity} ຊິ້ນ × ฿{Number(item.price).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-sm text-gray-900">
                                                            ฿{(Number(item.price) * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* ສະຫຼຸບລາຄາສຸດທິ ແລະ ປຸ່ມດຳເນີນການກວດສອບ */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 font-light">Total Amount</p>
                                            <p className="text-xl font-extrabold text-gray-900">
                                                ฿{Number(order.total_amount).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 justify-end">
                                            {/* ປຸ່ມເບິ່ງຕົວຢ່າງຮູບສະລິບໂອນເງິນເດີມທີ່ເຄີຍແນບໄວ້ */}
                                            {currentPayment.slip_url && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-gray-600 text-xs h-9">
                                                            <Eye className="size-3.5 mr-1.5" />
                                                            View Slip
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md rounded-xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Payment Slip</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="relative h-96 w-full mt-2 border rounded-lg overflow-hidden bg-gray-50">
                                                            <Image
                                                                src={currentPayment.slip_url}
                                                                alt="Payment slip"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}

                                            {/* ສະແດງປຸ່ມອັບໂຫລດສະລິບໃໝ່ກໍລະນີຄ້າງຈ່າຍ ຫຼື ສະລິບຖືກປະຕິເສດ (REJECTED) */}
                                            {(order.status === 'WAITING_PAYMENT' || currentPayment.status === 'REJECTED') && (
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 shadow-sm" onClick={() => openUploadDialog(order.order_id)}>
                                                    <Upload className="size-3.5 mr-1.5" />
                                                    {currentPayment.slip_url ? 'Re-upload Slip' : 'Upload Slip'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* ກ່ອງອັບໂຫລດໄຟລ໌ຫຼັກຖານ (Upload Dialog) */}
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogContent className="max-w-md rounded-xl">
                        <DialogHeader>
                            <DialogTitle>Upload Payment Slip</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-2">
                            <div className="border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-8 text-center bg-gray-50/50 transition-colors">
                                <input
                                    type="file"
                                    id="slip-upload"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file && selectedOrder) {
                                            handleFileUpload(selectedOrder, file);
                                        }
                                    }}
                                    className="hidden"
                                />
                                <label htmlFor="slip-upload" className="cursor-pointer block">
                                    <Upload className="size-10 mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm font-semibold text-gray-800 mb-1">
                                        ຄລິກເພື່ອອັບໂຫລດໄຟລ໌ສະລິບໂອນເງິນ
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        ຮອງຮັບໄຟລ໌ຮູບພາບ PNG, JPG ສູງສຸດ 10MB
                                    </p>
                                </label>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}