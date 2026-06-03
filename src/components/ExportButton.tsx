"use client";

import { Button } from "@/components/ui/button";
type ExportButtonProps = {
    onExport: () => void;
    loading?: boolean;
    title?: string;
};

export default function ExportButton({ title,onExport, loading = false, }: ExportButtonProps) {
    return (

        <Button
            disabled={loading}
            onClick={onExport}
            className="h-11 rounded-xl px-5 gap-2 shadow-sm border"
        >
            {loading ? "Exporting..." : title }
        </Button>

    )
}
