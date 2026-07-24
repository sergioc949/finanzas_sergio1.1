import { useMemo, useState } from 'react'
import { addDays, addMonths, isSameDay, isSameMonth, isSameWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Period } from './types'
import { useExpenses } from './hooks/useExpenses'
import { useCurrency } from './hooks/useCurrency'
import { rangeFor } from './lib/dates'
import { buildBackup, parseBackup } from './lib/storage'
import { byCategory, filterByRange, periodStats, trendSeries } from './lib/stats'
import { Header } from './components/Header'
import { ExpenseForm } from './components/ExpenseForm'
import { PeriodSelector } from './components/PeriodSelector'
import { SummaryCards } from './components/SummaryCards'
import { CategoryChart, TrendChart } from './components/Charts'
import { ExpenseList } from './components/ExpenseList'

export default function App() {
  const { expenses, addExpense, removeExpense, replaceExpenses } = useExpenses()
  const [currency, setCurrency] = useCurrency()
  const [period, setPeriod] = useState<Period>('day')
  const [reference, setReference] = useState(() => new Date())
  const [message, setMessage] = useState<string | null>(null)

  const visible = useMemo(() => filterByRange(expenses, rangeFor(period, reference)), [expenses, period, reference])
  const stats = useMemo(() => periodStats(expenses, period, reference), [expenses, period, reference])
  const trend = useMemo(
    () => trendSeries(period === 'day' ? expenses : visible, period, reference),
    [expenses, visible, period, reference],
  )
  const categories = useMemo(() => byCategory(visible), [visible])

  const today = new Date()
  const isCurrent =
    period === 'day'
      ? isSameDay(reference, today)
      : period === 'week'
        ? isSameWeek(reference, today, { locale: es, weekStartsOn: 1 })
        : isSameMonth(reference, today)

  function shift(direction: -1 | 1) {
    setReference((current) => {
      if (period === 'day') return addDays(current, direction)
      if (period === 'week') return addDays(current, direction * 7)
      return addMonths(current, direction)
    })
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(buildBackup(expenses), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gastos-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Copia de seguridad descargada.')
  }

  async function handleImport(file: File) {
    try {
      const imported = parseBackup(await file.text())
      replaceExpenses(imported)
      setMessage(`Se importaron ${imported.length} gastos.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo leer el archivo.')
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Header currency={currency} onCurrencyChange={setCurrency} onExport={handleExport} onImport={handleImport} />

      {message && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage(null)} aria-label="Cerrar aviso" className="text-neutral-400 hover:text-neutral-700">
            ×
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-8">
          <ExpenseForm currency={currency} onAdd={addExpense} />
        </div>

        <main className="flex flex-col gap-4">
          <PeriodSelector
            period={period}
            reference={reference}
            isCurrent={isCurrent}
            onPeriodChange={setPeriod}
            onShift={shift}
            onToday={() => setReference(new Date())}
          />
          <SummaryCards stats={stats} period={period} currency={currency} />
          <TrendChart data={trend} period={period} currency={currency} />
          <CategoryChart data={categories} currency={currency} />
          <ExpenseList expenses={visible} currency={currency} onRemove={removeExpense} />
        </main>
      </div>
    </div>
  )
}
