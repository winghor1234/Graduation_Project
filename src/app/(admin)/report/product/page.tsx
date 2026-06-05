'use client';

import { useMemo, useState } from 'react';
import ExportButton from '@/components/ExportButton';
import { Package } from 'lucide-react';
import { handleProductExcelExport, handleProductPDFExport } from '@/components/report/ExportToReport';
import { useGetReport } from '@/app/features/hooks';

export default function ProductReportPage() {
    const { data, isLoading } = useGetReport({
        reportType: "SALES",
        period: "MONTHLY",
    });
    const products = data?.data?.products || [];

    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('MONTH');

    const filteredProducts = useMemo(() => {
        return products.filter((item: any) => {
            const keyword = search.toLowerCase();

            return (
                item?.product_name?.toLowerCase().includes(keyword) ||
                item?.product_code?.toLowerCase().includes(keyword)
            );
        });
    }, [products, search]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-96 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#f5f7fb] min-h-screen">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Product Report
                    </h1>

                    <p className="text-sm text-gray-500">
                        View and export product reports
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap">

                    <ExportButton
                        title="Export PDF"
                        loading={isLoading}
                        onExport={() =>
                            handleProductPDFExport(filteredProducts)
                        }
                    />

                    <ExportButton
                        title="Export Excel"
                        loading={isLoading}
                        onExport={() =>
                            handleProductExcelExport(filteredProducts)
                        }
                    />

                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

                <div className="flex items-center gap-3">

                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                        <Package size={20} />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Total Products
                        </p>

                        <h2 className="text-2xl font-bold">
                            {products.length}
                        </h2>
                    </div>

                </div>

            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full"
                    />

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border rounded-lg px-3 py-2"
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

                </div>

                {filterType === 'CUSTOM' && (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">

                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2"
                        />

                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2"
                        />

                    </div>
                )}

            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left px-4 py-3">
                                    Code
                                </th>

                                <th className="text-left px-4 py-3">
                                    Product Name
                                </th>

                                <th className="text-left px-4 py-3">
                                    Stock
                                </th>

                                <th className="text-left px-4 py-3">
                                    Sale Price
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item: any) => (
                                    <tr
                                        key={item.product_id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            {item.product_code}
                                        </td>

                                        <td className="px-4 py-3">
                                            {item.product_name}
                                        </td>

                                        <td className="px-4 py-3">
                                            {item.stock_qty}
                                        </td>

                                        <td className="px-4 py-3">
                                            ${item.sale_price}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>

                                    <td
                                        colSpan={4}
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No products found
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}