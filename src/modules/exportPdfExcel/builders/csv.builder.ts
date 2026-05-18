export class CsvBuilder {

    static export(data: any[]) {

        if (!data || data.length === 0) {
            return ""
        }

        const headers =
            Object.keys(data[0])

        const rows = []

        rows.push(headers.join(","))

        for (const row of data) {

            const values = headers.map((header) => {

                return `"${String(row[header] ?? "")}"`

            })

            rows.push(values.join(","))

        }

        return rows.join("\n")

    }

}