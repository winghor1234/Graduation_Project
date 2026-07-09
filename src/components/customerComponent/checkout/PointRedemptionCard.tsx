"use client"

import { Minus, Plus } from "lucide-react"
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
        onChangePoints(isNaN(n) ? 0 : clamp(n))
    }

    const step10 = (dir: 1 | -1) => onChangePoints(clamp(pointsToUse + dir * 10))

    return (
        <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
            <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-base font-semibold">ໃຊ້ຄະແນນສ່ວນຫຼຸດ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="border border-gray-200 rounded-lg px-3 py-2.5">
                        <p className="text-xs text-gray-500 mb-1">ຄະແນນທີ່ມີ</p>
                        <p className="font-bold text-gray-900">{customerPoints.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">≈ {formatCurrency(customerPoints * pointsPerKip)}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg px-3 py-2.5">
                        <p className="text-xs text-gray-500 mb-1">ໃຊ້ໄດ້ສູງສຸດ (30%)</p>
                        <p className="font-bold text-gray-900">{maxRedeemPoints.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">≈ {formatCurrency(maxRedeemPoints * pointsPerKip)}</p>
                    </div>
                </div>

                {canUse ? (
                    <>
                        <div>
                            <p className="text-sm text-gray-700 mb-2 font-medium">ຈຳນວນຄະແນນທີ່ຢາກໃຊ້</p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => step10(-1)}
                                    disabled={pointsToUse === 0}
                                    className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Minus className="size-4" />
                                </button>
                                <input
                                    type="number"
                                    min={0}
                                    max={maxRedeemPoints}
                                    value={pointsToUse === 0 ? "" : pointsToUse}
                                    onChange={e => handleInput(e.target.value)}
                                    placeholder="0"
                                    className="flex-1 h-9 text-center text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-300 focus:outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => step10(1)}
                                    disabled={pointsToUse >= maxRedeemPoints}
                                    className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>

                            <div className="flex gap-2 mt-2">
                                {[0, Math.floor(maxRedeemPoints * 0.5), maxRedeemPoints]
                                    .filter((v, i, arr) => arr.indexOf(v) === i)
                                    .map(v => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => onChangePoints(v)}
                                            className={`flex-1 h-7 text-xs rounded-lg border font-medium transition-colors ${
                                                pointsToUse === v
                                                    ? "bg-orange-500 border-orange-500 text-white"
                                                    : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500"
                                            }`}
                                        >
                                            {v === 0 ? "ບໍ່ໃຊ້" : v === maxRedeemPoints ? "ສູງສຸດ" : `${v}`}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>

                        {pointsToUse > 0 && (
                            <div className="flex justify-between text-sm border border-gray-200 rounded-lg px-3 py-2.5">
                                <span className="text-gray-600">ໃຊ້ {pointsToUse} ຄະແນນ</span>
                                <span className="font-semibold text-orange-500">-{formatCurrency(pointsValue)}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2.5">
                        ຕ້ອງມີຢ່າງໜ້ອຍ {minPoints} ຄະແນນ ຈຶ່ງໃຊ້ໄດ້
                        {customerPoints > 0 && (
                            <span className="text-gray-400"> (ຕ້ອງການອີກ {minPoints - customerPoints} ຄະແນນ)</span>
                        )}
                    </p>
                )}

                <p className="text-[11px] text-gray-400 text-center">
                    1 ຄະແນນ = {formatCurrency(pointsPerKip)} · ຮັບ 1 ຄະແນນທຸກ 10,000₭ ທີ່ຊື້
                </p>
            </CardContent>
        </Card>
    )
}
