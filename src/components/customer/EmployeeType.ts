export type Role = "ADMIN" | "STAFF"

export type Emplyoee = {
    employee_id: string
    employee_name: string
    email: string
    phone: string
    gender?: string
    address?: string
    position?: string
    role: Role

    isActive: boolean
    lastLogin?: string

    failedLoginAttempts: number
    lockUntil?: string

    createdAt: string
    updatedAt: string
}
