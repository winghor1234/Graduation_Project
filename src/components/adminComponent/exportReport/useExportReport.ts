import { useMemo, useState } from "react";
import { useGetExportReport } from "@/app/features/hooks/Export";

export function useReport<T>({
    reportType,
    searchFn,
}: {
    reportType: string;
    searchFn: (
        item: T,
        keyword: string
    ) => boolean;
}) {
    const [search, setSearch] = useState("");
    const [period, setPeriod] = useState<"WEEK" | "MONTH" | "YEAR" | "CUSTOM">("YEAR");
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const { data, isLoading } =
        useGetExportReport({
            reportType,
            period,
            startDate,
            endDate,
        });

    const records = (data?.data ?? []) as T[];
    const filteredData = useMemo(() => {
        const keyword = search.toLowerCase();

        return records.filter((item) => searchFn(item, keyword));
    }, [records, search, searchFn]);

    return {
        data: filteredData,
        isLoading,

        search,
        setSearch,

        period,
        setPeriod,

        startDate,
        setStartDate,

        endDate,
        setEndDate,
    };
}