import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { UpdateEmployeeInput } from "./employee.type"
import { BadRequestError, NotFoundError } from "@/utils/response"

export const employeeService = {

    async getEmployees(options: Prisma.EmployeeFindManyArgs = {}) {
        const {
            where,
            skip = 0,
            take = 10,
            orderBy,
        } = options

        return prisma.employee.findMany({
            where,
            skip,
            take,

            orderBy:
                (orderBy as Prisma.EmployeeOrderByWithRelationInput) ?? {
                    createdAt: "desc",
                },

            include: {
                purchases: true,
                imports: true,
                sales: true,
            },
        })
    },

    async getEmployee(id: string) {

        const employee = await prisma.employee.findUnique({
            where: { employee_id: id },
            include: {
                purchases: true,
                imports: true,
                sales: true,
            }
        })
        return employee

    },


    async updateEmployee(id: string, data: UpdateEmployeeInput) {
        const employee = await prisma.employee.update({
            where: { employee_id: id },
            data
        })
        if (!employee) {
            throw new BadRequestError("Failed to update employee")
        }
        return employee
    },

    async deleteEmployee(id: string) {
        const employee = await prisma.employee.findUnique({
            where: { employee_id: id }
        })

        if (!employee) {
            throw new NotFoundError("Employee not found")
        }
        return prisma.employee.update({
            where: { employee_id: id },
            data: {
                is_active: false
            }
        })

    },

    async updateEmployeeStatus(id: string) {
        const employee = await prisma.employee.findUnique({
            where: { employee_id: id }
        });
        if (!employee) {
            throw new NotFoundError("Employee not found");
        }
        const updatedEmployee = await prisma.employee.update({
            where: { employee_id: id },
            data: {
                isActive: !employee.isActive
            }
        });
        return updatedEmployee;
    }

}