"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table } from "../../Type"

type Props = {
    table: Table
}



export function OrderToolbar({ table }: Props) {

    const setSort = (field: string, order: "asc" | "desc") => {
        table.setSort(field)
        table.setOrder(order)
    }

    return (
        <div className="flex justify-between gap-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Search supplier..."
                    value={table.search}
                    onChange={(e) => table.setSearch(e.target.value)}
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ArrowUpDown className="w-4 h-4 mr-1" />
                            Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSort("createdAt", "desc")}>
                            Newest
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}