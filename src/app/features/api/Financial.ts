import axiosInstance from "@/lib/axiosInstance";

export type MonthlyFinancial = {
    month: string;
    revenue: number;
    cost: number;
    profit: number;
    saleCount: number;
};

export type FinancialSummary = {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
    saleCount: number;
    purchaseCount: number;
    monthCount: number;
    avgMonthlyRevenue: number;
    avgMonthlyCost: number;
};

export type FinancialReport = {
    summary: FinancialSummary;
    monthly: MonthlyFinancial[];
};

export const financialApi = {
    getFinancialReport: async (params?: {
        period?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{ data: FinancialReport }> => {
        const res = await axiosInstance.get("/financial", { params });
        return res.data;
    },
};
