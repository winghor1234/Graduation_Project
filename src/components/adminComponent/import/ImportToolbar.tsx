"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpDown, Search, X } from "lucide-react"
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

                <div className="relative w-[350px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="ຄົ້ນຫາໃບບິນສັ່ງຊື້: ລະຫັດນຳເຂົ້າ , ຜູ້ສະໜອງ..."
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
                            onClick={() => setSort("import_date", "desc")}
                        >
                            ວັນທີ (ໃໝ່ສຸດ)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("import_date", "asc")}
                        >
                            ວັນທີ (ເກົ່າສຸດ)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("import_id", "asc")}
                        >
                            ລະຫັດນຳເຂົ້າ (A → Z)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setSort("import_id", "desc")}
                        >
                            ລະຫັດນຳເຂົ້າ (Z → A)
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