"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

interface Props {
    table: any
}

export function SortDropdown({ table }: Props) {
    return (
        <DropdownMenu>

            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    ລຽງລຳດັບ
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

                <DropdownMenuItem
                    onClick={() => {
                        table.setSort("createdAt")
                    }}
                >
                    ວັນທີ (ໃໝ່ສຸດ)
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        table.setSort("product_name")
                    }}
                >
                    ຊື່ສິນຄ້າ (ກ → ຮ)
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        table.setSort("product_name")
                        table.setOrder("desc")
                    }}
                >
                    ຊື່ສິນຄ້າ (ຮ → ກ)
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    )
}