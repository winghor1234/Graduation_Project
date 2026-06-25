"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SearchInput } from "@/components/SearchInput"
import { ArrowUpDown, Plus } from "lucide-react"
import { PropsTable } from "@/components/Type"

export function EmployeeToolbar({ table, onAdd }: PropsTable) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2">
                <SearchInput
                    value={table.search}
                    onChange={table.setSearch}
                    placeholder="ຄົ້ນຫາ: ຊື່, ອີເມວ, ຕຳແໜ່ງ..."
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 shrink-0">
                            <ArrowUpDown className="size-4" />
                            ລຽງລຳດັບ
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => table.setSort("createdAt", "desc")}>ວັນທີ (ໃໝ່ສຸດ)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.setSort("createdAt", "asc")}>ວັນທີ (ເກົ່າສຸດ)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.setSort("employee_name", "asc")}>ຊື່ (A → Z)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => table.setSort("employee_name", "desc")}>ຊື່ (Z → A)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Button onClick={onAdd} className="gap-2 shrink-0 bg-gray-900 hover:bg-gray-700">
                <Plus className="size-4" />
                ເພີ່ມພະນັກງານ
            </Button>
        </div>
    )
}