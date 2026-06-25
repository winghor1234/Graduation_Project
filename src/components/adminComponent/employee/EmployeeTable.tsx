"use client"

import { Edit, ShieldCheck, ShieldOff, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Employee } from "@/modules/employee/employee.type"
import { formatDate } from "@/utils/FormatDate"

// ────────────────────────────────────────────────────────────
// Skeleton
// ────────────────────────────────────────────────────────────

function EmployeeTableSkeleton() {
    return (
        <div className="animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                    <div className="size-9 rounded-full bg-admin-border/40 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-4 w-36 bg-admin-border/60 rounded" />
                        <div className="h-3 w-48 bg-admin-border/60 rounded" />
                    </div>
                    <div className="h-4 w-24 bg-admin-border/60 rounded hidden md:block" />
                    <div className="h-5 w-16 bg-admin-border/60 rounded-full hidden lg:block" />
                    <div className="h-5 w-20 bg-admin-border/60 rounded-full" />
                    <div className="h-4 w-28 bg-admin-border/60 rounded hidden xl:block" />
                    <div className="flex gap-1">
                        <div className="size-8 bg-admin-border/60 rounded-lg" />
                        <div className="size-8 bg-admin-border/60 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// ────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────

type Props = {
    employees: Employee[]
    isLoading: boolean
    onEdit: (emp: Employee) => void
    onToggleStatus: (id: string) => void
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function EmployeeTable({ employees, isLoading, onEdit, onToggleStatus }: Props) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[2.5rem_1fr_1fr_7rem_6rem_8rem_9rem_7rem] gap-0 border-b border-admin-border bg-admin-bg">
                {["#", "ພະນັກງານ", "ອີເມວ / ເບີໂທ", "ຕຳແໜ່ງ", "Role", "ສະຖານະ", "ເຂົ້າໃຊ້ຫຼ້າສຸດ", ""].map((h, i) => (
                    <div key={i} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {h}
                    </div>
                ))}
            </div>

            {isLoading ? (
                <EmployeeTableSkeleton />
            ) : employees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-admin-muted">
                    <User className="size-10 text-gray-200" />
                    <p className="text-sm font-medium">ຍັງບໍ່ມີຂໍ້ມູນພະນັກງານ</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {employees.map((emp, idx) => (
                        <div
                            key={emp.employee_id}
                            className="grid grid-cols-1 md:grid-cols-[2.5rem_1fr_1fr_7rem_6rem_8rem_9rem_7rem] items-center gap-2 md:gap-0 px-4 py-3.5 hover:bg-brand-blue-soft/30 transition-colors"
                        >
                            {/* # */}
                            <div className="hidden md:block text-xs text-admin-muted font-medium px-1">
                                {idx + 1}
                            </div>

                            {/* Name + avatar */}
                            <div className="flex items-center gap-3 px-1">
                                <div className="size-9 rounded-full bg-brand-navy text-white flex items-center justify-center text-sm font-bold shrink-0">
                                    {emp.employee_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{emp.employee_name}</p>
                                    <p className="text-xs text-admin-muted truncate md:hidden">{emp.email}</p>
                                </div>
                            </div>

                            {/* Email / Phone */}
                            <div className="hidden md:block px-1 min-w-0">
                                <p className="text-sm text-gray-600 truncate">{emp.email}</p>
                                <p className="text-xs text-admin-muted mt-0.5">{emp.phone}</p>
                            </div>

                            {/* Position */}
                            <div className="hidden md:block px-1">
                                <p className="text-sm text-gray-600 truncate">{emp.position ?? "—"}</p>
                            </div>

                            {/* Role */}
                            <div className="px-1">
                                <Badge
                                    className={
                                        emp.role === "ADMIN"
                                            ? "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-50"
                                            : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-brand-blue-soft"
                                    }
                                >
                                    {emp.role === "ADMIN" ? "Admin" : "Staff"}
                                </Badge>
                            </div>

                            {/* Status */}
                            <div className="px-1">
                                <Badge
                                    className={
                                        emp.isActive
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                            : "bg-gray-100 text-admin-muted border border-admin-border hover:bg-gray-100"
                                    }
                                >
                                    {emp.isActive ? "ໃຊ້ງານ" : "ປິດ"}
                                </Badge>
                            </div>

                            {/* Last login */}
                            <div className="hidden xl:block px-1">
                                <p className="text-xs text-admin-muted">
                                    {emp.lastLogin ? formatDate(emp.lastLogin) : "ຍັງບໍ່ເຄີຍ"}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 px-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-lg text-gray-500 hover:text-gray-900"
                                    onClick={() => onEdit(emp)}
                                >
                                    <Edit className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`size-8 rounded-lg ${
                                        emp.isActive
                                            ? "text-admin-muted hover:text-red-600 hover:bg-red-50"
                                            : "text-admin-muted hover:text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                    title={emp.isActive ? "ປິດໃຊ້ງານ" : "ເປີດໃຊ້ງານ"}
                                    onClick={() => onToggleStatus(emp.employee_id)}
                                >
                                    {emp.isActive
                                        ? <ShieldOff className="size-4" />
                                        : <ShieldCheck className="size-4" />
                                    }
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}