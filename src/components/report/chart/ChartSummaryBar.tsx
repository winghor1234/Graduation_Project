type SummaryItem = {
    label: string
    value: string
    color: string
}

type Props = {
    items: SummaryItem[]
}

export default function ChartSummaryBar({ items }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {items.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1">{item.label}</p>
                    <p className="text-base font-bold" style={{ color: item.color }}>{item.value}</p>
                </div>
            ))}
        </div>
    )
}