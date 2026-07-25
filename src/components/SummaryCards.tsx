import type { Period } from '../types'
import { formatMoney, type Currency } from '../lib/format'
import type { PeriodStats } from '../lib/stats'

const PREVIOUS_LABEL: Record<Period, string> = {
  day: 'vs. ayer',
  week: 'vs. semana anterior',
  month: 'vs. mes anterior',
}

type Props = {
  stats: PeriodStats
  period: Period
  currency: Currency
}

export function SummaryCards({ stats, period, currency }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card label="Total del periodo" value={formatMoney(stats.total, currency)} highlight />
      <Card label="Media diaria" value={formatMoney(stats.dailyAverage, currency)} />
      <Card label="Nº de gastos" value={String(stats.count)} />
      <Card
        label={PREVIOUS_LABEL[period]}
        value={stats.change === null ? '—' : `${stats.change > 0 ? '+' : ''}${(stats.change * 100).toFixed(0)}%`}
        tone={stats.change === null ? 'neutral' : stats.change > 0 ? 'up' : 'down'}
      />
    </div>
  )
}

type CardProps = {
  label: string
  value: string
  highlight?: boolean
  tone?: 'neutral' | 'up' | 'down'
}

function Card({ label, value, highlight, tone = 'neutral' }: CardProps) {
  const toneClass = tone === 'up' ? 'text-red-600' : tone === 'down' ? 'text-emerald-600' : 'text-neutral-900'
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-xs tracking-wide text-neutral-500 uppercase">{label}</p>
      <p className={`mt-1 tabular-nums ${highlight ? 'text-2xl font-semibold' : 'text-xl font-medium'} ${toneClass}`}>{value}</p>
    </div>
  )
}
