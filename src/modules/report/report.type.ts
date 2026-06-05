export type RevenueSummary = {
    revenue: number
    cost: number
    profit: number
}


export type MonthlyRevenue = {
  month: string
  revenue: number
}

export type MonthlyRevenueRaw = {
  month: Date
  revenue: number
}

export enum ReportType {
    PRODUCT = "PRODUCT",
    PURCHASE = "PURCHASE",
    IMPORT = "IMPORT",
    CUSTOMER = "CUSTOMER",
    SALE = "SALE",
    REVENUE = "REVENUE",
    PROFIT = "PROFIT",
    ORDER = "ORDER"
}

export enum ReportPeriod {
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
}

export class ReportQueryDto {
    reportType?: ReportType;
    period?: ReportPeriod;
    startDate?: string;
    endDate?: string;
}





