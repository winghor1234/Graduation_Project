

// Customer 

export type Customers = {
    customer_id: string
    customer_name: string
    email: string
    phone: string
    gender?: string
    address?: string
    role: "CUSTOMER"
    isActive: boolean
    point: number
    lastLogin?: string

    createdAt: string
    updatedAt: string
}

export type CreateCustomerInput = {
    customer_name: string
    email: string
    phone: string
    password: string
    gender?: string

}

export type UpdateCustomerInput = {
    customer_name?: string
    email?: string
    phone?: string
    gender?: string
    address?: string
    isActive?: boolean
}





export interface PointsTransaction {
  id: string;
  date: string;
  type: "EARNED" | "REDEEMED";
  points: number;
  description: string;
  orderId?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  itemsCount: number;
}

export type Point = {
  id: string;
  point_amount: number;
  date: string;
}

export interface Customer {
  customer_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  gender: string;
  role: string;
  joinDate: string;
  lastOrderDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  isActive: boolean;
  points: Point[];
  orders: CustomerOrder[];
  pointsHistory: PointsTransaction[];
}
