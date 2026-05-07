type LegendItem = {
    label: string
    color: string
    type: "bar" | "line"
    dashed?: boolean
}

type Props = {
    items: LegendItem[]
}

export default function ChartLegend({ items }: Props) {
    return (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-5 pt-4 border-t border-gray-50">
            {items.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    {item.type === "bar" ? (
                        <span
                            className="w-6 h-2.5 rounded-sm inline-block"
                            style={{ backgroundColor: item.color }}
                        />
                    ) : (
                        <span className="inline-flex items-center w-6">
                            <span
                                className="w-full rounded-full"
                                style={{
                                    height: "2.5px",
                                    backgroundColor: item.color,
                                    backgroundImage: item.dashed
                                        ? `repeating-linear-gradient(to right, ${item.color} 0, ${item.color} 4px, transparent 4px, transparent 8px)`
                                        : "none",
                                }}
                            />
                        </span>
                    )}
                    {item.label}
                </span>
            ))}
        </div>
    )
}