export type ExportColumn<T> = {
    header: string
    key?: keyof T
    accessor?: string
}

export type ExportConfig<T> = {
    title: string
    columns: ExportColumn<T>[]
    data: T[]
}