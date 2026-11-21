// Choix exclusif sous forme de boutons bascule (aria-pressed). `idPrefix` : id de chaque option
// (`<idPrefix>-<valeur>`), utile aux tests.
export function SegmentedControl({ label, options, value, onChange, idPrefix }) {
  return (
    <div role="group" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 bg-black/40 p-1">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            id={idPrefix ? `${idPrefix}-${option.value}` : undefined}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={
              'px-3 py-2 text-sm font-semibold uppercase tracking-wider transition duration-150 ease-out ' +
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ' +
              (active ? 'bg-brand-red text-white' : 'text-white/60 hover:bg-white/10 hover:text-white')
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
