"use client"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Payment } from "@/modules/payment/payment.type"
import { BadgeComponent } from "../StatusComponent"
import { formatCurrency } from "@/utils/FormatCurrency"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    payments: Payment[]
    isLoading: boolean
    onVerify: (p: Payment) => void
}

export function PaymentTable({ payments, isLoading, onVerify }: Props) {
    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            {["#", "ລະຫັດອໍເດີ້", "ຈຳນວນ", "ສະຖານະ", "ສລິບ", ""].map((h) => (
                                <TableHead key={h} className={theme.subText}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i} className="border-admin-border">
                                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="size-12 rounded-lg" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-20 rounded-lg" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        )
    }

    return (
        <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
            <div className="w-full overflow-x-auto">
                <Table className="min-w-150">
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={theme.subText}>#</TableHead>
                            <TableHead className={theme.subText}>ລະຫັດອໍເດີ້</TableHead>
                            <TableHead className={theme.subText}>ຈຳນວນເງິນ</TableHead>
                            <TableHead className={theme.subText}>ສະຖານະ</TableHead>
                            <TableHead className={theme.subText}>ສລິບໂອນ</TableHead>
                            <TableHead className={cn("text-right", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length ? (
                            payments.map((p, index) => (
                                <TableRow
                                    key={p.payment_id}
                                    className="border-admin-border hover:bg-brand-blue-soft/30 transition-colors"
                                >
                                    <TableCell className={cn("font-medium", theme.subText)}>{index + 1}</TableCell>
                                    <TableCell className={cn("font-mono text-xs", theme.text)}>{p.order?.order_code}</TableCell>
                                    <TableCell className={cn("font-semibold", theme.primary)}>{formatCurrency(p.amount ?? 0)}</TableCell>
                                    <TableCell><BadgeComponent status={p.status} /></TableCell>
                                    <TableCell>
                                        {p.slip_url ? (
                                            <Image
                                                src={p.slip_url}
                                                className="size-12 object-cover rounded-lg border border-admin-border"
                                                width={48}
                                                height={48}
                                                alt="Slip"
                                            />
                                        ) : (
                                            <span className={cn("text-xs", theme.subText)}>-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {p.status === "PENDING" && (
                                            <Button
                                                size="sm"
                                                className="bg-brand-blue hover:bg-brand-blue-hover text-white h-7 text-xs"
                                                onClick={() => onVerify(p)}
                                            >
                                                ກວດສອບ
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className={cn("text-center py-12 text-sm", theme.subText)}>
                                    ຍັງບໍ່ມີຂໍ້ມູນການຊຳລະ
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}