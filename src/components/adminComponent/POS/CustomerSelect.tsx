'use client'
import { Input } from "@/components/ui/input"
import { Customer } from "@/modules/customer/customer.type"

type Props = {
  customers: Customer[]
  selected?: Customer | null
  onSelect: (customer: Customer | null) => void // ປັບໃຫ້ກົງກັບການໃຊ້ງານ (null)
}

export default function CustomerSelect({ customers, selected, onSelect }: Props) {
  return (
    // <select
    //   className="w-full border rounded-md px-3 py-2"
    //   value={selected?.customer_id || ""}
    //   onChange={(e) => {
    //     const value = e.target.value

    //     if (!value) {
    //       onSelect(null) // ລູກຄ້າທົ່ວໄປ (Walk-in)
    //       return
    //     }

    //     const c = customers.find(
    //       (x) => String(x.customer_id) === value
    //     )

    //     onSelect(c || null)
    //   }}
    // >
    //   <option value="">ລູກຄ້າທົ່ວໄປ (Walk-in Customer)</option>

    //   {customers.map((c) => (
    //     <option key={c.customer_id} value={c.customer_id}>
    //       {c.customer_name}
    //     </option>
    //   ))}
    // </select>
    <Input
      placeholder="ຄົ້ນຫາປະເພດສິນຄ້າ..."
      value={table.search}
      onChange={(e) => table.setSearch(e.target.value)}
      className="w-60"
    />
  )
}