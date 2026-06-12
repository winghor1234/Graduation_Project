"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Plus } from "lucide-react"
import { PropsTable } from "../../Type"

export function CategoryToolbar({ table, onAdd }: PropsTable) {
    const setSort = (sort: string, order: "asc" | "desc") => {
        table.setSort(sort)
        table.setOrder(order)
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Search + Sort */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="ຄົ້ນຫາປະເພດສິນຄ້າ..."
                    value={table.search}
                    onChange={(e) => table.setSearch(e.target.value)}
                    className="w-60"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            ລຽງລຳດັບ
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem onClick={() => setSort("created_at", "desc")}>
                            ວັນທີ (ໃໝ່ສຸດ)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort("created_at", "asc")}>
                            ວັນທີ (ເກົ່າສຸດ)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSort("category_name", "asc")}>
                            ຊື່ສິນຄ້າ (ກ → ຮ)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort("category_name", "desc")}>
                            ຊື່ສິນຄ້າ (ຮ → ກ)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Right: Add button */}
            <Button onClick={onAdd} size="sm" className="gap-1.5 shrink-0">
                <Plus className="h-4 w-4" />
                ເພີ່ມປະເພດສິນຄ້າ
            </Button>
        </div>
    )
}