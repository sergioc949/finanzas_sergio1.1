import { useCallback, useEffect, useState } from 'react'
import type { Expense } from '../types'
import { EXPENSES_KEY, isExpense, readJson, writeJson } from '../lib/storage'

export type NewExpense = Omit<Expense, 'id' | 'createdAt'>

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function sortByDate(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => (a.date === b.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)))
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => sortByDate(readJson<Expense[]>(EXPENSES_KEY, []).filter(isExpense)))

  useEffect(() => {
    writeJson(EXPENSES_KEY, expenses)
  }, [expenses])

  const addExpense = useCallback((expense: NewExpense) => {
    setExpenses((current) => sortByDate([...current, { ...expense, id: createId(), createdAt: new Date().toISOString() }]))
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }, [])

  const replaceExpenses = useCallback((next: Expense[]) => {
    setExpenses(sortByDate(next))
  }, [])

  return { expenses, addExpense, removeExpense, replaceExpenses }
}
