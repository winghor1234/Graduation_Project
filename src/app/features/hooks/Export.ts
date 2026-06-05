"use client"
import { useQuery } from "@tanstack/react-query";
import { exportReportApi } from "../api/Export";

export const useGetExportReport = (params?: {
    reportType?: string;
    period?: string;
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: [
            "report",
            params?.reportType,
            params?.period,
            params?.startDate,
            params?.endDate,
        ],

        queryFn: () => exportReportApi.getExportReport(params ?? {}),

        placeholderData: (prev) => prev,

        enabled: !!params?.reportType,
    });
};
