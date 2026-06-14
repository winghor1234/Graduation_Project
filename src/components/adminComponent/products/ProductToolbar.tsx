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

export function ProductToolbar({ table, onAdd }: PropsTable) {

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Search + Sort */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="ຄົ້ນຫາສິນຄ້າ..."
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
                        <DropdownMenuItem onClick={() => table.setSort("createdAt", "desc")}>
                            ວັນທີ (ໃໝ່ສຸດ)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.setSort("createdAt", "asc")}>
                            ວັນທີ (ໃໝ່ສຸດ)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => table.setSort("product_name", "asc")}>
                            ຊື່ສິນຄ້າ (ກ → ຮ)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.setSort("product_name", "desc")}>
                            ຊື່ສິນຄ້າ (ຮ → ກ)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => table.setSort("purchase_price", "asc")}>
                            ລາຄາຊື້ (ຕ່ຳ → ສູງ)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.setSort("purchase_price", "desc")}>
                            ລາຄາຊື້ (ສູງ → ຕ່ຳ)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => table.setSort("sale_price", "asc")}>
                            ລາຄາຂາຍ (ຕ່ຳ → ສູງ)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.setSort("sale_price", "desc")}>
                            ລາຄາຂາຍ (ສູງ → ຕ່ຳ)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Right: Add button */}
            <Button onClick={onAdd} size="sm" className="gap-1.5 shrink-0">
                <Plus className="h-4 w-4" />
                ເພີ່ມສິນຄ້າ
            </Button>
        </div>
    )
}