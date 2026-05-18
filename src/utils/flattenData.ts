export const flattenData = (data: any[]): any[] => {
    return data.map((item) => {
        const flattened: any = {}

        const flatten = (obj: any, prefix = "") => {
            Object.keys(obj).forEach((key) => {
                const value = obj[key]
                const newKey = prefix ? `${prefix}_${key}` : key

                if (
                    value &&
                    typeof value === "object" &&
                    !Array.isArray(value) &&
                    !(value instanceof Date)
                ) {
                    flatten(value, newKey)
                } else if (Array.isArray(value)) {
                    flattened[newKey] = value
                        .map((v) =>
                            typeof v === "object" ? JSON.stringify(v) : v
                        )
                        .join(", ")
                } else {
                    flattened[newKey] = value
                }
            })
        }

        flatten(item)
        return flattened
    })
}
