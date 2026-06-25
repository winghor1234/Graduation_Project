import { ActiveTab } from "../../../Type"

type Props = {
    tab: ActiveTab
    onChange: (t: ActiveTab) => void
}

const TABS: ActiveTab[] = ["Sales", "Revenue", "Inventory"]

export default function ChartTabBar({ tab, onChange }: Props) {

    return (
        <div className="flex bg-gray-100 rounded-full p-0.5 gap-0.5">
            {TABS.map((t) => (
                <button
                    key={t}
                    onClick={() => {
                        onChange(t)
                    }}
                    className={`px-3.5 py-1 text-xs rounded-full font-medium transition-all ${tab === t
                        ? "bg-white text-admin-text shadow-sm"
                        : "text-admin-muted hover:text-gray-600"
                        }`}
                >
                    {t}
                </button>
            ))}
        </div>
    )
}