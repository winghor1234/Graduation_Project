"use client"

import { Button } from "@/components/ui/button"
import { Plus, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PropsTable } from "../../Type"
import { SearchInput } from "@/components/SearchInput"



export function ImportToolbar({ table, onAdd }: PropsTable) {
    return (
        <div className="flex justify-between gap-4">
            <div className="flex gap-2">

                <SearchInput
                    value={table.search}
                    onChange={table.setSearch}
                    placeholder="ຄົ້ນຫາໃບບິນສັ່ງຊື້: ລະຫັດນຳເຂົ້າ , ຜູ້ສະໜອງ..."
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
                            onClick={() => table.setSort("import_date", "desc")}
                        >
                            ວັນທີ (ໃໝ່ສຸດ)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("import_date", "asc")}
                        >
                            ວັນທີ (ເກົ່າສຸດ)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("import_id", "asc")}
                        >
                            ລະຫັດນຳເຂົ້າ (A → Z)
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.setSort("import_id", "desc")}
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