import { useMonthlyRevenueReport, useRevenueSummaryReport } from "@/app/features/hooks"

export function UseDashboard() {
    const { data: summary, isLoading: loading1 } = useRevenueSummaryReport()
    const { data: monthly, isLoading: loading2 } = useMonthlyRevenueReport()

    return {
        summary: summary || null,
        monthly: monthly || [],
        loading: loading1 || loading2,
        error: null
    }
}