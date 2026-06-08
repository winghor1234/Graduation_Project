// "use client"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
// import { ArrowUpDown, Plus } from "lucide-react"
// import { PropsTable } from "../Type"



// export function ProductToolbar({ table, onAdd }: PropsTable) {
//     const setSort = (sort: string, order: "asc" | "desc") => {
//         table.setSort(sort)
//         table.setOrder(order)
//     }
//     return (
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex gap-2">
//                 <Input
//                     placeholder="Search products..."
//                     value={table.search}
//                     onChange={(e) => table.setSearch(e.target.value)}
//                     className="w-[250px]"
//                 />
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="outline" size="sm" className="gap-2">
//                             <ArrowUpDown className="w-4 h-4" />
//                             Sort
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                         <DropdownMenuItem
//                             onClick={() => setSort("created_at", "desc")}
//                         >
//                             Date (Newest)
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                             onClick={() => setSort("product_name", "asc")}
//                         >
//                             Name (A → Z)
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                             onClick={() => setSort("product_name", "desc")}
//                         >
//                             Name (Z → A)
//                         </DropdownMenuItem>

//                         <DropdownMenuItem
//                             onClick={() => setSort("price", "asc")}
//                         >
//                             Price (Low → High)
//                         </DropdownMenuItem>

//                         <DropdownMenuItem
//                             onClick={() => setSort("price", "desc")}
//                         >
//                             Price (High → Low)
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//             <Button onClick={onAdd} className="gap-2">
//                 <Plus className="w-4 h-4" />
//                 Add Product
//             </Button>
//         </div>
//     )
// }

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
    const setSort = (sort: string, order: "asc" | "desc") => {
        table.setSort(sort)
        table.setOrder(order)
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Search + Sort */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search products..."
                    value={table.search}
                    onChange={(e) => table.setSearch(e.target.value)}
                    className="w-60"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem onClick={() => setSort("created_at", "desc")}>
                            Date (Newest)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSort("product_name", "asc")}>
                            Name (A → Z)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort("product_name", "desc")}>
                            Name (Z → A)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSort("price", "asc")}>
                            Price (Low → High)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSort("price", "desc")}>
                            Price (High → Low)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Right: Add button */}
            <Button onClick={onAdd} size="sm" className="gap-1.5 shrink-0">
                <Plus className="h-4 w-4" />
                Add Product
            </Button>
        </div>
    )
}