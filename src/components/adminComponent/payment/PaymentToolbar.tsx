// "use client"

// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { ArrowUpDown, Filter } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { PropsTable } from "@/components/Type"


// export function PaymentToolbar({ table }: PropsTable) {

//     return (
//         <div className="flex justify-between gap-4">

//             {/* 🔍 Search */}
//             <div className="flex gap-2">
//                 <Input
//                     placeholder="ຄົ້ນຫາອໍເດີ້..."
//                     value={table.search}
//                     onChange={(e) => table.setSearch(e.target.value)}
//                     className="w-[250px]"
//                 />

//                 {/* 🔽 Filter Status */}
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="outline" size="sm">
//                             <Filter className="w-4 h-4 mr-1" />
//                             ສະຖານະ
//                         </Button>
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent>
//                         <DropdownMenuItem onClick={() => table.setSort("")}>
//                             ທັງໝົດ
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => table.setSort("PENDING")}>
//                             ລໍຖ້າກວດສອບ
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => table.setSort("VERIFIED")}>
//                             ກວດສອບແລ້ວ
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => table.setSort("REJECTED")}>
//                             ປະຕິເສດແລ້ວ
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>

//                 {/* 🔽 Sort */}
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="outline" size="sm">
//                             <ArrowUpDown className="w-4 h-4 mr-1" />
//                             ລຽງລຳດັບ
//                         </Button>
//                     </DropdownMenuTrigger>

//                     <DropdownMenuContent>
//                         <DropdownMenuItem onClick={() => setSort("payment_date", "desc")}>
//                             ໃໝ່ສຸດ
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => setSort("payment_date", "asc")}>
//                             ເກົ່າສຸດ
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => setSort("amount", "desc")}>
//                             ຈຳນວນເງິນ (ສູງ → ຕ່ຳ)
//                         </DropdownMenuItem>
//                         <DropdownMenuItem onClick={() => setSort("amount", "asc")}>
//                             ຈຳນວນເງິນ (ຕ່ຳ → ສູງ)
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>

//             </div>

//         </div>
//     )
// }