'use client'
import { Customer } from "@/modules/customer/customer.type"

type Props = {
  customers: Customer[]
  selected?: Customer | null
  onSelect: (customer: Customer | undefined) => void
}

export default function CustomerSelect({ customers, selected, onSelect }: Props) {
  return (
    <select
      className="w-full border rounded-md px-3 py-2"
      value={selected?.customer_id || ""}
      onChange={(e) => {
        const value = e.target.value

        if (!value) {
          onSelect(null) // Walk-in customer
          return
        }

        const c = customers.find(
          (x) => String(x.customer_id) === value
        )

        onSelect(c || null)
      }}
    >
      <option value="">Walk-in Customer</option>

      {customers.map((c) => (
        <option key={c.customer_id} value={c.customer_id}>
          {c.customer_name}
        </option>
      ))}
    </select>
  )
}