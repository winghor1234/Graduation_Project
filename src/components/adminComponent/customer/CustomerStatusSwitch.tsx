

type Props = {
  active: boolean
  onToggle: () => void
}

export function StatusToggleButton({ active, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle()}
      className={`
        relative w-12 h-5 rounded-full transition-all duration-300
        flex items-center

        ${active ? "bg-blue-500" : "bg-gray-300"}
      `}
    >
      {/* circle */}
      <span
        className={`
          absolute top-1 left-1 h-3 w-3 rounded-full bg-white
          shadow-md transition-all duration-300

          ${active ? "translate-x-7" : "translate-x-0"}
        `}
      />
    </button>
  )
}