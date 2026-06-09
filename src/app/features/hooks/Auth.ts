"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ForgotPasswordInput, VerifyOTPInput } from "@/modules/auth/auth.type"
import { AuthApi } from "../api/Auth"

export const useAuthMe = () => {
    const { data, isLoading } = Me()
    const user = data?.data ?? null
    return {
        user,
        isLoading,
        isAuthenticated: !!user,
    }
}



export const Me = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: AuthApi.Me,
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}

export const useEmployeeLogin = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: AuthApi.employeeLogin,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] })
        },
    })
}

export const useEmployeeForgotPassword = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordInput) => AuthApi.employeeForgotPassword(data),
    })
}

export const useEmployeeVerifyOtp = () => {
    return useMutation({
        mutationFn: (data: VerifyOTPInput) => AuthApi.employeeVerifyOtp(data),
    })
}

export const useEmployeeResendOTP = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordInput) => AuthApi.employeeResendOtp(data),
    })
}

export const useEmployeeResetPassword = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: AuthApi.employeeResetPassword,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] })
        }
    })
}




export const useEmployeeRegister = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: AuthApi.employeeRegister,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] })
        },
    })
}

export const useEmployeeLogout = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: AuthApi.employeeLogout,
        onSuccess: () => {
            qc.removeQueries({ queryKey: ["me"] })
            window.location.href = "/login"

        },
    })
}

export const useEmployeeRefresh = () => {
    return useMutation({
        mutationFn: AuthApi.employeeRefresh,
    })
}

