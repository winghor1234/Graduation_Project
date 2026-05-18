export const generateCsv = (data: any[]) => {
    if (!data.length) return ""

    const headers = Object.keys(data[0])

    const escape = (val: any) => {
        if (val === null || val === undefined) return ""
        const str = String(val)
        if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
            return `"${str.replace(/"/g, "\"\"")}"`
        }
        return str
    }

    const headerRow = headers.map(escape).join(",")

    const rows = data.map((row) =>
        headers.map((header) => escape(row[header])).join(",")
    )

    return [headerRow, ...rows].join("\n")
}
