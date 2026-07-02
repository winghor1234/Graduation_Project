"use client";
import { useQuery } from "@tanstack/react-query";
import { financialApi } from "../api/Financial";

export const useGetFinancialReport = (params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: ["financial", params?.period, params?.startDate, params?.endDate],
        queryFn: () => financialApi.getFinancialReport(params),
        placeholderData: (prev) => prev,
    });
};
