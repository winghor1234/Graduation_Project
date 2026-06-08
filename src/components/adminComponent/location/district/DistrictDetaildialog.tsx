"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { District } from "@/modules/location/location.type"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    district?: District
}

export function DistrictDetailDialog({ open, onOpenChange, district }: Props) {
    if (!district) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle>District Detail</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">

                    {/* District */}
                    <div>
                        <p className="text-muted-foreground">District</p>
                        <p className="font-medium">{district.district_name}</p>
                    </div>

                    {/* Province */}
                    <div>
                        <p className="text-muted-foreground">Province</p>
                        <p className="font-medium">
                            {district.province?.province_name}
                        </p>
                    </div>

                    {/* Branch */}
                    <div>
                        <p className="text-muted-foreground">Branch</p>
                        <div className="flex flex-wrap gap-1">
                            {district.branches?.map(b => (
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