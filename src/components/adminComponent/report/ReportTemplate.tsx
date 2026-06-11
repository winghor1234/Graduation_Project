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
                        title="ສົ່ງອອກເປັນ PDF"
                        onExport={() => { }}
                    />

                    <ExportButton
                        title="ສົ່ງອອກເປັນ Excel"
                        onExport={() => { }}
                    />
                </div>
            </div>

            <ReportFilter />

            <div className="bg-white rounded-xl border p-4">

                <table className="w-full">

                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="text-left p-2">
                                ລຳດັບ
                            </th>

                            <th className="text-left p-2">
                                ຊື່ລາຍການ
                            </th>

                            <th className="text-left p-2">
                                ວັນທີ
                            </th>

                            <th className="text-left p-2">
                                ຈຳນວນເງິນ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="text-sm">
                            <td className="p-2">1</td>
                            <td className="p-2">ຕົວຢ່າງລາຍການ</td>
                            <td className="p-2">2026-06-03</td>
                            <td className="p-2">$100</td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>
    );
}