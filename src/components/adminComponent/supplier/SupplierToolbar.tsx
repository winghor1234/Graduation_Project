"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Plus } from "lucide-react"
import { PropsTable } from "../../Type"



export function SupplierToolbar({ table, onAdd }: PropsTable) {

    const setSort = (field: string, order: "asc" | "desc") => {
        table.setSort(field)
        table.setOrder(order)
    }

    return (
        <div className="flex justify-between gap-4">

            <div className="flex gap-2">
                <Input
                    placeholder="Search suppliers..."
                    value={table.search}
                    onChange={(e) => table.setSearch(e.target.value)}
                    className="w-[250px]"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Sort
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSort("supplier_name", "asc")}>
                            Name A → Z
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setSort("supplier_name", "desc")}>
                            Name Z → A
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setSort("created_at", "desc")}>
                            Newest
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
            </Button>
        </div>
    )
}