export function calculateGrowthPercent(current: number, last: number): number {
    if (last === 0) {
        return current > 0 ? 100 : 0
    }

    return ((current - last) / last) * 100
}