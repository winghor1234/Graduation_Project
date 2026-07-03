// auth 
export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
  customer_name: string
}

export type CurrentUser = {
  id: string
  role: "ADMIN" | "STAFF" | "CUSTOMER"
}


export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  points: number
  totalOrders: number
  totalSpent: number
  joinedAt: string
  status: "active" | "inactive"
}


export type UseGetParams = {
    page?: number
    limit?: number
    search?: string
    orderBy?: string
    order?: "asc" | "desc"
    status?: string
}









