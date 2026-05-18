export function flattenData(
    data: any[]
): Record<string, any>[] {

    return data.map((item) =>
        flattenObject(item)
    )

}

function flattenObject(
    obj: any,
    parentKey = "",
    result: Record<string, any> = {}
) {

    for (const key in obj) {

        const value = obj[key]

        const newKey =
            parentKey
                ? `${parentKey}.${key}`
                : key

        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            !(value instanceof Date)
        ) {

            flattenObject(
                value,
                newKey,
                result
            )

        } else {

            result[newKey] = value

        }

    }

    return result

}