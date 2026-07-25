import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { Period } from '../types'
import { formatMoney, type Currency } from '../lib/format'
import type { CategorySlice } from '../lib/stats'

const TREND_TITLE: Record<Period, string> = {
  day: 'Últimos 7 días',
  week: 'Gasto por día',
  month: 'Gasto por día del mes',
}

type TrendProps = {
  data: { label: string; total: number }[]
  period: Period
  currency: Currency
}

export function TrendChart({ data, period, currency }: TrendProps) {
  const hasData = data.some((point) => point.total > 0)
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">{TREND_TITLE[period]}</h2>
      <div className="mt-4 h-52">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#737373' }} interval="preserveStartEnd" />
              <Tooltip
                cursor={{ fill: '#f5f5f5' }}
                formatter={(value) => [formatMoney(toNumber(value), currency), 'Total']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 13 }}
              />
              <Bar dataKey="total" fill="#171717" radius={[6, 6, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>
    </section>
  )
}

type CategoryProps = {
  data: CategorySlice[]
  currency: Currency
}

export function CategoryChart({ data, currency }: CategoryProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Por categoría</h2>
      {data.length === 0 ? (
        <div className="mt-4 h-52">
          <EmptyChart />
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="label" innerRadius={44} outerRadius={68} paddingAngle={2} stroke="none">
                  {data.map((slice) => (
                    <Cell key={slice.id} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [formatMoney(toNumber(value), currency), String(name)]}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex w-full flex-col gap-2">
            {data.map((slice) => (
              <li key={slice.id} className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                <span className="text-neutral-700">{slice.label}</span>
                <span className="ml-auto tabular-nums text-neutral-500">{(slice.share * 100).toFixed(0)}%</span>
                <span className="w-24 text-right font-medium tabular-nums">{formatMoney(slice.value, currency)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function toNumber(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function EmptyChart() {
  return <div className="flex h-full items-center justify-center text-sm text-neutral-400">Sin gastos en este periodo</div>
}
