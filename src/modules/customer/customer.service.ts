
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { CreateCustomerInput, UpdateCustomerInput } from "./customer.type"
import { BadRequestError, NotFoundError } from "@/utils/response"
import { hashPassword } from "@/utils/password"
import { generateAccessToken, generateRefreshToken } from "@/utils/cookie"

export const customerService = {

    async getCustomers(options?: Prisma.CustomerFindManyArgs) {
        const customers = await prisma.customer.findMany({
            ...options,
            include: {
                orders: true,
                sales: true
            }
        })
        return customers
    },

    async getCustomer(id: string) {

        const customer = await prisma.customer.findUnique({
            where: { customer_id: id },
            include: {
                orders: true,
                sales: true,
                points: true
            }
        })


        return customer

    },

    // async createCustomer(data: CreateCustomerInput) {
    //     const customer = await prisma.customer.create({
    //         data
    //     })
    //     return customer
    // },

    async createCustomer(data: CreateCustomerInput) {
        const existingUser = await prisma.customer.findFirst({
            where: { phone: data.phone }

        });

        if (existingUser) {
            throw new NotFoundError("User already exists")
        }
        const hashedPassword = await hashPassword(data.password);
        const user = await prisma.customer.create({
            data: {
                customer_name: data.customer_name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
                gender: data.gender ?? undefined,
                isActive: true

            }
        });

        const accessToken = generateAccessToken(user.customer_id, user.role);
        const refreshToken = generateRefreshToken(user.customer_id);
        const refreshTokenRecord = await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                customer: {
                    connect: {
                        customer_id: user.customer_id
                    }
                }
            }
        });
        if (!refreshTokenRecord) {
            throw new BadRequestError("Failed to create refresh token");
        }

        return {
            user,
            accessToken,
            refreshToken
        };

    },


    async updateCustomer(id: string, data: UpdateCustomerInput) {
        const customer = await prisma.customer.update({
            where: { customer_id: id },
            data
        })
        if (!customer) {
            throw new BadRequestError("Failed to update customer")
        }
        return customer
    },

    // async deleteCustomer(id: string) {
    //     const customer = await prisma.customer.findUnique({
    //         where: { customer_id: id }
    //     })

    //     if (!customer) {
    //         throw new NotFoundError("Customer not found")
    //     }

    //     // ❌ ถ้าปิดไปแล้ว
    //     if (!customer.isActive) {
    //         throw new BadRequestError("Customer already inactive")
    //     }

    //     // ✅ soft delete
    //     return prisma.customer.update({
    //         where: { customer_id: id },
    //         data: {
    //             isActive: false
    //         }
    //     })
    // },

    async updateCustomerStatus(id: string) {

        const customer = await prisma.customer.findUnique({
            where: { customer_id: id }
        });

        if (!customer) {
            throw new NotFoundError("Customer not found");
        }

        const updatedCustomer = await prisma.customer.update({
            where: { customer_id: id },
            data: {
                isActive: !customer.isActive
            }
        });

        return updatedCustomer;
    }

}