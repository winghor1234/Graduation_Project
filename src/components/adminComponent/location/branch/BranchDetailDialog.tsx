"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Branch } from "@/modules/location/location.type"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    branch?: Branch
}

export function BranchDetailDialog({ open, onOpenChange, branch }: Props) {
    if (!branch) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle>Branch Detail</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">

                    {/* Branch */}
                    <div>
                        <p className="text-muted-foreground">Branch</p>
                        <p className="font-medium">{branch.branch_name}</p>
                    </div>

                    {/* District */}
                    <div>
                        <p className="text-muted-foreground">District</p>
                        <p className="font-medium">
                            {branch.district?.district_name}
                        </p>
                    </div>

                    {/* Province */}
                    <div>
                        <p className="text-muted-foreground">Province</p>
                        <p className="font-medium">
                            {branch.district?.province?.province_name}
                        </p>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}