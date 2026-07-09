"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { toast } from "sonner"

import { useGetEmployees, useCreateEmployee, useUpdateEmployee, useUpdateEmployeeStatus } from "@/app/features/hooks/Employee"
import { useDataTable } from "@/hooks/useDataTable"
import { Employee } from "@/modules/employee/employee.type"
import { EmployeeToolbar } from "@/components/adminComponent/employee/EmployeeToolbar"
import { EmployeeTable } from "@/components/adminComponent/employee/EmployeeTable"
import { EmployeeFormDialog } from "@/components/adminComponent/employee/EmployeeFormDialog"
import { AppPagination } from "@/components/AppPagination"

export default function EmployeePage() {
    const table = useDataTable()

    const { data, isLoading } = useGetEmployees(table.params)
    const create = useCreateEmployee()
    const update = useUpdateEmployee()
    const toggleStatus = useUpdateEmployeeStatus()

    const [openForm, setOpenForm] = useState(false)
    const [selected, setSelected] = useState<Employee | undefined>()

    const employees = data?.data ?? []
    const meta = data?.meta

    const handleEdit = (emp: Employee) => {
        setSelected(emp)
        setOpenForm(true)
    }

    const handleAdd = () => {
        setSelected(undefined)
        setOpenForm(true)
    }

    const handleToggleStatus = (id: string) => {
        toggleStatus.mutate(id, {
            onSuccess: () => toast.success("ອັບເດດສະຖານະສຳເລັດ"),
            onError: () => toast.error("ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່"),
        })
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gray-900 flex items-center justify-center">
                        <Users className="size-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">ຈັດການພະນັກງານ</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            ທັງໝົດ {meta?.total ?? employees.length} ຄົນ
                        </p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <EmployeeToolbar table={table} onAdd={handleAdd} />

            {/* Table */}
            <EmployeeTable
                employees={employees}
                isLoading={isLoading}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
            />

            {/* Pagination */}
            <AppPagination
                page={table.params.page}
                totalPages={meta?.totalPages ?? 0}
                onPageChange={table.setPage}
            />

            {/* Dialog */}
            <EmployeeFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                employee={selected}
                create={create}
                update={update}
            />
        </div>
    )
}