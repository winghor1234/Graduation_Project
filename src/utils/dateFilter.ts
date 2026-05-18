export function getDateFilter(
    period?: string,
    startDate?: string | null,
    endDate?: string | null
) {

    const now = new Date()

    let from: Date | undefined
    let to: Date | undefined

    switch (period) {

        case "day":

            from = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            )

            to = new Date()

            break

        case "week":

            from = new Date()

            from.setDate(now.getDate() - 7)

            to = new Date()

            break

        case "month":

            from = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            )

            to = new Date()

            break

        case "year":

            from = new Date(
                now.getFullYear(),
                0,
                1
            )

            to = new Date()

            break

    }

    if (startDate) {
        from = new Date(startDate)
    }

    if (endDate) {
        to = new Date(endDate)
    }

    if (from || to) {

        return {
            gte: from,
            lte: to
        }
    }

}