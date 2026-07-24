import { differenceInCalendarDays } from 'date-fns'
import type { Expense, Period } from '../types'
import { getCategory } from './categories'
import { isInRange, previousRangeFor, rangeFor, trendBuckets, type Range } from './dates'

export function filterByRange(expenses: Expense[], range: Range): Expense[] {
  return expenses.filter((expense) => isInRange(expense.date, range))
}

export function sum(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0)
}

export type CategorySlice = { id: string; label: string; color: string; value: number; share: number }

export function byCategory(expenses: Expense[]): CategorySlice[] {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }
  const total = sum(expenses)
  return [...totals.entries()]
    .map(([id, value]) => {
      const category = getCategory(id)
      return { id, label: category.label, color: category.color, value, share: total === 0 ? 0 : value / total }
    })
    .sort((a, b) => b.value - a.value)
}

export function trendSeries(expenses: Expense[], period: Period, reference: Date): { label: string; total: number }[] {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.date, (totals.get(expense.date) ?? 0) + expense.amount)
  }
  return trendBuckets(period, reference).map(({ key, label }) => ({ label, total: totals.get(key) ?? 0 }))
}

export function groupByDay(expenses: Expense[]): { date: string; total: number; items: Expense[] }[] {
  const groups = new Map<string, Expense[]>()
  for (const expense of expenses) {
    const items = groups.get(expense.date) ?? []
    items.push(expense)
    groups.set(expense.date, items)
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({ date, total: sum(items), items }))
}

export type PeriodStats = {
  total: number
  count: number
  dailyAverage: number
  previousTotal: number
  /** Variación relativa frente al periodo anterior, o null si no hay base de comparación. */
  change: number | null
}

export function periodStats(expenses: Expense[], period: Period, reference: Date): PeriodStats {
  const range = rangeFor(period, reference)
  const current = filterByRange(expenses, range)
  const previous = filterByRange(expenses, previousRangeFor(period, reference))
  const total = sum(current)
  const previousTotal = sum(previous)
  const elapsedDays = Math.min(
    differenceInCalendarDays(range.end, range.start) + 1,
    Math.max(differenceInCalendarDays(new Date(), range.start) + 1, 1),
  )
  return {
    total,
    count: current.length,
    dailyAverage: elapsedDays > 0 ? total / elapsedDays : total,
    previousTotal,
    change: previousTotal === 0 ? null : (total - previousTotal) / previousTotal,
  }
}
