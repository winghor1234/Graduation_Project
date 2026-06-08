"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Province } from "@/modules/location/location.type"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    province?: Province
}

export function ProvinceDetailDialog({ open, onOpenChange, province }: Props) {
    if (!province) return null

    const branches = province.districts?.flatMap(d => d.branches ?? []) ?? []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle>Province Detail</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">

                    {/* Province */}
                    <div>
                        <p className="text-muted-foreground">Province</p>
                        <p className="font-medium">{province.province_name}</p>
                    </div>

                    {/* District */}
                    <div>
                        <p className="text-muted-foreground">District</p>
                        <div className="flex flex-wrap gap-1">
                            {province.districts?.map(d => (
                                <Badge key={d.district_id} variant="secondary">
                                    {d.district_name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Branch */}
                    <div>
                        <p className="text-muted-foreground">Branch</p>
                        <div className="flex flex-wrap gap-1">
                            {branches.map(b => (
                                <Badge key={b.branch_id}>
                                    {b.branch_name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}