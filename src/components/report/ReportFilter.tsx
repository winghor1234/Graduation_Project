"use client";

import { useState } from "react";

export default function ReportFilter() {
    const [filter, setFilter] = useState("WEEK");

    return (
        <div className="bg-white rounded-xl border p-4 mb-4">
            <div className="grid md:grid-cols-3 gap-4">

                <select
                    className="border rounded p-2"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="WEEK">
                        Weekly
                    </option>

                    <option value="MONTH">
                        Monthly
                    </option>

                    <option value="YEAR">
                        Yearly
                    </option>

                    <option value="CUSTOM">
                        Custom Range
                    </option>
                </select>

                {filter === "CUSTOM" && (
                    <>
                        <input
                            type="date"
                            className="border rounded p-2"
                        />

                        <input
                            type="date"
                            className="border rounded p-2"
                        />
                    </>
                )}
            </div>
        </div>
    );
}