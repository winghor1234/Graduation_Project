"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    User, Mail, Phone, Star, Calendar, Edit2,
    Check, X, ShieldCheck, LogIn,
} from "lucide-react"

import { useAuthMe } from "@/app/features/hooks/Auth"
import { useUpdateCustomer } from "@/app/features/hooks/Customer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/utils/FormatCurrency"
import { formatDate } from "@/utils/FormatDate"

const POINTS_PER_KIP = 100

type CustomerUser = {
    customer_id: string
    customer_name: string
    email: string
    phone: string
    gender?: string
    point?: number
    role: string
    isActive?: boolean
    createdAt?: string
    lastLogin?: string
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-10 animate-pulse">
            <div className="container mx-auto px-4 max-w-2xl space-y-6">
                <div className="bg-white rounded-2xl p-8 flex items-center gap-5">
                    <div className="size-20 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                        <div className="h-5 w-40 bg-gray-200 rounded" />
                        <div className="h-4 w-52 bg-gray-100 rounded" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 bg-gray-100 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function CustomerProfilePage() {
    const { user: rawUser, isLoading } = useAuthMe()
    const user = rawUser as CustomerUser | null
    const qc = useQueryClient()
    const { mutate: updateCustomer, isPending } = useUpdateCustomer()

    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ customer_name: "", phone: "", gender: "" })

    const startEdit = () => {
        setForm({
            customer_name: user?.customer_name ?? "",
            phone: user?.phone ?? "",
            gender: user?.gender ?? "",
        })
        setEditing(true)
    }

    const cancelEdit = () => setEditing(false)

    const handleSave = () => {
        if (!user?.customer_id) return
        updateCustomer(
            {
                id: user.customer_id,
                data: {
                    customer_name: form.customer_name || undefined,
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

    const initial = (user.customer_name ?? "?")[0].toUpperCase()
    const points  = Math.floor(user.point ?? 0)
    const pointValue = points * POINTS_PER_KIP

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-2xl space-y-5">

                {/* ── Header card ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <div className="flex items-center gap-5">
                        <div className="size-20 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
                            <span className="text-3xl font-extrabold text-white">{initial}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-extrabold text-gray-900 truncate">{user.customer_name}</h1>
                            <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
                                <Mail className="size-3.5" />
                                {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-50 text-brand-orange border border-orange-200 rounded-full px-2.5 py-0.5">
                                    <ShieldCheck className="size-3" />
                                    ລູກຄ້າ
                                </span>
                                {user.isActive ? (
                                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">ໃຊ້ງານຢູ່</span>
                                ) : (
                                    <span className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-2.5 py-0.5">ປິດໃຊ້ງານ</span>
                                )}
                            </div>
                        </div>

                        {!editing && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-1.5 rounded-xl border-gray-200 text-gray-600 hover:border-gray-400 shrink-0"
                                onClick={startEdit}
                            >
                                <Edit2 className="size-3.5" />
                                ແກ້ໄຂ
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── Points card ── */}
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                                <Star className="size-5 text-amber-500 fill-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">ຄະແນນສຳສັກ</p>
                                <p className="text-2xl font-extrabold text-amber-600">{points.toLocaleString()} pts</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">ມູນຄ່າ</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(pointValue)}</p>
                            <p className="text-[11px] text-gray-400">1 pt = {formatCurrency(POINTS_PER_KIP)}</p>
                        </div>
                    </div>
                </div>

                {/* ── Info / Edit card ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-5">ຂໍ້ມູນສ່ວນຕົວ</h2>

                    {editing ? (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ຊື່</Label>
                                <Input
                                    value={form.customer_name}
                                    onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                                    className="rounded-xl border-gray-200 focus-visible:ring-brand-orange/30"
                                    placeholder="ກະລຸນາໃສ່ຊື່"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ເບີໂທ</Label>
                                <Input
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    className="rounded-xl border-gray-200 focus-visible:ring-brand-orange/30"
                                    placeholder="020xxxxxxxx"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ເພດ</Label>
                                <select
                                    value={form.gender}
                                    onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                                    className="w-full h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                                >
                                    <option value="">ບໍ່ລະບຸ</option>
                                    <option value="ຊາຍ">ຊາຍ</option>
                                    <option value="ຍິງ">ຍິງ</option>
                                </select>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Button
                                    className="flex-1 h-10 rounded-xl bg-gray-900 hover:bg-gray-700 text-white gap-2"
                                    onClick={handleSave}
                                    disabled={isPending}
                                >
                                    <Check className="size-4" />
                                    {isPending ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 h-10 rounded-xl border-gray-200 gap-2"
                                    onClick={cancelEdit}
                                    disabled={isPending}
                                >
                                    <X className="size-4" />
                                    ຍົກເລີກ
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <InfoRow icon={User} label="ຊື່" value={user.customer_name} />
                            <InfoRow icon={Mail} label="ອີເມວ" value={user.email} />
                            <InfoRow icon={Phone} label="ເບີໂທ" value={user.phone} />
                            <InfoRow icon={User} label="ເພດ" value={user.gender || "ບໍ່ລະບຸ"} />
                            {user.createdAt && (
                                <InfoRow icon={Calendar} label="ສະມາຊິກຕັ້ງແຕ່" value={formatDate(user.createdAt)} />
                            )}
                            {user.lastLogin && (
                                <InfoRow icon={LogIn} label="ເຂົ້າສູ່ລະບົບຄັ້ງລ່າສຸດ" value={formatDate(user.lastLogin)} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <Icon className="size-4 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
            </div>
        </div>
    )
}
