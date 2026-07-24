import type { Expense, ExpensesBackup } from '../types'

export const EXPENSES_KEY = 'gastos:expenses'
export const CURRENCY_KEY = 'gastos:currency'

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Almacenamiento lleno o no disponible (modo privado): la app sigue funcionando en memoria.
  }
}

export function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.amount === 'number' &&
    Number.isFinite(candidate.amount) &&
    typeof candidate.category === 'string' &&
    typeof candidate.note === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

export function parseBackup(raw: string): Expense[] {
  const parsed: unknown = JSON.parse(raw)
  const expenses = Array.isArray(parsed) ? parsed : (parsed as Partial<ExpensesBackup>)?.expenses
  if (!Array.isArray(expenses)) throw new Error('El archivo no contiene una lista de gastos.')
  const valid = expenses.filter(isExpense)
  if (valid.length === 0) throw new Error('El archivo no contiene gastos válidos.')
  return valid
}

export function buildBackup(expenses: Expense[]): ExpensesBackup {
  return { version: 1, exportedAt: new Date().toISOString(), expenses }
}
