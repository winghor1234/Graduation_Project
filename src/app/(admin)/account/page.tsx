"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    User, Mail, Phone, Shield, Calendar, Edit2,
    Check, X, LogIn, KeyRound,
} from "lucide-react"

import { useAuthMe } from "@/app/features/hooks/Auth"
import { useUpdateEmployee } from "@/app/features/hooks/Employee"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/utils/FormatDate"
import { cn } from "@/lib/utils"
import { theme } from "@/styles/theme"

type EmployeeUser = {
    employee_id: string
    employee_name: string
    email: string
    phone: string
    gender?: string
    role: "ADMIN" | "STAFF"
    isActive?: boolean
    createdAt?: string
    lastLogin?: string
}

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
    ADMIN: { label: "ຜູ້ດູແລລະບົບ", color: "bg-brand-blue-soft text-brand-blue border-brand-blue" },
    STAFF: { label: "ພະນັກງານ",     color: "bg-emerald-900/30 text-emerald-400 border-emerald-700" },
}

function ProfileSkeleton() {
    return (
        <div className="animate-pulse space-y-5">
            <div className={cn("rounded-2xl p-8 flex items-center gap-5", theme.card)}>
                <div className="size-20 rounded-full bg-admin-border" />
                <div className="space-y-2 flex-1">
                    <div className="h-5 w-40 bg-admin-border rounded" />
                    <div className="h-4 w-52 bg-admin-border rounded" />
                </div>
            </div>
            <div className={cn("rounded-2xl p-6 space-y-4", theme.card)}>
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-admin-border rounded-xl" />)}
            </div>
        </div>
    )
}

export default function AdminProfilePage() {
    const { user: rawUser, isLoading } = useAuthMe()
    const user = rawUser as EmployeeUser | null
    const qc = useQueryClient()
    const { mutate: updateEmployee, isPending } = useUpdateEmployee()

    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ employee_name: "", phone: "", gender: "" })

    const startEdit = () => {
        setForm({
            employee_name: user?.employee_name ?? "",
            phone: user?.phone ?? "",
            gender: user?.gender ?? "",
        })
        setEditing(true)
    }

    const cancelEdit = () => setEditing(false)

    const handleSave = () => {
        if (!user?.employee_id) return
        updateEmployee(
            {
                id: user.employee_id,
                data: {
                    employee_name: form.employee_name || undefined,
                    phone: form.phone || undefined,
                    gender: form.gender || undefined,
                },
            },
            {
                onSuccess: () => {
                    qc.invalidateQueries({ queryKey: ["me"] })
                    toast.success("ອັບເດດໂປຣໄຟລ໌ສຳເລັດ")
                    setEditing(false)
                },
                onError: () => toast.error("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່"),
            }
        )
    }

    if (isLoading) return <ProfileSkeleton />
    if (!user) return null

    const initial   = (user.employee_name ?? "?")[0].toUpperCase()
    const roleCfg   = ROLE_LABEL[user.role] ?? ROLE_LABEL.STAFF

    return (
        <div className="max-w-2xl mx-auto space-y-5">

            {/* ── Header card ── */}
            <div className={cn("rounded-2xl p-8", theme.card)}>
                <div className="flex items-center gap-5">
                    <div className={cn("size-20 rounded-full flex items-center justify-center shrink-0", theme.avatarGradient)}>
                        <span className="text-3xl font-extrabold text-white">{initial}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className={cn("text-2xl font-extrabold truncate", theme.text)}>{user.employee_name}</h1>
                        <p className={cn("text-sm mt-0.5 flex items-center gap-1.5", theme.subText)}>
                            <Mail className="size-3.5" />
                            {user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2.5 py-0.5", roleCfg.color)}>
                                <Shield className="size-3" />
                                {roleCfg.label}
                            </span>
                            {user.isActive ? (
                                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-900/30 border border-emerald-700 rounded-full px-2.5 py-0.5">ໃຊ້ງານຢູ່</span>
                            ) : (
                                <span className="text-[11px] font-medium text-rose-400 bg-rose-900/30 border border-rose-700 rounded-full px-2.5 py-0.5">ປິດໃຊ້ງານ</span>
                            )}
                        </div>
                    </div>

                    {!editing && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 rounded-xl border-admin-border text-admin-muted hover:text-white hover:bg-admin-border shrink-0"
                            onClick={startEdit}
                        >
                            <Edit2 className="size-3.5" />
                            ແກ້ໄຂ
                        </Button>
                    )}
                </div>
            </div>

            {/* ── Info / Edit card ── */}
            <div className={cn("rounded-2xl p-6", theme.card)}>
                <h2 className={cn("text-base font-bold mb-5", theme.text)}>ຂໍ້ມູນສ່ວນຕົວ</h2>

                {editing ? (
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className={cn("text-xs font-semibold uppercase tracking-wide", theme.subText)}>ຊື່</Label>
                            <Input
                                value={form.employee_name}
                                onChange={e => setForm(f => ({ ...f, employee_name: e.target.value }))}
                                className="rounded-xl bg-admin-bg border-admin-border text-admin-text focus-visible:ring-brand-blue/30"
                                placeholder="ກະລຸນາໃສ່ຊື່"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className={cn("text-xs font-semibold uppercase tracking-wide", theme.subText)}>ເບີໂທ</Label>
                            <Input
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                className="rounded-xl bg-admin-bg border-admin-border text-admin-text focus-visible:ring-brand-blue/30"
                                placeholder="020xxxxxxxx"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className={cn("text-xs font-semibold uppercase tracking-wide", theme.subText)}>ເພດ</Label>
                            <select
                                value={form.gender}
                                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                                className="w-full h-10 rounded-xl border border-admin-border bg-admin-bg px-3 text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                            >
                                <option value="">ບໍ່ລະບຸ</option>
                                <option value="ຊາຍ">ຊາຍ</option>
                                <option value="ຍິງ">ຍິງ</option>
                            </select>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Button
                                className="flex-1 h-10 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white gap-2"
                                onClick={handleSave}
                                disabled={isPending}
                            >
                                <Check className="size-4" />
                                {isPending ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 h-10 rounded-xl border-admin-border text-admin-muted gap-2"
                                onClick={cancelEdit}
                                disabled={isPending}
                            >
                                <X className="size-4" />
                                ຍົກເລີກ
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <AdminInfoRow icon={User}     label="ຊື່"                   value={user.employee_name} />
                        <AdminInfoRow icon={Mail}     label="ອີເມວ"                  value={user.email} />
                        <AdminInfoRow icon={Phone}    label="ເບີໂທ"                  value={user.phone} />
                        <AdminInfoRow icon={User}     label="ເພດ"                   value={user.gender || "ບໍ່ລະບຸ"} />
                        <AdminInfoRow icon={KeyRound} label="ສິດ"                   value={roleCfg.label} />
                        {user.createdAt && (
                            <AdminInfoRow icon={Calendar} label="ສ້າງບັນຊີວັນທີ"       value={formatDate(user.createdAt)} />
                        )}
                        {user.lastLogin && (
                            <AdminInfoRow icon={LogIn}   label="ເຂົ້າລະບົບຄັ້ງລ່າສຸດ"  value={formatDate(user.lastLogin)} />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function AdminInfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-admin-border last:border-0">
            <div className="size-8 rounded-lg bg-admin-bg border border-admin-border flex items-center justify-center shrink-0">
                <Icon className="size-4 text-admin-muted" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-admin-muted">{label}</p>
                <p className="text-sm font-semibold text-admin-text truncate">{value}</p>
            </div>
        </div>
    )
}
