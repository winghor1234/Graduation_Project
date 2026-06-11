"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PropsTable } from "../../Type"



export function ImportToolbar({ table, onAdd }: PropsTable) {

    const setSort = (field: string, order: "asc" | "desc") => {
        table.setSort(field)
        table.setOrder(order)
    }

    return (
        <div className="flex justify-between gap-4">
            <div className="flex gap-2">
                <Input
                    placeholder="ຄົ້ນຫາຜູ້ສະໜອງ..."
                    value={table.search}
                    onChange={(e) => table.setSearch(e.target.value)}
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ArrowUpDown className="w-4 h-4 mr-1" />
                            ລຽງລຳດັບ
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSort("createdAt", "desc")}>
                            ໃໝ່ສຸດ
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-1" />
                ເພີ່ມການນຳເຂົ້າ
            </Button>
        </div>
    )
}