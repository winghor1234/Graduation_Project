"use client"

import { Star, Lock, Minus, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/FormatCurrency"

type Props = {
    customerPoints:  number
    maxRedeemPoints: number
    pointsToUse:     number
    onChangePoints:  (pts: number) => void
    canUse:          boolean
    minPoints:       number
    pointsPerKip:    number
}

export function PointRedemptionCard({
    customerPoints, maxRedeemPoints, pointsToUse,
    onChangePoints, canUse, minPoints, pointsPerKip,
}: Props) {
    const pointsValue = pointsToUse * pointsPerKip

    const clamp = (v: number) => Math.max(0, Math.min(v, maxRedeemPoints))

    const handleInput = (raw: string) => {
        const n = parseInt(raw, 10)
        if (isNaN(n)) { onChangePoints(0); return }
        onChangePoints(clamp(n))
    }

    const step10 = (dir: 1 | -1) => onChangePoints(clamp(pointsToUse + dir * 10))

    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-gray-900 text-base">
                    <div className="size-8 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Star className="size-4 text-amber-500 fill-amber-400" />
                    </div>
                    ໃຊ້ຄະແນນສ່ວນຫຼຸດ
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Balance info */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                        <p className="text-[11px] text-amber-600 mb-0.5">ຄະແນນທີ່ມີ</p>
                        <p className="text-lg font-extrabold text-amber-700">
                            {customerPoints.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-amber-500">≈ {formatCurrency(customerPoints * pointsPerKip)}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                        <p className="text-[11px] text-gray-500 mb-0.5">ໃຊ້ໄດ້ສູງສຸດ (30%)</p>
                        <p className="text-lg font-extrabold text-gray-700">
                            {maxRedeemPoints.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-400">≈ {formatCurrency(maxRedeemPoints * pointsPerKip)}</p>
                    </div>
                </div>

                {canUse ? (
                    <>
                        {/* Input row */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                ພິມຈຳນວນຄະແນນທີ່ຢາກໃຊ້
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => step10(-1)}
                                    disabled={pointsToUse === 0}
                                    className="size-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Minus className="size-4" />
                                </button>

                                <div className="flex-1 relative">
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxRedeemPoints}
                                        value={pointsToUse === 0 ? "" : pointsToUse}
                                        onChange={e => handleInput(e.target.value)}
                                        placeholder="0"
                                        className="w-full h-10 text-center text-lg font-bold text-gray-900 border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                                        ຄະແນນ
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => step10(1)}
                                    disabled={pointsToUse >= maxRedeemPoints}
                                    className="size-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>

                            {/* Quick picks */}
                            <div className="flex gap-2 mt-2">
                                {[0, Math.floor(maxRedeemPoints * 0.25), Math.floor(maxRedeemPoints * 0.5), maxRedeemPoints]
                                    .filter((v, i, arr) => arr.indexOf(v) === i && v <= maxRedeemPoints)
                                    .map(v => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => onChangePoints(v)}
                                            className={`flex-1 h-7 text-xs rounded-lg border font-semibold transition-colors ${
                                                pointsToUse === v
                                                    ? "bg-amber-400 border-amber-400 text-white"
                                                    : "border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600"
                                            }`}
                                        >
                                            {v === 0 ? "ບໍ່ໃຊ້" : v === maxRedeemPoints ? "ສູງສຸດ" : v}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Result */}
                        <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors ${
                            pointsToUse > 0
                                ? "bg-amber-50 border border-amber-200"
                                : "bg-gray-50 border border-gray-100"
                        }`}>
                            <p className={`text-sm font-semibold ${pointsToUse > 0 ? "text-amber-700" : "text-gray-400"}`}>
                                {pointsToUse > 0 ? `ໃຊ້ ${pointsToUse} ຄະແນນ` : "ຍັງບໍ່ໄດ້ເລືອກ"}
                            </p>
                            <p className={`text-sm font-extrabold ${pointsToUse > 0 ? "text-amber-700" : "text-gray-400"}`}>
                                {pointsToUse > 0 ? `-${formatCurrency(pointsValue)}` : "—"}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <Lock className="size-4 text-gray-400 shrink-0" />
                        <p className="text-sm text-gray-500">
                            ຕ້ອງມີຢ່າງໜ້ອຍ {minPoints} ຄະແນນ ຈຶ່ງໃຊ້ໄດ້
                            {customerPoints > 0 && (
                                <span className="text-gray-400 text-xs"> (ຕ້ອງການອີກ {minPoints - customerPoints} ຄະແນນ)</span>
                            )}
                        </p>
                    </div>
                )}

                <p className="text-[11px] text-gray-400 text-center">
                    1 ຄະແນນ = {formatCurrency(pointsPerKip)} · ໄດ້ຮັບ 1 ຄະແນນທຸກ 10,000₭ ທີ່ຊື້
                </p>
            </CardContent>
        </Card>
    )
}
