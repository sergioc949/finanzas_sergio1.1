import type { Expense } from '../types'
import { getCategory } from '../lib/categories'
import { formatDay } from '../lib/dates'
import { formatMoney, type Currency } from '../lib/format'
import { groupByDay } from '../lib/stats'

type Props = {
  expenses: Expense[]
  currency: Currency
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, currency, onRemove }: Props) {
  const days = groupByDay(expenses)

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Movimientos</h2>
      {days.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-400">Todavía no hay gastos en este periodo.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-6">
          {days.map((day) => (
            <div key={day.date}>
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-2">
                <h3 className="text-sm font-medium text-neutral-700">{formatDay(day.date)}</h3>
                <span className="text-sm tabular-nums text-neutral-500">{formatMoney(day.total, currency)}</span>
              </div>
              <ul>
                {day.items.map((expense) => {
                  const category = getCategory(expense.category)
                  return (
                    <li key={expense.id} className="group flex items-center gap-3 border-b border-neutral-100 py-2.5 last:border-none">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-neutral-900">{expense.note || category.label}</p>
                        {expense.note && <p className="text-xs text-neutral-500">{category.label}</p>}
                      </div>
                      <span className="ml-auto font-medium tabular-nums">{formatMoney(expense.amount, currency)}</span>
                      <button
                        type="button"
                        onClick={() => onRemove(expense.id)}
                        aria-label={`Eliminar gasto de ${formatMoney(expense.amount, currency)}`}
                        className="rounded-full px-2 text-neutral-300 opacity-0 transition group-hover:opacity-100 hover:text-red-600 focus:opacity-100"
                      >
                        ×
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
