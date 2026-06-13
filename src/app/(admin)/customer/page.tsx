"use client"
import { useState } from "react"
import { useGetCustomers, useCreateCustomer, useUpdateCustomerStatus, useUpdateCustomer } from "@/app/features/hooks/Customer"
import { useDataTable } from "@/hooks/useDataTable"
import { Customer } from "@/modules/customer/customer.type"
import { CustomerToolbar } from "@/components/adminComponent/customer/CustomerToolbar"
import { CustomerTable } from "@/components/adminComponent/customer/CustomerTable"
import { AppPagination } from "@/components/AppPagination"
import { CustomerFormDialog } from "@/components/adminComponent/customer/CustomerFormDialog"
export default function CustomerPage() {
    const table = useDataTable()

    const { data, isLoading } = useGetCustomers(table.params);
    const createCustomer = useCreateCustomer()
    // const updateCustomerStatus = useUpdateCustomerStatus()
    const updateCustomer = useUpdateCustomer()
    const [selectedCustomers, setSelectedCustomers] = useState<Customer | undefined>()
    const [openForm, setOpenForm] = useState(false)
    const updateStatus = useUpdateCustomerStatus()
    const customers = data?.data ?? []


    const handleEdit = (customer: Customer) => {
        setSelectedCustomers(customer)
        setOpenForm(true)
    }

    const handleChangeStatus = (id: string) => {
        updateStatus.mutate(id)
    }

    // const exportCSV = () => {
    //     if (!customers.length) return
    //     const rows = customers.map(c => ({
    //         Name: c.customer_name,
    //         Email: c.email,
    //         Phone: c.phone,
    //         Points: c.points?.map((p) => p.point_amount).reduce((a, b) => a + b, 0)
    //     }))
    //     const csv = [
    //         Object.keys(rows[0]).join(","),
    //         ...rows.map(r => Object.values(r).join(","))
    //     ].join("\n")
    //     const blob = new Blob([csv], { type: "text/csv" })
    //     const url = URL.createObjectURL(blob)
    //     const a = document.createElement("a")
    //     a.href = url
    //     a.download = "customers.csv"
    //     a.click()
    // }

    return (
        <div className="space-y-4">
            {/* Header */}
            <CustomerToolbar table={table} onAdd={() => setOpenForm(true)} />
            {/* Table */}
            <CustomerTable
                customers={customers}
                isLoading={isLoading}
                onEdit={handleEdit}
                onChange={handleChangeStatus}
            />

            <AppPagination
                page={table.params.page}
                totalPages={data?.meta?.totalPages ?? 0}
                onPageChange={table.setPage}
            />

            <CustomerFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                create={createCustomer}
                update={updateCustomer}
                customer={selectedCustomers}
            />  
        </div>
    )
}