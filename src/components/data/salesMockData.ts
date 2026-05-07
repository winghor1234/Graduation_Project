import { InventoryGraphData, RevenueGraphData, SalesGraphData, ViewMode } from "../Type"

export const salesData: Record<ViewMode, SalesGraphData> = {
    W: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        unitsSold: [22, 35, 28, 40, 55, 70, 45],
        revenue: [18, 28, 22, 35, 48, 62, 38],
        cost: [10, 15, 12, 18, 22, 28, 17],
        profit: [8, 13, 10, 17, 26, 34, 21],
        expenses: [15, 22, 18, 28, 38, 50, 30],
        revenueBars: [18, 28, 22, 35, 48, 62, 38],
    },
    M: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        unitsSold: [88, 115, 155, 160, 95, 55, 130, 205, 155, 90, 125, 175],
        revenue: [75, 95, 105, 95, 70, 60, 85, 120, 100, 80, 105, 140],
        cost: [35, 42, 50, 48, 38, 32, 40, 55, 45, 38, 43, 60],
        profit: [30, 40, 45, 42, 32, 28, 35, 52, 40, 32, 42, 55],
        expenses: [60, 75, 90, 85, 65, 55, 70, 95, 78, 65, 75, 95],
        revenueBars: [75, 95, 105, 95, 70, 60, 85, 120, 100, 80, 105, 140],
    },
    Y: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        unitsSold: [820, 640, 950, 1100, 1350, 1600],
        revenue: [700, 520, 810, 950, 1150, 1400],
        cost: [320, 260, 380, 430, 520, 610],
        profit: [280, 190, 340, 420, 530, 680],
        expenses: [550, 420, 640, 750, 900, 1100],
        revenueBars: [700, 520, 810, 950, 1150, 1400],
    },
}

export const revenueData: Record<ViewMode, RevenueGraphData> = {
    W: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        grossRevenue: [25, 38, 30, 45, 60, 75, 50],
        netRevenue: [20, 30, 24, 37, 50, 63, 42],
        refunds: [3, 5, 4, 5, 6, 7, 5],
        tax: [2, 3, 2, 3, 4, 5, 3],
    },
    M: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        grossRevenue: [90, 110, 125, 115, 85, 75, 100, 140, 120, 95, 125, 160],
        netRevenue: [75, 92, 105, 97, 70, 63, 85, 118, 100, 80, 105, 135],
        refunds: [8, 10, 12, 10, 8, 7, 9, 13, 11, 9, 11, 15],
        tax: [7, 8, 8, 8, 7, 5, 6, 9, 9, 6, 9, 10],
    },
    Y: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        grossRevenue: [850, 680, 980, 1150, 1400, 1700],
        netRevenue: [710, 560, 820, 960, 1170, 1430],
        refunds: [85, 70, 95, 110, 130, 160],
        tax: [55, 50, 65, 80, 100, 110],
    },
}

export const inventoryData: Record<ViewMode, InventoryGraphData> = {
    W: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        inStock: [320, 310, 295, 280, 260, 245, 230],
        lowStock: [45, 48, 52, 55, 60, 63, 68],
        outOfStock: [8, 9, 10, 12, 13, 15, 17],
        received: [50, 20, 0, 80, 0, 0, 60],
    },
    M: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        inStock: [400, 380, 420, 390, 360, 340, 370, 410, 390, 355, 380, 430],
        lowStock: [45, 50, 42, 55, 60, 65, 58, 48, 52, 62, 55, 40],
        outOfStock: [8, 10, 6, 12, 15, 18, 14, 9, 11, 16, 13, 7],
        received: [200, 150, 300, 180, 120, 250, 210, 280, 160, 190, 220, 350],
    },
    Y: {
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        inStock: [3200, 2800, 3600, 4100, 4500, 5200],
        lowStock: [420, 380, 450, 510, 580, 640],
        outOfStock: [85, 110, 75, 90, 95, 80],
        received: [1800, 1400, 2200, 2600, 3000, 3500],
    },
}