import { useState, type FormEvent } from 'react'
import { CATEGORIES } from '../lib/categories'
import { parseAmount, type Currency } from '../lib/format'
import { toDateKey } from '../lib/dates'
import type { NewExpense } from '../hooks/useExpenses'

type Props = {
  currency: Currency
  onAdd: (expense: NewExpense) => void
}

export function ExpenseForm({ currency, onAdd }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => toDateKey(new Date()))
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsed = parseAmount(amount)
    if (parsed === null) {
      setError('Introduce un importe mayor que 0.')
      return
    }
    onAdd({ amount: parsed, category, note: note.trim(), date })
    setAmount('')
    setNote('')
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Nuevo gasto</h2>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-neutral-600">Importe ({currency})</span>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          placeholder="0,00"
          autoFocus
          aria-label="Importe"
          className="rounded-xl border border-neutral-200 px-3 py-2.5 text-2xl font-semibold tabular-nums outline-none focus:border-neutral-900"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-neutral-600">Categoría</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((option) => {
            const selected = option.id === category
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setCategory(option.id)}
                aria-pressed={selected}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
                  selected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: option.color }} />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-neutral-600">Descripción (opcional)</span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Café, metro, alquiler…"
          className="rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-neutral-600">Fecha</span>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-neutral-900"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="rounded-xl bg-neutral-900 px-4 py-2.5 font-medium text-white transition hover:bg-neutral-700"
      >
        Añadir gasto
      </button>
    </form>
  )
}
