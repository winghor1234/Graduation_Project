import axiosInstance from "@/lib/axiosInstance"
import { LoginInput, RegisterInput } from "../types"
import { ForgotPasswordInput, ResetPasswordInput, VerifyOTPInput } from "@/modules/auth/auth.type"
import { isAxiosError } from "axios"

export const AuthApi = {
    // employee
    // employeeLogin: async (data: LoginInput) => {
    //     // console.log("login data : ",data)
    //     const res = await axiosInstance.post("auth/employee/login", data)
    //     return res.data
    // },

    login: async (data: LoginInput) => {
        const res = await axiosInstance.post("/auth/login", data)
        return res.data
    },

    employeeForgotPassword: async (data: ForgotPasswordInput) => {
        const res = await axiosInstance.post("/auth/employee/forgot-password", data)
        return res.data
    },

    employeeResetPassword: async (data: ResetPasswordInput) => {
        const res = await axiosInstance.post("/auth/employee/reset-password", data)
        return res.data
    },

    employeeVerifyOtp: async (data: VerifyOTPInput) => {
        const res = await axiosInstance.post("/auth/employee/verify-otp", data)
        return res.data
    },

    employeeResendOtp: async (data: ForgotPasswordInput) => {
        const res = await axiosInstance.post("/auth/employee/resend-otp", data)
        return res.data
    },

    employeeRegister: async (data: RegisterInput) => {
        const res = await axiosInstance.post("/auth/employee/register", data)
        return res.data
    },

    employeeLogout: async () => {
        await axiosInstance.post("/auth/employee/logout")
    },

    employeeRefresh: async () => {
        const res = await axiosInstance.post("/auth/refresh")
        return res.data
    },


    // employeeMe: async () => {
    //     try {
    //         const res = await axiosInstance.get("/auth/me")
    //         return res.data
    //     } catch (err: unknown) {
    //         if (isAxiosError(err)) {
    //             if (err.response?.status === 401) {
    //                 return null
    //             }
    //         }
    //         throw err
    //     }
    // },

    // customer
    customerLogin: async (data: LoginInput) => {
        const res = await axiosInstance.post("/auth/customer/login", data)
        return res.data
    },
    customerRegister: async (data: RegisterInput) => {
        const res = await axiosInstance.post("/auth/customer/register", data)
        return res.data
    },
    customerLogout: async () => {
        await axiosInstance.post("/auth/customer/logout")
    },
    customerRefresh: async () => {
        const res = await axiosInstance.post("/auth/refresh")
        return res.data
    },
    // customerMe: async () => {
    //     try {
    //         const res = await axiosInstance.get("/auth/me")
    //         return res.data
    //     } catch (err: unknown) {
    //         if (isAxiosError(err)) {
    //             if (err.response?.status === 401) {
    //                 return null
    //             }
    //         }
    //         throw err
    //     }
    // },

    customerForgotPassword: async (data: ForgotPasswordInput) => {
        const res = await axiosInstance.post("/auth/customer/forgot-password", data)
        return res.data
    },

    customerVerifyOtp: async (data: VerifyOTPInput) => {
        const res = await axiosInstance.post("/auth/customer/verify-otp", data)
        return res.data
    },

    customerResendOtp: async (data: ForgotPasswordInput) => {
        const res = await axiosInstance.post("/auth/customer/resend-otp", data)
        return res.data
    },

    customerResetPassword: async (data: ResetPasswordInput) => {
        const res = await axiosInstance.post("/auth/customer/reset-password", data)
        return res.data
    },

// me
    Me: async () => {
        try {
            const res = await axiosInstance.get("/auth/me")
            return res.data
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                // 401 = no access token
                // 400 = interceptor tried /auth/refresh but got "Refresh token missing"
                // Both mean user is not authenticated → return null, don't throw
                const status = err.response?.status
                if (status === 401 || status === 400 || status === 403) {
                    return null
                }
            }
            throw err
        }
    },

}



