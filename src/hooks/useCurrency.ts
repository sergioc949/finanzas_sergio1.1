import { useEffect, useState } from 'react'
import { CURRENCIES, type Currency } from '../lib/format'
import { CURRENCY_KEY, readJson, writeJson } from '../lib/storage'

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>(() => {
    const stored = readJson<Currency>(CURRENCY_KEY, 'EUR')
    return CURRENCIES.includes(stored) ? stored : 'EUR'
  })

  useEffect(() => {
    writeJson(CURRENCY_KEY, currency)
  }, [currency])

  return [currency, setCurrency] as const
}
