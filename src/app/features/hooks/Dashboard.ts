"use client"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { dashboardApi } from "../api/Dashboard"

export const useGetDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: () => dashboardApi.getDashboard(),
        placeholderData: keepPreviousData,
    })
}
