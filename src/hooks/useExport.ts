import { useMutation } from "@tanstack/react-query"

export const useExport = () => {
    const exportFile = async (type: "pdf" | "excel", config: any) => {
        const res = await fetch(`/api/export/${type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        })

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = `export.${type === "pdf" ? "pdf" : "xlsx"}`
        a.click()

        URL.revokeObjectURL(url)
    }

    const pdf = useMutation({
        mutationFn: (config: any) => exportFile("pdf", config)
    })

    const excel = useMutation({
        mutationFn: (config: any) => exportFile("excel", config)
    })

    return {
        exportPdf: pdf.mutate,
        exportExcel: excel.mutate
    }
}