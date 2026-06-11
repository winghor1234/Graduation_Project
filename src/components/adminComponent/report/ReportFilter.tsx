"use client";

import { useState } from "react";

export default function ReportFilter() {
    const [filter, setFilter] = useState("WEEK");

    return (
        <div className="bg-white rounded-xl border p-4 mb-4">
            <div className="grid md:grid-cols-3 gap-4">

                <select
                    className="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="WEEK">
                        ລາຍອາທິດ (Weekly)
                    </option>

                    <option value="MONTH">
                        |ລາຍເດືອນ (Monthly)
                    </option>

                    <option value="YEAR">
                        ລາຍປີ (Yearly)
                    </option>

                    <option value="CUSTOM">
                        ກຳນົດເອງ (Custom Range)
                    </option>
                </select>

                {filter === "CUSTOM" && (
                    <>
                        <input
                            type="date"
                            className="border rounded p-2 text-sm"
                        />

                        <input
                            type="date"
                            className="border rounded p-2 text-sm"
                        />
                    </>
                )}
            </div>
        </div>
    );
}