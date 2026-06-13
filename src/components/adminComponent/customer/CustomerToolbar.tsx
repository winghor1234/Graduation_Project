"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Plus } from "lucide-react"
import { PropsTable } from "@/components/Type"
import { SearchInput } from "@/components/SearchInput"


/* ----------------------------- Component ----------------------------- */

export function CustomerToolbar({ table, onAdd }: PropsTable) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* 🔍 Search + Sort */}
            <div className="flex gap-2">
                <SearchInput
                    value={table.search}
                    onChange={table.setSearch}
                    placeholder="ຄົ້ນຫາລູກຄ້າ: ຊື່ , ອີເມວ , ເບີໂທ..."
                />

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
                            onClick={() => table.setSort("customer_name", "asc")}
                        >
                            ຊື່ (A → Z)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("customer_name", "desc")}
                        >
                             ຊື່ (Z → A)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("email", "asc")}
                        >
                            ອີເມວ (A → Z)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("email", "desc")}
                        >
                            ອີເມວ (Z → A)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* ➕ Add */}
            <Button onClick={onAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                ເພີ່ມລູກຄ້າ
            </Button>
        </div>
    )
}