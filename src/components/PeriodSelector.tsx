import type { Period } from '../types'
import { rangeLabel } from '../lib/dates'

const PERIOD_LABELS: Record<Period, string> = { day: 'Día', week: 'Semana', month: 'Mes' }

type Props = {
  period: Period
  reference: Date
  onPeriodChange: (period: Period) => void
  onShift: (direction: -1 | 1) => void
  onToday: () => void
  isCurrent: boolean
}

export function PeriodSelector({ period, reference, onPeriodChange, onShift, onToday, isCurrent }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex rounded-full border border-neutral-200 bg-white p-1">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPeriodChange(option)}
            aria-pressed={option === period}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              option === period ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {PERIOD_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onShift(-1)}
          aria-label="Periodo anterior"
          className="size-8 rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-400"
        >
          ‹
        </button>
        <span className="min-w-44 text-center text-sm font-medium text-neutral-700">{rangeLabel(period, reference)}</span>
        <button
          type="button"
          onClick={() => onShift(1)}
          aria-label="Periodo siguiente"
          className="size-8 rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-400"
        >
          ›
        </button>
        {!isCurrent && (
          <button
            type="button"
            onClick={onToday}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-600 transition hover:border-neutral-400"
          >
            Hoy
          </button>
        )}
      </div>
    </div>
  )
}
