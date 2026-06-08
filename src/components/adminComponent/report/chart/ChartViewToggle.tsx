import { ViewMode } from "../../../Type"

type Props = {
    view: ViewMode
    onChange: (v: ViewMode) => void
}

const VIEWS: ViewMode[] = ["W", "M", "Y"]

export default function ChartViewToggle({ view, onChange }: Props) {
    return (
        <div className="flex gap-1">
            {VIEWS.map((v) => (
                <button
                    key={v}
                    onClick={() => onChange(v)}
                    className={`px-3 py-1 text-xs rounded-lg border font-medium transition-all ${view === v
                            ? "bg-blue-50 border-blue-200 text-blue-600"
                            : "bg-transparent border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
                        }`}
                >
                    {v}
                </button>
            ))}
        </div>
    )
}