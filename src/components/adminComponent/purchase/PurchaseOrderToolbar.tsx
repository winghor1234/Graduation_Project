"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Plus } from "lucide-react"
import { PropsTable } from "../../Type"


/* ----------------------------- Component ----------------------------- */

export function PurchaseOrderToolbar({ table, onAdd }: PropsTable) {

    const setSort = (sort: string, order: "asc" | "desc") => {
        table.setSort(sort)
        table.setOrder(order)
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* 🔍 SEARCH + SORT */}
            <div className="flex gap-2">

                <Input
                    placeholder="Search purchase orders..."
                    value={table.search}
                    onChange={(e) => table.setSearch(e.target.value)}
                    className="w-[250px]"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowUpDown className="w-4 h-4" />
                            Sort
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>

                        <DropdownMenuItem
                            onClick={() => setSort("createdAt", "desc")}
                        >
                            Date (Newest)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("createdAt", "asc")}
                        >
                            Date (Oldest)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("purchase_id", "asc")}
                        >
                            Purchase ID (A → Z)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("purchase_id", "desc")}
                        >
                            Purchase ID (Z → A)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("total_amount", "asc")}
                        >
                            Amount (Low → High)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("total_amount", "desc")}
                        >
                            Amount (High → Low)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("status", "asc")}
                        >
                            Status (A → Z)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("status", "desc")}
                        >
                            Status (Z → A)
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ➕ ADD */}
            <Button onClick={onAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Purchase Order
            </Button>
        </div>
    )
}