export class CsvBuilder {

    static export(data: any[]) {

        if (!data || data.length === 0) {
            return ""
        }

        const headers =
            Object.keys(data[0])

        const csvRows = []

        csvRows.push(headers.join(","))

        for (const row of data) {

            const values =
                headers.map((header) => {

                    const escaped =
                        String(
                            row[header] ?? ""
                        )
                            .replace(/"/g, '""')

                    return `"${escaped}"`

                })

            csvRows.push(values.join(","))

        }

        return csvRows.join("\n")

    }

}