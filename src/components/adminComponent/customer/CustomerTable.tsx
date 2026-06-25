"use client"
import { Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Customer } from "@/modules/customer/customer.type"
import { StatusToggleButton } from "./CustomerStatusSwitch"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type Props = {
    customers: Customer[]
    isLoading: boolean
    onEdit: (p: Customer) => void
    onChange: (id: string) => void
}

export function CustomerTable({ customers, isLoading, onEdit, onChange }: Props) {
    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={theme.subText}>ຊື່</TableHead>
                            <TableHead className={theme.subText}>ອີເມວ</TableHead>
                            <TableHead className={theme.subText}>ເບີໂທ</TableHead>
                            <TableHead className={theme.subText}>ຄະແນນ</TableHead>
                            <TableHead className={theme.subText}>ສະຖານະ</TableHead>
                            <TableHead className={cn("text-right", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i} className="border-admin-border">
                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Skeleton className="size-8 rounded-lg" />
                                    <Skeleton className="size-8 rounded-lg" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        )
    }

    if (!customers?.length) {
        return (
            <Card className={cn("p-12 text-center rounded-2xl", theme.card)}>
                <p className={cn("text-sm", theme.subText)}>ຍັງບໍ່ມີຂໍ້ມູນລູກຄ້າ</p>
            </Card>
        )
    }

    return (
        <Card className={cn("overflow-hidden rounded-2xl", theme.card)}>
            <div className="w-full overflow-x-auto">
                <Table className="min-w-175">
                    <TableHeader>
                        <TableRow className="bg-admin-bg hover:bg-admin-bg border-admin-border">
                            <TableHead className={theme.subText}>ຊື່</TableHead>
                            <TableHead className={theme.subText}>ອີເມວ</TableHead>
                            <TableHead className={theme.subText}>ເບີໂທ</TableHead>
                            <TableHead className={theme.subText}>ຄະແນນ</TableHead>
                            <TableHead className={theme.subText}>ສະຖານະ</TableHead>
                            <TableHead className={cn("text-right", theme.subText)}>ການຈັດການ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow
                                key={customer.customer_id}
                                className="border-admin-border hover:bg-brand-blue-soft/30 transition-colors"
                            >
                                <TableCell className={cn("font-medium", theme.text)}>
                                    {customer.customer_name}
                                </TableCell>
                                <TableCell className={theme.subText}>{customer.email}</TableCell>
                                <TableCell className={theme.subText}>{customer.phone}</TableCell>
                                <TableCell className={cn("font-semibold", theme.primary)}>
                                    {customer.points?.map((p) => p.point_amount).reduce((a, b) => a + b, 0) || 0}
                                </TableCell>
                                <TableCell>
                                    {customer.isActive
                                        ? <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">ໃຊ້ງານຢູ່</Badge>
                                        : <Badge variant="secondary" className="bg-gray-100 text-gray-500 border border-gray-200">ປິດໃຊ້ງານ</Badge>
                                    }
                                </TableCell>
                                <TableCell className="flex justify-end gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8 hover:bg-brand-blue-soft hover:text-brand-blue"
                                        onClick={() => onEdit(customer)}
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <StatusToggleButton
                                        active={customer.isActive}
                                        onToggle={() => onChange(customer.customer_id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}