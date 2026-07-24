import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { Period } from '../types'

const WEEK_OPTIONS = { locale: es, weekStartsOn: 1 } as const

export type Range = { start: Date; end: Date }

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function fromDateKey(key: string): Date {
  return startOfDay(parseISO(key))
}

export function rangeFor(period: Period, reference: Date): Range {
  if (period === 'day') {
    return { start: startOfDay(reference), end: endOfDay(reference) }
  }
  if (period === 'week') {
    return { start: startOfWeek(reference, WEEK_OPTIONS), end: endOfWeek(reference, WEEK_OPTIONS) }
  }
  return { start: startOfMonth(reference), end: endOfMonth(reference) }
}

export function previousRangeFor(period: Period, reference: Date): Range {
  if (period === 'day') return rangeFor('day', subDays(reference, 1))
  if (period === 'week') return rangeFor('week', subDays(reference, 7))
  return rangeFor('month', subMonths(reference, 1))
}

export function isInRange(dateKey: string, range: Range): boolean {
  const date = fromDateKey(dateKey)
  return date >= startOfDay(range.start) && date <= endOfDay(range.end)
}

export function rangeLabel(period: Period, reference: Date): string {
  if (period === 'day') return capitalize(format(reference, "EEEE d 'de' MMMM", { locale: es }))
  if (period === 'week') {
    const { start, end } = rangeFor('week', reference)
    return `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`
  }
  return capitalize(format(reference, 'MMMM yyyy', { locale: es }))
}

/** Puntos del eje X para la gráfica de tendencia del periodo seleccionado. */
export function trendBuckets(period: Period, reference: Date): { key: string; label: string }[] {
  if (period === 'month') {
    const { start, end } = rangeFor('month', reference)
    return eachDayOfInterval({ start, end }).map((date) => ({
      key: toDateKey(date),
      label: format(date, 'd', { locale: es }),
    }))
  }
  if (period === 'week') {
    const { start, end } = rangeFor('week', reference)
    return eachDayOfInterval({ start, end }).map((date) => ({
      key: toDateKey(date),
      label: capitalize(format(date, 'EEE', { locale: es })),
    }))
  }
  return eachDayOfInterval({ start: subDays(reference, 6), end: reference }).map((date) => ({
    key: toDateKey(date),
    label: capitalize(format(date, 'EEE', { locale: es })),
  }))
}

export function lastMonths(reference: Date, count: number): { key: string; label: string }[] {
  return eachMonthOfInterval({ start: subMonths(reference, count - 1), end: reference }).map((date) => ({
    key: format(date, 'yyyy-MM'),
    label: capitalize(format(date, 'MMM', { locale: es })),
  }))
}

export function formatDay(dateKey: string): string {
  return capitalize(format(fromDateKey(dateKey), "EEEE d 'de' MMMM", { locale: es }))
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
