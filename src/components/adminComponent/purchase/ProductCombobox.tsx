"use client"

import { useState } from "react"
import { Product } from "@/modules/product/product.types"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    products: Product[]
    value: string
    onChange: (value: string) => void
    onCreateNew: () => void
    placeholder?: string
}

export function ProductCombobox({ products, value, onChange, onCreateNew, placeholder = "ເລືອກສິນຄ້າ", }: Props) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const selected = products.find((p) => p.product_id === value)
    const filteredProducts = products.filter((p) => p.product_name.toLowerCase().includes(search.toLowerCase()))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selected ? selected.product_name : placeholder}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        placeholder="ຄົ້ນຫາສິນຄ້າ..."
                        value={search}
                        onValueChange={setSearch}
                    />

                    <CommandEmpty>
                        <div className="p-2 text-sm text-muted-foreground">
                            ບໍ່ພົບຂໍ້ມູນສິນຄ້າ
                        </div>
                    </CommandEmpty>

                    <CommandGroup>
                        {filteredProducts.map((product) => (
                            <CommandItem
                                key={product.product_id}
                                value={product.product_name}
                                onSelect={() => {
                                    onChange(product.product_id)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === product.product_id
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {product.product_name}
                            </CommandItem>
                        ))}
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-brand-blue-soft"
                            onClick={() => {
                                setOpen(false)
                                onCreateNew()
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            ເພີ່ມສິນຄ້າໃໝ່
                        </Button>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}