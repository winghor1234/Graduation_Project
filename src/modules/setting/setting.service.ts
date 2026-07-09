import { prisma } from "@/lib/prisma"

const DEFAULTS: Record<string, string> = {
    shipping_cost: "20000",
}

export const settingService = {

    async get(key: string): Promise<string> {
        const row = await prisma.setting.findUnique({ where: { key } })
        if (row) return row.value
        // auto-seed default on first read
        const defaultVal = DEFAULTS[key] ?? ""
        await prisma.setting.create({ data: { key, value: defaultVal } })
        return defaultVal
    },

    async getAll(): Promise<Record<string, string>> {
        // ensure all default keys exist
        await Promise.all(
            Object.entries(DEFAULTS).map(([key, value]) =>
                prisma.setting.upsert({
                    where: { key },
                    update: {},
                    create: { key, value },
                })
            )
        )
        const rows = await prisma.setting.findMany()
        return Object.fromEntries(rows.map(r => [r.key, r.value]))
    },

    async set(key: string, value: string) {
        return prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        })
    },
}
