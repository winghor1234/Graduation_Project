// "use client";

// import * as React from "react";
// import { Check, ChevronsUpDown } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";

// export type ComboboxOption = {
//     value: string;
//     label: string;
//     description?: string;
// };

// type ComboboxProps = {
//     value?: string;
//     options: ComboboxOption[];
//     placeholder?: string;
//     searchPlaceholder?: string;
//     emptyMessage?: string;
//     disabled?: boolean;
//     className?: string;
//     onChange: (value: string) => void;
// };

// export function Combobox({
//     value,
//     options,
//     placeholder = "ເລືອກຂໍ້ມູນ...",
//     searchPlaceholder = "ຄົ້ນຫາ...",
//     emptyMessage = "ບໍ່ພົບຂໍ້ມູນ",
//     disabled,
//     className,
//     onChange,
// }: ComboboxProps) {
//     const [open, setOpen] = React.useState(false);

//     const selected = options.find(
//         (option) => option.value === value
//     );

//     return (
//         <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//                 <Button
//                     type="button"
//                     variant="outline"
//                     role="combobox"
//                     disabled={disabled}
//                     aria-expanded={open}
//                     className={cn(
//                         "w-full justify-between font-normal",
//                         !selected && "text-muted-foreground",
//                         className
//                     )}
//                 >
//                     {selected?.label ?? placeholder}

//                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//             </PopoverTrigger>

//             <PopoverContent
//                 className="w-[var(--radix-popover-trigger-width)] p-0"
//                 align="start"
//             >
//                 <Command>
//                     <CommandInput
//                         placeholder={searchPlaceholder}
//                     />

//                     <CommandList>
//                         <CommandEmpty>
//                             {emptyMessage}
//                         </CommandEmpty>

//                         <CommandGroup>
//                             {options.map((option) => (
//                                 <CommandItem
//                                     key={option.value}
//                                     value={`${option.label} ${option.description ?? ""}`}
//                                     onSelect={() => {
//                                         onChange(option.value);
//                                         setOpen(false);
//                                     }}
//                                 >
//                                     <Check
//                                         className={cn(
//                                             "mr-2 h-4 w-4",
//                                             value === option.value
//                                                 ? "opacity-100"
//                                                 : "opacity-0"
//                                         )}
//                                     />

//                                     <div className="flex flex-col">
//                                         <span>
//                                             {option.label}
//                                         </span>

//                                         {option.description && (
//                                             <span className="text-xs text-muted-foreground">
//                                                 {option.description}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// }


"use client";

import Select from "react-select";

export type SearchSelectOption = {
    value: string;
    label: string;
};

type SearchSelectProps = {
    value?: string;
    options: SearchSelectOption[];
    placeholder?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    onChange: (value: string) => void;
};

export default function SearchSelect({
    value,
    options,
    placeholder = "ເລືອກຂໍ້ມູນ...",
    isLoading,
    isDisabled,
    onChange,
}: SearchSelectProps) {

    const selectedOption =
        options.find((option) => option.value === value) || null;

    return (
        <Select
            options={options}
            value={selectedOption}
            placeholder={placeholder}
            isSearchable
            isLoading={isLoading}
            isDisabled={isDisabled}
            noOptionsMessage={() => "ບໍ່ພົບຂໍ້ມູນ"}
            loadingMessage={() => "ກຳລັງໂຫຼດ..."}
            onChange={(option) => {
                if (option) {
                    onChange(option.value);
                }
            }}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
                control: (base, state) => ({
                    ...base,
                    minHeight: 40,
                    borderRadius: 8,
                    borderColor: state.isFocused
                        ? "#3b82f6"
                        : base.borderColor,
                    boxShadow: "none",
                }),
                menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                }),
            }}
        />
    );
}