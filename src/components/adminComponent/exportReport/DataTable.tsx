import React from "react";

export type Column<T> = {
    key: string;
    title: string;
    render: (row: T) => React.ReactNode;
};

type Props<T> = {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
};

export default function DataTable<T>({
    data,
    columns,
    loading = false,
    emptyMessage = "ບໍ່ພົບຂໍ້ມູນ",
}: Props<T>) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6">
                ກຳລັງໂຫຼດຂໍ້ມູນ...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left px-4 py-3"
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-t hover:bg-gray-50"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 py-3"
                                        >
                                            {column.render(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-10 text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}