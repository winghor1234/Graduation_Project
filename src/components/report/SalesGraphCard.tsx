"use client"

import { useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler, type ChartOptions, type ChartData } from 'chart.js';
import { ActiveTab, ViewMode } from "../Type"
import { inventoryData, revenueData, salesData } from "../data/salesMockData"
import ChartTabBar from "./chart/ChartTabBar"
import ChartViewToggle from "./chart/ChartViewToggle"
import ChartSummaryBar from "./chart/ChartSummaryBar"
import SalesChart from "./chart/SalesChart"
import InventoryChart from "./chart/InventoryChart"
import RevenueChart from "./chart/RevenueChart"


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler)

function getSalesSummary(view: ViewMode) {
    const d = salesData[view]
    const total = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
    return [
        { label: "Units Sold", value: `${total(d.unitsSold)}K`, color: "#22c55e" },
        { label: "Revenue", value: `$${total(d.revenue)}K`, color: "#60a5fa" },
        { label: "Cost", value: `$${total(d.cost)}K`, color: "#f87171" },
        { label: "Profit", value: `$${total(d.profit)}K`, color: "#fbbf24" },
    ]
}

function getRevenueSummary(view: ViewMode) {
    const d = revenueData[view]
    const total = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
    return [
        { label: "Gross Revenue", value: `$${total(d.grossRevenue)}K`, color: "#3b82f6" },
        { label: "Net Revenue", value: `$${total(d.netRevenue)}K`, color: "#22c55e" },
        { label: "Refunds", value: `$${total(d.refunds)}K`, color: "#f87171" },
        { label: "Tax", value: `$${total(d.tax)}K`, color: "#fbbf24" },
    ]
}

function getInventorySummary(view: ViewMode) {
    const d = inventoryData[view]
    const last = (arr: number[]) => arr[arr.length - 1]
    return [
        { label: "In Stock", value: `${last(d.inStock)}`, color: "#3b82f6" },
        { label: "Low Stock", value: `${last(d.lowStock)}`, color: "#fbbf24" },
        { label: "Out of Stock", value: `${last(d.outOfStock)}`, color: "#f87171" },
        { label: "Received", value: `+${d.received.reduce((a, b) => a + b, 0)}`, color: "#22c55e" },
    ]
}
type Props = {
    data: any
}
export default function SalesGraphCard(data: Props) {

    const [tab, setTab] = useState<ActiveTab>("Sales")
    const [view, setView] = useState<ViewMode>("M")
    
    const summaryItems =
    tab === "Sales" ? getSalesSummary(view) :
    tab === "Revenue" ? getRevenueSummary(view) :
    getInventorySummary(view)
    
    
    // console.log("tab:", tab, "view:", view)
    // console.log("summaryItems:", summaryItems)
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm w-full min-w-0">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-800">Sales Graph</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Performance overview by period</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap ">
                    <ChartTabBar tab={tab} onChange={setTab} />
                    <ChartViewToggle view={view} onChange={setView} />
                </div>
            </div>

            {/* Summary numbers */}
            <ChartSummaryBar items={summaryItems} />

            {/* Charts */}
            {tab === "Sales" && <SalesChart key={`sales-${view}`} data={salesData[view]} />}
            {tab === "Revenue" && <RevenueChart key={`revenue-${view}`} data={revenueData[view]} />}
            {tab === "Inventory" && <InventoryChart key={`inventory-${view}`} data={inventoryData[view]} />}
        </div>
    )
}