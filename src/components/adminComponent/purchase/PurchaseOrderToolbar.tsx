"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Plus, Search, X } from "lucide-react"
import { PropsTable } from "../../Type"


/* ----------------------------- Component ----------------------------- */

export function PurchaseOrderToolbar({ table, onAdd }: PropsTable) {

    // const setSort = (sort: string, order: "asc" | "desc") => {
    //     table.setSort(sort)
    //     table.setOrder(order)
    // }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* 🔍 SEARCH + SORT */}
            <div className="flex gap-2">

                <div className="relative w-[350px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="ຄົ້ນຫາໃບບິນສັ່ງຊື້: ລະຫັດສັ່ງຊື້ , ຜູ້ສະໜອງ..."
                        value={table.search}
                        onChange={(e) => table.setSearch(e.target.value)}
                        className="pl-10 pr-10"
                    />

                    {table.search && (
                        <button
                            type="button"
                            onClick={() => table.setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowUpDown className="w-4 h-4" />
                            ລຽງລຳດັບ
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>

                        <DropdownMenuItem
                            onClick={() => table.setSort("createdAt", "desc")}
                        >
                            ວັນທີ (ໃໝ່ສຸດ)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("createdAt", "asc")}
                        >
                            ວັນທີ (ເກົ່າສຸດ)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("purchase_code", "asc")}
                        >
                            ລະຫັດສັ່ງຊື້ (A → Z )
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("purchase_code", "desc")}
                        >
                            ລະຫັດສັ່ງຊື້ (Z → A)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("total_amount", "asc")}
                        >
                            ຈຳນວນເງິນ (ຕ່ຳ → ສູງ)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("total_amount", "desc")}
                        >
                            ຈຳນວນເງິນ (ສູງ → ຕ່ຳ)
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ➕ ADD */}
            <Button onClick={onAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                ເພີ່ມໃບບິນສັ່ງຊື້
            </Button>
        </div>
    )
}

