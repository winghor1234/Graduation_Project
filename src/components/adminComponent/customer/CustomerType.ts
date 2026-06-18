// CustomerType.ts
import { Order, Sale } from "@prisma/client";

export type Customer = {
    customer_id: string;
    customer_name: string;
    phone: string;
    email: string;
    gender?: string | null;
    province?: string | null;
    point: number;
    isActive: boolean;
    createdAt: Date | string;
    orders: Order[];
    sales: Sale[];
};