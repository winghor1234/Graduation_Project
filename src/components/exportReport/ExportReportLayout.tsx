'use client';

import ExportButton from "@/components/ExportButton";

export type PeriodType =
    | "WEEK"
    | "MONTH"
    | "YEAR"
    | "CUSTOM";

type Props = {
    title: string;
    description: string;

    total: number;
    loading: boolean;

    search: string;
    setSearch: (value: string) => void;

    period: PeriodType;
    setPeriod: (value: PeriodType) => void;

    startDate?: string;
    endDate?: string;

    setStartDate: (value: string) => void;
    setEndDate: (value: string) => void;

    onPdf: () => void;
    onExcel: () => void;

    children: React.ReactNode;
};

export default function ReportLayout({
    title,
    description,

    total,
    loading,

    search,
    setSearch,

    period,
    setPeriod,

    startDate,
    endDate,

    setStartDate,
    setEndDate,

    onPdf,
    onExcel,

    children,
}: Props) {
    return (
        <div className="p-6 bg-[#f5f7fb] min-h-screen">

            <div className="flex justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        {title}
                    </h1>

                    <p className="text-gray-500">
                        {description}
                    </p>
                </div>

                <div className="flex gap-2">

                    <ExportButton
                        title="Export PDF"
                        loading={loading}
                        onExport={onPdf}
                    />

                    <ExportButton
                        title="Export Excel"
                        loading={loading}
                        onExport={onExcel}
                    />

                </div>

            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
                Total Records : {total}
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">

                <div className="grid md:grid-cols-2 gap-4">

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search..."
                        className="border rounded-lg px-3 py-2"
                    />

                    <select
                        value={period}
                        onChange={(e) =>
                            setPeriod(
                                e.target.value as PeriodType
                            )
                        }
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="WEEK">Week</option>
                        <option value="MONTH">Month</option>
                        <option value="YEAR">Year</option>
                        <option value="CUSTOM">Custom</option>
                    </select>

                </div>

                {period === "CUSTOM" && (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">

                        <input
                            type="date"
                            value={startDate ?? ""}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            className="border rounded-lg px-3 py-2"
                        />

                        <input
                            type="date"
                            value={endDate ?? ""}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            className="border rounded-lg px-3 py-2"
                        />

                    </div>
                )}

            </div>

            {children}

        </div>
    );
}