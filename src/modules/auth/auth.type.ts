

export type CustomerRegisterInput = {
    customer_name: string
    email: string
    password: string
    phone: string
    gender?: string
}
export type  CustomerUpdateInput = {
    customer_name?: string
    email?: string
    phone?: string
    gender?: string
    address?: string
}


export type EmployeeRegisterInput = {
    employee_name: string
    email: string
    password: string
    phone: string
}

export type AuthUser = {
    user_id: string
    role: "ADMIN" | "STAFF" | "CUSTOMER"
}

export type JwtPayload = {
    user_id: string
    role: string
}

export type ForgotPasswordInput = {
    email: string
}

export type VerifyOTPInput = {
    email: string
    otp: string
}

export type ResetPasswordInput = {
    email: string
    password: string
}

export type ResendOTPInput = {
    email: string
}


export type LoginDto = {
    email: string;
    password: string;
};




