"use client";

import ReportFilter from "./ReportFilter";
import ExportButton from "@/components/ExportButton";

type Props = {
    title: string;
    
};

export default function ReportTemplate({ title }: Props) {
    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">
                    {title}
                </h1>

                <div className="flex gap-2">
                    <ExportButton
                        title="Export PDF"
                        onExport={() => { }}
                    />

                    <ExportButton
                        title="Export Excel"
                        onExport={() => { }}
                    />
                </div>
            </div>

            <ReportFilter />

            <div className="bg-white rounded-xl border p-4">

                <table className="w-full">

                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">
                                #
                            </th>

                            <th className="text-left p-2">
                                Name
                            </th>

                            <th className="text-left p-2">
                                Date
                            </th>

                            <th className="text-left p-2">
                                Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="p-2">1</td>
                            <td className="p-2">Example</td>
                            <td className="p-2">2026-06-03</td>
                            <td className="p-2">$100</td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>
    );
}