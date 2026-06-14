"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Customer } from "@/modules/customer/customer.type"

type Props = {
  customers: Customer[]
  selected: Customer | null
  onSelect: (customer: Customer | null) => void
}

export function CustomerSelect({
  customers,
  selected,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selected
            ? selected.customer_name
            : "ເລືອກລູກຄ້າ"}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="ຄົ້ນຫາລູກຄ້າ..." />

          <CommandEmpty>
            ບໍ່ພົບຂໍ້ມູນລູກຄ້າ
          </CommandEmpty>

          <CommandGroup>
            <CommandItem
              value="walkin"
              onSelect={() => {
                onSelect(null)
                setOpen(false)
              }}
            >
              ເລືອກລູກຄ້າ
            </CommandItem>

            {customers.map((customer) => (
              <CommandItem
                key={customer.customer_id}
                value={`${customer.customer_name} ${customer.phone} ${customer.email}`}
                onSelect={() => {
                  onSelect(customer)
                  setOpen(false)
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    selected?.customer_id === customer.customer_id
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />

                <div className="flex flex-col">
                  <span>{customer.customer_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {customer.phone}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}