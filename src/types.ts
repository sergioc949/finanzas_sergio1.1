export type Expense = {
  id: string
  amount: number
  category: string
  note: string
  /** Fecha del gasto en formato YYYY-MM-DD (hora local). */
  date: string
  createdAt: string
}

export type Period = 'day' | 'week' | 'month'

export type ExpensesBackup = {
  version: 1
  exportedAt: string
  expenses: Expense[]
}
