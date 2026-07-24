export type Category = {
  id: string
  label: string
  color: string
}

export const CATEGORIES: Category[] = [
  { id: 'comida', label: 'Comida', color: '#f97316' },
  { id: 'transporte', label: 'Transporte', color: '#0ea5e9' },
  { id: 'hogar', label: 'Hogar', color: '#8b5cf6' },
  { id: 'ocio', label: 'Ocio', color: '#ec4899' },
  { id: 'salud', label: 'Salud', color: '#10b981' },
  { id: 'compras', label: 'Compras', color: '#eab308' },
  { id: 'servicios', label: 'Servicios', color: '#3b82f6' },
  { id: 'otros', label: 'Otros', color: '#94a3b8' },
]

const BY_ID = new Map(CATEGORIES.map((category) => [category.id, category]))

export const OTHER_CATEGORY: Category = CATEGORIES[CATEGORIES.length - 1]

export function getCategory(id: string): Category {
  return BY_ID.get(id) ?? { ...OTHER_CATEGORY, id, label: id }
}
